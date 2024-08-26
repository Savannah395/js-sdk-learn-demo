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

import { CURRENCY } from './const';
import { getExchangeRate } from './exchange-api'; 
const transform = async () => { 
}

return <div>
  <div style={{ margin: 10 }}>
    <div>Select Field</div>
    <Select style={{ width: 120 }} onSelect={setSelectFieldId} options={formatFieldMetaList(currencyFieldMetaList)}/>
  </div>
  <div style={{ margin: 10 }}>
    <div>Select Currency</div>
    <Select options={CURRENCY} style={{ width: 120 }} onSelect={setCurrency}/>
    <Button style={{ marginLeft: 10 }} onClick={transform}>transform</Button>
  </div>
  const transform = async () => {
  // 如果用户没有选择货币或者转换的字段，则不进行转换操作
  if (!selectFieldId || !currency) return;
  const table = await bitable.base.getActiveTable();
  // 获取货币字段，这里我们传入了一个 ICurrencyField 
  // 来表明我们获取的是一个货币类型的字段  
  // 在使用 ts 的情况下，我们限制了这个字段的类型之后 
  // 在开发时就会获得很多类型提示，来帮我们进行开发  
  const currencyField = await table.getField<ICurrencyField>(selectFieldId); 
  const currentCurrency = await currencyField.getCurrencyCode();
  // 设置货币类型
  await currencyField.setCurrencyCode(currency);
  // 获取货币的汇率
  const ratio = await getExchangeRate(currentCurrency, currency);
  if (!ratio) return;
  // 首先我们获取 recordId 
  const recordIdList = await table.getRecordIdList();
  // 对 record 进行遍历
  for (const recordId of recordIdList) {
    // 获取当前的货币值
    const currentVal = await currencyField.getValue(recordId);
    // 通过汇率进行新值的运算
    await currencyField.setValue(recordId, currentVal * ratio);
  }
}
