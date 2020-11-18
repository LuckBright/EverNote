import { HOSPITAL_EXECUTE } from '@/util/table-config'
import storage from '@/util/storage'
export default {
  data () {
    let executeSchema = [
      {
        name: 'serviceNameList',
        label: '医嘱名称',
        comp: 'custom',
        span: 12
      },
      {
        name: 'pishiResult',
        label: '皮试结果',
        comp: 'sys-select',
        span: 12,
        props: {
          placeholder: '请选择皮试结果',
          options: [
            {id: '1', name: '阴性'},
            {id: '2', name: '阳性'}
          ]
        }
      },
      {
        name: 'description',
        label: '备注',
        comp: 'textarea',
        props: {
          placeholder: '请输入备注'
        }
      }
    ]
    let executeObj = this.$ever.createObjFromSchema(executeSchema)
    let noExecuteSchema = [
      {
        name: 'noExecuteReason',
        label: '原因',
        comp: 'sys-type',
        props: {
          placeholder: '请选择无法执行原因',
          code: 'THC_CPOE_HOSP_NURES_NOT_EXCUTE_REASON',
        }
      },
      {
        name: 'description',
        label: '备注',
        comp: 'textarea',
        props: {
          placeholder: '请输入备注'
        }
      }
    ]
    let noExecuteObj = this.$ever.createObjFromSchema(noExecuteSchema)
    let cancelExecuteSchema = [
      {
        name: 'result',
        label: '取消原因',
        comp: 'textarea',
        props: {
          placeholder: '请输入取消原因'
        }
      }
    ]
    let cancelExecuteObj = this.$ever.createObjFromSchema(cancelExecuteSchema)
    let querySchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'serviceTypes',
        label: '',
        comp: 'sys-select',
        props: {
          options: [],
          placeholder: '医嘱类型',
          field: {
            multiple: true,
            collapsetags: true
          }
        }
      },
      // {
      //   name: 'executeTypeCodeList',
      //   label: '',
      //   comp: 'sys-select',
      //   props: {
      //     placeholder: '执行单类型',
      //     field: {
      //       multiple: true,
      //       collapsetags: true
      //     },
      //     options: []
      //   }
      // },
      {
        name: 'executeStatusList',
        label: '',
        comp: 'sys-select',
        props: {
          placeholder: '执行单状态',
          field: {
            multiple: true,
            collapsetags: true
          },
          options: []
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termTypes = -1
    // queryObj.executeTypeCodeList = []
    queryObj.executeStatusList = []
    if (this.baseInfo) {
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
    }
    return {
      querySchema,
      queryObj,
      executeSchema,
      executeObj,
      noExecuteSchema,
      noExecuteObj,
      cancelExecuteSchema,
      cancelExecuteObj,
      executeRules: {
        pishiResult: [
          { required: true, message: '请选择皮试结果', trigger: 'change' }
        ],
        description: [
          { max: 150, message: '不能大于150个字符', trigger: 'blur' }
        ]
      },
      noExecuteRules: {
        noExecuteReason: [
          { required: true, message: '请选择不执行原因', trigger: 'change' }
        ],
        description: [
          { max: 150, message: '不能大于150个字符', trigger: 'blur' }
        ]
      },
      cancelExecuteRules: {
        result: [
          { required: true, message: '请输入取消原因', trigger: 'blur' },
          { max: 150, message: '不能大于150个字符', trigger: 'blur' }
        ]
      },
      // executeTypeList: [
      //   {
      //     id: 'YAO_LIAO_DAN',
      //     name: '药疗单',
      //     code: 'thc_phr.advice_execute_YAO_LIAO_DAN_20181130'
      //   },
      //   {
      //     id: 'ZHU_SHE_DAN',
      //     name: '注射单',
      //     code: 'thc_phr.advice_execute_ZHU_SHE_DAN_20181130'
      //   },
      //   {
      //     id: 'SHU_YE_DAN',
      //     name: '输液单',
      //     code: 'thc_phr.advice_execute_SHU_YE_DAN_20181130'
      //   },
      //   {
      //     id: 'HU_LI_DAN',
      //     name: '护理单',
      //     code: 'thc_phr.advice_execute_HU_LI_DAN_20181130'
      //   },
      //   {
      //     id: 'XIAO_ZHI_LIAO_DAN',
      //     name: '小治疗单',
      //     code: 'thc_phr.advice_execute_XIAO_ZHI_LIAO_DAN_20181130'
      //   }
      // ],
      executeStatusList: [
        {
          id: '10',
          name: '待执行'
        },
        {
          id: '30',
          name: '已完成'
        },
        {
          id: '53',
          name: '已作废'
        },
        {
          id: '55',
          name: '无法执行'
        }
      ],
      columns: [
        {
          prop: 'patientName',
          label: '患者信息',
          showOverflowTooltip: true,
          minWidth: '10%',
          formatter: ({ value, row }) => {
            return (row.bedName ? row.bedName + ' ' : '') + value
          }
        },
        {
          prop: 'planTime',
          label: '计划时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value }) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'termType',
          label: '长/临',
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({ value }) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: '类型',
          minWidth: '6%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '内容',
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'executeProviderName',
          label: '执行科室',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'executeStatus',
          prop: 'executeStatus',
          label: '执行状态',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value }) => {
            return this.executeStatusList.find(val => { return String(value) === val.id }).name || ''
          }
        },
        {
          slot: 'completeTimes',
          prop: 'completeTimes',
          label: '执行时间',
          showOverflowTooltip: true,
          minWidth: '12%'
        },
        {
          slot: 'executeBy',
          prop: 'executeBy',
          label: '执行人',
          showOverflowTooltip: true,
          minWidth: '12%'
        }
      ],
      configOption: { id: HOSPITAL_EXECUTE },
      rowClass: 'executeContextRow',
      arraySpan: ['patientName', 'planTime', 'termType', 'executeProviderName', 'executeStatus', 'completeTimes', 'executeBy'],
      noBorderSpan: ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust'],
    }
  }
}
