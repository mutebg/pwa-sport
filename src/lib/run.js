export const convertKmPerHour = (distanceInKM, timeInSeconds) => {
	const timeInHours = timeInSeconds / 60 / 60;
	const kmPerHour = distanceInKM / timeInHours;
	return kmPerHour.toFixed(2);
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
