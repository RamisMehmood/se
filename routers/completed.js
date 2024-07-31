import express from "express";
import pool from '../db.js';
import {authentication} from '../server.js'

const router = express.Router();
router.use(express.json());

router.get('/view' ,authentication, async (req,res) => {
    const user_id = req.session.passport.user;
    try{
        const query = await pool.query('SELECT * FROM completed where user_id = $1', [user_id])
        return res.status(200).send(query.rows);
    } catch(err) {
        console.log(err);
        return res.send("Error");
    }
})

router.post('/' ,authentication, async (req,res) => {
    const{workoutplan_id,date,difficulty} = req.body;
    const user_id = req.session.passport.user;
    try{
        const query = await pool.query('Insert INTO completed (workoutplan_id, date, difficulty, user_id) Values ($1,$2,$3,$4)', [workoutplan_id,date,difficulty,user_id])
        return res.status(200).send('Entry Added');
    } catch(err) {
        console.log(err);
        return res.send("Error");
    }
})

export default router