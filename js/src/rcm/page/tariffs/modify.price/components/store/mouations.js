/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-28 10:44:39
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-30 17:53:32
 */
export default {
  // 初始化设置价格列 和  价格维度
  initItemCol (state, payload) {
    const { aceList, sceneList } = payload
    let sceneObj = {}
    state.aceList = aceList // 计算规则 (四舍五入)
    state.sceneList = sceneList // 维度（场景）列表 价格维度
    state.sceneList.forEach(item => {
      sceneObj[item.scene] = ''
    })
    state.sceneObj = sceneObj
  },
  // 设置当前tab值
  activeName (state, payload) {
    state.activeName = payload
  },
  // 设置当前来源 warehouse | cpoe
  sourceModule (state, payload) {
    state.sourceModule = payload
  },
  // 设置系统分类
  initSysValue (state, serviceOptions) {
    state.serviceOptions = serviceOptions
  },
  // 设置机构数据
  setOrgList (state, org) {
    state.orgList = org
  },
  // 设置是否是在集团操作
  setTenant (state, payload) {
    state.isTenant = payload
  },
  // 设置 按分类调价 或 按维度调价选中的影响机构
  setSelectOrgs (state, payload) {
    state.orgIds = payload
  },
  setPriceColumns (state, payload) {
    state.priceColumns = payload
  }
}
