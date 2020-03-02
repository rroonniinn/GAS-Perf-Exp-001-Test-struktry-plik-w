import {} from './tmp/dev';

import { exp01 } from './App/experiments/exp01';
import { menu } from './App/interface/menu';
import { menuDev } from './tmp/menuDev';

// Funkcje do menusów

global.menu = {
	exp01,
};

global.devMenu = {
	test,
};

// Triggery

global.onOpen = () => {
	menu();
	menuDev();
};
