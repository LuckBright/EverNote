<template>
  <el-footer height="32px" class="alg_c mt10" v-if="showAuditBtns || showMailBtn || showDispenseBtn">
    <template v-if="showAuditBtns">
      <template v-if="!hasReject">
        <el-button size="small" type="primary" v-ever-click-once:1000="loading" :loading="loading"  @click="operatorHandler('resolve')">审核通过</el-button>
        <el-button size="small" @click="operatorHandler('reject')">驳回</el-button>
      </template>
      <template v-else>
        <el-alert
          title="当前患者存在驳回处方，不能继续审核处方，请先处理完驳回处方后再审核处方"
          type="warning"
          center
          :closable="false"
          show-icon>
        </el-alert>
      </template>
    </template>
    <template v-if="showMailBtn || showDispenseBtn">
      <el-button size="small" type="primary" :disabled="!printBtnDisable" @click="operatorHandler('print')" v-if="showPrintBtn" v-ever-click-once:1000="loading" :loading="loading">打印</el-button>
      <template v-if="showMailBtn && !isInvented">
        <el-button size="small" :disabled="!printBtnDisable" type="primary" @click="operatorHandler('post')">邮寄发药</el-button>
      </template>
      <template v-if="showDispenseBtn">
        <el-button v-if="!isInvented" :disabled="!completeBtnDisable" size="small" v-ever-click-once:1000="loading" :loading="loading" type="primary" @click="operatorHandler('complete')">发药</el-button>
      </template>
    </template>
  </el-footer>
</template>

