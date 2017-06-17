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
			//access_token: token,
			data_type: 'gpx',
			//file: 'data/your_file.gpx',
			file: generateTrack(record),
			name: generateName(record),
			statusCallback(err, payload) {
				console.log(payload);
				//do something with your payload
			}
		},
		(err, payload, limits) => {
			console.log({ err });
			//do something with your payload, track rate limits
			response.json(payload);
		}
	);
	console.log('end of Func');
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

	return `
<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
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
