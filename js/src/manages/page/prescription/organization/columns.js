export default [
  {
    prop: 'managerPermission',
    slotName: 'managerPermission',
    label: '管理权',
    width: '90px',
    display: true,
    render (h, ctx, row) {
      return h('el-switch', {
        props: {
          value: !!row.managerPermission,
          disabled: (row.treeIndex === '0')
        },
        on: {
          input (val) {
            row.managerPermission = val
          },
          change: (val) => {
            this.changeOrgService(row, val, 'managerPermission')
          }
        }
      })
    }
  }, {
    prop: 'usePermission',
    slotName: 'usePermission',
    label: '使用权',
    width: '90px',
    display: true,
    render (h, ctx, row) {
      return h('el-switch', {
        props: {
          value: !!row.usePermission
          // disabled: this.clinicType === '0'
        },
        on: {
          input (val) {
            row.usePermission = val
          },
          change: (val) => {
            this.changeOrgService(row, val, 'usePermission')
          }
        }
      })
    }
  }, {
    prop: 'openProviderRList',
    slotName: 'openProviderRList',
    label: '开单科室',
    width: '140px',
    display: true,
    render (h, ctx, row) {
      return officeRender.call(this, h, row, 'openProviderRList')
    }
  }, {
    prop: 'executeProviderRList',
    slotName: 'executeProviderRList',
    label: '执行科室',
    width: '140px',
    display: true,
    render (h, ctx, row) {
      return officeRender.call(this, h, row, 'executeProviderRList')
    }
  }
  // , {
  //   prop: 'isValid',
  //   slotName: 'isValid',
  //   label: '启用状态',
  //   display: false,
  //   render (h, ctx, row) {
  //     return h('el-switch', {
  //       props: {
  //         value: !!row.isValid,
  //         disabled: this.clinicType === '0' || !(this.serviceInfo && this.serviceInfo.isValid)
  //       },
  //       on: {
  //         input (val) {
  //           row.isValid = val
  //         },
  //         change: (val) => {
  //           // if (val) {
  //           //   this.permissionUpLinkage(row, true)
  //           // } else {
  //           //   this.permissionDownLinkage(row, true)
  //           // }
  //         }
  //       }
  //     })
  //   }
  // }
]

function officeRender (h, row, prop) {
  let len = row[prop] && row[prop].length || 0
  if (row.usePermission) {
    return h('div', {
      class: 'office-select',
      on: {
        click: () => {
          this.openCorrelationDialog(row, prop)
        }
      }
    },
      [
        h('span', { class: 'cur-select' }, len ? `已选择${len}个科室` : '请选择科室'),
        h('i', { class: 'iconfont icon-domn' })
      ])
  } else {
    return h('span', {}, '')
  }
}
