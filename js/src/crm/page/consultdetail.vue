<template>
  <div id="consultdetail">
    <el-card>
      <el-row>
        <el-col :span="24">
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="left">
            <template slot-scope="scope" slot="patient">
              <label>{{scope.obj.patient.name ? scope.obj.patient.name : '--'}}</label>
            </template>
            <template slot-scope="scope" slot="forWhom">
              <sys-value type="THC_CONSULT_CONFOR" :code="scope.obj.source"></sys-value>
            </template>
            <template slot-scope="scope" slot="way">
              <sys-value type="THC_CC_FOLLOWUP" :code="scope.obj.way"></sys-value>
            </template>
            <template slot-scope="scope" slot="source">
              <sys-value type="THC_CONSULT_RESOURCE" :code="scope.obj.source"></sys-value>
            </template>
          </ever-form-model>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/consultapi'
  import form from '../../util/form'
  let schema = [
    {
      name: 'patient',
      type: 'custom',
      span: 12,
      label: '客户姓名：'
    },
    {
      name: 'dptName',
      type: 'label',
      span: 10,
      label: '咨询部门：'
    },
    {
      type: 'empty',
      span: 6
    },
    {
      name: 'forWhom',
      type: 'custom',
      span: 12,
      label: '为谁咨询：'
    },
    {
      name: 'source',
      type: 'custom',
      span: 12,
      label: '来源：'
    },
    {
      name: 'way',
      type: 'custom',
      span: 12,
      label: '咨询方式：'
    },
    {
      name: 'content',
      type: 'label',
      span: 24,
      label: '咨询内容：'
    }
  ]
  export default {
    props: ['initdata'],
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        api: api,
        obj: obj,
        users: '',
        id: ''
      }
    },
    watch: {
      initdata (val) {
        if (val) {
          this.id = this.initdata
        }
      }
    },
    created () {
      if (this.initdata) {
        this.api.request({id: this.initdata}).then(rs => {
          if (rs.data) {
            this.obj = Object.assign(this.obj, rs.data)
            this.users = [this.obj]
          }
        })
      }
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      }
    }
  }
</script>
