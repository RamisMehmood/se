import express from "express";
import pool from '../db.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
      const upperBodyResult = await pool.query('SELECT name FROM UpperBody');
      const lowerBodyResult = await pool.query('SELECT name FROM LowerBody');
      const cardioResult = await pool.query('SELECT name FROM Cardio');
      const bodyweightResult = await pool.query('SELECT name FROM Bodyweight');
  
      res.json({
        UpperBody: upperBodyResult.rows.map(row => row.name),
        LowerBody: lowerBodyResult.rows.map(row => row.name),
        Cardio: cardioResult.rows.map(row => row.name),
        Bodyweight: bodyweightResult.rows.map(row => row.name),
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/add' , async (req,res) => {
    const {table , name} = req.body;
    try {
      const result = await pool.query(`Insert into ${table} (name) Values ($1)` , [name]);
      res.status(200).send("Added");
    } catch(err) {
      console.error(err)
      res.send( {message : "Error Occured"})
    }
  })

  router.post('/', async (req, res) => {
    const { workouts, totalSets } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO workoutPlan (workouts, totalSets) VALUES ($1, $2)',
        [JSON.stringify(workouts), totalSets]
      );
      res.status(201).send("Created");
    } catch (error) {
      console.error('Error inserting workout plan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



export default router

/*"workouts" : {
    "UpperBody" : "['Bench Press', 'Shoulder Press', 'Bicep Curl']",
    "LowerBody" : "['Squat', 'Lunge', 'Leg Press']",
    "Cardio": "['Jogging', 'Cycling', 'Swimming']",
    "Bodyweight": "['Pull Ups', 'Push Ups', 'Plank']"
  },
  "totalSets" : 18 */