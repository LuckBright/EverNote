const init = {}
import storage from '@/util/storage'
import { MaterialClassify } from '@/warehouse/views/util/constant.js'
init.install = function (Vue) {
  // 初始化一些东西在此处添加
  storage.removeSessionStorage('FREQUENCY_LIST') // 清空用药频次
  storage.removeSessionStorage('RECIPE_CLASSIFY') // 清空处方点评列表数据
  storage.removeSessionStorage(MaterialClassify) // 清空物资分类
}

export default init
