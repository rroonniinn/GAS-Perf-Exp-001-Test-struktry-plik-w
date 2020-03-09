const menuDev = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('DEV')
		.addItem('Test', 'test')
		.addSeparator()
		.addItem('Test OnOpen', 'menu.testOnOpen')
		.addSeparator()
		.addItem('Test DoSomething', 'menu.testDoSomething')
		.addSeparator()
		.addItem('Update menu', 'onOpen')
		.addToUi();
};

export { menuDev };
