export const convertKmPerHour = (distanceInKM, timeInSeconds) => {
	if (distanceInKM > 0 && timeInSeconds > 0) {
		const timeInHours = timeInSeconds / 60 / 60;
		const kmPerHour = distanceInKM / timeInHours;
		return kmPerHour.toFixed(2);
	}
	return 0.0;
};

export const convertSecToMin = sec => {
	if (typeof sec === 'undefined') {
		return '00:00';
	}
	let minutes = Math.floor(sec / 60);
	let seconds = sec % 60;
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	return minutes + ':' + seconds;
};

export const converKmToM = km => (km * 1000).toFixed(0);

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
	let R = 6371; // Radius of the earth in km
	let dLat = deg2rad(lat2 - lat1); // deg2rad below
	let dLon = deg2rad(lon2 - lon1);
	let a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c; // Distance in km
	return d;
};

export const deg2rad = deg => deg * (Math.PI / 180);

export const calcRunMetrics = records => {
	const reducing = records.reduce(
		(prev, next) => {
			let totalDistance = prev.totalDistance;
			if (prev.gps) {
				totalDistance += getDistanceFromLatLonInKm(
					prev.gps.lat,
					prev.gps.lng,
					next.gps.lat,
					next.gps.lng
				);
			}

			return {
				gps: next.gps,
				totalHR: prev.totalHR + next.heartRate,
				totalDistance
			};
		},
		{
			gps: false,
			totalHR: 0,
			totalDistance: 0
		}
	);

	return {
		distance: reducing.totalDistance,
		av_hr: reducing.totalHR / records.length,
		av_speed: convertKmPerHour(reducing.totalDistance, records.length)
	};
};
