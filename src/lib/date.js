export const humanDateFromTS = ts => {
	const date = new Date(ts);
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec'
	];
	return date.getDate() + ' ' + months[date.getMonth() - 1];
};
