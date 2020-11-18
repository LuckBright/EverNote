<template>
  <div>
    <list-task
      ref="listtask"
      :listData="listData"
      :pageType="pageType"
      @clearList="clearList"
      @getList="getList"
      @goDispensing="goDispensing"
      @goSend="goSend"></list-task>
  </div>
</template>

<script>
import { CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import { request } from '@/util/req'
import listTask from '@/warehouse/views/drug/component/dispensing.task'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
export default {
  name: 'dispensing-task-index',
  mixins: [getStorage, HospitalMethodsMixin],
  components: {
    listTask
  },
  props: ['urlObj', 'pageType'],
  data () {
    return {
      queryObj: {},
      listData: []
    }
  },
  created () {
    // this.getList()
  },
  methods: {
    clearList () {
      this.listData = []
    },
    getTask () {
      this.getList()
    },
    /**
     * 获取发药任务列表
     * @param queryObj
     */
    getList (queryObj, flag, sendAfter) {
      this.$refs.listtask && this.$refs.listtask.changeLoading(true)
      if (queryObj) {
        this.queryObj = queryObj
        if (flag && (this.queryObj.billscode || this.queryObj.localMaterialId || this.queryObj.patientId)) {
          this.queryObj.areaId = ''
        }
      }
      this.queryObj.storageRoomId = this.storageId
      request(this.urlObj.getList, // /warehouse/DispensingDrugBills/queryBills
        this.queryObj,
        'post').then(res => {
          if (res.head.errCode === 0) {
            this.$refs.listtask && this.$refs.listtask.changeLoading(false, res.data)
            if (res.data.length === 0) {
              if (!sendAfter) {
                this.$messageTips(this, 'warning', '没有找到匹配的结果，请重新核对后重新搜索。')
              }
              this.listData = []
            } else {
              this.listData = res.data.map(item => {
                item.itemList = item.itemList.map(child => {
                  // 映射 adviceExecuteId
                  child.adviceExecuteId = child.orderId
                  return child
                })
                return item
              })
            }
          }
        })
    },
    /**
     * 摆药 || 重新摆药
     * @param data
     * @param callback
     */
    goDispensing (data, callback) {
      let tabActive = null
      if (data.tableCacheArr === data.newTableData) tabActive = 'first'
      let queryObj = this.handelTaskList(data)
      request(this.urlObj.dispensing,
        queryObj, 'post').then(res => {
          if (res.head.errCode === 0) {
            //  返回的res.data数据里面包含msg代表是欠费患者 需要
            if (res.data && res.data.msg) {
              if (callback) {
                setTimeout(() => {
                  callback(false, false, false, true)
                })
              }
              return this.$confirm(res.data.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
              }).then(() => {}).catch(() => {})
            }
            // 操作成功
            this.$messageTips(this, 'success', '摆药成功')
            this.$refs.listtask.getAreas(() => {
              this.getList(false, false, true)
            })
            if (callback) {
              setTimeout(() => {
                callback(1, res.data, false, false, tabActive)
              })
            }
          } else {
            if (callback) {
              setTimeout(() => {
                callback(false, false, false, true)
              })
            }
          }
        })
    },
    /**
     * 发药
     * @param data
     */
    goSend (data, callback) {
      let queryObj = { status: 3, id: data.currentData.id }
      queryObj.ids = data.tableData.map((item, index) => {
        return item.taskId
      })
      queryObj.itemIds = data.tableData.map((item, index) => {
        return item.id
      })
      request(this.urlObj.send,
        queryObj, 'post').then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '发药成功')
            this.$refs.listtask.getAreas(() => {
              this.getList(false, false, true)
            })
            if (callback) {
              setTimeout(() => {
                callback(1, res.data)
              })
            }
          } else {
            if (callback) {
              setTimeout(() => {
                callback()
              })
            }
          }
        })
    },
    handelTaskList (data) {
      let queryObj = { ...this.queryObj }
      let itemList = []
      data.checkData.forEach((item, index) => {
        if (CHINESE_MEDICINE_TYPE.includes(item.taskType)) {
          itemList.push(...this.chineseFormarData(item))
        } else {
          itemList.push(this.formatData(item))
        }
      })
      queryObj.itemList = itemList
      queryObj.storageRoomName = data.currentData.room || data.currentData.storageRoomName
      queryObj.storageRoomId = data.currentData.roomId || data.currentData.storageRoomId
      return queryObj
    },
    // 中药数据 itemList 的处理
    chineseFormarData (item) {
      let taskItem = []
      item._sourceData.forEach(row => {
        taskItem.push(...row.taskItemList)
      })
      return taskItem.flat(Infinity).map(task => {
        return this.formatData(task)
      })
    },
    formatData (item) {
      return {
        id: item.id,
        taskId: item.taskId || item.id,
        itemId: item.itemId,
        taskItemId: item.itemId,
        num: item.num,
        adviceExecuteId: item.adviceExecuteId,
        localMaterialId: item.localMaterialId,
        bedNum: item.bedNum,
        patientName: item.patientName,
        patientId: item.patientId,
        status: 2,
      }
    }
  }
}
</script>

