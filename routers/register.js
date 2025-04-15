import express from "express";
import nodeMailer from "nodemailer"
import pool from '../db.js';

const router = express.Router();

let otpStore = {}; // Temporary store for OTPs

// Email configuration
const transporter = nodeMailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ramismehmood123@gmail.com',
    pass: 'utve sisu knbe gzcc'
  }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  router.post('/', async (req, res) => {

    const { username, password, email} = req.body;
    req.session.registrationData = { username, password, email }; // store registration data in session
  
    const newOtp = generateOTP();
      const mailOptions = {
        from: 'ramismehmood123@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${newOtp}`
      }

      // Send OTP via email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({ message: 'Error sending OTP' });
        }

        // Store OTP
        otpStore[email] = newOtp;
        return res.status(200).send({ message: 'OTP sent successfully. Please verify the OTP.' });
      });
   
  });

  router.post('/verify' , async (req,res) => {
    const {otp} = req.body;
    const { email, username, password } = req.session.registrationData || {};

      if (otpStore[email] && otpStore[email] === otp) {
        // OTP verified successfully
        delete otpStore[email]; // Remove OTP after verification
        
        // Step 4: Register the user
        await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
        return res.status(200).send({ message: 'Registration successful' });
      } else {
        return res.status(400).send({ message: 'Invalid OTP' });
      }
      
  })

export default router