/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-12 10:29:22
 * @LastEditTime: 2020-11-05 18:59:02
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
import { EQUIPMENTTYPE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import storage from '@/util/storage'

export default {
  mixins: [getstorage],
  data () {
    return {
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  computed: {
    permissionObj () {
      const materialType = this.materialType !== EQUIPMENTTYPE
      return {
        drugbacks: materialType && this.$hasPermission('Auth_menu_material_drug_drugbacks'), // 采购退货 && 销毁报废
        allocationadd: materialType && !this.isInvented && this.$hasPermission('Auth_menu_material_drug_allocation'), // 院内调拨
        storageroomSplit: materialType && this.$hasPermission('Auth_menu_material_storageroom_split') && !this.isInvented, // 物资拆零
        storagebacks: materialType && this.$hasPermission('Auth_menu_material_drug_storagebacks') && !this.isInvented, // 退库申请
        drugallotbounds: materialType && this.$hasPermission('Auth_menu_material_drug_drugallotbounds') && !this.isInvented // 申领
      }
    },
    btnsList () {
      let list = [
        {
          name: '采购入库',
          url: '/entry/entryadd',
          show: true,
          top: true
        },
        {
          name: '采购退货',
          top: true,
          show: this.permissionObj.drugbacks,
          url: '/business/returnbusinessadd'
        },
        {
          name: '申领',
          top: true,
          isBatch: true,
          show: this.permissionObj.drugallotbounds,
          url: '/business/applybusinessadd/new'
        },
        {
          name: '调拨',
          top: true,
          isBatch: true,
          show: this.permissionObj.allocationadd,
          url: `/business/allocationadd`
        },
        {
          name: '退库',
          top: true,
          isBatch: true,
          show: this.permissionObj.storagebacks,
          url: '/business/retiringbusinadd'
        },
        {
          name: '盘点',
          bottom: true,
          show: true,
          url: '/check/checkstocktakingadd'
        },
        {
          name: '销毁报废',
          bottom: true,
          isBatch: true,
          show: this.permissionObj.drugbacks,
          url: '/business/destroybusinessadd'
        },
        {
          name: '物资拆零',
          bottom: true,
          isBatch: true,
          show: this.permissionObj.storageroomSplit,
          url: '/business/splitadd'
        },
        {
          name: '库存查询',
          bottom: true,
          show: true,
          url: '/reportform/catalog?code=wh_zkwpb'
        },
      ]
      let arr = list.map(item => {
        if (this.isBatch && item.isBatch && !item.url.includes('batch')) {
          if (item.name === '申领') {
            item.url = '/business/applybusinessaddbatch'
          } else {
            item.url += 'batch'
          }
        }
        return item
      })
      return arr
    },
  },
}

