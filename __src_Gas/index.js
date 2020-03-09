import { removeEmptyRowCol } from '../../GAS | Library/v01/gas/removeEmptyRowCol';
import { getSheet } from '../../GAS | Library/v01/gas/getSheet';

import {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
} from './App/experiments/tasks/z01';

global.menu = {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
};

global.removeEmptyRowCol = () => {
	const sheet = getSheet('Times: Z1');

	removeEmptyRowCol(sheet);
};

const menuDev = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('DEV')
		.addSubMenu(
			ui
				.createMenu('Z1 - test odczytu danych z całej bazy')
				.addItem('Regeneruj cache', 'menu.regenerateCachesZ1')
				.addItem('Z1 - Job by Job', 'menu.runZ1AllJbJ')
				.addItem('Z1 - Task by Task', 'menu.runZ1AllTbT')
				.addItem('@ Usuń puste', 'removeEmptyRowCol')
		)

		.addSeparator()
		.addItem('Update menu', 'onOpen')
		.addToUi();
};

export { menuDev };

// Triggery
global.onOpen = () => {
	menuDev();
};
