import {} from '../../GAS | Library/v01/prot/obj/disp';

import {} from './tmp/dev';
import { menuDev } from './tmp/menuDev';
import { menu } from './App/interface/menu';
import {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
} from './App/experiments/tasks/z01';

// Funkcje do menusów

global.menu = {
	regenerateCachesZ1,
	runZ1AllJbJ,
	runZ1AllTbT,
};

global.devMenu = {
	test,
};

// Triggery

global.onOpen = () => {
	menu();
	menuDev();
};
