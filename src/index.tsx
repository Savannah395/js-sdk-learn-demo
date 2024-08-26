import { bitable, CurrencyCode, FieldType, ICurrencyField, ICurrencyFieldMeta } from '@lark-base-open/js-sdk'; 
import { CURRENCY } from './const'; 

function LoadApp() {
  const [currencyFieldMetaList, setMetaList] = useState<ICurrencyFieldMeta[]>([]) 
  const [selectFieldId, setSelectFieldId] = useState<string>(); 
  const [currency, setCurrency] = useState<CurrencyCode>(); 

useEffect(() => {
  const fn = async () => {
    const table = await bitable.base.getActiveTable();
    const fieldMetaList = await table.getFieldMetaListByType<ICurrencyFieldMeta>(FieldType.Currency); 
    setMetaList(fieldMetaList); 
  };
  fn();
}, []);

const formatFieldMetaList = (metaList: ICurrencyFieldMeta[]) => { 
  return metaList.map(meta => ({ label: meta.name, value: meta.id })); 
}; 

return <div>
  <div style={{ margin: 10 }}> 
    <div>Select Field</div> 
    <Select style={{ width: 120 }} onSelect={setSelectFieldId} options={formatFieldMetaList(currencyFieldMetaList)}/> 
  </div> 
  <div style={{ margin: 10 }}>
    <div>Select Currency</div>
    <Select options={CURRENCY} style={{ width: 120 }} onSelect={setCurrency}/>
  </div>
</div>
