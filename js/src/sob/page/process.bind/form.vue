<template>
  <div>
    <ever-bread-crumb name="ServicePattern" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj"
        :rules="rules"
        label-position="right" :nosubmit="true">
        <template slot="serviceItems">
          <service-select class="service_select" v-model="obj.serviceItems" value-key="id" :type="obj.serviceClassification" :scene="obj.usageScene ? Number(obj.usageScene) : ''" belongType="1">
          </service-select>
        </template>
      </ever-form2>
      <el-button style="margin-left: 120px; !important" type="primary" @click="submit" :disabled="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/sob/store/process.bind.api'
import form from '@/util/form'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

export default {
  data () {
    let schema = [
      {
        name: 'process',
        label: '流程',
        comp: 'sys-select',
        props: {
          placeholder: '请选择',
          options: [],
          field: {
            useObject: true
          }
        }
      },
      {
        name: 'orgId',
        label: '机构',
        comp: 'ever-org-select',
        span: 12,
        props: {
          fields: 'id',
          type: 'select'
        }
      },
      {
        name: 'usageScene',
        label: '使用场景',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'THC_SYS_SCENE',
          useValue: true
        }
      },
      {
        name: 'purchaseChannel',
        label: '购买渠道',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'THC_SYS_PRESCRIPTION_SOURCE'
        }
      },
      //        {
      //          name: 'deliveryMode',
      //          label: '配送方式',
      //          comp: 'sys-type',
      //          span: 12,
      //          props: {
      //            code: 'THC_SOB_DISTRIBUTION_MODE'
      //          }
      //        },
      {
        name: 'executionMode',
        label: '执行方式',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'THC_SOB_EXCUTE_TYPE'
        }
      },
      {
        name: 'usage',
        label: '给药途径',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'CV06.00.102'
        }
      },
      {
        name: 'serviceClassification',
        label: '医嘱项目类型',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'THC_WH_OBJECT_SUB_TYPE'
        }
      },
      {
        name: 'serviceItems',
        label: '医嘱项目',
        comp: 'custom',
        span: 12
      },
      {
        name: 'isValid',
        label: '状态',
        comp: 'sys-type',
        span: 12,
        props: {
          code: 'THC_SOB_AVAILABLE_STATE',
          useValue: true
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.isValid = '1'
    return {
      api,
      schema,
      obj,
      objId: this.$route.params.id,
      successPath: this.$route.meta.thirdActiveIndex,
      objDetail: {},
      rules: {
        process: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        serviceClassification: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  mixins: [form],
  async created () {
    let list = []
    let res = await request(urlMap.process.getProcesses, { offset: 0, pagesize: 100 })
    if (res.head.errCode === 0) {
      list = res.data.map(item => {
        item.id = item.id
        item.name = item.processName
        return item
      })
      this.$ever.getFieldFromSchema(this.schema, 'process').props.options = list
    }
  },
  methods: {
    submit () {
      if (this.obj.serviceItems && this.obj.serviceItems.id) {
        this.obj.serviceId = this.obj.serviceItems.id
        this.obj.serviceName = this.obj.serviceItems.name
      } else {
        this.obj.serviceId = ''
        this.obj.serviceName = ''
      }
      this.submitForm()
    },
  },
  watch: {
    'obj.serviceClassification' () {
      this.obj.serviceItems = ''
    },
    'obj.process' (val) {
      if (val) {
        this.obj.processKey = val.processKey
        this.obj.processName = val.processName
      }
    },
    'objDetail': {
      handler (val) {
        if (val.process) {
          this.obj.processKey = val.processKey
          this.obj.processName = val.processName
        }
        if (val.serviceId && val.serviceName) {
          this.obj.serviceItems = {
            id: val.serviceId,
            name: val.serviceName
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.auto-scroll {
  flex: 1;
  overflow: auto;
}
</style>
