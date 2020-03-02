/**
 * App module.
 * @module app
 *
 */

import * as Client from './client';

/* eslint-disable max-lines-per-function */

// Różne funkcje aplikacji jako takiej

// Get elements:
const messageDiv = document.getElementById('message');
const btnSave = document.getElementById('btnSave');
const btnGet = document.getElementById('btnGet');
const inpRange = document.getElementById('inputRange');
const inpVal = document.getElementById('inputVal');
const outputDiv = document.getElementById('output');

// Raportowanie błędów:
const reportMessage = message => {
	messageDiv.innerHTML = message;
};

/**
 * Ustawia eventListenery
 * @returns {void} Tylko side effect
 */
const setListeners = () => {
	btnGet.addEventListener('click', e => {
		e.preventDefault();

		Client.getData(output => {
			outputDiv.innerHTML = output;
			reportMessage('Data transfered!');
		});
	});

	btnSave.addEventListener('click', e => {
		e.preventDefault();

		const range = inpRange.value;
		const val = inpVal.value;

		Client.setVal(range, val, output => {
			reportMessage(output);
		});
	});
};

export { setListeners };
