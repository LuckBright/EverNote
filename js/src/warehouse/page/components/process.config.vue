<template>
  <div style="padding-right: 100px" class="processbox">
    <switch-list
      :label-witdh="'150px'"
      :schemaList="schemaList"
      v-model="schemaObj">
      <div slot="bbox" class="slotbox mt10" v-if="schemaObj.isPrint == 1">
        <switch-list
          :label-witdh="'80px'"
          :show-btn="false"
          :schemaList="danj"
          v-model="schemaObj">
          <!-- 药贴打印  -->
          <span slot="bsoe" class="ml20" v-if="schemaObj.dispensePaste == 1">
            <ever-select
              style="width: 150px"
              v-model="schemaObj.processItemPasteObject.value"
              :options="PRINT_SPEC"
              size="small">
            </ever-select>
            <ever-select
              style="width: 150px"
              v-model="schemaObj.processItemPasteObject.processItemPasteObject.value"
              :options="PRINT_SPEC[schemaObj.processItemPasteObject.value - 1].children.map(item => ({...item, name: item.spec}))"
              size="small">
            </ever-select>
            <el-popover
              placement="right"
              trigger="click">
              <img
                :width="imgCompileWidth(PRINT_SPEC[schemaObj.processItemPasteObject.value - 1].children, schemaObj.processItemPasteObject.processItemPasteObject.value, 'spec')"
                :src="htmlCompileShow(PRINT_SPEC[schemaObj.processItemPasteObject.value - 1].children, schemaObj.processItemPasteObject.processItemPasteObject.value, 'url')">
              <el-button slot="reference" size="small" type="text">预览效果</el-button>
            </el-popover>
          </span>
          <!-- 父子医嘱打印 -->
          <span slot="dlle" class="ml20" v-if="schemaObj.dispensePatient == 1">
            <ever-select
              style="width: 150px"
              v-model="schemaObj.processItemPatientObject.value"
              :options="PRINT_OPTION"
              size="small">
            </ever-select>
            <ever-select
              style="width: 150px"
              v-model="schemaObj.processItemPatientObject.processItemPatientObject.value"
              :options="OPD_PARENT_PRINT_STYLE.map(item => ({...item, name: item.spec}))"
              size="small">
            </ever-select>
            <el-popover
              placement="right"
              trigger="click">
              <img
              :width="imgCompileWidth(PRINT_SPEC[schemaObj.processItemPatientObject.processItemPatientObject.value - 1].children, schemaObj.processItemPatientObject.processItemPatientObject.value, 'spec')"
              :src="htmlCompileShow(OPD_PARENT_PRINT_STYLE, schemaObj.processItemPatientObject.processItemPatientObject.value, 'url')">
              <el-button slot="reference" size="small" type="text">预览效果</el-button>
            </el-popover>
          </span>
          <!-- 发货单打印 -->
          <span slot="atch" class="ml20" v-if="schemaObj.dispatchListPrint == 1">
            <ever-select
              style="width: 230px"
              v-model="schemaObj.processItemDispatchPrintObject.value"
              :options="BATCH_FHD_PRINT_OPTIONS"
              size="small">
            </ever-select>
            <el-popover
              placement="right"
              trigger="click">
              <img width="700" :src="htmlCompileShow(FHD_OPTIONS, schemaObj.processItemDispatchPrintObject.value + '', 'url')">
              <el-button slot="reference" size="small" type="text">预览效果</el-button>
            </el-popover>
          </span>
        </switch-list>
      </div>
      <div slot="bbox2" class="slotbox mt10" v-if="schemaObj.dispensePrepare == 1">
        <switch-list
          :label-witdh="'80px'"
          :show-btn="false"
          :schemaList="baiy"
          v-model="schemaObj">
          <span slot="sfee" class="ml20" v-if="schemaObj.dispensePreparePrint == 1">
            <el-select
              style="width: 150px"
              v-model="schemaObj.processItemPreparePrintObject.value"
              size="small"></el-select>
            <el-button size="small" type="text">预览效果</el-button>
          </span>
        </switch-list>
      </div>
    </switch-list>
    <div class="fayaoconfig">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>
