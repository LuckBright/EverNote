import RoleList from '@/auth/page/rolelist'
import Role from '@/auth/page/role'
// import ResourceListOld from '@/auth/page/resourcelist'
import ResourceList from '@/auth/page/reslist'
import Resource from '@/auth/page/resource'
// import ResourceHelp from '@/auth/page/res.help'
import ResSql from '@/auth/page/res.sql'
import RoleDataaccess from '@/auth/page/role.dataaccess'

export default [
  {
    path: 'roles',
    name: 'roles',
    component: RoleList
  },
  {
    path: 'roles/:id?/:num?',
    name: 'roleAdd',
    component: Role,
    meta: {
      thirdActiveIndex: '/systemset/roles'
    }
  },
  {
    path: 'roledata/:id?/:type?',
    name: 'roleDataaccess',
    component: RoleDataaccess,
    meta: {
      thirdActiveIndex: '/systemset/roles'
    }
  },
  {
    path: 'resources',
    name: 'resources',
    component: ResourceList
  },
  // {
  //   path: 'resourcesold',
  //   name: 'resourcesold',
  //   component: ResourceListOld
  // },
  {
    path: 'resources/:id?/:type?',
    name: 'resourcesAdd',
    component: Resource,
    meta: {
      thirdActiveIndex: '/systemset/resources'
    }
  },
  // {
  //   path: 'reshelp/:rid?/:rName?',
  //   name: 'resourcesHelp',
  //   component: ResourceHelp,
  //   meta: {
  //     thirdActiveIndex: '/systemset/resources'
  //   }
  // },
  {
    path: 'ressql',
    name: 'resSql',
    component: ResSql,
    meta: {
      thirdActiveIndex: '/systemset/resources'
    }
  },
]
