// 930 组织机构人员科室
// -------------------------------------------------------------------------------------
// 930 组织机构人员科室
import OrganizationTree from '@/manages/page/organization/views/org/org'
import OrganizationDetail from '@/manages/page/organization/views/org/detail'
import OrganizationWebhDetail from '@/manages/page/organization/views/org/webhdetail'
import OrganizationSignDetail from '@/manages/page/organization/views/org/signdetail'
import DepartmentTree from '@/manages/page/organization/views/dept/dept'
import DepartmentDetail from '@/manages/page/organization/views/dept/detail'
import SubjectTree from '@/manages/page/organization/views/subject/subject'
// import OrgSubjectAuthTree from '@/manages/page/organization/views/subject/orgsubjectauth'
import SubjectAuthTree from '@/manages/page/organization/views/subject/subjectauth'
import SubjectDetail from '@/manages/page/organization/views/subject/detail'
import Staff from '@/manages/page/organization/views/staff/staff'
import StaffDetail from '@/manages/page/organization/views/staff/detail'
import StaffWebhDetail from '@/manages/page/organization/views/staff/webhdetail'
import StaffAuth from '@/manages/page/organization/views/staff/staffauth'
import StaffPunishList from '@/manages/page/organization/views/staff/staffpunishlist'
import StaffPunishDetail from '@/manages/page/organization/views/staff/staffpunishdetail'
import SubjectManages from '@/manages/page/organization/views/subject/subjectmanages'
import OrgSubjectTree from '@/manages/page/organization/views/subject/orgsubjecttree'
// -------------------------------------------------------------------------------------

// 930 组织机构人员科室
const organizationRouteList = [
  {
    path: 'org/org',
    name: 'org-org',
    component: OrganizationTree,
    meta: {
      h: true,
    },
  },
  {
    path: 'org/org/detail/:orgId/:type/:from?',
    name: 'org-org-detail',
    component: OrganizationDetail,
    meta: {
      secActiveIndex: '/manages/org/org',
    },
  },
  {
    path: 'org/org/webh/:orgId/:tenantId',
    name: 'org-org-webh',
    component: OrganizationWebhDetail,
    meta: {
      secActiveIndex: '/manages/org/org',
    },
  },
  {
    path: 'org/org/sign/:orgId',
    name: 'org-org-sign',
    component: OrganizationSignDetail,
  },
  {
    path: 'org/dept/:orgId',
    name: 'org-dept',
    component: DepartmentTree,
    meta: {
      h: true,
      secActiveIndex: '/manages/org/org',
    },
  },
  {
    path: 'org/dept/detail/:orgId/:deptId/:type',
    name: 'org-dept-detail',
    component: DepartmentDetail,
  },
  {
    path: 'org/subject/:orgId', // 科室管理，传orgId时为机构科室管理，传-1时为集团科室管理
    name: 'org-subject-manage',
    component: SubjectTree,
    meta: {
      h: true,
    },
  },
  // {
  //   path: 'org/orgSubjectAuth/:orgId', // 以机构为标准，批量将科室与机构关联 或者说 批量给机构授权
  //   name: 'org-subject-auth',
  //   component: OrgSubjectAuthTree,
  // },
  {
    path: 'org/subjectAuth', // 以集团科室为基准，批量给机构授权
    name: 'org-subject',
    component: SubjectAuthTree,
    meta: {
      h: true,
    },
  },
  {
    // http://dev4a.everjiankang.com.cn/web/systemset/index.html#/wharehouse/subject/manages
    path: 'subject/manages',
    name: 'subject-manages',
    component: SubjectManages,
    redirect: {name: 'subjectManagesList'},
    children: [
      {
        // 直接展示当前登录机构的科室
        // http://dev4a.everjiankang.com.cn/web/systemset/index.html#/wharehouse/subject/manages/subjectList
        path: 'subjectList',
        name: 'subjectManagesList',
        component: OrgSubjectTree,
      },
      {
        // http://dev4a.everjiankang.com.cn/web/systemset/index.html#/wharehouse/subject/manages/subjectAuth
        path: 'subjectAuth',
        name: 'subjectManagesAuth',
        component: SubjectAuthTree,
      },
    ],
    meta: {
      h: true,
    }
  },
  {
    path: 'org/subject/detail/:orgId/:subjectId/:type/:isTenant/:from?',
    name: 'org-subject-detail',
    component: SubjectDetail,
    meta: {
      secActiveIndex: '/manages/org/subject',
    },
  },
  {
    path: 'org/staff',
    name: 'org-staff',
    component: Staff,
    meta: {
      h: true,
    },
  },
  {
    path: 'org/staff/detail/:id/:type/:from?',
    name: 'org-staff-detail',
    component: StaffDetail,
    meta: {
      secActiveIndex: '2', // 在三级菜单的页面里再跳转页面时，二级菜单通过此参数高亮
      thirdActiveIndex: '/manages/org/staff',
    },
  },
  {
    path: 'org/staff/webhdetail/:id/',
    name: 'org-staff-webh-detail',
    component: StaffWebhDetail,
    meta: {
      secActiveIndex: '2',
      thirdActiveIndex: '/manages/org/staff',
    },
  },
  {
    path: 'org/staffAuth',
    name: 'org-staff-auth',
    component: StaffAuth,
    meta: {
      h: true,
    },
  },
  {
    path: 'org/staff/punish/:id/',
    name: 'org-staff-punish-list',
    component: StaffPunishList,
  },
  {
    path: 'org/staff/punish/detail/:id/:type/:staffId',
    name: 'org-staff-punish-detail',
    component: StaffPunishDetail,
    meta: {
      h: true,
    },
  },
]
export default organizationRouteList
