import express from "express";
import pool from '../db.js';

const router = express.Router();
router.use(express.json());

// Utility function to calculate the start date based on the period
function calculateStartDate(period) {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1); // First day of the current year
      break;
    default:
      throw new Error('Invalid period specified');
  }

  return startDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
}

router.get('/difficulty/:period', async (req, res) => {
    const { period } = req.params
  
    try {
      const startDate = calculateStartDate(period);
      const endDate = new Date().toISOString().split('T')[0]; // Current date
  
      const result = await pool.query(
        'SELECT MAX(difficulty) AS max_difficulty, MIN(difficulty) AS min_difficulty, AVG(difficulty) AS avg_difficulty FROM completed WHERE date BETWEEN $1 AND $2',
        [startDate, endDate]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send({ message: "No data found for the given period" });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });



export default router;
