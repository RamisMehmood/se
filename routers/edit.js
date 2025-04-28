import express from "express";
import pool from '../db.js';
import {authentication} from '../server.js'

const router = express.Router();
router.use(express.json());

router.get('/available',authentication, async (req, res) => {
    try {
        const userId = req.session.passport.user;
    
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
    
        const result = await pool.query("SELECT * FROM workoutplan WHERE user_id = $1", [userId]);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id);
  
    try {
      const result = await pool.query(
        'SELECT workouts, totalsets FROM workoutplan WHERE id = $1',
        [parsedId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Workout not found" });
      }
  
      const workout = result.rows[0];
  
      let workoutsData = workout.workouts;
  
      if (typeof workoutsData === 'string') {
        workoutsData = JSON.parse(workoutsData);
  
        // Parse each field if necessary
        for (let category of ['UpperBody', 'LowerBody', 'Cardio', 'Bodyweight']) {
          if (workoutsData[category] && typeof workoutsData[category] === 'string') {
            try {
              workoutsData[category] = JSON.parse(workoutsData[category]);
            } catch (e) {
              console.warn(`Could not parse ${category}`, e);
            }
          }
        }
      }
  
      res.status(200).json({
        workouts: workoutsData,
        totalsets: workout.totalsets
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("error occurred");
    }
  });
  
  

router.put('/:id' ,authentication, async (req,res) => {
    const {workouts , totalSets} = req.body;
    const {id} = req.params;
    const user_id = req.session.passport.user;
    const parsedId = parseInt(id);

    
    const query = await pool.query('SELECT user_id FROM workoutplan WHERE id = $1', [parsedId]);
    const queryId = parseInt(query.rows[0].user_id)

    //if(queryId !== user_id) {return res.status(401).send("You dont have permission to edit this Workout")};

    try{
        const result = await pool.query('Update workoutplan Set workouts = $2 , totalsets = $3 WHERE id = $1 AND user_id = $4', [parsedId,JSON.stringify(workouts),totalSets,user_id])
        res.status(200).send({message: "Updated"});
    } catch(err) {
        console.log(err);
        res.send("error occured")
    }
})

router.patch('/:id' ,authentication, async (req,res) => {
    const {body} = req;
    const {id} = req.params;
    const parsedId = parseInt(id);
    const user_id = req.session.passport.user;

    const query = await pool.query('SELECT user_id FROM workoutplan WHERE id = $1', [parsedId]);
    const queryId = parseInt(query.rows[0].user_id)

    if(queryId !== user_id) {return res.status(401).send("You dont have permission to edit this Workout")};

    try{
        const result = await pool.query('Select * FROM workoutplan WHERE id = $1', [parsedId])

        const existingPlan = result.rows[0];
        let updatedPlan = {
            ...existingPlan,
            ...body,
            workouts: body.workouts ? JSON.stringify(body.workouts) : existingPlan.workouts
    };
        const query = await pool.query('Update workoutplan SET workouts = $1, totalSets = $2 WHERE id = $3', [updatedPlan.workouts, updatedPlan.totalSets,parsedId])
        return res.status(200).send({message: "Updated"});
    } catch(err) {
        console.log(err);
        return res.status(400).send("Error");
    }
})


export default router
