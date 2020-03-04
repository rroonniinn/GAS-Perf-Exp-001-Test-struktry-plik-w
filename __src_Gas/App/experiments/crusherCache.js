import { CrusherPluginCacheService } from '../../../../GAS | Library/v01/gas-mcpher/CrusherPluginCacheService';
/**
 * Obiekt do obsługi cachowania z biblioteki mcpher
 */

const crusherCache = {
	init: new CrusherPluginCacheService().init({
		store: CacheService.getScriptCache(),
	}),
	get(key) {
		return this.init.get(`cr-${key}`);
	},
	put(key, vals) {
		this.init.put(`cr-${key}`, vals, 60 * 60 * 2); // t 2h
	},
};

export { crusherCache };
