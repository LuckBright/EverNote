<template>
  <div>
    <ever-bread-crumb name="排斥组管理" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="11"
        :rules="rules"
        :nosubmit="true"
      >
        <template slot="adviceItems">
          <service-picker
            ref="servicePicker"
            v-model="obj.adviceItems"
            :only="true"
            v-if="obj.excludeType === '1'"
          ></service-picker>
        </template>
        <template slot="excludeType">
          <el-row>
            <el-col>
              <sys-select v-model="obj.excludeType" type="radio" :options="excludeTypeOpts"></sys-select>
            </el-col>
            <el-col v-show="obj.excludeType === '2'" class="mt10">
              <service-picker ref="servicePickerEx" v-model="obj.excludeAdviceItems"></service-picker>
            </el-col>
          </el-row>
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
import api from '../../store/advice.exclude'
import form from '@/util/form'
import servicePicker from './service.picker'
export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'name',
        label: '排斥组名称'
      },
      {
        name: 'excludeType',
        label: '排斥范围',
        comp: 'custom',
        span: 24
      },
      {
        name: 'adviceItems',
        label: '排斥医嘱',
        comp: 'custom',
        span: 24
      },
      {
        name: 'isValid',
        label: '状态',
        comp: 'sys-type',
        props: {
          code: 'THC_SOB_AVAILABLE_STATE',
          useValue: true,
          clearable: false
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.excludeType = '1'
    obj.isValid = '1'
    return {
      api,
      obj,
      schema,
      objId: this.$route.params.id,
      btnDisabled: false,
      objDetail: {},
      excludeTypeOpts: [
        {
          id: '1',
          name: '全排斥'
        },
        {
          id: '2',
          name: '部分排斥'
        }
      ],
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        excludeType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        isValid: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        adviceItems: [
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
          if (this.$refs.servicePicker && !this.$refs.servicePicker.validate()) {
            this.btnDisabled = false
            this.$messageTips(this, 'warning', '请选择排斥医嘱', '提示')
            return false
          }
          if (this.obj.excludeType === '2') {
            if (this.$refs.servicePickerEx && !this.$refs.servicePickerEx.validate()) {
              this.btnDisabled = false
              // this.$messageTips(this, 'warning', '请选择排斥医嘱', '提示')
              return false
            }
          }
          let data = JSON.parse(JSON.stringify(this.obj))
          if (data.adviceItems && data.adviceItems.length) {
            data.serviceId = data.adviceItems[0].service.id
            data.serviceName = data.adviceItems[0].service.name
            data.serviceType = data.adviceItems[0].serviceType
            delete data.adviceItems
            //              data.adviceItems.map(item => {
            //                if (item.service) {
            //                  item.id = item.service.id
            //                  item.name = item.service.name
            //                }
            //                delete item.service
            //                return item
            //              })
          }
          if (data.excludeAdviceItems && data.excludeAdviceItems.length) {
            data.excludeAdviceItems.map(item => {
              if (item.service) {
                item.excludeServiceId = item.service.id
                item.serviceName = item.service.name
              }
              delete item.service
              return item
            })
          }
          const res = await api.createOrUpdate(data)
          if (res && res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功！', '提示')
            this.$router.push(this.$route.meta.thirdActiveIndex)
          } else {
            this.btnDisabled = false
          }
        } else {
          this.btnDisabled = false
        }
      })
    },
    cancel () {
      this.$router.push(this.$route.meta.thirdActiveIndex)
    }
  },
  watch: {
    'objDetail': {
      handler (val) {
        if (val) {
          if (val.serviceId) {
            let adviceItems = [
              {
                service: {
                  id: val.serviceId,
                  name: val.serviceName || ''
                },
                serviceType: String(val.serviceType)
              }
            ]
            this.$set(this.obj, 'adviceItems', adviceItems)
          } else {
            this.$set(this.obj, 'adviceItems', [{ service: { id: '', name: '', serviceType: String(val.serviceType) } }])
          }
          if (val.excludeAdviceItems && val.excludeAdviceItems.length) {
            let list = []
            val.excludeAdviceItems.forEach(item => {
              if (!item.serviceName) {
                item.serviceName = ''
                item.excludeServiceId = ''
                item.serviceType = ''
              }
              list.push(item)
            })
            this.$set(this.obj, 'excludeAdviceItems', list)
          }
        }
      }
    },
    'obj.excludeType': {
      handler (val) {
        if (this.obj.adviceItems && this.obj.adviceItems.length) {
          this.obj.adviceItems.forEach(item => {
            if (item.service.echo) {
              item.service.echo = undefined
            }
          })
        }
        if (val === '1') {
          let obj = {
            name: 'adviceItems',
            label: '排斥医嘱',
            comp: 'custom',
            span: 24
          }
          this.schema.splice(2, 0, obj)
          this.rules.adviceItems = [{ required: true, message: '必填项', trigger: 'change' }]
        } else {
          this.schema.splice(2, 1)
          delete this.rules.adviceItems
        }
      }
    },
    'objDetail.excludeAdviceItems': {
      handler (val) {
        if (val && val.length) {
          val.forEach((item, index) => {
            let service = {
              id: item.excludeServiceId,
              name: item.serviceName
            }
            let nItem = Object.assign({}, this.obj.excludeAdviceItems[index], { service: service, serviceType: String(item.serviceType) })
            this.$nextTick(_ => {
              setTimeout(_ => {
                this.$set(this.obj.excludeAdviceItems, index, nItem)
              }, 500)
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
