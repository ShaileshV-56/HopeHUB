import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

const router = Router();

const requestSchema = z.object({
  donationId: z.string().uuid(),
  helperOrgId: z.string().uuid(),
  notes: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = requestSchema.parse(req.body);

    // verify donation exists and available
    const donationRes = await pool.query(
      `SELECT id, status FROM public.food_donations WHERE id = $1 AND status = 'available'`,
      [data.donationId]
    );
    if (donationRes.rowCount === 0) {
      return res.status(404).json({ error: 'Donation not found or not available' });
    }

    // verify organization exists
    const orgRes = await pool.query(
      `SELECT id FROM public.helper_organizations WHERE id = $1`,
      [data.helperOrgId]
    );
    if (orgRes.rowCount === 0) {
      return res.status(404).json({ error: 'Helper organization not found' });
    }

    // ensure no duplicate request
    const existingRes = await pool.query(
      `SELECT id FROM public.donation_requests WHERE donation_id = $1 AND helper_org_id = $2`,
      [data.donationId, data.helperOrgId]
    );
    if (existingRes.rows.length > 0) {
      return res.status(400).json({ error: 'A request already exists for this donation and organization' });
    }

    const insertRes = await pool.query(
      `INSERT INTO public.donation_requests (donation_id, helper_org_id, notes, status)
       VALUES ($1,$2,$3,'requested') RETURNING *`,
      [data.donationId, data.helperOrgId, data.notes ?? null]
    );

    res.json({ success: true, message: 'Donation request created successfully', request: insertRes.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
