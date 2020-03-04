/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { getSheet } from '../../../GAS | Library/v01/gas/getSheet';
import { getRangeRelative } from '../../../GAS | Library/v02/gas/getRangeRelative';

global.test = () => {
	const ss = getSheet('Arkusz3');
	// Czyszczenie kontentu
	getRangeRelative(ss, 1).clearContent();
};
