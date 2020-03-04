// eslint-disable-next-line max-lines-per-function
const menu = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('ICON')
		.addSubMenu(
			ui
				.createMenu('Z1')
				.addItem('Z1 - Job by Job', 'menu.runZ1AllJbJ')
				.addItem('Z1 - Task by Task', 'menu.runZ1AllTbT')
				.addSeparator()
				.addItem(
					'Z1 - Regenerate Cashes',
					'menu.regenerateCachesZ1'
				)
		)
		.addToUi();
};

export { menu };
