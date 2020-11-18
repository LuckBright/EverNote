<template>
  <div>
    <ever-bread-crumb name="编辑"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <!-- 顶部安全库存设置 -->
        <el-row :gutter="20">
          <el-col :span="10">
            <h4 style="width: 100px" class="fl">安全库存设置</h4>
            <sys-select
              :options="safeStockOptions"
              v-model="safeStock"
              size="small"
              style="width: 200px;"
              class="ml10 fl">
            </sys-select>
          </el-col>
          <el-col :span="14">
            <wh-popover class="fr" :placement="'left-start'" :width="'500'" :showType="'icon'" :btnText="'说明'">
              <template slot="content">
                1、系统推荐依赖于过往出入库数据，数据越多计算越精确。系统根据过去30天的日均消耗量，依据日常补货间隔时间（补货周期）和额外预留天数（安全周期），综合计算出合适的安全库存。<br>日均消耗量：过去30天，所有出库完成数据合计，领用出库+发货出库+申领出库+调拨出库+退库出库+盘亏出库+销毁报废，日平均数。<br>系统推荐安全库存 = 日均消耗量 X （补货周期 + 安全周期）。
                <br>
                2、您也可以选择批量手动设置安全库存，将所有商品的安全库存设置成统一的数值，设置完成后支持单个修改。
                <br>
                3、最小库存设置以安全库存为基础，按0-100%比例向下进行浮动，四舍五入取整数保留。（例如安全库存为100，最小库存为比例为20%，最小库存则为20）
                <br>
                4、安全库存和最小库存都需要设置，才能进行预警和推荐补货数量。设置后，当库房中物资的可用库存到达最小库存时，物资会进入库存预警列表中。我们会为您计算：建议补货数量=安全库存+（待发货-实际库存）。
              </template>
            </wh-popover>
          </el-col>
        </el-row>
        <!-- 安全设置 -->
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="safeForm"
          class="safe_form"
          :rules="rules[safeStock]"
          :nosubmit="true">
          <template slot="replenishmentCycle">
            <div class="df">
              <el-input
                style="width: 200px;"
                size="small"
                @blur="handleChangeRc(obj.replenishmentCycle)"
                placeholder="请输入补货周期"
                v-model.number="obj.replenishmentCycle"
                type="number"
              ></el-input>
              <span class="from_text">天</span>
              <span class="from_text ml20">日常的补货间隔时间</span>
            </div>
          </template>
          <template slot="safeCycle">
            <div class="df">
              <el-input
                @blur="handleChangeSc(obj.safeCycle)"
                style="width: 200px;"
                size="small"
                v-model.number="obj.safeCycle"
                type="number"
              ></el-input>
              <span class="from_text">天</span>
              <span class="from_text ml20">额外预留天数</span>
            </div>
          </template>
          <template slot="safeNum">
            <el-input
              style="width: 200px;"
              size="small"
              v-model.number="obj.safeNum"
              placeholder="请输入安全库存数量"
              type="number"
            ></el-input>
            <span class="from_text">将所有商品的安全库存设置成统一的数值，设置完成后允许单个修改</span>
          </template>
        </ever-form2>
        <!-- 最小库存设置 -->
        <h4>最小库存设置</h4>
        <ever-form2
          :schema="minScaleSchema"
          v-model="minObj"
          ref="minForm"
          class="min_form"
          :rules="minRulues"
          :nosubmit="true">
          <template slot="minScale">
            <el-input
              style="width: 200px;"
              size="small"
              @blur="handleChangeMS"
              placeholder="请输入最小库存比例"
              v-model.number="minObj.minScale"
              type="number"
            ></el-input>
            <span class="from_text">%</span>
            <span class="from_text ml20">以安全库存为基础，按0-100比例向下进行浮动。</span>
          </template>
        </ever-form2>
        <el-button
          type="primary"
          size="small"
          @click="handlePreviewStock"
          style="margin-left: 120px">预览计算结果</el-button>

        <!-- 表格区域 -->
        <inventory-table ref="inventory" v-model="tableData" :getListParmas="setUpParams"></inventory-table>

        <!-- 底部 -->
        <el-button
          type="primary"
          size="small"
          @click="submit"
          class="w_60 mt20">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import inventoryTable from './component/inventorytable.vue'
import api from '@/warehouse/page/storages/store/storagemanageapi.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { PARSE_SPECIAL_REG, PARSE_REG } from '@/warehouse/util/reg.js'

