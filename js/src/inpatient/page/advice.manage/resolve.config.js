import { HOSPITAL_RESOLVE_MEDICINE, HOSPITAL_RESOLVE_NOMEDICINE, HOSPITAL_RESOLVE_MEDICINE_SEARCH, HOSPITAL_RESOLVE_NOMEDICINE_SEARCH } from '@/util/table-config'
import storage from '@/util/storage'
export default {
  data () {
    let resultSchema = [
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
            { id: '1', name: '阴性' },
            { id: '2', name: '阳性' }
          ]
        }
      },
      {
        name: 'description',
        label: '备注',
        comp: 'textarea',
        props: {
          placeholder: '请输入备注',
          maxlength: 150
        }
      }
    ]
    let resultObj = this.$ever.createObjFromSchema(resultSchema)
    let resolveSchema = [
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
      {
        name: 'splitTime',
        label: '分解时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          placeholder: '',
          clearable: false
        }
      },
      {
        name: 'resolve',
        label: '',
        comp: 'custom'
      },
      {
        name: 'showDelete',
        label: '',
        comp: 'sys-select',
        props: {
          type: 'checkbox',
          options: [{id: '1', name: '显示已删除'}]
        }
      }
    ]
    let searchSchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'splitTime',
        label: '分解时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          placeholder: ''
        }
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
      {
        name: 'executeStatusList',
        label: '执行状态',
        comp: 'sys-select',
        props: {
          placeholder: '执行状态',
          field: {
            multiple: true,
            collapsetags: true
          },
          options: [
            {
              id: '30',
              name: '已完成'
            },
            {
              id: '53',
              name: '已作废'
            },
            {
              id: '10',
              name: '待执行'
            }
          ]
        }
      },
      {
        name: 'dispenseStatusList',
        label: '出库状态',
        comp: 'sys-select',
        props: {
          placeholder: '出库状态',
          field: {
            multiple: true,
            collapsetags: true
          },
          options: []
        }
      }
    ]
    let querySchema = resolveSchema
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termTypes = -1
    queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
    queryObj.page = Number(this.$route.query.page) || 1
    queryObj.pagesize = Number(this.$route.query.pagesize) || 20
    queryObj.offset = (Number(this.$route.query.page) - 1) * Number(this.$route.query.pagesize) || 0
    return {
      resolveSchema,
      searchSchema,
      querySchema,
      queryObj,
      resultSchema,
      resultObj,
      resultRules: {
        pishiResult: [
          { required: true, message: '请选择皮试结果', trigger: 'change' }
        ]
      },
      columns0: [
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
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          prop: 'employName',
          label: '用法',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'measure',
          label: '剂量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value, row }) => {
            return value ? value + row.measureUnitName : '--'
          }
        },
        {
          prop: 'useFreqName',
          label: '频次',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'count',
          label: '领量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value, row }) => {
            return value + row.countUnitName
          }
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          slot: 'source',
          prop: 'source',
          label: '渠道',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'storageRoomName',
          label: '库房',
          showOverflowTooltip: true,
          minWidth: '8%'
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
          label: '状态',
          minWidth: '6%',
          hidden: true
        }
      ],
      columns1: [
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
          slot: 'source',
          prop: 'source',
          label: '渠道',
          showOverflowTooltip: true,
          minWidth: '8%'
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
          label: '状态',
          minWidth: '6%',
          hidden: true
        }
      ],
      columns2: [
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
          prop: 'employName',
          label: '用法',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'measure',
          label: '剂量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value, row }) => {
            return value ? value + row.measureUnitName : '--'
          }
        },
        {
          prop: 'useFreqName',
          label: '频次',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'count',
          label: '领量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value, row }) => {
            return value + row.countUnitName
          }
        },
        {
          slot: 'dispenseStatus',
          prop: 'dispenseStatus',
          label: '出库状态',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'splitTime',
          label: '分解时间',
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
          prop: 'splitName',
          label: '分解人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'submitTime',
          label: '提交时间',
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
          prop: 'submitName',
          label: '提交人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        }
      ],
      columns3: [
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
          slot: 'source',
          prop: 'source',
          label: '渠道',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'executeProviderName',
          label: '执行科室',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'splitTime',
          label: '分解时间',
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
          prop: 'splitName',
          label: '分解人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'submitTime',
          label: '提交时间',
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
          prop: 'submitName',
          label: '提交人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        }
      ],
      rowClass: 'resolveContextRow',
      arraySpan: ['patientName', 'planTime', 'employName', 'termType', 'useFreqName', 'storageRoomName', 'source', 'splitTime', 'splitName', 'submitTime', 'submitName', 'executeProviderName'],
      noBorderSpan: ['doctorAdviceName', 'serviceType', 'measure', 'count', 'entrust', 'dispenseStatus'],
      sendStatusList: {
        '3': '待提交',
        '0': '待出库',
        '190': '已出库',
        '70': '出库驳回',
        // '150': '退库中',
        // '160': '已退库',
        // '180': '退库驳回'
      },
      configOption: { id: HOSPITAL_RESOLVE_MEDICINE },
      tableConfigIds: {
        '0': HOSPITAL_RESOLVE_MEDICINE,
        '1': HOSPITAL_RESOLVE_NOMEDICINE,
        '2': HOSPITAL_RESOLVE_MEDICINE_SEARCH,
        '3': HOSPITAL_RESOLVE_NOMEDICINE_SEARCH
      }
    }
  }
}
