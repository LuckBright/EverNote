export default {
  methods: {
    // 验证整个发票列表是否有未填写的物资信息
    cheListData () {
      return this.obj.purchaseAcceptanceItemList.some(item => {
        if (this.cheListItemData(item.item)) return item
      })
    },
    // 验证某一个发票下的物资是否有未填写的信息
    cheListItemData (checkData) {
      return checkData.some(thisData => {
        let ches = false
        if (thisData.localMaterialId) {
          if (thisData.isExpiryDate === 0 || (thisData.localSettingObject && thisData.localSettingObject.isExpiryDate === 0)) {
            ches = thisData.price === '' || thisData.price === undefined || !thisData.num
          } else {
            ches = !thisData.num || thisData.price < 0 || thisData.price === undefined || !thisData.produceDate || !thisData.validityDate
          }
        }
        if (ches) return thisData
      })
    }
  }
}
