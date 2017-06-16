const functions = require('firebase-functions');
const strava = require('strava-v3');

exports.stravaCallback = functions.https.onRequest((request, response) => {
	//console.log(request);
	const code = request.query.code;
	const state = request.query.state;
	strava.oauth.getToken(code, (err, stravaResp) => {
		if (!err) {
			response.json({
				code,
				state,
				token: stravaResp.access_token
			});
		}
		else {
			response.json(err);
		}
	});
});

exports.stravaLogin = functions.https.onRequest((request, response) => {
	const url = strava.oauth.getRequestAccessURL({
		scope: 'view_private,write'
	});
	response.redirect(url);
});

exports.stravaUpload = functions.https.onRequest((request, response) => {
	const token = request.body.token;
	const record = request.body.record;
	strava.uploads.post(
		{
			access_token: token,
			data_type: 'gpx',
			file: 'data/your_file.gpx',
			name: 'Epic times',
			statusCallback(err, payload) {
				//do something with your payload
			}
		},
		(err, payload, limits) => {
			//do something with your payload, track rate limits
		}
	);
});
