/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-13 11:26:25
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2019-12-05 11:30:43
 */

// 住院公共配置数据
import {
  tableDefaultCellValue,
  checkboxWidth
} from '@/warehouse/views/util/constant'
import { objGet } from '@/util/common'
import uddApi from '@/warehouse/views/drug/api/uddapi.js'
export default {
  data () {
    return {
      uddApi,
      checkboxWidth,
      patientCode: '009', // 库房患者头code
      tableDefaultCellValue,
      noDataTip: '暂无任务',
      listWidth: '638px',
      footerHeight: '52px',
      commonParams: { // 病区、给药途径、执行时间公共参数字段
        storageRoomId: '',
        type: 3, // 3 住院发药
        patientId: '',
        hospitalizedNumber: ''
      },
    }
  },
  methods: {
    canSelected (data) { // 公共方法，判断数据是否可以选择（udd和任务task）
      if (!data) return false
      // 包含异常、缺货、取消、无法到货 checkbox都不选中
      return !data.some(item => item.identification || item.shortage === 23 || [4, 5].includes(item.status))
    }
  },
  computed: {
    currentProcessConfig () { // 当前库房流程配置数据
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    processConfigurationId () { // 流程id
      return this.currentProcessConfig.id
    },
    listMode () { // 模式选择：0：“单人操作” | 1：“多人协同”
      return objGet(this.currentProcessConfig, 'processItemObject.listMode', 0)
    },
    dispensePrepare () { // 摆药流程 0/否  1/是
      return objGet(this.currentProcessConfig, 'processItemObject.dispensePrepare', 0)
    },
    dispenseDetail () { // 打印单个药签打印与否 0/否  1/是
      return objGet(this.currentProcessConfig, 'processItemObject.dispenseDetail', 0)
    },
    dispensePatient () { // 打印父子医嘱 0/否  1/是
      return objGet(this.currentProcessConfig, 'processItemObject.dispensePatient', 0)
    },
    dispensePreparePrint () { // 打印摆药单 0/否  1/是
      return objGet(this.currentProcessConfig, 'processItemObject.dispensePreparePrint', 0)
    },
    currentStorageRoomId () { // 当前库房id
      return this.currentProcessConfig.storageRoomId
    },
    processId () { // 当前流程配置code  100001 100002 100003 等
      return this.currentProcessConfig.processId
    }
  },
}
