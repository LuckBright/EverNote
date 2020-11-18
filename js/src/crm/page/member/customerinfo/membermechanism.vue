<template>
  <div>
    <el-dialog :title="title || '解除关联？'" :visible.sync="dialogVisible" class="spe" :close-on-click-modal="false" width="28%">
      <div style="height:80px;text-align: center;font-size: 20px">
        <el-row class="alg_l">
          <el-col v-if="title" :span="20">
            <ever-form2
              :schema="schema"
              v-model="obj"
              ref="form"
              :rules="rules"
              :nosubmit="true"
            ></ever-form2>
          </el-col>
          <el-col v-else :span="20" class="f18">
            <el-row class="mb5">
              <el-col :span="10" class="alg_r">
                <span class="cGray">公司名称：</span>
              </el-col>
              <el-col :span="14">
                <span>{{dataInfo.customerName}}</span>
              </el-col>
            </el-row>
            <el-row class="mb5">
              <el-col :span="10" class="alg_r">
                <span class="cGray">报销方案：</span>
              </el-col>
              <el-col :span="14">
                <span>{{dataInfo.productName}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="spe" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading">{{title ? titleBtn : '解除'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['title', 'titleBtn', 'api', 'patientId'],
  data () {
    let schema = [
      {
        name: 'customerId',
        label: '公司名称',
        comp: 'ever-select',
        props: {
          options: []
        },
      },
      {
        name: 'programmeId',
        label: '报销方案',
        comp: 'ever-select',
        props: {
          options: []
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.patientIds = [this.patientId]
    return {
      dialogVisible: false,
      schema,
      obj,
      cacheObj: JSON.parse(JSON.stringify(obj)),
      rules: {
        'customerId': [{ required: true, message: '必选项', trigger: ['change', 'blur'] }],
        'programmeId': [{ required: true, message: '必选项', trigger: ['change', 'blur'] }]
      },
      dataInfo: {},
      btnLoading: false
    }
  },
  created () {},
  methods: {
    close () {
      this.dialogVisible = false
    },
    open (data) {
      this._initData()
      if (data && data.id) {
        this.dataInfo = data
      } else {
        Object.assign(this.obj, this.cacheObj)
      }
      this.dialogVisible = true
    },
    handleSubmit () {
      let params = {}
      if (this.title) {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.btnLoading = true
            Object.assign(params, this.obj)
            delete params.customerId
            this.api.addPatinets(params).then(res => {
              this.btnLoading = false
              if (res.head.errCode === 0) {
                this.close()
                this.$emit('seachList', true)
                this.$messageTips(this, 'success', '添加成功')
              }
            })
          }
        })
      } else {
        Object.assign(params, {
          patientId: this.patientId,
          programmeId: this.dataInfo.id
        })
        this.btnLoading = true
        this.api.delPatinet(params).then(res => {
          this.btnLoading = false
          if (res.head.errCode === 0) {
            this.close()
            this.$emit('seachList', true)
            this.$messageTips(this, 'success', '解除成功')
          }
        })
      }
    },
    getProgrammeData (id) {
      this.api.selectByCustomer({customerId: id}).then(res => {
        if (res && res.data) {
          let resData = res.data
          resData.length && resData.forEach(item => {
            item.name = item.productName
          })
          this.$ever.getFieldFromSchema(this.schema, 'programmeId').props.options = resData
        }
      })
    },
    _initData () {
      this.api.bigCustomerAll({}).then(res => {
        if (res && res.data) {
          let resData = res.data
          this.$ever.getFieldFromSchema(this.schema, 'customerId').props.options = resData
        }
      })
    }
  },
  watch: {
    'obj.customerId' (val) {
      this.obj.programmeId = ''
      this.$ever.getFieldFromSchema(this.schema, 'programmeId').props.options = []
      if (val) this.getProgrammeData(val)
    }
  }
}
</script>

