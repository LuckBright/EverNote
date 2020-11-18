// 库房工作站数据结构
const benchName = '库房工作站'
// 药房
export const EVER_MENU_SEC_STORAGES_DRUG = {
  benchName: benchName,
  navList: [
    {
      name: '首页',
      index: '/storages/home',
      auth: 'Auth_menu_treasury_indexpage'
    },
    {
      name: '业务管理',
      index: '4',
      auth: 'Auth_menu_treasury_businessmanagement',
      children: [
        {
          name: '出库',
          index: '/storages/output',
          auth: 'Auth_menu_treasury_businessmanagement_output'
        },
        {
          name: '入库',
          index: '/storages/entry',
          auth: 'Auth_menu_treasury_businessmanagement_entry'
        },
        {
          name: '业务',
          index: '/storages/business',
          auth: 'Auth_menu_treasury_businessmanagement_business'
        },
        {
          name: '预警',
          index: '/storages/warning',
          auth: 'Auth_menu_treasury_businessmanagement_warning'
        },
        {
          name: '盘点',
          index: '/storages/check',
          auth: 'Auth_menu_treasury_businessmanagement_inventory'
        },
        {
          name: '货位管理',
          index: '/storages/commoditymanage/commoditylocations',
          auth: 'Auth_menu_treasury_businessmanagement_commoditylocation'
        },
        {
          name: '编码工具',
          index: '/storages/tools',
          auth: 'Auth_menu_treasury_businessmanagement_tool'
        }
      ]
    },
    {
      name: '数据查询',
      index: '/storages/query',
      auth: 'Auth_menu_treasury_businessmanagement_dataquery'
    },
    {
      name: '报表',
      index: '/storages/reportform',
      auth: 'Auth_menu_treasury_reportform',
      children: [
        {
          name: '门诊报表',
          index: '/storages/reportform/outpatient',
          auth: 'Auth_menu_treasury_reportform_outpatient'
        },
        {
          name: '住院报表',
          index: '/storages/reportform/hospitalization',
          auth: 'Auth_menu_treasury_reportform_hospitalization'
        },
        {
          name: '进销存报表',
          index: '/storages/reportform/inventory',
          auth: 'Auth_menu_treasury_reportform_inventory'
        },
        {
          name: '综合报表',
          index: '/storages/reportform/synthesize',
          auth: 'Auth_menu_treasury_reportform_synthesize'
        }
      ]
    }
  ],
  navType: '1001'
}
// 设备
export const EVER_MENU_SEC_STORAGES_EQUIP = {
  benchName: benchName,
  navList: [
    {
      name: '首页',
      index: '/storages/home',
      auth: 'Auth_menu_treasury_indexpage'
    },
    {
      name: '业务管理',
      index: '4',
      auth: 'Auth_menu_treasury_businessmanagement',
      children: [
        {
          name: '入库',
          index: '/storages/entry',
          auth: 'Auth_menu_treasury_businessmanagement_entry'
        },
        {
          name: '预警',
          index: '/storages/warning',
          auth: 'Auth_menu_treasury_businessmanagement_warning'
        },
        {
          name: '工具',
          index: '/storages/tools',
          auth: 'Auth_menu_treasury_businessmanagement_tool'
        }
      ]
    },
    {
      name: '数据查询',
      index: '/storages/query',
      auth: 'Auth_menu_treasury_businessmanagement_dataquery'
    }
  ],
  navType: '298'
}
// 耗材
export const EVER_MENU_SEC_STORAGES_MATERIAL = {
  benchName: benchName,
  navList: [
    {
      name: '首页',
      index: '/storages/home',
      auth: 'Auth_menu_treasury_indexpage'
    },
    {
      name: '业务管理',
      index: '4',
      auth: 'Auth_menu_treasury_businessmanagement',
      children: [
        {
          name: '出库',
          index: '/storages/output',
          auth: 'Auth_menu_treasury_businessmanagement_output'
        },
        {
          name: '入库',
          index: '/storages/entry',
          auth: 'Auth_menu_treasury_businessmanagement_entry'
        },
        {
          name: '业务',
          index: '/storages/business',
          auth: 'Auth_menu_treasury_businessmanagement_business'
        },
        {
          name: '预警',
          index: '/storages/warning',
          auth: 'Auth_menu_treasury_businessmanagement_warning'
        },
        {
          name: '盘点',
          index: '/storages/check',
          auth: 'Auth_menu_treasury_businessmanagement_inventory'
        },
        {
          name: '工具',
          index: '/storages/tools',
          auth: 'Auth_menu_treasury_businessmanagement_tool'
        },
        {
          name: '货位管理',
          index: '/storages/commoditymanage/commoditylocations',
          auth: 'Auth_menu_treasury_businessmanagement_commoditylocation2'
        }
      ]
    },
    {
      name: '数据查询',
      index: '/storages/query',
      auth: 'Auth_menu_treasury_businessmanagement_dataquery'
    }
  ],
  navType: '294'
}
// 血库
export const EVER_MENU_SEC_STORAGES_BLOOD = {
  benchName: benchName,
  navList: [
    {
      name: '首页',
      index: '/blood/home',
      auth: 'Auth_menu_treasury_bloodbank'
    },
    {
      name: '用血管理',
      index: '/blood/manage',
      auth: 'Auth_menu_treasury_bloodbank_manage',
      children: [
        {
          name: '备血申请',
          index: '/blood/manage/applylist',
          auth: 'Auth_menu_treasury_bloodbank_manage_applylist'
        },
        {
          name: '交叉配血',
          index: '/blood/manage/matchinglist',
          auth: 'Auth_menu_treasury_bloodbank_manage_matchinglist'
        }
      ]
    },
    {
      name: '入库',
      index: '/blood/entry',
      auth: 'Auth_menu_treasury_bloodbank_entry'
    },
    {
      name: '查询',
      index: '/blood/query',
      auth: 'Auth_menu_treasury_bloodbank_query',
      children: [
        {
          name: '库存查询',
          index: '/blood/query/bloodinventory',
          auth: 'Auth_menu_treasury_bloodbank_query_bloodinventory'
        },
        {
          name: '过期查询',
          index: '/blood/query/expire',
          auth: 'Auth_menu_treasury_bloodbank_query_expire'
        },
        {
          name: 'Rh(D)阴性查询',
          index: '/blood/query/rhsearch',
          auth: 'Auth_menu_treasury_bloodbank_query_rhsearch'
        }
      ]
    },
    {
      name: '配置',
      index: '/blood/configure',
      auth: 'Auth_menu_treasury_bloodbank_configuration',
      children: [
        {
          name: '效期预警',
          index: '/blood/configure/bloodwarning',
          auth: 'Auth_menu_treasury_bloodbank_configuration_bloodwarning'
        },
        {
          name: '品种编码',
          index: '/blood/configure/varietycode',
          auth: 'Auth_menu_treasury_bloodbank_configuration_varietycode'
        },
        {
          name: '血型编码',
          index: '/blood/configure/bloodtypecode',
          auth: 'Auth_menu_treasury_bloodbank_configuration_bloodtypecode'
        }
      ]
    }
  ],
  navType: '1002'
}
