import moment from 'moment'
const yesterdayEnd = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
const yesterdayStart = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
export const runqianArr = [
  {
    name: '当日费用清单',
    code: 'ZY_DANG_RI_FEI_YONG_QING_DAN',
    schema: ['orgId', 'hospitalizedNumber', 'termType', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '住院收费查询报表',
    code: 'report_other_ip_zysfcxbb',
    schema: ['orgId', 'person', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '门诊收费员日报表',
    code: 'report_other_out_mzsfyrb',
    schema: ['orgId', 'rjtype', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      type: 1
    }
  },
  {
    name: '医技外送统计表',
    code: 'report_other_mt_yjwstjb',
    schema: ['orgId', 'deptId', 'type', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      doctorId: localStorage.getItem('USERID'),
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd,
      type: 1
    }
  },
  {
    name: '住院流动分析',
    code: 'report_other_ip_zyldfx',
    schema: ['orgId'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID')
    }
  },
  {
    name: '病区日报',
    code: 'report_other_bqrb',
    schema: ['orgId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '科室收入分析（润乾）',
    code: 'report_other_ip_kssrfx',
    schema: ['orgId', 'type', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    }
  },
  {
    name: '出院病人住院费用汇总(出院患者费用汇总表)',
    code: 'report_other_ip_cyhzfyhzb',
    schema: ['orgId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '挂号工作量统计',
    code: 'report_work_out_ghgzltj',
    schema: ['orgId', 'type', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    }
  },
  {
    name: '医保在院患者查询表',
    code: 'report_yb_ybzyhzcx',
    schema: ['orgId', 'type', 'insuranceorgid', 'treattype', 'overallarea', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '医保结算统计明细表',
    code: 'report_yb_ybjsmxb',
    schema: ['orgId', 'deptId', 'insuranceorgid', 'treattype', 'overallarea', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '医保结算统计汇总表',
    code: 'report_yb_ybjshzb',
    schema: ['orgId', 'insuranceorgid', 'treattype', 'overallarea', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '签约医生开单统计',
    code: 'report_other_out_qyyskdtj',
    schema: ['orgId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    }
  },
  {
    name: '医生诊次金额统计表',
    code: 'report_other_out_yszcjetjb',
    schema: ['orgId', 'deptId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '门诊当日工作量统计明细表',
    code: 'report_work_out_gzltjmx_today',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '门诊当日工作量统计汇总表',
    code: 'report_work_out_gzltjhz_today',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59')
    }
  },
  {
    name: '门诊工作量统计汇总表（润乾）',
    code: 'report_work_out_gzltjhz',
    schema: ['orgId', 'deptId', 'visitStartDate'],
    defaultQueryObj: {
      doctorId: localStorage.getItem('USERID'),
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '门诊工作量统计明细表（润乾）',
    code: 'report_work_out_gzltjmx',
    schema: ['orgId', 'deptId', 'visitStartDate'],
    defaultQueryObj: {
      doctorId: localStorage.getItem('USERID'),
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '住院工作量统计汇总表（润乾）',
    code: 'report_work_ip_gzltjhz',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '住院工作量统计明细表（润乾）',
    code: 'report_work_ip_gzltjmx',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '医技工作量统计表（润乾）',
    code: 'report_work_mt_gzltj',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '医技工作量统计明细表',
    code: 'report_work_mt_gzltj_settlement',
    schema: ['orgId', 'openDeptId', 'openDoctorId', 'openTime', 'type', 'settleType', 'deptId', 'doctorId', 'exeTime', 'itemType'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      openStartTime: yesterdayStart,
      openEndTime: yesterdayEnd,
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '门诊开单项目汇总表（润乾）',
    code: 'report_work_out_kdltjmx_new',
    schema: ['orgId', 'deptId', 'doctorId', {
      name: 'itemType',
      label: '项目名称', // 项目名称
      span: 4,
    }, 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '住院开单项目汇总表（润乾）',
    code: 'report_work_ip_kdltjmx_new',
    schema: ['orgId', 'deptId', 'exeDeptId', 'doctorId', {
      name: 'itemType',
      label: '项目名称', // 项目名称
      span: 4,
    }, 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '医技工作量统计汇总表',
    code: 'report_work_mt_zxltjmx_new',
    schema: ['orgId', 'deptId', 'doctorId', 'settleType', 'itemType', 'exeTime'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '门诊药品耗材销售汇总表（润乾）',
    code: 'report_sale_out_yphchz',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '门诊药品耗材销售明细表（润乾）',
    code: 'report_sale_out_yphcmx',
    schema: ['orgId', 'storageRoomId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '住院药品耗材销售汇总表（润乾）',
    code: 'report_sale_ip_yphchz',
    schema: ['orgId', 'deptId', 'doctorId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '住院药品耗材销售明细表（润乾）',
    code: 'report_sale_ip_yphcmx',
    schema: ['orgId', 'storageRoomId', 'visitStartDate'],
    defaultQueryObj: {
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '药品销售双十排名表(已结算)（润乾）',
    code: 'report_sale_out_ypsspm',
    schema: ['orderString', 'itemType', 'visitStartDate', 'orgId'],
    defaultQueryObj: {
      orderString: 'quantity',
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '药品销售双十排名表（润乾）',
    code: 'report_sale_out_ypsspm_all',
    schema: ['orderString', 'itemType', 'visitStartDate', 'orgId'],
    defaultQueryObj: {
      orderString: 'quantity',
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '药品销售排名表（润乾）',
    code: 'report_sale_ip_yppm',
    schema: ['orderString', 'itemType', 'visitStartDate', 'orgId'],
    defaultQueryObj: {
      orderString: 'quantity',
      orgId: localStorage.getItem('CLINICID'),
      startTime: yesterdayStart,
      endTime: yesterdayEnd
    },
  },
  {
    name: '领用汇总表（润乾）',
    code: 'report_storageroom_apply',
    schema: [
      {
        name: 'orgId',
        comp: 'ever-org-select',
        label: '机构名称',
        props: {
          type: 'select',
          multiple: true,
          collapseTags: true,
          fields: 'id',
          props: {
            clearable: false
          },
          params: {
            everQueryType: 'isLogin'
          }
        }
      },
      {
        name: 'relatedPartyId',
        label: '科室',
        comp: 'ever-subject-select',
        props: {
          multiple: true,
          collapseTags: true,
          params: {
          },
          type: 'select',
          fields: 'id'
        }
      },
      {
        name: 'storageRoomId',
        label: '药房',
        comp: 'everStorageroomSelect',
        props: {
          multiple: true,
          collapseTags: true,
          params: {
            clinicIds: [localStorage.getItem('CLINICID')]
          }
        }
      }, 'visitStartDate', 'isHide'],
    defaultQueryObj: {
      startTime: moment().date(1).format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 00:00:00'),
      staffId: localStorage.getItem('USERID'),
      orgId: [localStorage.getItem('CLINICID')],
      isHide: true
    },
  },
  {
    name: '互联网基础数据报表',
    code: 'ih_hlwjcsjbb',
    schema: ['visitStartDate'],
    defaultQueryObj: {
      startTime: '',
      endTime: '',
      // staffId: localStorage.getItem('USERID'),
      // orgId: [localStorage.getItem('CLINICID')],
    },
  },
  {
    name: '在线问政收入报表',
    code: 'ih_zxwzsrbb',
    schema: ['visitStartDate'],
    defaultQueryObj: {
      startTime: '',
      endTime: ''
      // staffId: localStorage.getItem('USERID'),
      // orgId: [localStorage.getItem('CLINICID')],
    },
  },
]

// code: wh_cgrkhzb
export const apiName = {
  'wh_cgrkhzb': {
    apiName: 'listSummary',
    exportType: '1',
    reportName: '采购入库汇总表',
  },
  'wh_cgrkmxb': {
    apiName: 'listDetailed',
    exportType: '2',
    reportName: '采购入库明细表',
    status: '11'
  },
  'wh_cgthhzb': {
    apiName: 'listSalesreturncount',
    exportType: '3',
    reportName: '采购退货汇总表',
    status: '12'
  },
  'wh_cgthmxb': {
    apiName: 'listSalesreturndetail',
    exportType: '4',
    reportName: '采购退货明细表',
    status: '13'
  },
  'wh_gyswlhzb': {
    apiName: 'suppliercontactscount',
    exportType: '5',
    reportName: '供应商往来汇总表',
    status: '14'
  },
  'wh_gyswlmxb': {
    apiName: 'suppliercontactsdetail',
    exportType: '6',
    reportName: '供应商往来明细表',
    status: '15'
  },
  'wh_fhhzb': {
    apiName: 'dispensemedicinecount',
    exportType: '7',
    reportName: '发货汇总表',
  },
  'wh_fhmxb': {
    apiName: 'dispensemedicinedetail',
    exportType: '8',
    reportName: '发货明细表',
    status: '17'
  },
  'wh_thhzb': {
    apiName: 'returnmedicinecount',
    exportType: '9',
    reportName: '退货汇总表',
    status: '18'
  },
  'wh_thmxb': {
    apiName: 'returnmedicinedetail',
    exportType: '10',
    reportName: '退货明细表',
    status: '19'
  },
  'wh_wppccx': {
    apiName: 'stockMaterialByBatch',
    exportType: '12',
    reportName: '在库物品批次查询表',
    status: '20'
  },
  'wh_crkywhz': {
    apiName: 'inAndOutStockGather',
    exportType: '13',
    reportName: '出入库业务汇总',
    status: '21'
  },
  'wh_crkywls': {
    apiName: 'inAndOutStockFlow',
    exportType: '14',
    reportName: '出入库业务流水',
    status: '22'
  },
  'wh_ysfwfhbb': {
    apiName: 'paidButNotOutStockMaterial',
    exportType: '15',
    reportName: '已收费未发货报表',
    status: '23'
  },
  'wh_jxcbb': {
    apiName: 'inventory',
    exportType: '16',
    reportName: '进销存报表',
    status: '24'
  },
  'wh_zkwpb': {
    apiName: 'stockMaterial',
    exportType: '11',
    reportName: '在库物品表'
  },
}
