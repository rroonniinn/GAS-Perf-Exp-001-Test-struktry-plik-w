import { getGeneralBankName } from './getGeneralBankName';
import { getFromSheet } from './getFromSheet';
import { crusherCache } from './crusherCache';
import { orangeCache } from './orangeCache';

/**
 * Pobiera dane z cacha z okrślonego klucza. Jeśli danych nie ma
 * pobiera je z pliku o tym id i ładuje do cacha. Funkcja zcurrowana.
 *
 * @param {Object} cashMethod Obiekt z metodami do obsługi cacha
 * @param {String} fileId Id pliku z którego mają pochodzić dane.
 * Stanowi zarazem klucz tych danych w cachu
 */

const getThroughCache = cashMethod => fileId => {
	const name = getGeneralBankName(fileId);
	const valsCache = cashMethod.get(fileId);

	if (valsCache) {
		console.log(`${name}-- from cache --`);
		return valsCache;
	}

	const valsSheet = getFromSheet(fileId);
	cashMethod.put(fileId, valsSheet);
	console.log(`${name}-- from file --`);
	return valsSheet;
};

const getThroughCrusher = getThroughCache(crusherCache);
const getThroughOrange = getThroughCache(orangeCache);

export { getThroughCrusher, getThroughOrange };
