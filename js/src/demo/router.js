import demo from './demo'
import layout from './pageLayout/layout'
import create from './pageLayout/create'
import edit from './pageLayout/edit'
import rowBox from './pageLayout/rowbox'
import dialog from './pageLayout/dialog'
import scroll from './pageLayout/loadscroll'
import testform from './testform'
import medicalrecordplugin from './pageLayout/medicalrecordplugin'
import phrplugin from './pageLayout/phrplugin'
// import medicalrecord from './pageLayout/medicalrecord/index'
import print from './print'
import slidewindowdemo from './pageLayout/slidewindowdemo'
import Pagerdemo from './pageLayout/pagerdemo'
import PagerAddress from './pageLayout/addressdemo'
import Selectdemo from './pageLayout/selectdemo'
import Baseremotedemo from './pageLayout/multipleselectdemo/remotemultipleselectdemo'
import BusDemo from './pageLayout/busdemo/test.vue'
import DateDemo from './pageLayout/datedemo.vue'
import PatientSelectDemo from './pageLayout/patientselectdemo.vue'
import TableDemo from './pageLayout/tabledemo/tabledemo.vue'
import UploadDemo from './pageLayout/uploaddemo/uploaddemo.vue'
import DownloadDemo from './pageLayout/downloaddemo.vue'
import FormDemo from './pageLayout/formdemo/formdemo.vue'
import EverBreadcrumbDemo from './pageLayout/everbreadcrumbdemo/everbreadcrumbdemo.vue'
import EverTableDemo from './pageLayout/evertabledemo/evertabledemo.vue'
import BaseSubjectSelectDemo from './pageLayout/subjectselectdemo/subjectselectdemo'
import BaseOrgSelectDemo from './pageLayout/orgselectdemo/orgselectdemo'
import BaseStaffSelectDemo from './pageLayout/staffselectdemo/staffselectdemo'
import BaseSpaceDemo from './pageLayout/spaceselectdemo/spacedemo'
import FixedHeaderTable from './pageLayout/evertabledemo/demo/fixedheadertable.vue'
import ManyTable from './pageLayout/evertabledemo/demo/manytable.vue'
import SearchAutoTable from './pageLayout/evertabledemo/demo/searchautotable'
import SearchManualTable from './pageLayout/evertabledemo/demo/searchmanualtable'
import SearchMixinTable from './pageLayout/evertabledemo/demo/searchmixintable'
import SearchSimpleTable from './pageLayout/evertabledemo/demo/searchsimpletable'
import SearchSimpleDialogTable from './pageLayout/evertabledemo/demo/searchsimpledialogtable'
import PrintDemo from '@/components/jcpprint'
import PageDemo from './pageLayout/pagedemo'
import ContactsDemo from './pageLayout/contactsdemo.vue'
import FiltersDemo from './pageLayout/filtersdemo.vue'
import EditorDemo from './pageLayout/editor/editor.demo'
import Test from './pageLayout/test'
import CompTest from './pageLayout/compdemo/parent'
import UserAuthorizeDemo from './pageLayout/userauthorizedemo'
import Sendmsgdemo from './pageLayout/sendmsgdemo'
import SystypeDemo from './pageLayout/systypedemo'
import Reportdemo from './pageLayout/reportdemo'
import ProcessflowDemo from './pageLayout/processflowdemo'
import SchemaManage from './pageLayout/schema.manage'
import ConfirmDemo from './pageLayout/confirmdemo'
import NumberDemo from './pageLayout/numberdemo'
import NoDataDemo from './pageLayout/nodatademo'
import ReportDialogdemo from './pageLayout/reportdialogdemo'
import ExportSqlDemo from './pageLayout/exportsqldemo'
import tableelDemo from './pageLayout/tabledemo/table'
import MapDemo from '@/demo/pageLayout/mapdemo'
import MapDemo1 from '@/demo/pageLayout/mapdemo1'
import AgeDemo from './pageLayout/agedemo'
import IconDemo from './pageLayout/icondemo'
import I18nDemo from './pageLayout/i18ndemo'
import Idcardreaddemo from './pageLayout/idcardreaddemo'
import Iccardreaddemo from './pageLayout/iccardreaddemo'
import BaseCommonHeadDemo from './pageLayout/commonheaddemo/basecommonheaddemo'
import HelpDemo from './pageLayout/helpdemo'
import CommonDemoTest from '@/demo/component/common-demo/CommonDemoTest'
import RightclkDemo from './pageLayout/rightclkdemo'

