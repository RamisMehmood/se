import passport from "passport"
import { Strategy } from 'passport-local'
import pool from '../db.js';

passport.serializeUser( (user,done) => {    
    console.log("Serializing") 
    done(null,user.userid)
})

passport.deserializeUser(async (userid, done) => {
    console.log("Deserializing");
    try{
        const result = await pool.query('SELECT username,userid FROM users WHERE userid = $1' , [userid])
        const newUser = result.rows[0]
        if(!newUser){
            throw new Error("User not Found")
        }
        done(null,newUser)
    } catch (err) {
      done(err,null)
    }
})

export default passport.use( new Strategy( async (username,password,done) => {
    try{
     const result = await pool.query('SELECT userid FROM users WHERE username = $1 AND password = $2' , [username,password])
     const user = result.rows[0]
     if(!user){
         throw new Error("User not Found")
     }
     done(null,user)
    }
     catch(err) {
         done(err,null)
     }
 
 }))
