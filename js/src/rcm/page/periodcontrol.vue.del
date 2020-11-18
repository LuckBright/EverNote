<template>
  <div>
    <ever-bread-crumb name="期间控制" path="/financeistall/periodcontrols"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="12"
        :rules="rules"
        @submit="submitForm()"
        :api="api"
      >
        <template slot="id">
          <el-col :span="12">
            <el-form-item prop="id" label="账套名称">
              <ever-select v-model="obj.id" :options="vouchArr" style="width: 100%"></ever-select>
            </el-form-item>
          </el-col>
        </template>
        <template slot="year">
          <el-col :span="12">
            <el-form-item prop="year" label="日期范围">
              <date-picker v-model="obj.year" outformat="yyyy" :type="'year'"></date-picker>
            </el-form-item>
          </el-col>
        </template>
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button size="small" type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from '../store/periodcontrolapi'
import apperiodmangeapi from '../store/apperiodmangeapi'
import { getClinicInfo } from '../store/voucherEntries'
var schema = [
  {
    label: '医疗机构名称',
    name: 'clinicid',
    comp: 'ever-org-select',
    props: {
      fields: 'id',
      type: 'select',
      disabled: true
    }
  },
  {
    name: 'id',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'year',
    comp: 'custom',
    noWrap: true
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj: obj,
      api: api,
      periodArr: [],
      vouchArr: [],
      rules: {
        corpType: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm () {
      api.createOrUpdate(this.obj).then(v => {
        if (v && v.head && v.head.errCode === 0) {
          this.$notify({
            message: v.head.errMsg || '成功',
            type: 'success'
          })
        }
      })
    },
    // 获取当前机构
    async getCurrentClinc () {
      try {
        let data = await getClinicInfo()
        this.obj.clinicid = data.data && data.data[0].id
      } catch (err) { }
    },
    afterSave (params) {
      if (params.head.errCode === 0) {
        history.go(-1)
      }
    }
  },
  created () {
    this.getCurrentClinc()
  },
  watch: {
    'obj.clinicid': {
      handler (cur, old) {
        if (cur !== old) {
          this.obj.id = ''
          apperiodmangeapi
            .getListByClinicId({
              clinicId: this.obj.clinicid
            })
            .then(result => {
              result.data.forEach(function (item, index) {
                item.name = item.setOfBooksName
              })
              this.vouchArr = result.data
              if (result.data.length > 0) {
                this.obj.id = this.vouchArr[0].id
              }
            })
        }
      }
    }
  }
}
</script>
