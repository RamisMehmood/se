import express from "express";
import pool from './db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from "passport";
import bodyParser from 'body-parser'

import loginRouter from './routers/login.js';
import createWorkoutRouter from './routers/create-workout.js'
import editRouter from './routers/edit.js'
import completedRouter from './routers/completed.js'
import progressRouter from './routers/progress.js'
import registerRouter from './routers/register.js'
import supportRouter from './routers/support.js'
import calculationsRouter from './routers/calculations.js'


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
app.use('/progress',progressRouter)
app.use('/register', registerRouter)
app.use('/support', supportRouter)
app.use('/calculations', calculationsRouter)

app.get('/', async (req,res) => {
    const result = await pool.query('SELECT * FROM users')
    return res.send(result.rows);
})

export function authentication(req,res,next){
if(req.isAuthenticated()){
    return next();
}
res.status(401).send("You need to Log in first");
}

app.listen(4000, () => {
    console.log("Server running on port 4000");
})


// HOME PAGE: Login/Register

// => Register => Home Page

// => Login => Page 1

// => PAGE 1 : Create/Edit Workout && Progress-Tracker && Log-A-completedWorkout



