import express from "express";
import pool from '../db.js';

const router = express.Router();
router.use(express.json());

router.get('/view' , async (req,res) => {
    try{
        const query = await pool.query('SELECT * FROM completed')
        return res.status(200).send(query.rows);
    } catch(err) {
        console.log(err);
        return res.send("Error");
    }
})

router.post('/' , async (req,res) => {
    const{workoutplan_id,date,difficulty} = req.body;
    try{
        const query = await pool.query('Insert INTO completed (workoutplan_id, date, difficulty) Values ($1,$2,$3)', [workoutplan_id,date,difficulty])
        return res.status(200).send('Entry Added');
    } catch(err) {
        console.log(err);
        return res.send("Error");
    }
})

export default router