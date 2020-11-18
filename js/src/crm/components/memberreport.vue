<template>
  <el-dialog title="上传报告" :visible.sync="dialogVisible" :key="currentTime" class="ui_dialog_02 spe pd">
    <div id="sourceselect">
      <el-row class="el-dialog__body">
        <el-col :span="24">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            :rules="rules"
            ref="reportForm"
            label-position="right">
            <template slot="reportFile">
              <ever-upload1 v-model="queryObj.reportFile" type="doc" accept=".png,.jpg,.pdf"></ever-upload1>
            </template>
            <template slot="finishTime">
              <el-date-picker
                v-model="queryObj.finishTime"
                type="date"
                placeholder="选择完成日期">
              </el-date-picker>
            </template>
            <div slot="default"></div>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row class="el-dialog__footer">
        <el-col>
          <div class="alg_r">
            <el-button type="primary" @click="saveReport">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import api from '../store/recordapi'
let querySchema = [
  {
    name: 'type',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    },
    label: '报告类型',
    span: 16
  },
  {
    name: 'name',
    label: '报告名称',
    span: 16
  },
  {
    name: 'executor',
    label: '执行人',
    span: 16
  },
  {
    name: 'finishTime',
    label: '完成时间',
    comp: 'custom',
    span: 16
  },
  {
    name: 'reportOpinion',
    props: {
      type: 'textarea',
      placeholder: '意见'
    },
    label: '报告意见',
    span: 16
  },
  {
    name: 'reportFile',
    label: '报告文件',
    comp: 'custom',
    span: 16
  }
]
export default {
  props: ['visible'],
  data () {
    return {
      api,
      querySchema,
      queryObj: {},
      dialogVisible: false,
      patientId: this.$route.params.patientId ? this.$route.params.patientId : null,
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: ['change', 'blur'] }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        reportFile: [
          { required: true, message: '请上传报告文件', trigger: ['change', 'blur'] }
        ]
      },
      currentTime: new Date().getTime()
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
        this.dialogVisible = val
        this.currentTime = new Date().getTime()
      },
      immediate: true
    },
    'dialogVisible': {
      handler: function (val) {
        this.$emit('update', val)
      },
      immediate: true
    }
  },
  created () {
    this.$ever.getFieldFromSchema(this.querySchema, 'type').props.options = [{ id: '800', name: '检查' }, { id: '801', name: '检验' }]
  },
  methods: {
    saveReport () {
      this.queryObj.patientId = this.patientId
      this.queryObj.finishTime = this.queryObj.finishTime ? this.$moment(this.queryObj.finishTime).format('YYYY-MM-DD') : ''
      this.$refs.reportForm.$refs.form.validate(valid => {
        valid && api.create(this.queryObj).then(rs => {
          if (rs) {
            this.dialogVisible = false
            this.$parent.list()
          }
        })
      })
    },
  }
}
</script>
<style scoped>
#sourceselect .el-form {
  margin-left: -15px;
}
#sourceselect .el-form .el-form-item {
  margin-right: 0;
  margin-left: 15px;
}
#sourceselect .el-table td,
#sourceselect .el-table th {
  line-height: initial;
}
</style>
