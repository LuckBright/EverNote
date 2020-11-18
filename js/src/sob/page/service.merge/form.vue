<template>
  <div>
    <ever-bread-crumb name="检验耗材管理" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="11"
        :rules="rules"
        :nosubmit="true"
      >
        <template slot="inspectionList">
          <service-picker
            ref="serviceSetPicker"
            v-model="obj.inspectionList"
            :is-set="true"
            :select-type="'801'"
          >
            <template slot='specimenCount'  slot-scope="item" v-if='showSpecimenCount'>标本数量：{{item.slotScope.specimenCount}}</template>
          </service-picker>
        </template>
        <template slot="serviceList">
          <service-picker
            ref="servicePicker"
            v-model="obj.serviceList"
            :is-no-must="true"
            :select-type="'10006'"
          ></service-picker>
        </template>
      </ever-form2>
      <div class="form_handle" v-if="!loading">
        <el-button type="primary" @click="submitForm" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import serviceeditapi from '@/sob/store/serviceeditapi.js'
import servicesetapi from '@/sob/store/servicesetapi.js'
import api from '../../store/service.merge'
import form from '@/util/form'
import servicePicker from './service.picker'
export default {
  mixins: [form],
  data () {
    let mergeType = {
      '1': '合并',
      '0': '不合并'
    }
    let schema = [
      {
        name: 'name',
        label: '检验耗材名称',
        span: 14,
        props: {
          maxlength: 40
        }
      },
      {
        name: 'isMerge',
        label: '合并类型',
        comp: 'value-set',
        span: 14,
        props: {
          options: mergeType
        }
      },
      {
        name: 'isValid',
        label: '状态',
        comp: 'sys-type',
        span: 14,
        props: {
          code: 'THC_SOB_AVAILABLE_STATE',
          useValue: true,
          clearable: false
        }
      },
      {
        // name: 'serviceSetDto',
        name: 'inspectionList',
        label: '检验项目',
        comp: 'custom',
        span: 24
      },
      {
        name: 'serviceList',
        label: '使用耗材',
        comp: 'custom',
        span: 24
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.isValid = '1'
    return {
      api,
      obj,
      schema,
      objId: this.$route.params.id,
      btnDisabled: false,
      objDetail: {},
      mergeType,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        inspectionList: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // serviceList: [
        //   {required: true, message: '必填项', trigger: 'change'}
        // ],
        isMerge: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        isValid: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      showSpecimenCount: false,
      loading: this.$route.params.id !== '-1'
    }
  },
  components: {
    servicePicker
  },
  methods: {
    getDetail: function (id) {
      this.api.getById(id || this.objId).then(result => {
        if (result) {
          let data = {}
          if (result.id) {
            data = result
          }
          if (result[0] && result[0].id) {
            data = result[0]
          }
          this.objDetail = JSON.parse(JSON.stringify(data))
          Object.assign(this.obj, data)
        }
        this.loading = false
      })
    },
    async submitForm () {
      this.btnDisabled = true
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.$refs.serviceSetPicker.validate()) {
            this.btnDisabled = false
            this.$messageTips(this, 'warning', '请选择检验项目', '提示')
            return false
          }
          if (this.obj.isMerge === '1') {
            let result = await this.check()
            if (!result) {
              this.btnDisabled = false
              this.showSpecimenCount = true
              this.$messageTips(this, 'warning', '标本项目中存在标本数量不一致')
              return
            }
            this.showSpecimenCount = false
          }
          let data = JSON.parse(JSON.stringify(this.obj))
          console.log(this.obj)
          if (data.inspectionList && data.inspectionList.length) {
            data.inspectionList.map(item => {
              if (item.service) {
                item.serviceId = item.service.id
                item.serviceName = item.service.name
                item.serviceClassification = item.serviceType
                item.serviceType = item.service.isSet ? 2 : 1
              }
              delete item.service
              return item
            })
          }
          if (data.serviceList && data.serviceList.length) {
            if (!data.serviceList[0].serviceType || (data.serviceList.length === 1 && !data.serviceList[0].service)) {
              delete data.serviceList
            } else {
              data.serviceList.map(item => {
                if (item.service) {
                  item.serviceId = item.service.id
                  item.serviceName = item.service.name
                }
                delete item.service
                return item
              })
            }
          } else {
            delete data.serviceList
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
    },
    async check () {
      return new Promise((resolve, reject) => {
        let arr = []
        this.obj.inspectionList.forEach(async (val, index) => {
          if (val.service && val.service.isSet !== undefined) {
            if (+val.service.isSet === 0) {
              arr.push(serviceeditapi.getById(val.service.id))
            } else {
              arr.push(servicesetapi.getById(val.service.id))
            }
          }
        })
        let specimen = {

        }
        Promise.all(arr).then((result) => {
          result.forEach((ele, index) => {
            specimen[ele.specimenCount] = true
            this.$set(this.obj.inspectionList[index], 'specimenCount', ele.specimenCount)
          })
          Object.keys(specimen).length > 1 ? resolve(false) : resolve(true)
        }).catch(_ => {
          resolve(false)
        })
      })
    }
  },
  watch: {
    'objDetail.inspectionList': {
      handler (val) {
        if (val && val.length) {
          val.forEach((item, index) => {
            let service = {
              id: item.serviceId,
              name: item.serviceName
            }
            let nItem = Object.assign({}, this.obj.serviceList[index], { service: service, serviceType: '801' })
            this.$set(this.obj.inspectionList, index, nItem)
          })
        }
      }
    },
    'objDetail.serviceList': {
      handler (val) {
        if (val && val.length) {
          val.forEach((item, index) => {
            let service = {
              id: item.serviceId,
              name: item.serviceName,
              echo: undefined
            }
            let nItem = Object.assign({}, this.obj.serviceList[index], { service: service, serviceType: item.serviceType })
            this.$set(this.obj.serviceList, index, nItem)
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
