import SystemSet from '@/systemset/page/systemset'
import Welcome from '@/login/page/welcome'

// 打印机设置
import PrinterSetList from '@/systemset/page/printerset/printersetlist'
import PrinterSet from '@/systemset/page/printerset/printerset'

// 值集管理
import SystypeRouter from '@/warehouse/page/systype/router/index.js'

// 权限（角色和资源)
import AuthRouter from '@/auth/router/index.js'

// 运维
import Operation from '../page/system/operation.vue'
import OperationDetail from '../page/system/operationdetail.vue'
import OperationQueueDetail from '../page/system/operationqueuedetail.vue'
import DataSource from '../page/system/datasource.vue'
import DataSourceOld from '../page/system/datasource-old'
import SequenceRule from '../page/system/sequencerule.vue'
import SequenceRuleDetail from '../page/system/sequenceruledetail.vue'
import Rules from '../page/system/rules.vue'
import RulesDetail from '../page/system/rulesdetail.vue'
import RulesTemplate from '../page/system/rulestemplate.vue'
import RulesTemplateDetail from '../page/system/rulestemplatedetail.vue'

// 分析报表注册
import BiRouter from '@/bi/router/index.js'

import FormsRouter from '@/form/router/formrouter.js'
import ProcessList from '@/systemset/page/process/processlist'
import ProcessDetail from '@/systemset/page/process/processdetail'
import ProcessInstance from '@/systemset/page/process/processinstance'
import ProcessInstanceDetail from '@/systemset/page/process/processinstancedetail'

// 我的待办
import Approval from '@/message/page/approval.vue'

// 数据交换
import dataswitch from '@/systemset/page/dataswitch/dataswitch'
import datachannel from '@/systemset/page/dataswitch/datachannel'
import rule from '@/rule/router/index'

// 接口权限
import InterfaceManage from '@/systemset/page/interface/index'
import InterfaceSys from '@/systemset/page/interface/sys'
import InterfaceMenu from '@/systemset/page/interface/menu'

// 价格维度配置
import RulesPrices from '@/systemset/page/priceset/price'
// 客户编号设置
import Membernumberlist from '@/crm/page/membernumber/membernumberlist'
import Membernumberedit from '@/crm/page/membernumber/membernumberedit'

// 其他功能
import DataImport from '../page/otherfeature/data-import.vue'

let routers = [
  {
    path: '/systemset',
    redirect: '/systemset/welcome',
    component: SystemSet,
    meta: {
      space: 'systemset'
    },
    children: [
      ...rule,
      {
        path: '/approval/:processInstanceId',
        component: Approval
      },
      {
        path: 'welcome',
        name: 'welcome',
        meta: {
          full: true,
        },
        component: Welcome
      },
      ...FormsRouter,
      ...SystypeRouter,
      ...AuthRouter,
      ...BiRouter({
        editMode: true,
        moduleSelect: true,
        searchMode: true,
        addMode: true,
        // secActiveIndex: '/systemset/reportlist'
      }),
      {
        path: 'printersetlist',
        name: 'printersetlist',
        component: PrinterSetList
      },
      {
        path: 'printerset/:id?',
        name: 'printerset',
        component: PrinterSet,
        meta: {
          thirdActiveIndex: '/systemset/printersetlist',
        }
      },
      {
        path: 'operation',
        name: 'operation',
        component: Operation,
      },
      {
        path: 'operation/detail/:id?',
        name: 'operationDetail',
        component: OperationDetail,
        meta: { thirdActiveIndex: '/systemset/operation' }
      },
      {
        path: 'operation/queue/detail/:operationId/:id?',
        name: 'operationQueueDetail',
        component: OperationQueueDetail,
        meta: { thirdActiveIndex: '/systemset/operation' }
      },
      {
        path: 'dataSource',
        name: 'dataSource',
        component: DataSource,
      },
      {
        path: 'dataSourceOld',
        name: 'dataSourceOld',
        component: DataSourceOld,
      },
      {
        path: 'sequenceRule',
        name: 'sequenceRule',
        component: SequenceRule,
      },
      {
        path: 'sequenceRule/detail/:pattern/:id?',
        name: 'sequenceRuleDetail',
        component: SequenceRuleDetail,
        meta: { thirdActiveIndex: '/systemset/sequenceRule' }
      },
      {
        path: 'rules',
        name: 'rules',
        component: Rules,
      },
      {
        path: 'rules/detail/:pattern/:id?',
        name: 'rulesDetail',
        component: RulesDetail,
        meta: { thirdActiveIndex: '/systemset/rules' }
      },
      {
        path: 'rulesTemplate',
        name: 'rulesTemplate',
        component: RulesTemplate,
      },
      {
        path: 'rulesTemplate/detail/:pattern/:id?',
        name: 'rulesTemplateDetail',
        component: RulesTemplateDetail,
        meta: { thirdActiveIndex: '/systemset/rulesTemplate' }
      },
      {
        path: 'rulesprices',
        name: 'rulesprices',
        component: RulesPrices
      },
      {
        path: 'sysprocesslist',
        name: 'sysprocesslist',
        component: ProcessList,
      },
      {
        path: 'sysprocessdetail',
        name: 'sysprocessdetail',
        component: ProcessDetail,
      },
      {
        path: 'sysprocessinstance',
        name: 'sysprocessinstance',
        component: ProcessInstance,
      },
      {
        path: 'sysprocessinstancedetail/:instanceId/:processType',
        name: 'sysprocessinstancedetail',
        component: ProcessInstanceDetail,
      },
      {
        path: 'dataswitch',
        name: 'dataswitch',
        component: dataswitch
      },
      {
        path: 'reportchannel',
        name: 'reportchannel',
        component: datachannel
      },
      {
        path: 'interface',
        name: 'interfaceManage',
        component: InterfaceManage
      },
      {
        path: 'interfacesys',
        name: 'interfacesys',
        component: InterfaceSys
      },
      {
        path: 'interfacemenu',
        name: 'interfacemenu',
        component: InterfaceMenu,
        // meta: { thirdActiveIndex: '/systemset/interface' }
      },
      {
        path: 'viewmanage',
        name: 'viewmanage',
        component: dataswitch,
        // meta: { thirdActiveIndex: '/systemset/interface' }
      },
      {
        path: 'member',
        name: 'membernumberlist',
        component: Membernumberlist
      },
      {
        path: 'membernumberedit',
        name: 'membernumberedit',
        component: Membernumberedit,
        meta: {
          thirdActiveIndex: '/systemset/member'
        }
      },
      {
        path: 'dataImport',
        name: 'dataImport',
        component: DataImport,
        meta: {
          thirdActiveIndex: '/systemset/dataImport'
        }
      },
      // {
      //   path: 'techthirdconfig',
      //   name: 'techthirdconfig',
      //   component: TechThirdConfig,
      //   meta: {
      //     thirdActiveIndex: '/systemset/techthirdconfig'
      //   }
      // },
    ]
  }
]

export default routers