<script>
import { objGet } from '@/util/common'
import { CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant'
import checkCdssApi from '@/warehouse/views/drug/api/processapi.js'
export default {
  props: {
    type: Number, // 是否是审核 => 审核页面才传入
    pageType: Number, // 发药界面所属项 1、任务审核  2、任务列表／收方发药  3、缺货任务  4、发药记录
    delivery: [Number, String],
    isInvented: {
      type: Number,
      default: 0
    },  //  是否是虚拟库房 0:实体库房 1:虚拟库房
    metaDataList: { // 处方整单数据 => 一种发货方式的全部数据(自取、邮寄、自备)
      type: Array,
      default: () => []
    },
    metaData: { // 元数据，完整的一条数据集
      type: [Object, Array],
      default: () => ({})
    },
    parentIndex: Number,
    selectionTable: { // 处方明细数据 => 选中的明细
      type: Object,
      default: () => ({})
    },
    hasReject: Boolean, // 是否有驳回数据
    isFullPrescription: Boolean // true是处方\false是明细 ， 此刻代替operateMode(操作模式)参数
  },
  computed: {
    showAuditBtns () {
      // type = 1 待审核状态 0、驳回 2、已审核 => 元数据 0 待审核 、 1 驳回 、2 审核通过
      return this.type === 1
    },
    showMailBtn () {
      // 邮寄才有邮寄按钮
      return !this.showAuditBtns && this.checkShowBtn('mailFlag', 0) && this.delivery === 1
    },
    showDispenseBtn () {
      // 自取才有发药按钮
      return !this.showAuditBtns && this.checkShowBtn('status', 2) && this.delivery === 0
    },
    showPrintBtn () {
      if (this.processItemObject && this.processItemObject.isPrint) return true
      return false
    },
    printBtnDisable () {
      if (this.isFullPrescription) {
        return this.hasChecked()
      } else {
        if (typeof this.parentIndex !== 'undefined') {
          return this.selectionTable[this.delivery].some(item => {
            if (item.mailAddressObject) {
              item.addressId = item.mailAddressObject.address + item.mailAddressObject.mobile + item.mailAddressObject.name
            }
            return this.metaDataList[this.parentIndex].addressId === item.addressId
          })
        } else {
          return this.selectionTable[this.delivery].length > 0
        }
      }
    },
    completeBtnDisable () {
      if (this.isFullPrescription) {
        // 处方整单操作
        return this.hasChecked()
      } else {
        // 明细操作
        const selected = this.selectionTable[this.delivery]
        const len = selected.length
        if (!len) return false
        // 选择明细数据中可能包含多种状态，过滤出所有状态，去重后保留一个状态，并且状态为待发药
        const status = Array.from(new Set(selected.map(select => select.status)))
        if (status.length === 1 && status[0] === 2) return true
      }
    }
  },
  data () {
    return {
      loading: false,
      printIds: { // 打印数据ids 集合
        chinese: [], // 中药
        drug: [] // 西药
      },
      processItemObject: objGet(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject', {}), // 库房发药配置
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig, // vuex中当前库房配置信息
      generatingFunc: null // 根据isFullPrescription 来生成新的处理函数
    }
  },
  created () {
    this.generatingFunc = this.isFullPrescription ? this.fullPreFunc : this.presctionFunc
  },
  methods: {
    checkShowBtn (name, value) {
      // 发药记录页面，不展示任何操作按钮
      if (this.pageType === 4) return false
      if (!this.isFullPrescription) {
        return true
        // 同一库房id
        // const actualStorageRoomId = this.metaData.actualStorageRoomId
        // const curData = this.metaDataList.find(task => task.actualStorageRoomId === actualStorageRoomId)
        // pageType = 2 ：收方发药页面操作时 可以操作
        // 按处方明细操作和查看时，是否展示邮寄按钮 | 发药按钮
        // return curData.taskDtoList.some(task => task[name] === value)
      }
      return true // 整单发药，直接返回true
    },
    hasChecked () {
      const len = this.metaDataList.length
      if (!len) return false
      for (let i = 0; i < this.metaDataList.length; i++) {
        const hasChecked = this.metaDataList[i].checked
        if (hasChecked) return true
      }
    },
    fullPreFunc () {
      // 处方整单函数
      // 选择勾选上并且是状态为(自取 待出库) 或( 邮寄 待邮寄) 本库房 非异常、非缺货
      // this.metaData.actualStorageRoomId 必须是当前元数据同库房（要不库房都没有， 要不库房一样）
      return [...new Set(this.metaDataList.filter(meta => (
        this.metaData.actualStorageRoomId === meta.actualStorageRoomId &&
        meta.checked &&
        (
          meta.actualStorageRoomId === this.processConfig.storageRoomId ||
          (this.pageType === 2 && !meta.actualStorageRoomId)
        ) &&
        (
          (
            this.delivery === 0 &&
            meta.status === 2 &&
            !meta.identification &&
            meta.shortage !== 23
          ) ||
          (
            this.delivery === 1 &&
            !meta.mailFlag &&
            meta.status <= 3 &&
            !meta.identification &&
            meta.shortage !== 23
          )
        )
      )).map(meta => meta.taskDtoList.map(task => task.taskId)).flat())]
    },
    presctionFunc (localMaterialIds, type) {
      let _arr = []
      // if (localMaterialIds && type === 'resolve' && this.metaData && this.metaData.taskDtoList && CHINESE_MEDICINE_TYPE.includes(String(this.metaData.taskType))) {
      //   this.metaData.taskDtoList.forEach(item => {
      //     const { localMaterialId } = item || {}
      //     _arr.push(localMaterialId)
      //   })
      //   return [...new Set(_arr)]
      // }
      this.printIds = {
        drug: [],
        chinese: []
      }
      // 明细处方函数
      this.selectionTable[this.delivery].forEach(select => {
        if (select.mailAddressObject) {
          select.addressId = select.mailAddressObject.address + select.mailAddressObject.mobile + select.mailAddressObject.name
        }
        if (typeof this.parentIndex !== 'undefined' && this.metaDataList[this.parentIndex].scene === 5 && select.addressId !== this.metaDataList[this.parentIndex].addressId) return
        // 父子医嘱
        const { mainFlag, mainGroupId } = select
        const { _sourceData, taskType } = select
        if (mainFlag > 0) {
          // fix全选后，取消某些父子医嘱的选项，会再次打印
          if (mainFlag === 1) {
            const index = this.metaDataList.findIndex(task => task.taskDtoList.some(dto => dto.taskId === select.taskId))
            const compose = mainGroupId + select.createTime
            // 明细处方， metaDataList元数据， 始终只会有一条，medicine.list.vue组件传入需要从所有元数据中删选出当前父子医嘱所有明细
            // 并且过滤 自取状态为 2 或 邮寄状态为 2 和 3 的数据
            ~index && this.metaDataList[index].taskDtoList.filter(task => (task.mainGroupId + task.createTime === compose && ((task.status === 2 && this.delivery === 0) || ([2, 3].includes(task.status) && this.delivery === 1)))).forEach(task => {
              _arr.push(task.taskId)
              this.printIds.drug.push({
                storage: task.actualStorageRoomId,
                id: task.taskId,
                type: 'drug'
              })
            })
          }
        } else if (CHINESE_MEDICINE_TYPE.includes(String(taskType))) {
          _sourceData.forEach(task => {
            _arr.push((localMaterialIds && (this.delivery === 0 || this.delivery === 1 && task.status === 2)) ? task.localMaterialId : task.taskId)
            this.printIds.chinese.push({
              storage: task.actualStorageRoomId,
              id: task.taskId,
              type: 'chinese'
            })
          })
        } else {
          _arr.push(select.taskId)
          this.printIds.drug.push({
            storage: select.actualStorageRoomId,
            id: select.taskId,
            type: 'drug'
          })
        }
      })
      return [...new Set(_arr)]
    },
    operatorHandler (type) {
      // 增加十八反、十九畏 用药提醒
      const localMaterialIds = this.generatingFunc('localMaterialId', type)
      if (['complete', 'post'].includes(type) && localMaterialIds.length) {
        checkCdssApi.checkCdssRule({bizCode: 'THC_RULE_MZCFSH', localMaterialIds}).then(res => {
          if (res && res.length) {
            let message = res.map(item => item.message).join('<br>')
            return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
              confirmButtonText: '确认执行',
              dangerouslyUseHTMLString: true,
              customClass: 'w_500',
            }).then(() => {
              this.$emit('operator-func', this.generatingFunc(), this.delivery, type)
            }).catch(() => {})
          } else {
            this.$emit('operator-func', this.generatingFunc(), this.delivery, type)
          }
        })
      } else {
        this.$emit('operator-func', this.generatingFunc(), this.delivery, type)
        if (type === 'print') {
          this.printHanlderData()
        }
      }
    },
    printHanlderData () {
      const newObj = {}
      Object.keys(this.printIds).forEach(key => {
        newObj[key] = []
        let aList = []
        this.printIds[key].forEach(item => {
          const { storage, id, type } = item
          let index = -1
          // 在新的aList中存在storage时，把idpush进入ids中
          if ((index = aList.findIndex(list => list.storage === storage)) > -1) {
            aList[index].ids.push(id)
          } else {
            aList.push({
              storage,
              ids: [id],
              type
            })
          }
        })
        newObj[key].push(...aList)
      })
      this.$bus.$emit('printData', newObj)
    }
  }
}
</script>
