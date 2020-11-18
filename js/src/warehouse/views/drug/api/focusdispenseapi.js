
let prefix = '/warehouse'

export default {
  getTaskList: { url: '/DispensingDrugBillsRule/queryTask', isStatic: false, prefix: prefix },
  getSendList: { url: '/DispensingDrugBills/queryBills', isStatic: false, prefix: prefix },
  goDispensing: { url: '/DispensingDrugBills/creatBills', isStatic: false, prefix: prefix },
  reDispensing: { url: '/DispensingDrugBills/reBuildBills', isStatic: false, prefix: prefix },
  goSend: { url: '/DispensingDrugBills/sendMedicine', isStatic: false, prefix: prefix },
  getRecordList: { url: '/DispensingDrugBills/querySimpleBills', isStatic: false, prefix: prefix },
  getRecordDetail: { url: '/DispensingDrugBills/getBillsById', isStatic: false, prefix: prefix },
  saveRule: { url: '/DispensingDrugBillsRule/insert', isStatic: false, prefix: prefix },
  updRule: { url: '/DispensingDrugBillsRule/update', isStatic: false, prefix: prefix },
  getRuleList: { url: '/DispensingDrugBillsRule/queryList', isStatic: false, prefix: prefix },
  delRule: { url: '/DispensingDrugBillsRule/delete', isStatic: false, prefix: prefix },
  getConfigs: { url: '/DispensingDrugBillsRule/queryValueSet', isStatic: false, prefix: prefix },
  checkName: { url: '/DispensingDrugBillsRule/queryContainName', isStatic: false, prefix: prefix },
  getAreas: { url: '/udd/getBatchAreaList/', isStatic: false, prefix: prefix },
  getAreasNew: { url: '/DispensingDrugBills/queryArea', isStatic: false, prefix: prefix },
}
