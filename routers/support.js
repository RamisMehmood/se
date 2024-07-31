import express from "express";
import pool from '../db.js';
import {authentication} from '../server.js'

const router = express.Router();
router.use(express.json());


router.post('/', authentication, async (req,res) => {
const {message} = req.body;
const user_id = req.session.passport.user;
try{
    const query = await pool.query('INSERT INTO support (user_id, message) VALUES ($1,$2)', [user_id, message])
    return res.status(200).send("Feedback Sent");
} catch(err){
    console.log(err.message);
    return res.send(200);
}
})


export default router;