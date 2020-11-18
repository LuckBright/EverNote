/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-03 10:47:46
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-03 16:14:58
 */

const orgId = localStorage.getItem('CLINICID')
export const apiOptions = [
  {
    id: '01',
    name: '/warehouse/storageRoom/getStorageRoomList/',
    subtitle: '/warehouse/supplyRelation/getStorageRoomList/',
    paramsKeys: ['storageRoomId'],
    afterQuery: function (options, cur) {
      return options.filter(item => item.id !== cur)
    }
  },
  {
    id: '02',
    prefix: 'subject',
    format: {
      id: 'orgSubjectCode',
      name: 'orgSubjectName'
    },
    params: { 'pagesize': 10000, 'usePermissionStatus': 'Y', 'systemType': 106, 'orgIdList': [orgId], 'filterOverdueRecord': true, 'offset': 0, 'orgSubjectNameList': [''] },
    name: 'outGetTenantSubjectListByCondition',
  },
  {
    id: '03',
    format: {
      name: 'sickAreaName'
    },
    name: '/thc-platform-core/out/sickArea/getSickAreaListByCondition' // urls被全局引用，添加不生效
  },
]
