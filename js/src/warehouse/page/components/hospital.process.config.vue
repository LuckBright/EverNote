<template>
  <div style="padding-right: 100px">
    <ever-form2
      :schema="schema"
      :nosubmit="true"
      v-model="obj">
      <template slot="printConfig">
        <div class="slotbox">
          <ever-form2
            ref="form"
            v-model="obj"
            :nosubmit="true"
            label-width="120px"
            :schema="subSchema">
            <template :slot="sub.name" v-for="sub in subSchema">
              <div :key="sub.name" v-if="!sub.display">
                <wh-switch
                  :disabled="sub.disabled"
                  v-model="obj[sub.name]"
                  :textList="StartStop">
                </wh-switch>
                <template v-if="obj[sub.name] && sub.options">
                  <ever-select
                    class="ml10"
                    style="width: 180px"
                    v-model="obj[sub.keyPair].value"
                    :options="sub.options"
                    size="small">
                  </ever-select>
                  <el-popover
                    v-if="obj[sub.keyPair].value"
                    class="ml10"
                    placement="right"
                    trigger="click">
                    <el-image
                      :style="{width: sub.options[0].name == 'A4纸' ? '500px' : '300px', height: sub.options[0].name == 'A4纸' ? '500px' : '300px'}"
                      :src="$filters.formateValueToFnt(obj[sub.keyPair].value, {list: sub.options, showKey: 'url'})"
                      fit="contain"></el-image>
                    <img >
                    <el-button slot="reference" size="medium" type="text">预览效果</el-button>
                  </el-popover>
                </template>
                <!-- 提示语note -->
                <div class="cGray lineHigh mt5" v-html="sub.note"></div>
              </div>
            </template>
          </ever-form2>
        </div>
      </template>
      <template slot="dispensePrepare">
        <wh-switch
          v-model="obj.dispensePrepare"
          :textList="StartStop"></wh-switch>
        <!-- <el-button v-if="obj.dispensePrepare" class="ml10" size="medium" type="text">打印快捷码</el-button> -->
      </template>
      <template slot="itemSwitch">
        <wh-switch
          v-model="obj.itemSwitch"
          :disabled="true"
          :textList="StartStop"></wh-switch>
        <!-- <el-button class="ml10" size="medium" type="text">打印快捷码</el-button> -->
      </template>
    </ever-form2>
    <div class="fayaoconfig">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>
</template>
<script>
import whSwitch from '@/warehouse/page/components/wh.switch'
import storage from '@/util/storage'
import { PRINT_SPEC, OPD_PARENT_PRINT_STYLE } from '@/util/common'
import { UDD_OPTIONS, DRUG_OPTIONS, FATHER_SON_OPTIONS, PLACE_OPTIONS } from '@/warehouse/views/util/constant.js'

