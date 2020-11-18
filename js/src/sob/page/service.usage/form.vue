<template>
  <div>
    <ever-bread-crumb name="用法管理" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="11"
        :rules="rules"
        :nosubmit="true"
      >
        <template slot="itemDto">
          <service-picker ref="servicePicker" v-model="obj.itemDto" :only="'10006'"></service-picker>
        </template>
      </ever-form2>
      <div class="form_handle">
        <el-button type="primary" @click="submitForm" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../store/service.usage'
import form from '@/util/form'
import servicePicker from './service.picker'
export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'usage',
        label: '用法',
        comp: 'sys-type',
        props: {
          disabled: true,
          code: 'CV06.00.102'
        }
      },
      {
        name: 'itemDto',
        label: '收费项目',
        comp: 'custom',
        span: 24
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      obj,
      schema,
      objId: this.$route.params.id,
      btnDisabled: false,
      objDetail: this.$ever.createObjFromSchema(schema),
      rules: {
        usage: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        itemDto: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    servicePicker
  },
  methods: {
    async submitForm () {
      this.btnDisabled = true
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.$refs.servicePicker.validate()) {
            this.btnDisabled = false
            return this.$messageTips(this, 'warning', '请选择收费项目', '提示')
          }
          let data = JSON.parse(JSON.stringify(this.obj))
          if (data.itemDto && data.itemDto.length) {
            data.itemDto.map(item => {
              if (item.service) {
                item.serviceId = item.service.id
                item.serviceName = item.service.name
                item.countUnit = item.service.unit
                item.unitName = item.service.unitName
              }
              item.serviceClassification = item.serviceType
              delete item.service
              return item
            })
          }
          const res = await api.createOrUpdate(data)
          if (res && res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功！', '提示')
            this.$router.go(-1)
          } else {
            this.btnDisabled = false
          }
        } else {
          this.btnDisabled = false
        }
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  watch: {
    'objDetail.itemDto': {
      handler (val) {
        if (val && val.length) {
          val.forEach((item, index) => {
            let service = {
              id: item.serviceId,
              name: item.serviceName,
              unitName: item.unitName || ''
            }
            let nItem = Object.assign({}, this.obj.itemDto[index], { service: service, serviceType: item.serviceClassification, count: item.count })
            this.$nextTick(_ => {
              // setTimeout(_ => {
              this.$set(this.obj.itemDto, index, nItem)
              // }, 500)
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form_handle {
  padding-left: 120px;
}
.auto-scroll {
  flex: 1;
  overflow: auto;
}
</style>