export default [
  {
    path: '/',
    redirect: '/demo/layout/demo'
  },
  {
    path: '/demo/',
    redirect: '/demo/layout/demo'
  },
  {
    path: '/testform/:formid?',
    component: testform
  },
  {
    path: '/demo/layout',
    component: layout,
    children: [
      {
        path: 'demo',
        component: demo
      },
      {
        path: 'create',
        component: create
      },
      {
        path: 'edit/:id',
        component: edit
      },
      {
        path: 'rowbox',
        component: rowBox
      },
      {
        path: 'dialog',
        component: dialog
      },
      {
        path: 'scroll',
        component: scroll
      },
      {
        path: 'medicalrecordplugin',
        component: medicalrecordplugin
      },
      {
        path: 'phrplugin',
        component: phrplugin
      },
      {
        path: 'print',
        component: print
      },
      {
        path: 'slidewindowdemo',
        component: slidewindowdemo
      },
      {
        path: 'pagerdemo',
        component: Pagerdemo
      },
      {
        path: 'address',
        component: PagerAddress
      },
      {
        path: 'select',
        component: Selectdemo
      },
      {
        path: 'baseremotedemo',
        component: Baseremotedemo
      },
      {
        path: 'bus',
        component: BusDemo
      },
      {
        path: 'date',
        component: DateDemo
      },
      {
        path: 'patientselect',
        component: PatientSelectDemo
      },
      {
        path: 'table',
        component: TableDemo
      },
      {
        path: 'evertable',
        component: EverTableDemo
      },
      {
        path: 'evertabledemo/fixedheadertable/:id',
        component: FixedHeaderTable
      },
      {
        path: 'evertabledemo/fixedheadertable',
        component: FixedHeaderTable
      },
      {
        path: 'evertabledemo/manytable',
        component: ManyTable
      },
      {
        path: 'evertabledemo/searchautotable',
        component: SearchAutoTable
      },
      {
        path: 'evertabledemo/searchmanualtable',
        component: SearchManualTable
      },
      {
        path: 'evertabledemo/searchmixintable',
        component: SearchMixinTable
      },
      {
        path: 'evertabledemo/searchsimpletable',
        component: SearchSimpleTable
      },
      {
        path: 'evertabledemo/searchsimpledialogtable',
        component: SearchSimpleDialogTable
      },
      {
        path: 'basesubjectselectdemo',
        component: BaseSubjectSelectDemo
      },
      {
        path: 'baseorgselectdemo',
        component: BaseOrgSelectDemo
      },
      {
        path: 'basestaffselectdemo',
        component: BaseStaffSelectDemo
      },
      {
        path: 'basespacedemo',
        component: BaseSpaceDemo
      },
      {
        path: 'form',
        component: FormDemo
      },
      {
        path: 'breadcrumbdemo',
        component: EverBreadcrumbDemo
      },
      {
        path: 'uploaddemo',
        component: UploadDemo
      },
      {
        path: 'downloaddemo',
        component: DownloadDemo
      },
      {
        path: 'printtest',
        component: PrintDemo
      },
      {
        path: 'page',
        component: PageDemo
      },
      {
        path: 'contacts',
        component: ContactsDemo
      },
      {
        path: 'filters',
        component: FiltersDemo
      },
      {
        path: 'editordemo',
        component: EditorDemo
      },
      {
        path: 'test',
        component: Test
      },
      {
        path: 'comptest',
        component: CompTest
      },
      {
        path: 'userauthorize',
        component: UserAuthorizeDemo
      },
      {
        path: 'sendmsgdemo',
        component: Sendmsgdemo
      },
      {
        path: 'systypedemo',
        component: SystypeDemo
      },
      {
        path: 'reportdemo',
        component: Reportdemo
      },
      {
        path: 'processflowdemo',
        component: ProcessflowDemo
      },
      {
        path: 'schema',
        component: SchemaManage
      },
      {
        path: 'confirmdemo',
        component: ConfirmDemo
      },
      {
        path: 'numberdemo',
        component: NumberDemo
      },
      {
        path: 'nodatademo',
        component: NoDataDemo
      },
      {
        path: 'reportdialogdemo',
        component: ReportDialogdemo
      },
      {
        path: 'exportsqldemo',
        component: ExportSqlDemo
      },
      {
        path: 'tableel',
        component: tableelDemo
      },
      {
        path: 'mapdemo',
        component: MapDemo
      },
      {
        path: 'mapdemo1',
        component: MapDemo1
      },
      {
        path: 'agedemo',
        component: AgeDemo
      },
      {
        path: 'icondemo',
        component: IconDemo
      },
      {
        path: 'i18ndemo',
        component: I18nDemo
      },
      {
        path: 'idcardreaddemo',
        component: Idcardreaddemo
      },
      {
        path: 'iccardreaddemo',
        component: Iccardreaddemo
      },
      {
        path: 'basecommonheaddemo',
        component: BaseCommonHeadDemo
      },
      {
        path: 'helpdemo',
        component: HelpDemo
      },
      {
        path: 'CommonDemoTest',
        component: CommonDemoTest
      },
      {
        path: 'rightclkdemo',
        component: RightclkDemo
      },
    ]
  }
]
