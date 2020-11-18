<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-02 20:49:25
 -->
<template>
  <div>
    <ever-bread-crumb name="保险公司管理"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        labelWidth="150px"
        :api="api"
        :info="true"
        :span="12"
        :rules="rules"
        label-position="right"
      >
        <template slot="corpType">
          <el-select v-model="obj.corpType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </template>
        <template slot="expiryDate">
          <el-date-picker v-model="obj.expiryDate" type="date" placeholder="选择日期"></el-date-picker>
        </template>
        <template slot="filepath">
          <ever-upload ref="upload" :upload-attrs="uploadContentAttrs" btn-txt="上传文件"></ever-upload>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from '../store/insuranceorgapi'

var schema = [
  {
    name: 'code',
    label: '保险公司编号',
    props: {
      disabled: true
    }
  },
  {
    name: 'insuranceOrgCnName',
    label: '保险公司全称'
  },
  {
    name: 'taxno',
    label: '税务登记号'
  },
  {
    name: 'insureOrgShortName',
    label: '保险公司简称'
  },
  {
    name: 'insuranceOrgEnName',
    label: '英文名称'
  },
  {
    name: 'telCode',
    label: '保险公司电话'
  },
  {
    name: 'contact',
    label: '联系人姓名'
  },
  {
    name: 'contactTel',
    label: '联系人电话'
  },
  {
    name: 'country',
    label: '保险公司所属国家',
    comp: 'sys-type',
    props: {
      code: 'GBT.2659'
    }
  },
  {
    name: 'corpType',
    label: '保险公司类型',
    disabled: false,
    comp: 'custom'
  },
  {
    name: 'triggerMode',
    label: '理赔触发事件',
    comp: 'sys-type',
    props: {
      code: 'THC_RCM_CLAIM_EVENT'
    }
  },
  {
    name: 'expiryDate',
    label: '失效日期',
    comp: 'custom'
  },
  {
    name: 'roleCode',
    label: '商保审批角色',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'filepath',
    label: '商保条款上传',
    comp: 'custom'
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.country = 'CHN'
    const that = this
    return {
      schema,
      obj: obj,
      api: api,
      options: [],
      rules: {
        // insureOrgCode: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        insuranceOrgCnName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        insureOrgShortName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        taxno: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        expiryDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        corpType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      uploadContentAttrs: {
        // accept: '.xlsx',
        multiple: false,
        limit: 1,
        'file-list': [],
        'on-success' (res) {
          if (res.head.errCode === 0) {
            that.obj.filepath = `${that.$ever.fileUrl2}${res.data.fileId}`
          }
        },
        'on-remove' () {
          that.obj.filepath = ''
        },
      },
    }
  },
  watch: {
    expiryDate: function (val) {
      console.log('新值' + val)
    }
  },
  created () {
    this.options = api.corpType
    if (this.$route.params.id) {
      this.$ever.getFieldFromSchema(schema, 'corpType').disabled = true
    } else {
      this.$ever.getFieldFromSchema(schema, 'corpType').disabled = false
    }
    // 获取商保审批角色列表
    api.getRoleList({ offset: 0, pagesize: 500 }).then(res => {
      // console.log(res, '商保审批角色列表')
      let options = []
      for (let item of res.data) {
        if (item.roleCode) {
          options.push({ id: item.roleCode, name: item.name })
        }
      }
      this.$ever.getFieldFromSchema(schema, 'roleCode').props.options = options
    })
    if (this.$route.params.id) {
      this.getinfo()
    }
  },
  methods: {
    getinfo () {
      api.getById(this.$route.params.id).then(v => {
        console.log(v)
        Object.assign(this.obj, v)
        if (v.filepath) {
          this.uploadContentAttrs['file-list'] = [
            {
              name: '文件',
              url: v.filepath
            }
          ]
        }
      })
    },
    afterSave (params) {
      if (params.head.errCode === 0) {
        history.go(-1)
      }
    }
  }
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
.el-date-editor.el-date-editor--date {
  width: 100%;
}
</style>

