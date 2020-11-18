import Reportsets from '@/bi/page/reportlist'
// import ReportView from '@/bi/page/report-view'
// import ReportDetailsList from '@/bi/page/reportdetails/reportdetailslist'
// 报表详情
// import ReportDetail from '@/bi/page/reportdetail/report.detail'
import indexcatalog from '@/bi/page/catalog'

let RouterArr = function (opt = {
  editMode: false,  // 是否可以编辑 (控制行内是否出现删除和编辑)
  moduleSelect: false,  // 是否可以选择模块搜索，配合某些业务内只查询一个模块下的报表的需求
  searchMode: false,  // 是否有查询和新增区域 某些页面纯表格展示，不需要搜索条件区域
  addMode: false, // 是否显示添加按钮
  thirdActiveIndex: '', // 菜单高亮补丁
  secActiveIndex: '',  // 菜单高亮补丁
}) {
  return [
    {
      path: 'reportlist/:code?',
      name: 'reportsets',
      component: Reportsets,
      meta: {
        editMode: opt.editMode,
        moduleSelect: opt.moduleSelect,
        searchMode: opt.searchMode,
        secActiveIndex: opt.secActiveIndex,
        addMode: opt.addMode
      }
    },
    // 原来的报表详情页面会被替换掉
    // {
    //   path: 'reportdetail/view/:code?',
    //   name: 'ReportView',
    //   component: ReportView,
    //   meta: {
    //     thirdActiveIndex: opt.thirdActiveIndex
    //   }
    // },
    // {
    //   path: 'reportdetail/:moduleName/:id',
    //   name: 'rcmReportDetails',
    //   component: ReportDetailsList,
    //   meta: {
    //     thirdActiveIndex: opt.thirdActiveIndex
    //   }
    // },
    // 替换原来的报表详情页面
    // {
    //   path: 'reportview/:code',
    //   name: 'reportView1',
    //   component: ReportDetail,
    //   meta: {
    //     h: true
    //   }
    // },
    {
      path: 'catalog/:code?',
      name: 'bicatalog',
      component: indexcatalog,
      meta: {
        showCodeList: ['outpatient', 'medical_skills', 'hospitalization', 'medical_supplies', 'warehouse', 'internet_hospital', 'insurance'],
        secActiveIndex: opt.secActiveIndex
      }
    },
  ]
}

export default RouterArr
