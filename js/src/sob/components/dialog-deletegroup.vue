<template>
  <div id="group_delete">
    <el-dialog
    :visible.sync="visible"
    title="提示"
    class="ui_dialog_02 spe">
    <div class="tips">
      <strong>确认删除分组"<span>{{programObj.name}}</span>"及该分类下所有常用诊断？</strong>
      <p>——  若选“是”，将删除该分类及该分类下所有常用诊断；</p>
      <p>——  若选“否”，将只删除该分类，其下所有诊断将保留在常用诊断中。</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clickBtn" type="primary">是</el-button>
      <el-button @click="cancelBtn">否</el-button>
      <el-button @click="visible=false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/store/groupdiagnosisapi'
export default {
  props: ['programObj', 'deptId'],
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
      },
      params: {
        rangeCode: null,
        relateId: null,
        diseaseGroupId: null
      }
    }
  },
  created () {
  },
  methods: {
    open () {
      this.params.diseaseGroupId = this.programObj.id
      if (this.deptId === 'person') {
        this.params.relateId = null
        this.params.rangeCode = 1
      } else {
        this.params.relateId = this.deptId
        this.params.rangeCode = 2
      }
      console.log(this.params, this.params)
      this.visible = true
    },
    close () {
      this.visible = false
    },
    clickBtn () {
      this.api.deleteByRangeModeOne(this.params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功',
            duration: 3000
          })
          this.$emit('clickBtn')
          this.visible = false
        }
      })
    },
    cancelBtn () { // 只删除分组
      this.api.deleteByRangeModeTwo(this.params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功',
            duration: 3000
          })
          this.$emit('cancelBtn')
          this.visible = false
        }
      })
    }
  },
  components: {
  }
}
</script>
<style scoped>
#group_delete .el-row.lh40{height:40px;line-height:40px;}
#group_delete strong{font-size:18px;}
#group_delete .el-dialog .el-dialog__body{padding: 0px 20px!important;}
</style>

