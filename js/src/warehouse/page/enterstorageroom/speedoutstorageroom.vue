<template>
  <div id="speedout">
    <el-dialog
      title="快捷出库"
      :visible.sync="dialogVisible"
      class="ui_dialog_02 spe">
      <div style="height: 320px; padding: 20px; font-size: 16px; line-height: 22px">
        <div v-if="status == 1">
          <p>快速出库是由系统辅助完成出库和入库的操作，将整批入库的商品出库到指定库房。</p>
          <p class="top">请选择接收的库房：</p>
          <ever-remote-method :filter="data.storageRoomId" :params="{ materialType: (materialType && materialType.length) ? JSON.stringify(materialType) : materialType, storageRoomId: data.storageRoomId, isInvented: 0, userType: null, pagesize: 999 }" :api="storageroomApi" v-model="storageRoomId" placeholder="请选择接收的库房" :isSilentQuery="true"></ever-remote-method>
        </div>
        <div v-if="status == 2">
          <p>出库完成！已为接收仓自动生成申领单。您可以到接收库房查询到商品库存。</p>
          <p class="top">申领单号：<span class="blue" @click="handleJump">{{billCode}}</span></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="status == 1" @click="submit(2)" type="primary" :loading="unRepeatedBtn"><i class="iconfont icon-tijiao"></i>确认</el-button>
        <el-button v-if="status == 2" @click="submitClose()" type="primary"><i class="iconfont icon-tijiao"></i>确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import storageroomApi from '../../store/storageroomapi'
import instockApi from './getinstockapi'
import { debounce, patch } from '@/util/common'

export default {
  props: ['data'],
  data () {
    return {
      dialogVisible: false,
      storageroomApi,
      storageRoomId: '',
      billCode: '',
      billId: '',
      status: 1,
      source: '',
      materialType: [],
      outStockObject: {},
      unRepeatedBtn: false // 控制重复提交
    }
  },
  methods: {
    handleJump () {
      let url = `/storages/${this.source}/${this.billId}`
      this.$router.push(url)
    },
    open (source) {
      this.storageRoomId = ''
      this.source = source
      this.dialogVisible = true
      let materialType = []
      this.data.inStockItemList.forEach(item => {
        item.item.forEach(child => {
          if (!materialType.includes(child.classifyId)) materialType.push(child.classifyId)
        })
      })
      this.materialType = materialType
    },
    submit: debounce(function (status) {
      if (!this.storageRoomId) {
        this.$messageTips(this, 'warning', '请选择接收的库房')
        return
      }
      const { storageRoomId, materialType, id } = this.data
      let params = {
        toStorageRoomId: this.storageRoomId,
        storageRoomId,
        materialType,
        id
      }
      // params.inStockItemList = []
      // for (let i = 0; i < this.data.inStockItemList.length; i++) {
      //   for (let n = 0; n < this.data.inStockItemList[i].item.length; n++) {
      //     params.inStockItemList.push(Object.assign({
      //       storageRoomId: this.data.storageRoomId,
      //       invoiceNo: this.data.inStockItemList[i].invoiceNo
      //     }, this.data.inStockItemList[i].item[n]))
      //     this.data.inStockItemList[i].ited && delete this.data.inStockItemList[i].ited
      //   }
      // }
      // for (let i = 0; i < params.inStockItemList.length; i++) {
      //   let item = params.inStockItemList[i]
      //   item.drugObject && delete item.drugObject
      //   item.consumptiveMaterialObject && delete item.consumptiveMaterialObject
      //   item.equipmentObject && delete item.equipmentObject
      //   item.localSettingObject && delete item.localSettingObject
      //   item.unitGroupItemObject && delete item.unitGroupItemObject
      //   item.storageRoomObject && delete item.storageRoomObject
      //   item.staffObject && delete item.staffObject
      // }
      // params.drugObject && delete params.drugObject
      // params.consumptiveMaterialObject && delete params.consumptiveMaterialObject
      // params.equipmentObject && delete params.equipmentObject
      // params.localSettingObject && delete params.localSettingObject
      // params.unitGroupItemObject && delete params.unitGroupItemObject
      // params.storageRoomObject && delete params.storageRoomObject
      // params.staffObject && delete params.staffObject
      this.unRepeatedBtn = true
      instockApi.create(params).then(res => {
        if (res && res.billId) {
          this.billCode = res.billCode
          this.billId = res.billId
          this.status = status
          this.outStockObject = res.outStockObject
          this.unRepeatedBtn = false
        } else {
          this.dialogVisible = false
        }
      })
    }),
    submitClose () {
      this.dialogVisible = false
    },
    ...patch
  },
  watch: {
    'dialogVisible' (v) {
      if (!v && this.status.toString() === '2') {
        this.$emit('handleVisible')
      }
    }
  },
}
</script>
<style scoped>
.top { margin-top: 30px;}
.blue:hover { cursor: pointer; text-decoration: underline;}
</style>
