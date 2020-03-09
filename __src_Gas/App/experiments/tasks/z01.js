/* eslint-disable max-lines */

import { accounts } from '../accounts';
import { getThroughCrusher, getThroughOrange } from '../getThroughCache';
import { map } from '../../../../../GAS | Library/v01/fp/map';
import { pipe } from '../../../../../GAS | Library/v01/fp/pipe';
import { reduceInitEl } from '../../../../../GAS | Library/v01/fp/reduce';
import { getSheet } from '../../../../../GAS | Library/v01/gas/getSheet';
import { getTableDataNoHeader } from '../../../../../GAS | Library/v01/gas/getTableDataNoHeader';
import { looper } from '../../../../../GAS | Library/v01/utils/looper';
import { performanceCheckerObj } from '../../../../../GAS | Library/v01/utils/performanceCheckerObj';
import { paste } from '../../../../../GAS | Library/v02/gas/paste';

const SRC_SHEET_HUB = 'helper HUB'; // cała baza transakcji (z01a1)

const EX_HUB_ID = '1WkQ5XL11vLgIVbOkFn2GjOKejlcPXBvn0dhg-2EbZRw'; // zewnętrzny plik z bazą (z01b1)
const SRC_SHEET = 'Wyciąg'; // arkusz z bazą (z01b1)

const TARGET_SHEET = 'Test Results';
const pasteResultOpt = {
	notRemoveFilers: true,
	restrictCleanup: 'preserve',
	notRemoveEmptys: true,
};
const pasteTimesOpt = {
	notRemoveFilers: true,
	restrictCleanup: 'preserve',
};

/**
 * Setup eksperymentów:
 * Bazę danych stanowią pliki z wyciągami z poszczególnych banków
 * (24 pliki, niektóre praktycznie pust). Celem testu nr 1 jest sprawdzenie
 * jaka struktura bazy danych jest najefektywniejsza w przypadku odczytu
 * danych za całej bazy (np. podczas wyszukiwania wszystkich transakcji
 * spełniających określone cechy).
 *
 * Zatem zadanie składa się z kroków:
 * - Pobranie danych z "bazy"
 * - Operacja na danych (znalezenie transakcji o największej wartości)
 * - Wklejenie wyniku do wskazanego arkusza
 *
 * Poniższe testy różnią się tylko strukturą bazy danych
 */

/** ************************************
 * Opcja A1 - Pobranie danych z arkusza w tym samym pliku
 * Wszystkie transakcje trzymane są w jednym dużym arkuszu w tym samym
 * pliku co główna aplikacja (czyli wyszukiwania, raporty itp)
 */

const z01a1 = pipe(
	() => getTableDataNoHeader(SRC_SHEET_HUB),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'B2', [[res]], pasteResultOpt)
);

/** ************************************
 * Opcja B1 - Pobranie danych z arkusza w innym pliku
 * Wszystkie transakcje trzymane są w jednym dużym arkuszu w innym
 * pliku niż główna aplikacja (czyli wyszukiwania, raporty itp)
 */
const z01b1 = pipe(
	() => getTableDataNoHeader(SRC_SHEET, EX_HUB_ID),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'C2', [[res]], pasteResultOpt)
);

/** ************************************
 * Opcja C1 - Pobranie danych z indywidualnych arkuszy (24 pliki)
 * pliku niż główna aplikacja (czyli wyszukiwania, raporty itp)
 */
const z01c1 = pipe(
	() => accounts.fileId,
	reduceInitEl(
		(all, id) => all.concat(getTableDataNoHeader(SRC_SHEET, id)),
		[]
	),
	map(([, , , , , sum]) => sum),
	sums => Math.max(...sums),
	res => paste(getSheet(TARGET_SHEET), 'D2', [[res]], pasteResultOpt)
);

/** ************************************
 * Opcja C2 - Pobranie danych z indywidualnych cachy indywidualnych
 * arkuszy (24 pliki) przy założeniu, że cache są dostępne.
 * Zatem przed odpaleniem tego testu należy wcześniej zregenerować
 * cache. Ta opcja ma dwa podtesty weryfikujące skuteczność dwóch niezależnych
 * bibliotek do cachowania (orange i crusher)
 */

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
		res => paste(getSheet(TARGET_SHEET), col, [[res]], pasteResultOpt)
	);
// funkcje do testowania
const z01c2orange = z01c2(getThroughOrange, 'G2');
const z01c2crusher = z01c2(getThroughCrusher, 'H2');

/** ************************************
 * Opcja D1 - Pobranie danych z jednego cacha zawierającego wszystkie transakcjie
 * przy założeniu, że cache jest dostępny.
 * Zatem przed odpaleniem tego testu należy wcześniej zregenerować
 * cache. Ta opcja ma dwa podtesty weryfikujące skuteczność dwóch niezależnych
 * bibliotek do cachowania (orange i crusher)
 */

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
		res => paste(getSheet(TARGET_SHEET), col, [[res]], pasteResultOpt)
	);
// funkcje do testowania
const z01d1orange = z01d1(getThroughOrange, 'I2');
const z01d1crusher = z01d1(getThroughCrusher, 'J2');

/**
 * Testy
 * Ponieważ same Sheetsy korzystają z jakiegoś wewnętrznego cachowania, testy
 * są przeprowadzane w dwóch opcjach różniących się kolejnościa wykonywania zadań
 * Opcja 1 - JobByJob - odpala określoną liczbę razy wskazaną funkcję,
 * następnie przechodzi do kolejnej funkcji, którą również odpala określoną
 * liczbę razy itd.
 * Opcja 2 - TaskByTask - odpala określoną liczbę razy ciąg funkcji jedna po drugiej
 *
 * Po zakończeniu pracy
 */

const loggerRes = [];

const run = descLong => (callback, descShort) => () =>
	performanceCheckerObj(loggerRes, callback, descShort, descLong, 1);

const runJbJ = run('Zadanie 01 (Job By Job) - Wyszukiwanie transakcji');
const runTbT = run('Zadanie 01 (Task By Task) - Wyszukiwanie transakcji');

// Odpalenie 'times' razy każdego zadania i przejście do następnego
const runZ1JobByJob = times => () => {
	looper(times, runJbJ(z01a1, 'A1'));
	looper(times, runJbJ(z01b1, 'B1'));
	looper(times, runJbJ(z01c1, 'C1'));
	looper(times, runJbJ(z01c2orange, 'C2 Orange'));
	looper(times, runJbJ(z01c2crusher, 'C2 Crusher'));
	looper(times, runJbJ(z01d1orange, 'D1 Orange'));
	looper(times, runJbJ(z01d1crusher, 'D1 Crusher'));
};

// Odpalenie 30 razy sekwencji składającej się ze wszystkich zadań
const runZ1TaskByTask = times => () => {
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

const printTimes = () =>
	paste(getSheet('Times: Z1'), 'A', loggerRes, pasteTimesOpt);

// Funkcje do uruchomienia masowych testów:
// JobByJob
const runZ1AllJbJ = pipe(runZ1JobByJob(20), printTimes);

// TaskByTask
const runZ1AllTbT = pipe(runZ1TaskByTask(20), printTimes);

// Regenaracja wszystkich cachy
const regenerateCachesZ1 = pipe(
	regenerateAllCrusher,
	regenerateAllOrange,
	buildCacheHubCrusher,
	buildCacheHubOrange
);

export { regenerateCachesZ1, runZ1AllJbJ, runZ1AllTbT };
