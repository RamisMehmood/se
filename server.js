import express from "express";
import pool from './db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from "passport";
import loginRouter from './routers/login.js';
import bodyParser from 'body-parser'
import createWorkoutRouter from './routers/create-workout.js'
import editRouter from './routers/edit.js'
import completedRouter from './routers/completed.js'

const app = express()

app.use(cookieParser('omlandahh'));
app.use(session({
  secret: 'omlandahh',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60000 * 60 }
}));

app.use(passport.initialize());
app.use(passport.session())

app.use(bodyParser.json())
app.use(express.json())

app.use('/login', loginRouter);
app.use('/create-workout', createWorkoutRouter);
app.use('/edit', editRouter )
app.use('/completed' , completedRouter)

// HOME PAGE: Login/Register

// => Register => Home Page

// => Login => Page 1

// => PAGE 1 : Create/Edit Workout && Progress-Tracker && Log-A-completedWorkout

app.get('/', async (req,res) => {
    const result = await pool.query('SELECT * FROM users')
    return res.send(result.rows);
})

app.post('/register' , async (req,res) => {
console.log("Registartion Started");
const {username,password} = req.body;
try{
    const result = await pool.query('SELECT userid FROM users Where username = $1', [username])
    if(result.rows[0]) { return res.send( {message : "Username Already Exists , Try Again"})}

    await pool.query('Insert Into users (username, password) VALUES ($1 , $2 )', [username , password])
    return res.send(200)
} catch(err) {
    console.log(err);
    res.sendStatus(500);
}
})


app.listen(4000, () => {
    console.log("Server running on port 4000");
})

