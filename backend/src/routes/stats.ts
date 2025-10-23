import { Router } from 'express';
import { withClient } from '../db/pool';

export const statsRouter = Router();

// GET /api/stats
statsRouter.get('/', async (_req, res, next) => {
  try {
    const result = await withClient(async (client) => {
      const [availableDonationsCountRes, totalDonationsCountRes, activeOrgsCountRes, latestDonationsRes] = await Promise.all([
        client.query("SELECT COUNT(*)::int AS count FROM food_donations WHERE status = 'available'"),
        client.query('SELECT COUNT(*)::int AS count FROM food_donations'),
        client.query("SELECT COUNT(*)::int AS count FROM helper_organizations WHERE status = 'active'"),
        client.query(
          `SELECT id, organization, food_type, quantity, location, available_until, status, created_at
           FROM food_donations
           WHERE status = 'available'
           ORDER BY created_at DESC
           LIMIT 10`
        ),
      ]);

      const availableDonationsCount = availableDonationsCountRes.rows[0]?.count ?? 0;
      const totalDonationsCount = totalDonationsCountRes.rows[0]?.count ?? 0;
      const activeOrganizationsCount = activeOrgsCountRes.rows[0]?.count ?? 0;

      // Simple heuristic: 15 meals per donation
      const mealsSaved = totalDonationsCount * 15;

      return {
        availableDonations: availableDonationsCount,
        mealsSaved,
        activeVolunteers: activeOrganizationsCount, // proxy for now
        partnerOrgs: activeOrganizationsCount,
        // Placeholder engagement numbers; real analytics would replace these
        totalVisits: Math.floor(Math.random() * 1000) + 500,
        uniqueVisitors: Math.floor(Math.random() * 300) + 200,
        donations: latestDonationsRes.rows,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});