const schemaItme = [
  {
    name: 'replenishmentCycle',
    label: '补货周期',
    comp: 'custom',
  },
  {
    name: 'safeCycle',
    label: '安全周期',
    comp: 'custom'
  }
]

const SafeNumSchema = [{
  name: 'safeNum',
  label: '安全库存数量',
  comp: 'custom'
}]

const minScaleSchema = [
  {
    name: 'minScale',
    label: '最小库存比例',
    comp: 'custom'
  }
]
export default {
  mixins: [getstorage],
  data () {
    let schema = this.getCreateSchema('1').schema
    let obj = this.getCreateSchema('1').obj
    let minObj = this.$ever.createObjFromSchema(minScaleSchema)
    return {
      safeStockOptions: [
        { id: '1', name: '系统推荐安全库存' },
        { id: '2', name: '批量设置安全库存' }
      ],
      safeStock: '1',
      schemaList: [],
      tableData: [],
      setUpParams: {}, // 库存设置params
      rules: {
        '1': {
          replenishmentCycle: { required: true, message: '请输入补货周期。', trigger: 'blur' }
        },
        '2': {
          safeNum: { required: true, message: '请输入安全库存数量。', trigger: 'blur' }
        }
      },
      minRulues: {
        minScale: { required: true, message: '请输入最小库存比例。', trigger: 'blur' }
      },
      schema,
      minScaleSchema,
      minObj,
      obj
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    // 预览计算结果
    handlePreviewStock () {
      let minFormValid
      let safeFormValid
      this.$refs.safeForm.$refs.form.validate(valid => { safeFormValid = valid })
      this.$refs.minForm.$refs.form.validate(valid => { minFormValid = valid })
      if (safeFormValid && minFormValid) {
        this.getDetail(true)
      }
    },
    // 获取列表数据
    getDetail (flag = false) {
      let parmas = {
        materialType: '',
        offset: 0,
        pagesize: 99999,
        requestSwitch: true,
        storageRoomId: this.storageId
      }
      if (flag) {
        Object.assign(parmas, this.obj, this.minObj, { safeType: this.safeStock })
        parmas.safeCycle = Number(parmas.safeCycle)
        this.setUpParams = parmas
      }
      api.list(parmas).then(res => {
        if (res && res.list) {
          this.tableData = res.list || []
        }
      })
    },
    handleChangeMS () {
      let { minScale } = this.minObj
      if (!PARSE_REG.test(minScale) || (minScale < 0 || minScale > 100)) {
        this.minObj.minScale = ''
        this.everWarning('最小库存比例只能是0-100的正整数')
      }
    },
    // 安全周期
    handleChangeSc (num) {
      if (num && !PARSE_SPECIAL_REG.test(num)) {
        this.obj.safeCycle = ''
        this.everWarning('安全周期只允许为正整数')
      }
    },
    // 补货周期
    handleChangeRc (num) {
      if (num && !PARSE_SPECIAL_REG.test(num)) {
        this.obj.replenishmentCycle = ''
        this.everWarning('补货周期只允许为正整数')
      }
    },
    submit () {
      if (this.$refs.inventory.checkSubmitData()) return this.everWarning('物资列表还有信息未录入')
      let parmas = this.$refs.inventory.tableData.map(item => {
        const { id, storageRoomId, localMaterialId, materialType, min, safe, clinicId } = item
        return Object.assign({
          id,
          storageRoomId,
          localMaterialId,
          materialType,
          min,
          safe,
          clinicId
        }, (id && (min === '' || min === null) && (safe === '' || safe === null)) ? {isDelete: 1} : {})
      })
      api.createStockAmountSave(parmas).then(res => {
        if (res) {
          this.$router.push('/storages/warning/inventorywarn')
          return this.everSuccess('保存成功')
        }
      })
    },
    getCreateSchema (val) {
      let schema = val === '1' ? schemaItme : SafeNumSchema
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    }
  },
  watch: {
    'safeStock' (val) {
      this.obj = this.getCreateSchema(val).obj
      this.schema = this.getCreateSchema(val).schema
    }
  },
  components: {
    inventoryTable
  }
}
</script>
<style lang="less" scoped>
.from_text {
  color: #666;
  font-size: 14px;
  padding: 0 0 0 20px;
}
.panel-body {
  /deep/.el-form .el-form-item .el-form-item__content {
    /deep/ .el-form-item__error {
      display: block !important;
      width: 0px;
      height: 0px;
      padding:0px!important;
      border:0px;
      overflow: hidden;
    }
  }
}
</style>
