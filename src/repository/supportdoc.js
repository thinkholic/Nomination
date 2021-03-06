import { DBError } from 'Errors';
import { DbConnection } from './dataSource';
import { formatQueryToBulkInsert, formatDataToBulkInsert} from './sqlHelper';


const SUPPORT_DOC_BY_NOMINATION_SELECT_QUERY = `SELECT NS.ID AS SUPPORT_DOC_ID,
                                                NS.FILE_PATH AS SUPPORT_DOC_FILE_PATH,
                                                NS.SUPPORT_DOC_CONFIG_DATA_ID AS SUPPORT_DOC_SUPPORT_DOC_CONFIG_DATA_ID,
                                                NS.NOMINATION_ID AS SUPPORT_DOC_NOMINATION_ID,
                                                SDC.KEY_NAME AS SUPPORT_DOC_KEY_NAME,
                                                NS.STATUS AS SUPPORT_DOC_STATUS
                                                FROM NOMINATION_SUPPORT_DOC NS LEFT JOIN SUPPORT_DOC_CONFIG_DATA SDCD
                                                ON NS.SUPPORT_DOC_CONFIG_DATA_ID=SDCD.SUPPORT_DOC_CONFIG_ID
                                                LEFT JOIN SUPPORT_DOC_CONFIG SDC ON SDCD.SUPPORT_DOC_CONFIG_ID=SDC.ID
                                                WHERE NS.NOMINATION_ID = :nominationId AND NS.STATUS<>"DELETED"`;

const SUPPORT_DOC_INSERT_BASE_QUERY = `INSERT INTO NOMINATION_SUPPORT_DOC (ID,FILE_PATH,SUPPORT_DOC_CONFIG_DATA_ID, NOMINATION_ID,STATUS) VALUES `
const SUPPORT_DOC_UPDATE_BASE_QUERY = `UPDATE NOMINATION_SUPPORT_DOC (ID,FILE_PATH,SUPPORT_DOC_CONFIG_DATA_ID, NOMINATION_ID) VALUES `

const SUPPORT_DOC_UPDATE_QUERY = `UPDATE NOMINATION_SUPPORT_DOC 
                                SET 
                                STATUS = "DELETED"
                                WHERE 
                                NOMINATION_ID = :nominationId`;


const SUPPORT_DOC_COLUMN_ORDER = ['id', 'filePath', 'supportDocConfDataId', 'nominationId','status'];


                                
const getSupportDocByNomination = (nominationId) => {
  const params = { nominationId: nominationId };
  return DbConnection()
    .query(SUPPORT_DOC_BY_NOMINATION_SELECT_QUERY,
      {
        replacements: params,
        type: DbConnection().QueryTypes.SELECT,
      }).catch((error) => {
        throw new DBError(error);
      });
}

const saveSupportDocs = (supportDocsData) => { 
  return DbConnection()
  .query(formatQueryToBulkInsert(SUPPORT_DOC_INSERT_BASE_QUERY, supportDocsData),
    {
      replacements: formatDataToBulkInsert(supportDocsData, SUPPORT_DOC_COLUMN_ORDER),
      type: DbConnection().QueryTypes.INSERT,
    }).then((results) => {
      return supportDocsData ;
     }).catch((error) => {
       throw new DBError(error);
     });
};

const updateSupportDocs = (nominationId) => {
  const params = { nominationId: nominationId };
  return DbConnection()
    .query(SUPPORT_DOC_UPDATE_QUERY,
      {
        replacements: params,
        type: DbConnection().QueryTypes.UPDATE,
      }).then((results) => {
        return params ;
       }).catch((error) => {
         throw new DBError(error);
       });
};


export default {
  getSupportDocByNomination,
  saveSupportDocs,
  updateSupportDocs
}