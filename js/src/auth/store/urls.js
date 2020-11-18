
import { prefix } from '@/util/urls'

export default {
  dataRowAccess: {
    getDataRowAccesss: { url: 'dataRowAccess/getDataRowAccesss', isStatic: false, prefix: prefix.core },
    createDataRowAccess: { url: 'dataRowAccess/createDataRowAccess', isStatic: false, prefix: prefix.core },
    deleteDataRowAccess: { url: 'dataRowAccess/deleteDataRowAccess', isStatic: false, prefix: prefix.core },
    updateDataRowAccess: { url: 'dataRowAccess/updateDataRowAccess', isStatic: false, prefix: prefix.core },
    getRowDataAccessByRoleId: { url: 'dataRowAccess/getRowDataAccessByRoleId', isStatic: false, prefix: prefix.core }, // 通过角色ID和菜单ID和数据类型查询行数据权限
    giveDataAccess: { url: 'dataRowAccess/giveDataAccess', isStatic: false, prefix: prefix.core }, // 赋予角色数据权限
  },
  dataColAccess: {
    getDataColAccesss: { url: 'dataColAccess/getDataColAccesss', isStatic: false, prefix: prefix.core },
    createDataColAccess: { url: 'dataColAccess/createDataColAccess', isStatic: false, prefix: prefix.core },
    deleteDataColAccess: { url: 'dataColAccess/deleteDataColAccess', isStatic: false, prefix: prefix.core },
    updateDataColAccess: { url: 'dataColAccess/updateDataColAccess', isStatic: false, prefix: prefix.core },
    getColDataAccessByRoleId: { url: 'dataColAccess/getColDataAccessByRoleId', isStatic: false, prefix: prefix.core }, // 查询角色下列数据权限
  },
  sysMenu: {
    del: { url: 'sys/menu/del', isStatic: false, prefix: prefix.core },
  },
  report: {
    // 查询角色所有报表权限
    getReportIdListByRoleId: '/platform-extend/reportRoleRelation/getReportIdListByRoleId',
    // 修改角色和报表关系
    reportModify: '/platform-extend/reportRoleRelation/modify',
    // 获取当前用户可用报表
    getReportInfo: '/platform-extend/reportRoleRelation/getReportInfo'
  }
}
