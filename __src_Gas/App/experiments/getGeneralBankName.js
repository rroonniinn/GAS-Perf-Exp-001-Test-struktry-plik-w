import { getParallel } from '../../../../GAS | Library/v01/obj/getParallel';
import { accounts } from './accounts';

const getGeneralBankName = fileId =>
	getParallel(accounts, 'fileId', fileId, 'bankAccountUser');

export { getGeneralBankName };
