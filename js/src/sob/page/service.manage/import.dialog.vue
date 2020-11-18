<template>
  <div id="serviceImport">
    <el-dialog title="同步上级医嘱项目" :visible.sync="flag" class="ui_dialog_02">
      <all-list type="import" ref="selectList" :update-list="flag"></all-list>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">
          <i class="iconfont icon-quxiao"></i>取消
        </el-button>
        <el-button type="primary" @click="importData" :disabled="subDisabled">
          <i class="iconfont icon-tijiao"></i>同步
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import allList from './import.list'
import api from '../../store/serviceeditapi'
export default {
  data () {
    return {
      flag: false,
      subDisabled: false
    }
  },
  components: {
    allList
  },
  methods: {
    async importData () {
      this.subDisabled = true
      if (this.$refs.selectList.serviceIds && this.$refs.selectList.serviceIds.length) {
        const res = await api.createOrgServiceFromDirectParentOrg({ ids: this.$refs.selectList.serviceIds })
        if (res) {
          this.$messageTips(this, 'success', '同步成功！', '提示')
          this.$emit('update')
          this.close()
        }
        setTimeout(_ => {
          this.subDisabled = false
        }, 2000)
      } else {
        this.subDisabled = false
        this.$messageTips(this, 'warning', '请选择要同步的数据！', '提示')
      }
    },
    open () {
      this.flag = true
    },
    close () {
      this.flag = false
    }
  },
  watch: {
    'flag' (val) {
      if (val) this.subDisabled = false
    }
  }
}
</script>
