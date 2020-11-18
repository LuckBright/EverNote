<template>
  <el-dialog
    title="配置规则"
    class="ui_dialog_02 spe"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动区域">
        <el-select v-model="form.name" placeholder="请选择" style="width:200px;margin-left:10px;">
          <el-option v-for="(item,i) in options" :key="i" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '../../store/scheduling'
export default {
  props: ['ruleDetail'],
  data () {
    return {
      api,
      dialogVisible: false,
      options: [],
      form: {
        name: ''
      }
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (val) {
        this.ruledetailsearch()
      } else {
        this.options = []
      }
    }
  },
  created () {
  },
  methods: {
    ruledetailsearch () {
      if (!this.ruleDetail || !this.ruleDetail.configKey) {
        return false
      }
      this.api.getRuleConfigDetail({ configKey: this.ruleDetail.configKey }).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.options = rs.data.valList
        this.form.name = this.ruleDetail.configValue
      })
    },
    save () {
      this.api.updateRuleConfigByKey({ configKey: this.ruleDetail.configKey, configValue: this.form.name }).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '成功',
          message: '配置成功'
        })
        this.$emit('success')
        this.dialogVisible = false
      })
    }
  }
}
</script>

