<template>
  <div class="recall_apply_dialog">
    <el-dialog
      title="请选择需要召回的病历"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="cancel">
      <div>
        <el-form :model="form" :rules="rules" ref="recallapply" label-position="left">
          <p class="title">召回信息</p>
          <el-form-item label="召回目的" prop="recallPurpose" labelWidth="80px">
            <el-input v-model="form.recallPurpose" clearable placeholder="请输入召回目的"></el-input>
          </el-form-item>
          <p>
          <el-radio v-model="form.recallMethod" :label="1">整份召回</el-radio>
          <el-radio v-model="form.recallMethod" :label="2">选择召回</el-radio>
        </p>
        <div class="record_tree" v-if="form.recallMethod===2">
          <p class="tree_title">
            {{role===1?'病历书写':'护理文书'}}
          </p>
          <div class="tree_container">
            <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
        </el-form>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import urlMap from '@/inpatient/urls'
import urls from '@/emr/urls'
import { request } from '@/util/req'
export default {
  name: 'recall_apply_dialog',
  props: {
    row: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        recallMethod: 1, // 召回方式1整份召回，2部分召回
        recallPurpose: '', // 召回目的
        recallMedicalRecordIds: []// 部分召回的病历id
      },
      rules: {
        recallPurpose: [
            { required: true, message: '请输入召回目的', trigger: 'blur' },
            // { max: 20, message: '最多输入20个字符', trigger: 'change' }
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    }
  },
  computed: {
    role () {
      return Number(this.$route.matched[0].meta.role)
    }
  },
  watch: {
    dialogVisible(val) {
      this.form = {
        recallMethod: 1, // 召回方式1整份召回，2部分召回
        recallPurpose: '', // 召回目的
        recallMedicalRecordIds: []// 部分召回的病历id
      }
    },
    'form.recallMethod'(val) {
      if (val === 2) {
        this.form.recallMedicalRecordIds = []
        if (this.role === 1) {
          this.getDoctorTree()
        } else {
          this.getNursingTree()
        }
      }
    }
  },
  methods: {
    resetForm() {

    },
    getRecords() {
      if (!this.$refs.tree) return
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      if (checkedNodes.length) {
        checkedNodes.forEach(item => {
          if (item.code === 'TI_WEN_DAN') { // 体温单需要单独处理
            this.form.recallMedicalRecordIds.push(item.code)
          }
          if (item.isInstance) {
            this.form.recallMedicalRecordIds.push(item.id)
          }
        })
      }
    },
    updateNursingData(data) {
      let codes = ['TI_WEN_DAN', 'TI_WEN_JI_LU_DAN']
      data.forEach(item => {
        if (codes.includes(item.code)) {
          item.nodes = []
        }
      })
      return data
    },
    async getNursingTree () { // 护理文书需要的接口
      let res = await request(urls.recordManage.getCategoryTreeExistMedical, {
        type: '3', // 护理文书
        visitNumber: this.row.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.treeData = this.updateNursingData(res.data)
      }
    },
    async getDoctorTree () {
      // 电子病历实例树
      let res = await request(urls.recordManage.getCategoryTreeExistMedical, {
        type: '1', // 1-住院医生 2-门诊 3-护理
        visitNumber: this.row.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.treeData = res.data
      }
    },
    handleRecallMedicalRecordIds() {
      if (this.form.recallMethod === 1) {
        this.form.recallMedicalRecordIds = null
      } else {
        this.form.recallMedicalRecordIds = JSON.stringify(this.form.recallMedicalRecordIds)
      }
    },
    submit () {
      this.getRecords()
      this.handleRecallMedicalRecordIds()
      if (this.form.recallMethod === 2 && !JSON.parse(this.form.recallMedicalRecordIds).length) {
        this.$messageTips(this, 'warning', '请选择至少一项需要召回的病历')
        return false
      }
      this.$refs['recallapply'].validate(valid => {
        if (valid) {
          request(urls.recall.addRecall, {...this.row, ...this.form}).then(res => {
            if (res.head.errCode === 0) {
              this.$emit('update:dialogVisible', false)
              this.$messageTips(this, 'success', '召回申请成功')
            }
          })
        }
      })
    },
    cancel () {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style lang="scss"  scoped>
p{
  line-height:30px;
}
.title{
  border-left:5px solid blue;
  padding-left:10px;
  line-height:20px;
  font-size:18px;
}
.start{
  font-size:16px;
  color:red;
}
.record_tree{
  display: flex;
  flex-direction: column;
  height:300px;
}
.tree_title{
  border-top:1px solid #ccc;
  border-bottom:1px solid #ccc;
  line-height:30px;
}
.tree_container{
  flex:1;
  overflow:auto;
  // height:300px;
  border:1px solid #ccc;

}
</style>
