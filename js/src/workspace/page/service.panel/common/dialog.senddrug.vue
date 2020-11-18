<template>
  <el-dialog
    title="选择发药库房"
    class="senddrug ui_dialog_02 spe"
    append-to-body
    :visible.sync="dialogVisible"
  >
    <template slot="title">
      <span class="f_bold">{{drug.patientName}}</span>
      <span v-if="drug.patientSex" class="f_bold">
        <sys-value type="GBT.2261.1" :code="drug.patientSex"></sys-value>
      </span>
      <span class="f_bold" v-if="drug.patientAge">/{{drug.patientAge}}岁</span>
    </template>
    <div class="content">
      <span>请选择要操作的库房：</span>
      <div class="containers">
        <div
          v-for="(item, index) in drugData"
          :key="index"
          class="druginfo"
          @click="linkdetail(item)"
        >
          <p class="f_bold">
            {{item.storageRoomName}}
            <i
              v-if="item.identification"
              class="icon iconfont icon-beibohui cRed iconwid"
            ></i>
          </p>
          <p>
            <span class="cGray6">处方数量：{{item.countNum}}</span>
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import appointapi from '@/workspace/store/appointapi'
import storage from '@/util/storage'
import storageApi from '@/warehouse/store/storageroomapi'
import { debounce } from '@/util/common'
export default {
  props: ['title'],
  data () {
    return {
      dialogVisible: false,
      drugData: [],
      drug: {}
    }
  },
  methods: {
    open (val) {
      this.drug = val
      this.getDrugInfo()
    },
    close () {
      this.dialogVisible = false
    },
    linkdetail (val) {
      if (val.staffRole) {
        const {storageRoomId = '', materialType = ''} = val
        storage.setLocalStorage('MATERIAL_TYPE', materialType)
        storage.setLocalStorage('INIT_STORAGE_ID', storageRoomId)
        storage.setLocalStorage('STORAGE_ID_VUEX', storageRoomId)
        storage.setLocalStorage('STORAGE_ID', storageRoomId)
        this.getStorage(val)
      } else {
        this.$messageTips(this, 'warning', '没有库房操作权限')
      }
    },
    getStorage: debounce(async function (val) {
      let res = await storageApi.list({ userType: 1 })
      if (res && res.list) {
        let list = []
        res.list.forEach(item => {
          list.push({
            id: item.id,
            name: item.name,
            materialType: item.materialType,
            toExamine: item.toExamine,
            onLineToExamine: item.onLineToExamine,
            isInvented: item.isInvented
          })
        })
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(list))
        if (val.processAll) {
          let diffurl = ''
          switch (val.examineFlag) {
            case 0:
              diffurl = 'prescriptionaudit'
              break
            case 1:
              diffurl = 'prescriptionaudit'
              break
            case 2:
              diffurl = val.status === 3 ? 'prescriptionrecord' : 'prescriptiontask'
              break
          }
          window.open(this.$ever.warehouseIndex + '/storages/outpaitent' + val.processConfigDtoObject.id + '/' + diffurl + '?patientId=' + this.drug.patientId)
        } else {
          let diffurl = this.drug.diff ? 'prescriptionrecord' : 'prescriptionreceive'
          window.open(this.$ever.warehouseIndex + '/storages/outpaitent' + val.processConfigDtoObject.id + '/' + diffurl + '?patientId=' + this.drug.patientId)
        }
        this.close()
      } else {
        JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) && this.$router.replace('/storages/reload?path=/storages?back=1')
        storage.removeLocalStorage('STORAGE_ITEM')
        storage.removeLocalStorage('INIT_STORAGE_ID')
        storage.removeLocalStorage('MATERIAL_TYPE')
      }
    }),
    getDrugInfo () {
      let getArr = this.drug.diff ? [3] : [2]
      appointapi.getDrugInfo({ 'visitSn': this.drug.visitNumber, 'statusList': getArr }).then(rs => {
        if (rs.head.errCode === 0) {
          let arr = []
          rs.data.forEach(val => {
            // 判断是不是跨机构发药以及是否指定库房
            if ((val.sourceOrgId === val.orgId) && (val.actualStorageRoomId && (val.actualStorageRoomId !== ''))) {
              arr.push(val)
            }
          })
          if (arr.length === 0) {
            this.$messageTips(this, 'warning', '请到药房发药!')
            return false
          }
          if (arr.length === 1) {
            this.linkdetail(arr[0])
          } else {
            this.dialogVisible = true
            this.drugData = arr || []
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.senddrug /deep/ .el-dialog__body {
  padding-top: 0px;
}
.content {
  min-height: 200px;
}
.containers {
  padding: 30px 70px;
  min-height: 100px;
  display: flex;
  justify-content: center;
}
.druginfo {
  width: 160px;
  height: 77px;
  margin-right: 20px;
  text-align: center;
  border: 1px solid #bbbbbb;
}
.druginfo:hover {
  border-color: #1c78ef;
  color: #1c78ef !important;
}
.iconwid {
  position: relative;
}
</style>
