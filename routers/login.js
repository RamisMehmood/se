import express from 'express';
import passport from "passport";
import "../strategies/local.mjs"

const router = express.Router();

router.use(express.json());
router.use(passport.initialize());
router.use(passport.session())

router.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID)
    return res.send(200);
});

router.post('/', passport.authenticate("local") , (req,res) => {
    req.session.status = 'Online';
    return res.sendStatus(200);
})

router.get('/status' , (req,res) => {
   return req.session.status ? res.status(200).send(req.session.status) :
   res.status(401).send({message : "Not Authenticated"});
})

export default router