</template>
<script>
import switchList from '@/warehouse/page/components/switch.list'
import { PRINT_SPEC, OPD_PARENT_PRINT_STYLE, PRINT_OPTION, FHD_PARENT_PRINT_STYLE } from '@/util/common'
import { FHD_OPTIONS, BATCH_FHD_PRINT_OPTIONS } from '@/warehouse/views/util/constant'
import storage from '@/util/storage'
const schemaList = [
  // {
  //   name: 'listMode',
  //   label: '列表模式',
  //   activeText: '详细',
  //   inactiveText: '简洁',
  //   activeValue: 0,
  //   inactiveValue: 1
  // },
  {
    name: 'focusHandle',
    label: '集中处理',
    activeText: '集中',
    inactiveText: '不限',
    activeValue: 1,
    inactiveValue: 0,
    note: '注：集中处理开启后，本库房能查看本机构所有开出的处方，包括由其他机构执行的处方；若关闭则只能查看由本机构执行的处方。无论开启或关闭发药记录仅能查看本库房记录。'
  },
  // {
  //   name: 'showSelf',
  //   label: '自备药',
  //   activeText: '显示',
  //   inactiveText: '不显示',
  //   activeValue: 0,
  //   inactiveValue: 1,
  //   note: '注：选择“显示”后，在发药任务页面会显示需要患者自行购买的自备药；否则不显示自备药。'
  // },
  {
    name: 'spanOrg',
    label: '跨机构发药',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 0,
    disabled: false,
    inactiveValue: 1,
    note: '注：启用跨机构发药后，允许将本机构的发药任务指派给集团下的其他机构；否则只能指派给本机构内部药房。'
  },
  {
    name: 'isPrint',
    label: '单据打印',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 1,
    inactiveValue: 0,
    slot: 'bbox'
  },
  // {
  //   name: 'dispensePrepare',
  //   label: '摆药流程',
  //   activeText: '启用',
  //   inactiveText: '停用',
  //   activeValue: 1,
  //   inactiveValue: 0,
  //   slot: 'bbox2'
  // }
]
const danj = [
  {
    name: 'dispensePaste',
    label: '药贴',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 1,
    inactiveValue: 0,
    note: '注：药贴是发药时贴在药品包装上的小不干胶标签',
    slot: 'bsoe'
  },
  {
    name: 'dispensePatient',
    label: '父子医嘱',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 1,
    inactiveValue: 0,
    note: '注：开启后，父子医嘱将单独打印一张药贴，所有药都打印在一起，普通药贴中不打印父子医嘱的药品',
    slot: 'dlle'
  },
  {
    name: 'dispatchListPrint',
    label: '发货单',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 1,
    inactiveValue: 0,
    note: '注：开启后，将按照发货明细打印发货单。',
    slot: 'atch'
  }
]
const baiy = [
  {
    name: 'dispensePreparePrint',
    label: '备药单',
    activeText: '启用',
    inactiveText: '停用',
    activeValue: 1,
    inactiveValue: 0,
    note: '备药单位热敏纸打印的药品清单，必须先开启药房备药时才能设置。打印规格：80宽的热敏纸',
    slot: 'sfee'
  }
]
export default {
  props: {
    processObject: {
      type: Object,
      default: () => ({})
    },
    pricingModel: {
      type: Number,
      default: 0
    },
    processId: String
  },
  data () {
    let schemaObj = this.$ever.createObjFromSchema(schemaList)
    schemaObj.listMode = 1
    schemaObj.focusHandle = 1
    schemaObj.showSelf = 0
    schemaObj.spanOrg = 0
    schemaObj.isPrint = 1
    schemaObj.dispensePaste = 1
    schemaObj.dispensePatient = 1
    schemaObj.dispatchListPrint = 1
    schemaObj.dispensePreparePrint = 1
    schemaObj.processItemPasteObject = { value: '1', processItemPasteObject: { value: '1' } }
    schemaObj.processItemPatientObject = { value: '1', processItemPatientObject: { value: '1' } }
    schemaObj.processItemPreparePrintObject = { value: '1' }
    schemaObj.processItemDispatchPrintObject = { value: 1 }
    return {
      schemaList,
      danj,
      baiy,
      schemaObj,
      PRINT_SPEC,
      oldSchemaObj: null,
      BATCH_FHD_PRINT_OPTIONS,
      OPD_PARENT_PRINT_STYLE,
      FHD_PARENT_PRINT_STYLE,
      FHD_OPTIONS,
      PRINT_OPTION,
      objId: this.$route.params.id,
      conut: false,
    }
  },
  created () {
    if (!this.objId) this.oldSchemaObj = JSON.parse(JSON.stringify(this.schemaObj))
    this.conut = true
  },
  methods: {
    imgCompileWidth (list, val, name) {
      let index = list.findIndex(item => {
        return item.id === val
      })
      let width = list[index][name].split('*')[0] * 5
      return width
    },
    htmlCompileShow (list, val, name) {
      let index = list.findIndex(item => {
        return item.id === val
      })
      return list[index][name]
    },
    onSubmit () {
      this.$emit('processPop', this.schemaObj)
    },
    resetForm () {
      this.schemaObj = JSON.parse(JSON.stringify(this.oldSchemaObj))
    }
  },
  watch: {
    'schemaObj.isPrint': {
      handler (v) {
        if (v) {
          this.schemaObj.dispensePaste = 1
          this.schemaObj.dispensePatient = 1
          this.schemaObj.dispatchListPrint = 1
        } else {
          this.schemaObj.dispensePaste = 0
          this.schemaObj.dispensePatient = 0
          this.schemaObj.dispatchListPrint = 0
        }
      },
      deep: true,
    },
    pricingModel: {
      handler (v) {
        if (v) {
          this.$ever.getFieldFromSchema(this.schemaList, 'spanOrg').disabled = !!v
        } else {
          this.$ever.getFieldFromSchema(this.schemaList, 'spanOrg').disabled = !!Number(storage.getLocalStorage('IS_BATCHPRICE') || 0)
        }
      },
      deep: true,
      immediate: true
    },
    'schemaObj.dispensePaste': {
      handler (v) {
        if (!v && !this.schemaObj.dispensePatient && !this.schemaObj.dispatchListPrint) {
          setTimeout(_ => {
            this.schemaObj.isPrint = 0
          }, 200)
        }
      },
      deep: true,
    },
    'schemaObj.dispensePatient': {
      handler (v) {
        if (!v && !this.schemaObj.dispensePaste && !this.schemaObj.dispatchListPrint) {
          setTimeout(_ => {
            this.schemaObj.isPrint = 0
          }, 200)
        }
      },
      deep: true,
    },
    'schemaObj.dispatchListPrint': {
      handler (v) {
        if (!v && !this.schemaObj.dispensePaste && !this.schemaObj.dispensePatient) {
          setTimeout(_ => {
            this.schemaObj.isPrint = 0
          }, 200)
        }
      },
      deep: true,
    },
    processObject: {
      handler (v) {
        if (this.processId) {
          let index = this.schemaList.findIndex(item => item.name === 'focusHandle')
          if (~index) this.schemaList.splice(index, 1)
          if (this.processId === '100007') {
            let index = this.schemaList.findIndex(item => item.name === 'spanOrg')
            if (~index) this.schemaList.splice(index, 1)
          } else {
            let index = this.schemaList.find(item => item.name === 'spanOrg')
            if (!index) {
              this.schemaList.unshift({
                name: 'spanOrg',
                label: '跨机构发药',
                activeText: '启用',
                inactiveText: '停用',
                activeValue: 0,
                inactiveValue: 1,
                note: '注：启用跨机构发药后，允许将本机构的发药任务指派给集团下的其他机构；否则只能指派给本机构内部药房。'
              })
            }
          }
        }
        if ((v.id || typeof v.isPrint !== 'undefined') && !this.conut) this.schemaObj = Object.assign(this.schemaObj, v)
        this.conut = true
        if (v.processItemPatientObject && !v.processItemPatientObject.processItemPatientObject) {
          this.schemaObj.processItemPatientObject.processItemPatientObject = {value: '1'}
        }
        this.schemaObj.processItemPasteObject === null && (this.schemaObj.processItemPasteObject = { value: '1', processItemPasteObject: { value: '1' } })
        this.schemaObj.processItemPatientObject === null && (this.schemaObj.processItemPatientObject = { value: '1', processItemPatientObject: { value: '1' } })
        this.schemaObj.processItemPatientObject.processItemPatientObject === null && (this.schemaObj.processItemPatientObject.processItemPatientObject = { value: '1' })
        this.schemaObj.dispensePreparePrint === null && (this.schemaObj.dispensePreparePrint = 0)
        this.schemaObj.dispatchListPrint === null && (this.schemaObj.dispatchListPrint = 0)
        this.schemaObj.processItemDispatchPrintObject === null && (this.schemaObj.processItemDispatchPrintObject = { value: 1 })
        // 转换为数字类型
        this.schemaObj.processItemDispatchPrintObject && (this.schemaObj.processItemDispatchPrintObject.value = Number(this.schemaObj.processItemDispatchPrintObject.value))
        this.schemaObj.processItemPreparePrintObject === null && (this.schemaObj.processItemPreparePrintObject = { value: '1' })
        if (!this.oldSchemaObj) {
          this.oldSchemaObj = JSON.parse(JSON.stringify(this.schemaObj))
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    switchList
  }
}
</script>

<style scoped lang="scss">
.slotbox{
  background-color: rgba(242, 242, 242, 1);
  padding: 10px;
  border-radius: 3px;
}
.fayaoconfig{
  padding-left: 150px;
  padding-bottom: 20px;
  /deep/ .el-button {
    padding: 10px 30px;
  }
}
.processbox{
  /deep/ .el-form-item{
    border-bottom:0px!important;
    padding-bottom: 0px!important;
  }
}
</style>
