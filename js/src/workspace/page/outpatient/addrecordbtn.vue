<template>
  <div class="inline-block">
    <el-button type="text" @click="isUpdated">
      <i class="iconfont icon-tianjiabingli"></i>
    </el-button>
    <el-dialog
      title="选择病历模版"
      :visible.sync="recordVisible"
      :close-on-click-modal="false"
      ref="recordDialog"
      width="1000px"
      class="ui_dialog_02"
    >
      <div class="addbox">
        <add-record v-model="nodeObj" v-if="recordVisible"></add-record>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="recordVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddRecord">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addRecord from '@/form/components/addrecord'
import phrapi from '@/form/store/phrapi'
export default {
  name: 'addRecordBtn',
  props: {
    objUpdate: {
      type: Boolean,
      default: 'false'
    },
    isAutoSave: {
      type: Boolean,
      default: 'false'
    },
  },
  data () {
    return {
      recordVisible: false,
      nodeObj: {}
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    isUpdated () {
      if (this.isAutoSave && this.objUpdate) {
        return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后！')
      }
      if (this.objUpdate) {
        this.$confirm('有未保存数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.recordVisible = true
          })
          .catch(() => {})
      } else {
        this.recordVisible = true
      }
    },
    async searchCount (code) {
      let params = {
        visitId: this.$route.query.visitSn,
        code: code,
        patientId: this.$route.query.patientId
      }
      let res = await phrapi.searchCount(params)
      if (res) {
        this.$emit('add', this.nodeObj)
        this.recordVisible = false
      }
    },
    handleAddRecord () {
      if (!this.nodeObj.code) {
        return this.$messageTips(this, 'warning', '请选择一个模版', '提示')
      }
      this.searchCount(this.nodeObj.code)
    }
  },
  components: {
    addRecord
  }
}
</script>
<style scoped lang="scss">
.addbox {
  max-height: 600px;
  font-size: 20px;
  overflow: hidden;
}
.ui_dialog_02{
  /deep/.el-dialog {
    /deep/.el-dialog__body{
      padding: 0;
    }
  }
}
</style>
