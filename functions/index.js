const functions = require('firebase-functions');
const strava = require('strava-v3');
const HTTPrequest = require('request');
const cors = require('cors')({ origin: true });

const config = {
	frontURL: 'http://localhost:8080/',
	defaultToken: 'db31f1f27ef1c14773e9d79d8519b6629c815e99'
};

exports.stravaCallback = functions.https.onRequest((request, response) => {
	const code = request.query.code;
	const state = request.query.state;
	strava.oauth.getToken(code, (err, stravaResp) => {
		if (!err) {
			response.redirect(
				`${config.frontURL}token?token=${stravaResp.access_token}&state=${state}`
			);
		}
		else {
			response.redirect(`${config.frontURL}`);
		}
	});
});

exports.stravaLogin = functions.https.onRequest((request, response) => {
	const url = strava.oauth.getRequestAccessURL({
		scope: 'view_private,write',
		state: request.query.state
	});
	response.redirect(url);
});

exports.stravaUpload = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		const token = request.body.token || config.defaultToken;
		const record = request.body.record;

		const trackXML = generateTrack(record);

		const tempName = Date.now() + '.gpx';

		const url = 'https://www.strava.com/api/v3/uploads';
		const options = {
			url,
			method: 'POST',
			json: true,
			headers: {
				Authorization: 'Bearer ' + token
			}
		};

		const req = HTTPrequest.post(options, (err, httpResponse, payload) => {
			response.send(payload);
		});

		const form = req.form();
		form.append('file', trackXML, {
			filename: tempName,
			contentType: ''
		});
		form.append('activity_type', 'run');
		form.append('data_type', 'gpx');
	});
});

const generateName = record =>
	`Run on ${new Date(record[0].time).toLocaleDateString()}`;

const generateTrack = record => {
	const points = record.map(
		({ gps, heartRate, time }) => `
		<trkpt lat="${gps.lat}" lon="${gps.lng}">
    <ele>0</ele>
    <time>${new Date(time).toISOString()}</time>
    <extensions>
     <gpxtpx:TrackPointExtension>
      <gpxtpx:hr>${heartRate}</gpxtpx:hr>
     </gpxtpx:TrackPointExtension>
    </extensions>
   </trkpt>
	`
	);

	return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="PWRunner" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
	<metadata>
  	<time>${new Date(record[0].time).toISOString()}</time>
 	</metadata>
 	<trk>
  	<name>${generateName(record)}</name>
  	<trkseg>${points.join('')}</trkseg>
	</trk>
</gpx>
	`;
};
