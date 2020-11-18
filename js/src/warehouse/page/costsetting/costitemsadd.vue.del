<template>
  <div>
    <ever-bread-crumb name="新建" path="/warehouse/costitemsedit"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        class="diy-form"
        :schema="schema"
        v-model="obj"
        :span=12
        :api="api"
        :info="true"
        :rules="rules"
        ref="form"
        label-position="right">
        <template slot='name'>
          <el-input v-model="obj.name" placeholder="请输入内容" :maxlength='20' @blur="bluefn"></el-input>
        </template>
        <template slot='status'>
          <el-radio class="radio" v-model="obj.status" label="1">可用</el-radio>
          <el-radio class="radio" v-model="obj.status" label="0">停用</el-radio>
        </template>
        <template slot='type'>
          <el-select v-model="obj.type" placeholder="请选择" size='medium'>
            <el-option
              v-for="item in typeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot='costType'>
          <el-select v-model="obj.costType" placeholder="请选择" size='medium'>
            <el-option
              v-for="item in costoptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot='healthIden'>
          <el-select v-model="obj.healthIden" placeholder="请选择" size='medium'>
            <el-option
              v-for="item in healthoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="createInfo">保存</el-button>
              <el-button  @click="cancel">取消</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/store/costapi'
import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  data () {
    let schema = [
      {
        name: 'code',
        label: '成本项目代码',
        props: {
          disabled: !!this.$route.params.id,
          maxlength: 20
        }
      },
      {
        name: 'name',
        label: '成本项目名称',
        comp: 'custom'
      },
      {
        name: 'parentCode',
        label: '上级编码',
        props: {
          disabled: !!this.$route.params.id,
          maxlength: 20
        }
      },
      {
        name: 'costType',
        label: '成本分类',
        comp: 'custom'
      },
      {
        name: 'type',
        label: '成本类型',
        comp: 'custom'
      },
      {
        name: 'healthIden',
        label: '医疗药品标识',
        comp: 'custom'
      },
      {
        name: 'spell',
        label: '拼音码',
        props: {
          maxlength: 20
        }
      },
      {
        name: 'status',
        label: '是否停用',
        comp: 'custom'
      }
    ]
    let rules = {
      code: [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      name: [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      costType: [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      type: [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      healthIden: [
          { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    var obj = this.$ever.createObjFromSchema(schema)
    obj.status = '1'
    return {
      api,
      obj,
      rules,
      queryObj: obj,
      schema: schema,
      id: this.$route.params.id,
      typeoptions: [
        {value: 1, label: '固定成本'},
        {value: 2, label: '变动成本'}
      ],
      healthoptions: [
        {value: 1, label: '医疗成本'},
        {value: 2, label: '药品成本'}
      ],
      costoptions: []
    }
  },
  components: {

  },
  created () {
    this.editinfo()
    sysvalue.listOnce('THC_RCM_DICT_COST_TYPE').then(res => {
      this.costoptions = res
    })
  },
  watch: {
  },
  methods: {
    bluefn (e) {
      if (!e.target.value) {
        return
      }
      let str = e.target.value
      let han = /^[\u4e00-\u9fa5]+$/
      if (!han.test(str)) {
        this.$notify({
          title: '',
          message: '成本项目名称必须为汉字',
          type: 'error'
        })
        return
      }
      api.getSpell({name: e.target.value}).then(result => {
        this.queryObj.spell = result.data.spell
      }).catch(reject => {
        this.$notify({
          title: '',
          message: '成本项目名称',
          type: 'error'
        })
      })
    },
    editinfo () {
      if (this.id) {
        api.getById({id: this.id}).then(result => {
          this.queryObj.code = result.data.code
          this.queryObj.name = result.data.name
          this.queryObj.parentCode = result.data.parentCode
          this.queryObj.costType = String(result.data.costType)
          this.queryObj.type = result.data.type
          this.queryObj.healthIden = result.data.healthIden
          this.queryObj.spell = result.data.spell
          this.queryObj.status = String(result.data.status)
        })
      }
    },
    updateInfo (key) {
      let url = 'addcost'
      if (this.id) {
        url = 'editcost'
        this.queryObj['id'] = this.id
      }
      api[url](this.queryObj).then(result => {
        this.$notify({
          title: '',
          message: '保存成功',
          type: 'success'
        })
        history.go(-1)
      })
    },
    cancel () {
      history.go(-1)
    },
    createInfo (key) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.updateInfo(key)
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
  .el-select{
    width:100%
  }
</style>