const StartStop = [{ id: 1, name: '启用' }, { id: 0, name: '停用' }]
const schema = [
  {
    name: 'listMode',
    label: '模式选择',
    props: {
      clearable: false,
      options: [
        { id: 0, name: '单人操作' },
        { id: 1, name: '多人协作' },
      ]
    },
    comp: 'select'
  },
  {
    name: 'printConfig',
    comp: 'custom',
    label: '单据打印'
  },
  {
    name: 'dispensePrepare',
    comp: 'custom',
    label: '摆药流程'
  },
  {
    name: 'itemSwitch',
    comp: 'custom',
    label: '发药流程'
  }
]
// TODO: 中药药包 配置
const subSchema = [
  {
    name: 'dispensePaste',
    comp: 'custom',
    label: 'UDD药包',
    disabled: true,
    keyPair: 'processItemPasteObject',
    options: UDD_OPTIONS,
    note: '注：以药包为单位的标签，包含药包内的全部明细；不允许停用。'
  },
  {
    name: 'chinDispensePrint',
    comp: 'custom',
    keyPair: 'processItemChinDispensePrintObject',
    label: '中药药包',
    options: DRUG_OPTIONS,
    note: '注：以单个药为单位打印每个药的标签'
  },
  {
    name: 'dispenseDetail',
    comp: 'custom',
    keyPair: 'processItemDispenseDetailObject',
    label: '单个药签',
    options: DRUG_OPTIONS,
    note: '注：以单个药为单位打印每个药的标签'
  },
  {
    name: 'dispensePatient',
    comp: 'custom',
    keyPair: 'processItemPatientObject',
    label: '父子医嘱',
    options: FATHER_SON_OPTIONS,
    note: '注：开启后，父子医嘱将按父子医嘱的样式单独打印药贴，关闭则按UDD药包样式统一打印。'
  },
  {
    name: 'dispensePreparePrint',
    comp: 'custom',
    keyPair: 'processItemPreparePrintObject',
    label: '批量摆药单',
    options: PLACE_OPTIONS,
    note: '批量打印时，同一个打印批次的药包汇总打印到一起'
  },
]
const staticObj = {
  listMode: 0, // UDD药贴:此项不允许修改，必须启用
  itemSwitch: 1, // 发药流程:不允许修改，必须启用
  dispensePaste: 1,
}
export default {
  props: {
    processObject: {
      type: Object,
      default: () => ({})
    },
    processId: String
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj = Object.assign({}, obj, staticObj, ...subSchema.map(row => ({ [row.keyPair]: { value: 1 } })))
    return {
      StartStop,
      schema: this.processId ? schema.filter(item => item.name === 'printConfig') : schema,
      subSchema,
      obj,
      PRINT_SPEC,
      oldSchemaObj: null,
      selected: '',
      OPD_PARENT_PRINT_STYLE,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      objId: this.$route.params.id
    }
  },
  methods: {
    onSubmit () {
      this.$emit('processPop', this.obj)
    },
    resetForm () {
      this.obj = JSON.parse(JSON.stringify(this.oldSchemaObj))
    }
  },
  watch: {
    'obj.listMode': { // obj.listMode:多人协作模式
      handler (v) {
        // 初始化批量摆药单配置
        // this.obj.processItemPreparePrintObject.value = ''
        if (v) {
          this.subSchema = JSON.parse(JSON.stringify([].concat(subSchema)))
        } else {
          // 批量摆药单：此项只在多人协作模式下显示，单人操作模式下不显示。
          this.subSchema = subSchema.filter(item => item.name !== 'dispensePreparePrint')
        }
        // 系统配置进来修改显示
        if (this.processId) {
          this.subSchema = JSON.parse(JSON.stringify([].concat(subSchema.filter(item => item.name === 'dispensePreparePrint' || item.name === 'dispensePaste'))))
          this.subSchema.forEach(item => {
            item.disabled = false
            if (item.name === 'dispensePreparePrint') {
              item.options = [{id: 1, name: '普通样式 A4:210*297', url: require('@/assets/img/printstyle/byhzd.jpg')}].concat(this.isBatch ? [{id: 2, name: '批次样式 A4:210*297'}] : [])
              item.note = '注：仅西药、中成药、耗材、商品可以打印汇总。'
              item.label = '摆药单汇总打印'
            }
            if (item.name === 'dispensePaste') {
              item.options = [{id: 1, name: '普通样式 A4:210*297', url: require('@/assets/img/printstyle/xyhz.jpg')}].concat(this.isBatch ? [{id: 2, name: '批次样式 A4:297*210'}] : [])
              item.label = '摆药单明细打印'
              item.note = '注：西药、中成药、耗材、商品以发药任务为维度进行打印，中药颗粒、中药饮片以处方维度进行打印。'
            }
          })
        }
      },
      deep: true,
      immediate: true
    },
    processObject: {
      handler (v) {
        const keys = subSchema.map(item => item.keyPair)
        keys.forEach(key => {
          if (!v[key]) v[key] = { value: 1 }
          v[key].value -= 0
        })
        this.obj = Object.assign({}, this.obj, v)
        if (!this.oldSchemaObj) {
          this.oldSchemaObj = JSON.parse(JSON.stringify(this.obj))
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    whSwitch
  }
}
</script>

<style scoped lang="scss">
.lineHigh {
  line-height: 20px
}
.slotbox{
  background-color: rgba(242, 242, 242, 1);
  padding: 10px;
  border-radius: 3px;
}
.fayaoconfig{
  padding-left: 120px;
  padding-bottom: 20px;
  /deep/ .el-button {
    padding: 10px 30px;
  }
}
</style>
