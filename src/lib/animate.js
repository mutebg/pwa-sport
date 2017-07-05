export const animateGroup = (elements, keyframes, timing, delay = 0) => {
	elements.forEach((el, i) => {
		el.animate(keyframes, Object.assign(timing, { delay: i * delay }));
	});
};

export const listAnimation = () => {
	const elements = Array.from(document.querySelectorAll('[class^=item__]'));

	const timing = {
		duration: 320,
		easing: 'ease-out',
		fill: 'both',
		iterations: 1
	};

	const keyframes = [
		{ transform: 'scaleY(0)', opacity: 0, offset: 0 },
		{ transform: 'scaleY(1)', opacity: 1, offset: 1 }
	];
	animateGroup(elements, keyframes, timing, timing.duration / 3);
};

export const homePage = () => {
	const elements = Array.from(document.querySelectorAll('[class^=wraper__]'));
	const timing = {
		duration: 700,
		easing: 'ease-out',
		fill: 'both',
		iterations: 1
	};

	const keyframes = [
		{ transform: 'scale(0)', opacity: 0, offset: 0 },
		{ transform: 'scale(1)', opacity: 1, offset: 1 }
	];
	animateGroup(elements, keyframes, timing, 150);
};

export const detailsPage = () => {
	const elements = [
		...Array.from(document.querySelectorAll('[class^=row__]')),
		...Array.from(document.querySelectorAll('[class^=inline-btn]'))
	];

	const timing = {
		duration: 320,
		easing: 'ease-out',
		fill: 'both',
		iterations: 1
	};

	const keyframes = [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }];
	animateGroup(elements, keyframes, timing, timing.duration / 3);
};
