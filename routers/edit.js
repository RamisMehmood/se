import express from "express";
import pool from '../db.js';
import {authentication} from '../server.js'

const router = express.Router();
router.use(express.json());

router.get('/available',authentication, async (req, res) => {
    try{
        const result = await pool.query('Select * FROM workoutplan')
        return res.send(result.rows)
    } catch(err) {
        return res.send({message : "error in query"})
    }
});

router.put('/:id' ,authentication, async (req,res) => {
    const {workouts , totalSets} = req.body;
    const {id} = req.params;
    const user_id = req.session.passport.user;
    const parsedId = parseInt(id);

    
    const query = await pool.query('SELECT user_id FROM workoutplan WHERE id = $1', [parsedId]);
    const queryId = parseInt(query.rows[0].user_id)

    if(queryId !== user_id) {return res.status(401).send("You dont have permission to edit this Workout")};

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
