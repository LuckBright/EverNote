// 基础字段和方法定义（公共组件间的定义）
import { ASIDE_WIDTH } from '@/warehouse/views/util/constant'
import { wrapperProscription } from '@/warehouse/views/util/index.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
export default {
  data () {
    return {
      listWidth: '380px', // 左侧列表宽度el-aside
      visitNumber: 'OP20190000003007', // 就诊号
      patientId: 'YzWmfYHJywZn22ueoLm', // 患者id
      patientCode: '009', // 库房患者头code
      storageRoomList: [], // 编辑弹窗中库房列表
      wrapper: null, // 包装处方数据方法Function
      noDataTip: '暂无任务',
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig,
      operateMode: null // 操作模式： 1、 按处方明细处理  2、按处方批量处理
    }
  },
  async created () {
    this.operateMode = this.$route.meta.operateMode
    const currentStorageRoom = this.storageItem.find(item => item.id === this.storageId)
    // 库房为中药类型，强制按处方发药 operateMode = 2
    if (currentStorageRoom && currentStorageRoom.materialType === '["303","304"]') this.operateMode = 2
    this.wrapper = wrapperProscription(this.operateMode)
  },
  mixins: [getStorage],
  mounted () {
    // 一小时内， 不会重复请求查询库房列表接口
    // const now = storage.getSessionStorage('DATE_NOW')
    // if (!(this.storageRoomList = JSON.parse(storage.getSessionStorage(this.processConfig.id))) || (!now || (Date.now() - now > 1000 * 60 * 60))) {
    // }
  },
  watch: {
    $route (route) {
      this.operateMode = route.meta.operateMode
    }
  },
  methods: {
    cancelFunc (id, dataType, fn) {
      // 删除异常原因 或 删除驳回原因
      dispenseApi.cancel({
        taskId: id,
        actualStorageRoomId: this.storageId,
        dataType
      }).then(res => {
        res && res.finally && fn && fn()
      })
    },
    handlerAsideWidth (b) {
      this.listWidth = ASIDE_WIDTH[+b] + 'px'
    },
    theParamsUpdateChange (obj, list, currentData, index, isMany) {
      // 处理更新处方信息或者处方审核信息
      // currentData:审核不会传入当前明细数据
      // 获取提交编辑数据（修改库房、方式、异常）
      const dataType = currentData ? 0 : 1 // 异常(0)、审核(1)
      const { delivery, actualStorageRoomId } = obj
      const params = {
        // dataType, // 异常
        // actualStorageRoomId: this.storageId,
        recipeCommentDetailList: [
          // {id: '', // 物资明细id、classifyList: [], // 选择异常数据、content: '', // 手动输入添加异常数据 }
        ]
      }
      // 审核驳回操作时：obj中不存在delivery、actualStorageRoomId
      delivery && (params.delivery = delivery)
      actualStorageRoomId && (params.actualStorageRoomId = actualStorageRoomId)
      // 获取该处方全部明细id = 审核驳回不需要ids 也没有currentData
      // isMany = true && operateMode = 1 父子医嘱 且 是明细操作模式 只需获取当前父子医嘱数据，而非整个taskDotList
      let expression = null
      if (isMany && this.operateMode === 1) {
        expression = function (list) {
          const { mainGroupId } = list[index]
          const compose = mainGroupId + list[index].createTime
          return list.filter(task => (task.mainGroupId + task.createTime) === compose).map(task => {
            return (task._sourceData && delivery) ? task._sourceData.map(item => item.taskId) : task.taskId
          })
        }
      } else {
        expression = function (list) {
          return list.map(task => task.taskId)
        }
      }
      // // currentData.taskDtoList.map(task => ((isMany && this.operateMode === 1) ? currentData : task.id))
      currentData && (params.ids = [...new Set(expression(currentData.taskDtoList).flat())])
      list.forEach(item => {
        // 获取添加异常物资明细id
        params.recipeCommentDetailList.push({
          id: item.taskId,
          classifyList: item.abnormalList ? item.abnormalList.filter(abnormal => abnormal.id).map(abnormal => ({ id: abnormal.id, contentText: abnormal.contentText })) : [],
          content: item.abnormalList ? item.abnormalList.filter(abnormal => !abnormal.id).join('') : '',
          dataType
        })
      })
      return params
    }
  }
}
