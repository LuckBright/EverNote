<template>
  <div>
    <ever-bread-crumb name="列表" path="/demo/layout/list"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="12"
        :api="api"
        :rules="rules"
        label-position="right"
      ></ever-form2>
    </div>

    <div class="layout_inner">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        :inline="true"
        :is-query="true"
        :hasExt="true"
        extBtnString="添加预约"
      >
        <template slot="daterange">
          <ever-range-picker
            :shortcut="true"
            :start.sync="queryObj.startAppointDate"
            :end.sync="queryObj.endAppointDate"
            :noclear="true"
            :autoWidth="false"
          ></ever-range-picker>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import form from '@/util/form'
import api from '@/warehouse/store/drugallotboundapi'

let querySchema = [
  {
    name: 'daterange',
    label: '日期：',
    comp: 'custom'
  },
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    props: {
      placeholder: '请输入患者姓名',
      width: '140px'
    }
  },
  {
    name: 'appointmentStates',
    comp: 'ever-select',
    props: {
      options: [],
      width: '100px'
    }
  },
  {
    name: 'appoBtn',
    comp: 'custom'
  }
]
var schema = [
  {
    name: 'code',
    label: '单据编号'
  },
  {
    name: 'status',
    label: '会员卡状态',
    comp: 'sys-type',
    props: {
      code: 'THC_CARD_MEMBERCARD_STATUS'
    }
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'joinOperator',
    label: '交接人'
  },
  {
    name: 'description',
    label: '说明',
    comp: 'el-input',
    props: {
      type: 'textarea'
    },
    span: 24
  }
]
export default {
  mixins: [form],
  data () {
    var rules = {
      joinOperator: [
        { required: true, message: '必填项', trigger: 'blur', type: 'number' }
      ],
      allotBoundType: [
        { required: true, message: '必填项', trigger: 'blur', type: 'number' }
      ],
      outStorageRoomId: [
        { required: true, message: '必填项', trigger: 'blur', type: 'number' }
      ],
      outStockDate: [
        { required: true, message: '必填项', trigger: 'blur', type: 'number' }
      ]
    }
    let obj = this.$ever.createObjFromSchema(schema)
    let queryObj = this.$ever.createObjFromSchema(querySchema)

    return {
      schema,
      querySchema,
      obj,
      queryObj,
      api,
      objId: this.$route.params.id,
      num: this.$route.params.num,
      rules
    }
  },
  beforecreated () {
    this.api = api
  }
}
</script>
