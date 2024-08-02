import express from "express";
import {authentication} from '../server.js'
import http from 'https'

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
    // Extracting the query parameter from the request
    const {muscle} = req.query;

    if (!muscle) {
        return res.status(400).send('Muscle query parameter is required');
    }

    const options = {
        method: 'GET',
        hostname: 'work-out-api1.p.rapidapi.com',
        port: null,
        path: `/search?Muscles=${encodeURIComponent(muscle)}`,
        headers: {
            'x-rapidapi-key': '0d7192c883mshfa4a7eb3d56285cp10eeb1jsn0cb5699217ab',
            'x-rapidapi-host': 'work-out-api1.p.rapidapi.com'
        }
    };

    const externalReq = http.request(options, function (externalRes) {
        const chunks = [];

        externalRes.on('data', function (chunk) {
            chunks.push(chunk);
        });

        externalRes.on('end', function () {
            const body = Buffer.concat(chunks);
            res.send(body.toString());
        });
    });

    externalReq.on('error', (error) => {
        console.error('Error with the request:', error);
        res.status(500).send('Internal Server Error');
    });

    externalReq.end();
});







export default router;