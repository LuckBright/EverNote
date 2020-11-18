/**
 * 获取物资icon
*/
export default {
  methods: {
    needIcon (adviceType) {
      const typeId = {
        301: {
          icon: 'iconyaopin1',
          name: '西药'
        },
        299: {
          icon: 'iconhaocai',
          name: '医疗耗材'
        },
        300: {
          icon: 'iconhaocai',
          name: '医疗耗材'
        },
        10008: {
          icon: 'iconshangpin1',
          name: '商品'
        },
        302: {
          icon: 'iconyaopin1',
          name: '中成药'
        }
      }
      return adviceType ? typeId[adviceType] : ''
    }
  }
}
