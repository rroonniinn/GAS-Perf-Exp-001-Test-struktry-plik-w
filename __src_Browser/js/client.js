/* eslint-disable max-params */
// Był Client

/* global google */

// Tylko komunikacja client - server

const messageDiv = document.getElementById('message');
// Raportowanie błędów:
const reportMessage = message => {
	messageDiv.innerHTML = message;
};

const getData = successFunction => {
	console.log('Get Data execute on server');
	google.script.run
		.withFailureHandler(err => {
			// this will be executed if it fails
			reportMessage(err);
		})
		.withSuccessHandler(successFunction) // this will be executed if it succeeds
		.getContent(); // this is what gets executed on AppSCript (server)
};

const setVal = (range, val, successFunction) => {
	console.log('Set Val execute on server');
	google.script.run
		.withFailureHandler(err => {
			// this will be executed if it fails
			reportMessage(err);
		})
		.withSuccessHandler(successFunction)
		.setVal(range, val); // this is what gets executed on AppSCript (server)
};

export { getData, setVal };
