// eslint-disable-next-line max-lines-per-function
const menu = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('ICON')
		.addSubMenu(
			ui
				.createMenu('**Z1 - Odczyt danych z całej bazy')
				.addItem('Z1 - Job by Job', 'intoMenu.runZ1AllJbJ')
				.addItem('Z1 - Task by Task', 'intoMenu.runZ1AllTbT')
				.addSeparator()
				.addItem(
					'Z1 - Regenerate Cashes',
					'intoMenu.regenerateCachesZ1'
				)
		)
		.addToUi();
};

export { menu };
