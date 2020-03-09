import { disp } from '../../../GAS | Library/v01/gas/disp';

const doSomething = () => {
	disp('--- doSomething ---');
};

const externaleActionA = () => {
	disp('externaleActionA');
};
const externaleActionB = () => {
	doSomething();
};

export { externaleActionA, externaleActionB };
