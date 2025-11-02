import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { withClient } from '../db/pool';
import { sendEmail, sendFoodRequestNotification, type EmailRecipient } from '../services/email';
import { requireAuth } from '../middleware/auth';

const createSchema = z.object({
  requesterName: z.string().min(1),
  phone: z.string().regex(/^[0-9]{10}$/),
  email: z.string().email().optional().nullable(),
  organization: z.string().optional().nullable(),
  requestedItem: z.string().min(1),
  quantity: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional().nullable(),
  neededBy: z.string().min(1),
});

const updateSchema = z.object({
  requesterName: z.string().min(1).optional(),
  phone: z.string().regex(/^[0-9]{10}$/).optional(),
  email: z.string().email().optional().nullable(),
  organization: z.string().optional().nullable(),
  requestedItem: z.string().min(1).optional(),
  quantity: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  neededBy: z.string().optional(),
  status: z.string().optional(),
});

export const foodRequestsRouter = Router();

// POST /api/food-requests
foodRequestsRouter.post('/', validateBody(createSchema), async (req, res, next) => {
  try {
    const body = (req as any).validatedBody as z.infer<typeof createSchema>;
    const userId = (req as any).user?.id || null;

    const { rows } = await withClient((client) => client.query(
      `INSERT INTO food_requests (
        requester_name, phone, email, organization, requested_item, quantity, location,
        description, needed_by, status, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10) RETURNING *`,
      [
        body.requesterName,
        body.phone,
        body.email ?? null,
        body.organization ?? null,
        body.requestedItem,
        body.quantity,
        body.location,
        body.description ?? null,
        body.neededBy,
        userId,
      ]
    ));

    // Send notification emails to all registered users and organizations
    try {
      const usersResult = await withClient((client) => client.query('SELECT name, email FROM users'));
      const orgsResult = await withClient((client) => client.query('SELECT contact_person as name, email FROM helper_organizations'));

      const recipients: EmailRecipient[] = [
        ...usersResult.rows.map((u: any) => ({ email: u.email, name: u.name })),
        ...orgsResult.rows.map((o: any) => ({ email: o.email, name: o.name })),
      ].filter(r => !!r.email);

      if (recipients.length > 0) {
        await sendFoodRequestNotification(
          body.requesterName,
          body.requestedItem,
          body.quantity,
          body.organization || 'Individual',
          recipients
        );
      }
    } catch (emailErr) {
      console.error('[food-requests] Failed to send email notification:', emailErr);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/food-requests
foodRequestsRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await withClient((client) => client.query(
      `SELECT fr.*, 
              COALESCE(NULLIF(regexp_replace(fr.quantity, '\\D', '', 'g'), '')::int, 0) AS requested_total,
              COALESCE(SUM(NULLIF(regexp_replace(p.pledged_quantity, '\\D', '', 'g'), '')::int), 0) AS pledged_total
         FROM food_requests fr
    LEFT JOIN food_request_pledges p ON p.request_id = fr.id
        WHERE fr.needed_by >= now()
     GROUP BY fr.id
     ORDER BY fr.created_at DESC`
    ));
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/food-requests/:id
foodRequestsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await withClient((client) => client.query(
      `SELECT fr.*, 
              COALESCE(NULLIF(regexp_replace(fr.quantity, '\\D', '', 'g'), '')::int, 0) AS requested_total,
              COALESCE(SUM(NULLIF(regexp_replace(p.pledged_quantity, '\\D', '', 'g'), '')::int), 0) AS pledged_total
         FROM food_requests fr
    LEFT JOIN food_request_pledges p ON p.request_id = fr.id
        WHERE fr.id = $1
          AND fr.needed_by >= now()
     GROUP BY fr.id`, [id]
    ));
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Request not found or has expired' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/food-requests/:id/pledges
foodRequestsRouter.post('/:id/pledges', requireAuth, validateBody(z.object({
  quantity: z.string().min(1),
})), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = (req as any).validatedBody as { quantity: string };
    const userId = (req as any).user?.id as string;
    const userEmail = (req as any).user?.email as string | undefined;

    // Ensure request exists
    const { rows: reqRows } = await withClient((client) => client.query('SELECT requester_name, email, quantity AS requested_quantity, requested_item, user_id, needed_by FROM food_requests WHERE id = $1', [id]));
    if (!reqRows[0]) return res.status(404).json({ success: false, message: 'Request not found' });

    if (reqRows[0].user_id && reqRows[0].user_id === userId) {
      return res.status(400).json({ success: false, message: 'You cannot donate to your own request' });
    }

    if (reqRows[0].needed_by && new Date(reqRows[0].needed_by).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'This request has expired' });
    }

    await withClient((client) => client.query(
      'INSERT INTO food_request_pledges (request_id, user_id, pledged_quantity) VALUES ($1, $2, $3)',
      [id, userId, quantity]
    ));

    // Send confirmation email to pledger (if we have their email)
    if (userEmail) {
      const subject = 'Thanks for your pledge on HopeHUB';
      const htmlContent = `
        <html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">Pledge Confirmation</h2>
            <p>Thank you for pledging <strong>${quantity}</strong> towards the request for <strong>${reqRows[0].requested_item}</strong>.</p>
            <p>Your support makes a difference.</p>
            <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em;">This is an automated message from HopeHUB.</p>
          </div>
        </body></html>`;
      try {
        await sendEmail({ to: [{ email: userEmail }], subject, htmlContent });
      } catch (e) {
        console.warn('[pledge] Failed to send confirmation email:', e);
      }
    }

    // Notify the original requester about the pledge (if they provided an email)
    try {
      const requesterEmail: string | null = reqRows[0]?.email ?? null;
      if (requesterEmail) {
        const subject = 'Good news! Someone pledged to your request on HopeHUB';
        const htmlContent = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">You have a new pledge</h2>
                <p>A community member pledged <strong>${quantity}</strong> towards your request for <strong>${reqRows[0].requested_item}</strong>.</p>
                ${userEmail ? `<p>You can reach them at: <a href="mailto:${userEmail}">${userEmail}</a></p>` : ''}
                <p>We will keep aggregating pledges until your need is met.</p>
                <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em;">This is an automated message from HopeHUB.</p>
              </div>
            </body>
          </html>`;
        await sendEmail({ to: [{ email: requesterEmail }], subject, htmlContent });
      }
    } catch (e) {
      console.warn('[pledge] Failed to notify requester via email:', e);
    }

    return res.status(201).json({ success: true, message: 'Pledge recorded' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/food-requests/:id
foodRequestsRouter.put('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = (req as any).validatedBody as z.infer<typeof updateSchema>;
    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, any> = {
      requester_name: body.requesterName,
      phone: body.phone,
      email: body.email,
      organization: body.organization,
      requested_item: body.requestedItem,
      quantity: body.quantity,
      location: body.location,
      description: body.description,
      needed_by: body.neededBy,
      status: body.status,
    };

    Object.entries(mapping).forEach(([col, val]) => {
      if (typeof val !== 'undefined') {
        params.push(val);
        fields.push(`${col} = $${params.length}`);
      }
    });

    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

    params.push(id);
    const { rows } = await withClient((client) => client.query(`UPDATE food_requests SET ${fields.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});
