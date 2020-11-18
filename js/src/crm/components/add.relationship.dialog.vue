<template>
  <el-dialog
    title="添加联系人"
    :visible.sync="dialogVisible"
    width="30%"
    center>
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="relationship"
      label-position="right"
      style="margin-left:-120px;">
      <div slot="default"></div>
      <template slot="patientName">
        <ever-patient-select v-model="obj.patientName" :allow-create="true" @select="selectPatient"></ever-patient-select>
      </template>
      <template slot="type">
        <sys-type code="GBT.4761" v-model="obj.type" size="mini" :useValue="true"></sys-type>
      </template>
      <template slot="shareMoney">
        <el-checkbox v-model="obj.shareMoney"></el-checkbox><span>公用预存款</span>
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="update">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/crm/store/relationshipapi'
let schema = [
  {
    name: 'patientName',
    comp: 'custom'
  },
  {
    name: 'type',
    comp: 'custom'
  },
  {
    name: 'shareMoney',
    comp: 'custom'
  }
]
export default {
  props: ['patientId'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.shareMoney = false
    return {
      obj,
      api,
      schema,
      patientName: this.patientId,
      relateId: '',
      type: '',
      isshare: '',
      dialogVisible: false,
      rules: {
        patientName: [
          { required: true, message: '请选择姓名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择关系', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancle () {
      this.dialogVisible = false
    },
    update () {
      this.obj.patientId = this.patientId
      this.$refs.relationship.$refs.form.validate(valid => {
        if (valid) {
          this.api.create(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.obj.patientName = null
              this.obj.type = ''
              this.$emit('update', true)
            }
          })
          this.dialogVisible = false
        }
      })
    },
    selectPatient (val) {
      this.obj.relateId = val.id
    }
  }
}
</script>
<style scoped>
</style>
