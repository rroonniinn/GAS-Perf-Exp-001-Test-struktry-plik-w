import {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
} from '../experiments/tasks/z01';

global.menu = {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
};

const menu = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('ICON')
		.addSubMenu(
			ui
				.createMenu('Z1 - test odczytu danych z całej bazy')
				.addItem('Z1 - Job by Job', 'menu.runZ1AllJbJ')
				.addItem('Z1 - Task by Task', 'menu.runZ1AllTbT')
				.addSeparator()
				.addItem('Regeneruj cache', 'menu.regenerateCachesZ1')
		)

		.addSeparator()
		.addItem('Update menu', 'onOpen')
		.addToUi();
};

export { menu };
