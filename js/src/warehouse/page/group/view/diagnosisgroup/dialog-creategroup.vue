<template>
  <div id="createGroup">
    <el-dialog :visible.sync="visible" title="创建分组" class="ui_dialog_02 spe">
      <el-form
        :model="obj"
        :rules="rules"
        ref="createGroup"
        label-width="0px"
        label-position="center"
      >
        <el-row class="lh40">
          <el-col :span="3">诊断组名称：</el-col>
          <el-col :span="21">
            <el-form-item label prop="groupName">
              <el-input v-model="obj.groupName" placeholder="请输入名称" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickBtn" type="primary">创建分组</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/store/groupdiagnosisapi'
export default {
  data () {
    return {
      api,
      obj: {},
      groupName: '',
      visible: false,
      rules: {
        groupName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    clickBtn () {
      let params = {
        rangeCode: 3,
        name: this.obj.groupName
      }
      this.$refs.createGroup.validate(valid => {
        if (valid) {
          this.api.createGroup(params).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            this.$notify({
              type: 'success',
              title: '成功',
              message: '新建分组成功',
              duration: 3000
            })
            this.$emit('reloadGroup', 1)
            this.obj.groupName = ''
            this.visible = false
          })
        }
      })
    }
  },
  components: {
  }
}
</script>
<style lang='scss' scoped>
#createGroup .el-row.lh40 {
  height: 40px;
  line-height: 40px;
}
.el-dialog .el-dialog__body {
  padding: 0px 20px !important;
}
.el-col-3 {
  text-align: right;
}
</style>

