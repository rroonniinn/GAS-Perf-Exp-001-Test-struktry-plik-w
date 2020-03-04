import { map } from '../../../../../GAS | Library/v01/fp/map';
import { pipe } from '../../../../../GAS | Library/v01/fp/pipe';
import { tap } from '../../../../../GAS | Library/v01/fp/tap';
import { reduceInitEl } from '../../../../../GAS | Library/v01/fp/reduce';
import { getSheet } from '../../../../../GAS | Library/v01/gas/getSheet';
import { getTableDataNoHeader } from '../../../../../GAS | Library/v01/gas/getTableDataNoHeader';
import { paste } from '../../../../../GAS | Library/v01/gas/paste';
import { removeEmptyRowCol } from '../../../../../GAS | Library/v01/gas/removeEmptyRowCol';
import { clearContent } from '../../../../../GAS | Library/v01/gas/clearContent';
import { looper } from '../../../../../GAS | Library/v01/utils/looper';
import { performanceCheckerObj } from '../../../../../GAS | Library/v01/utils/performanceCheckerObj';

import { accounts } from '../accounts';
import { getThroughCrusher, getThroughOrange } from '../getThroughCache';

const EX_HUB_ID = '1WkQ5XL11vLgIVbOkFn2GjOKejlcPXBvn0dhg-2EbZRw';
const SRC_SHEET_HUB = 'HUB';
const SRC_SHEET = 'Wyciąg';
const TARGET_SHEET = 'Test Results';

// Zadania do testów - Wyszukiwanie transakcji
/* ************************************ */
const z01a1 = pipe(
	() => getTableDataNoHeader(SRC_SHEET_HUB),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'B', 2, [[res]])
);

/* ************************************ */
const z01b1 = pipe(
	() => getTableDataNoHeader(SRC_SHEET, EX_HUB_ID),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'C', 2, [[res]])
);

/* ************************************ */
const z01c1 = pipe(
	() => accounts.fileId,
	reduceInitEl(
		(all, id) => all.concat(getTableDataNoHeader(SRC_SHEET, id)),
		[]
	),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'D', 2, [[res]])
);

/* ************************************ */
// helper - regeneruje cache
const regenerateAllCrusher = () =>
	accounts.fileId.forEach(id => getThroughCrusher(id));

const regenerateAllOrange = () =>
	accounts.fileId.forEach(id => getThroughOrange(id));

const z01c2 = (method, col) =>
	pipe(
		() => accounts.fileId,
		reduceInitEl((all, oneFile) => all.concat(method(oneFile)), []),
		map(([, , , , , sum]) => sum),
		sums => Math.max(...sums),
		res => paste(getSheet(TARGET_SHEET), col, 2, [[res]])
	);

const z01c2orange = z01c2(getThroughOrange, 'G');
const z01c2crusher = z01c2(getThroughCrusher, 'H');

/* ************************************ */
// helper - zbuduj cache cachy - hub cachey
// Rozwiązanie tymczasowe - oparte na pliku z B1

const buildCacheHubCrusher = () =>
	getThroughCrusher('1WkQ5XL11vLgIVbOkFn2GjOKejlcPXBvn0dhg-2EbZRw');
const buildCacheHubOrange = () =>
	getThroughOrange('1WkQ5XL11vLgIVbOkFn2GjOKejlcPXBvn0dhg-2EbZRw');

const z01d1 = (method, col) =>
	pipe(
		() => method('1WkQ5XL11vLgIVbOkFn2GjOKejlcPXBvn0dhg-2EbZRw'),
		map(([, , , , , sum]) => sum),
		sums => Math.max(...sums),
		res => paste(getSheet(TARGET_SHEET), col, 2, [[res]])
	);

const z01d1orange = z01d1(getThroughOrange, 'I');
const z01d1crusher = z01d1(getThroughCrusher, 'J');

/**
 * Testy *************************************************
 */

const loggerRes = [];
const times = 30;

const run = descLong => (callback, descShort) => () =>
	performanceCheckerObj(loggerRes, callback, descShort, descLong, 1);

const runJbJ = run('Zadanie 01 (Job By Job) - Wyszukiwanie transakcji');
const runTbT = run('Zadanie 01 (Task By Task) - Wyszukiwanie transakcji');

// Odpalenie 30 razy każdego zadania i przejście do następnego
const runZ1JobByJob = () => {
	looper(times, runJbJ(z01a1, 'A1'));
	looper(times, runJbJ(z01b1, 'B1'));
	looper(times, runJbJ(z01c1, 'C1'));
	looper(times, runJbJ(z01c2orange, 'C2 Orange'));
	looper(times, runJbJ(z01c2crusher, 'C2 Crusher'));
	looper(times, runJbJ(z01d1orange, 'D1 Orange'));
	looper(times, runJbJ(z01d1crusher, 'D1 Crusher'));
};

// Odpalenie 30 razy sekwencji składającej się ze wszystkich zadań
const runZ1TaskByTask = () => {
	looper(times, () => {
		runTbT(z01a1, 'A1')();
		runTbT(z01b1, 'B1')();
		runTbT(z01c1, 'C1')();
		runTbT(z01c2orange, 'C2 Orange')();
		runTbT(z01c2crusher, 'C2 Crusher')();
		runTbT(z01d1orange, 'D1 Orange')();
		runTbT(z01d1crusher, 'D1 Crusher')();
	});
};

const showLogs = (sheetName, colStart, colEnd, row) =>
	pipe(
		() => clearContent(sheetName, `${colStart}${row}:${colEnd}`),
		tap(sheet => paste(sheet, colStart, row, loggerRes)),
		removeEmptyRowCol
	);

const runZ1AllJbJ = pipe(runZ1JobByJob, showLogs('Z1 (x30)', 'A', 'D', 2));

const runZ1AllTbT = pipe(
	runZ1TaskByTask,
	showLogs('Z1 (x30)', 'F', 'I', 2)
);

const regenerateCachesZ1 = pipe(
	regenerateAllCrusher,
	regenerateAllOrange,
	buildCacheHubCrusher,
	buildCacheHubOrange
);

export { regenerateCachesZ1, runZ1AllJbJ, runZ1AllTbT };
