/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-28 10:44:22
 * @Last Modified by: qiaodengtao
 * @Last Modified time: 2020-06-11 15:04:52
 */

// 注册Vuex模块名称 -- 价格体系 调价vuex模块
export const ModuleName = 'priceControl'
// 调价组件tabs
export const Tabs = [
  {
    id: 'byitem',
    name: '按项目调价',
    isTenant: true
  },
  {
    id: 'byscene',
    name: '按维度调价',
    tips: '<span >注：</span>按维度调价是<span class="font red f_bold">基于基础价格</span>的调整比例，如：注射费基础价格10元，价格维度选医保价格，调整比例输入110%，发布后医保价格价格：10*110%=11元'
  },
  {
    id: 'byclass',
    name: '按分类调价',
    tips: '<span >注：</span>按分类调价是<span class="font red f_bold">基于当前价格</span>的调整比例，如：注射费基础价格10元，调整比例为110%，那么注射费基础价格：10+110%=11元'
  },
]
