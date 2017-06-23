export const speak = textToSpeak => {
	const newUtterance = new SpeechSynthesisUtterance();
	newUtterance.text = textToSpeak;
	newUtterance.voiceURI = 'Google UK English Female';
	newUtterance.lang = 'en-GB';
	window.speechSynthesis.speak(newUtterance);
};
