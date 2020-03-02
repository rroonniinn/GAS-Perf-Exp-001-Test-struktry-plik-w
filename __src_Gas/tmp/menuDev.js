const menuDev = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('DEV')
		.addItem('Test', 'test')
		.addSeparator()
		.addItem('Update menu', 'onOpen')
		.addToUi();
};

export { menuDev };
