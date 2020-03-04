import { EnhancedCache } from '../../../../GAS | Library/v01/gas-yinon/EnhancedCache';

/**
 * Obiekt do obsługi cachowania z biblioteki yinon
 */

const orangeCache = {
	init: new EnhancedCache(CacheService.getScriptCache()),
	get(key) {
		const res = this.init.get(`or-${key}`);
		return res ? JSON.parse(res) : null;
	},
	put(key, vals) {
		this.init.put(`or-${key}`, JSON.stringify(vals), 60 * 60 * 2); // t 2h
	},
};

export { orangeCache };
