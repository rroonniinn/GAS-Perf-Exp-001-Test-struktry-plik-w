// eslint-disable-next-line max-lines-per-function
const menu = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('ICON')
		.addItem('Exp01', 'menu.exp01')
		.addToUi();
};

export { menu };
