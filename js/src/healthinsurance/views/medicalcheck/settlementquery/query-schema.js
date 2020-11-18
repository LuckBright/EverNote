import medicalOrgSelect from '@/rcm/otmdiscomponent/medicalorgselect.vue'
export var schema = [{
  label: '患者姓名',
  name: 'patientId',
  comp: 'ever-patient-select'
},
{
  label: '门诊号'
},
{
  label: '结算单号'
},
{
  label: '结算日期',
  name: 'settleDate',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }

},
{
  label: '医保中心',
  comp: medicalOrgSelect,
  newRow: true
},
{
  label: '结算单类型',
  comp: 'ever-select',
  props: {
    options: [{
      id: '0',
      name: '全部'
    },
    {
      id: '1',
      name: '挂号'
    },
    {
      id: '2',
      name: '收费'
    }]
  }
},
{
  label: '结算方向',
  comp: 'ever-select',
  props: {
    options: [{
      id: '1',
      name: '收款'
    },
    {
      id: '2',
      name: '退款'
    }]
  }
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom'
}]
