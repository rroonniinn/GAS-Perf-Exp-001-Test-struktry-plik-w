import { getTableDataNoHeader } from '../../../../GAS | Library/v01/gas/getTableDataNoHeader';

const getFromSheet = fileId => getTableDataNoHeader('Wyciąg', fileId);

export { getFromSheet };
