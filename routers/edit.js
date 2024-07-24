import express from "express";
import pool from '../db.js';

const router = express.Router();
router.use(express.json());

router.get('/available', async (req, res) => {
    try{
        const result = await pool.query('Select * FROM workoutplan')
        return res.send(result.rows)
    } catch(err) {
        return res.send({message : "error in query"})
    }
});

router.put('/:id' , async (req,res) => {
    const {workouts , totalSets} = req.body;
    const {id} = req.params
    const parsedId = parseInt(id)
    try{
        const result = await pool.query('Update workoutplan Set workouts = $2 , totalsets = $3 WHERE id = $1', [parsedId,JSON.stringify(workouts),totalSets])
        res.status(200).send({message: "Updated"});
    } catch(err) {
        console.log(err);
        res.send("error occured")
    }
})

router.patch('/:id' , async (req,res) => {
    const {body} = req;
    const {id} = req.params;
    const parsedId = parseInt(id);

    try{
        const result = await pool.query('Select * FROM workoutplan WHERE id = $1', [parsedId])

        const existingPlan = result.rows[0];
        let updatedPlan = {
            ...existingPlan,
            ...body,
            workouts: body.workouts ? JSON.stringify(body.workouts) : existingPlan.workouts
    };
        const query = await pool.query('Update workoutplan SET workouts = $1, totalSets = $2 WHERE id = $3', [updatedPlan.workouts, updatedPlan.totalsets,parsedId])
        return res.status(200).send({message: "Updated"});
    } catch(err) {
        console.log(err);
        return res.status(400).send("Error");
    }
})


export default router
