import http from 'https';
import express from 'express';

const router = express.Router();
router.use(express.json());

router.post('/bmi', (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height) {
        return res.status(400).send('Weight and height are required');
    }

    const options = {
        method: 'POST',
        hostname: 'gym-calculations.p.rapidapi.com',
        port: null,
        path: '/bmi',
        headers: {
            'x-rapidapi-key': '0d7192c883mshfa4a7eb3d56285cp10eeb1jsn0cb5699217ab',
            'x-rapidapi-host': 'gym-calculations.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    const externalReq = http.request(options, (externalRes) => { // Creating Request
        const chunks = [];   // Handling Response from API

        externalRes.on('data', (chunk) => {   // Event listener Function
            chunks.push(chunk);
        });

        externalRes.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            res.send(body);
        });
    });

    externalReq.on('error', (e) => { // Handling Errors
        res.status(500).send(`Problem with request: ${e.message}`);
    });

    externalReq.write(JSON.stringify({ weight, height })); // Write Data and send Request
    externalReq.end();
});


router.post('/heartrates', (req,res) => {
	const {age,resting_heart_rate} = req.body;

	if (!age || !resting_heart_rate) {
        return res.status(400).send('Paramters are required');
    }

	const options = {
	method: 'POST',
	hostname: 'gym-calculations.p.rapidapi.com',
	port: null,
	path: '/heart-rate-zones',
	headers: {
		'x-rapidapi-key': '0d7192c883mshfa4a7eb3d56285cp10eeb1jsn0cb5699217ab',
		'x-rapidapi-host': 'gym-calculations.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
	}

	const newReq = http.request(options, function (newRes) {
	const chunks = [];

	newRes.on('data', function (chunk) {
		chunks.push(chunk);
	});

	newRes.on('end', function () {
		const body = Buffer.concat(chunks).toString();
        res.send(body);
	});
}); 

newReq.write(JSON.stringify({ age,resting_heart_rate}));
newReq.end();

});



// const options = {
// 	method: 'POST',
// 	hostname: 'gym-calculations.p.rapidapi.com',
// 	port: null,
// 	path: '/heart-rate-zones',
// 	headers: {
// 		'x-rapidapi-key': '0d7192c883mshfa4a7eb3d56285cp10eeb1jsn0cb5699217ab',
// 		'x-rapidapi-host': 'gym-calculations.p.rapidapi.com',
// 		'Content-Type': 'application/json'
// 	}
// };

// const req = http.request(options, function (res) {
// 	const chunks = [];

// 	res.on('data', function (chunk) {
// 		chunks.push(chunk);
// 	});

// 	res.on('end', function () {
// 		const body = Buffer.concat(chunks);
// 		console.log(body.toString());
// 	});
// });

// req.write(JSON.stringify({
//   age: 30,
//   resting_heart_rate: 60
// }));
// req.end();



export default router;
