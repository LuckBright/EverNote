<!-- 西药模版 -->
<template>
  <div>
    <!-- 退药 -->
    <el-table
      v-if="modelType === 'backdrug'"
      :data.sync="tableData"
      style="width: 100%"
      class="design_table no-border tableiconhover"
      :cell-class-name="tableCellClassName"
      :header-row-class-name="tableHeaderRowClassName"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" v-if="showSelected" :selectable="selectable"></el-table-column>
      <el-table-column
        header-align="center"
        v-if="isMatchSearch && changeTableBg && curPutCode && curPutCode == changeTableBg"
        :render-header="curPutCode == changeTableBg ? renderHeader : ''"
        width="80"
      ></el-table-column>
      <el-table-column min-width="200" label="物资名称">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" :content="`${needIcon(adviceType).name}`" effect="dark" placement="top">
            <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
              <use :xlink:href="'#' + needIcon(adviceType).icon"></use>
            </svg>
          </el-tooltip>
          <span>物资名称</span>
        </template>
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.outpatientDispenseItemObject && scope.row.outpatientDispenseItemObject.isMine" style="display: inline-block;">
              <i class="f12 iconfont icon-guanlian2" v-if="scope.row.outpatientDispenseItemObject.isMine == 1"></i>
              <i
                class="f12 iconfont icon-guanlian1"
                v-if="scope.row.oMineObj && scope.$index == scope.row.oMineObj[scope.row.outpatientDispenseItemObject.adviceId].sub && scope.row.outpatientDispenseItemObject.isMine == 2"
              ></i>
              <i class="f12 iconfont icon-guanlian" v-else-if="scope.row.outpatientDispenseItemObject.isMine == 2"></i>
            </div>
            <span
              v-if="scope.row.localSettingObject && parserJSON({data: scope.row.localSettingObject.materialSkuObject.ext, property: IDENTIFICATION_CODE})"
            >
            <wh-single-code-to-name
                :isExt="true"
                :patchObj="{
                  list: scope.row.localSettingObject.materialSkuObject.ext,
                  code: IDENTIFICATION_CODE
                }"
              ></wh-single-code-to-name> -</span>
            <wh-code-to-name
              v-if="scope.row.localSettingObject"
              :isExt="true"
              :patchObj="{
                code: MATERILA_CODE,
                list: scope.row.localSettingObject.materialSkuObject.ext,
                isInfo: false
              }"
            ></wh-code-to-name>
            <i v-if="WEST_MEDICINE_TYPE.includes(adviceType)" class="iconfont icon-shuoming" @click="drugOpen(scope.row)"></i>
            <div
              v-if="scope.row.status == 7"
              style="color: #ff9802"
            >拒收原因：{{scope.row.rejectionReason}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" label="规格">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject && CONSUMABLES_TYPE.includes(adviceType)">
            <wh-code-to-name
              :showIcon="false"
              :isExt="true"
              :patchObj="{
                code: [SPEC, PACKAGE_CODE],
                list: scope.row.localSettingObject.materialSkuObject.ext,
                isInfo: false,
                mark: '/'
              }">
            </wh-code-to-name>
          </span>
          <span
            v-else
          >
          <wh-code-to-name
            v-if="scope.row.localSettingObject"
            :showIcon="false"
            :isExt="true"
            :patchObj="{
              list: scope.row.localSettingObject.materialSkuObject.ext,
              code: [SPU_SPEC_CODE],
              isInfo: false
            }"
          ></wh-code-to-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="剂型" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope">
          <wh-single-code-to-name
            v-if="scope.row.localSettingObject"
            :isExt="true"
            :patchObj="{
              list: scope.row.localSettingObject.materialSkuObject.ext,
              code: DOSAGE
            }"
          ></wh-single-code-to-name>
        </template>
      </el-table-column>
      <el-table-column width="100" label="每次用量" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template
          v-if="scope.row.taskItemObject"
          slot-scope="scope"
        >{{scope.row.taskItemObject.measure}}
        <sys-value
          type="THC_WH_DOSE_UNIT"
          v-if="scope.row.taskItemObject.measureUnitId"
          :code="scope.row.taskItemObject.measureUnitId"
        ></sys-value>
        </template>
      </el-table-column>
      <el-table-column width="100" label="频次" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope" v-if="scope.row.taskItemObject">
          <sys-value
          :initoptions="JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || []"
          v-if="scope.row.taskItemObject.useFreq"
          :code="scope.row.taskItemObject.useFreq"
        ></sys-value>
        </template>
      </el-table-column>
      <el-table-column width="60" label="天数" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope" v-if="scope.row.taskItemObject">
          <span v-if="scope.row.taskItemObject.useDay">{{`${filters.subZeroAndDot(scope.row.taskItemObject.useDay)}天`}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140" label="途径" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope">
          <span v-if="scope.row.taskItemObject">
            <sys-value
              :code="scope.row.taskItemObject.employ"
              type="CV06.00.102"
            ></sys-value>
            <sys-value
              type="THC_CPOE_DropRate"
              v-if="scope.row.taskItemObject.dropSpeed"
              :code="scope.row.taskItemObject.dropSpeed"
            ></sys-value>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="right" label="数量">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
          <span
            v-if="scope.row.localSettingObject"
          >
          <wh-single-code-to-name
            v-if="scope.row.localSettingObject"
            :isExt="true"
            :patchObj="{
              list: scope.row.localSettingObject.materialSkuObject.ext,
              code: PACKAGE_CODE
            }"
          ></wh-single-code-to-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="货位号">
        <template slot-scope="scope">
          <span
            v-if="scope.row.taskItemObject && scope.row.taskItemObject.containerId"
          >{{JSON.parse(scope.row.taskItemObject.containerId)[0]}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 10">已入库</span>
          <span v-if="scope.row.status == 7" style="color: red">拒收</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 非退药 -->
    <el-table
      v-else
      :data.sync="tableData"
      style="width: 100%"
      class="design_table tableiconhover no-border"
      :cell-class-name="tableCellClassName"
      :header-row-class-name="tableHeaderRowClassName"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        header-align="center"
        v-if="isMatchSearch && changeTableBg && curPutCode && curPutCode == changeTableBg"
        :render-header="curPutCode == changeTableBg ? renderHeader : ''"
        width="80"
      ></el-table-column>
      <el-table-column min-width="300" label="物资名称">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" :content="`${needIcon(adviceType).name}`" effect="dark" placement="top">
            <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
              <use :xlink:href="'#' + needIcon(adviceType).icon"></use>
            </svg>
          </el-tooltip>
          <span>物资名称</span>
        </template>
        <template slot-scope="scope">
          <div>
            <div
              v-if="scope.row.outpatientDispenseItemObject && scope.row.outpatientDispenseItemObject.isMine"
              style="display: inline-block;"
            >
              <i
                class="f12 iconfont icon-guanlian2"
                v-if="scope.row.outpatientDispenseItemObject.isMine == 1"
              ></i>
              <i
                class="f12 iconfont icon-guanlian1"
                v-if="scope.row.oMineObj && scope.$index == scope.row.oMineObj[scope.row.outpatientDispenseItemObject.adviceId].sub && scope.row.outpatientDispenseItemObject.isMine == 2"
              ></i>
              <i
                class="f12 iconfont icon-guanlian"
                v-else-if="scope.row.outpatientDispenseItemObject.isMine == 2"
              ></i>
            </div>
            <span v-if="scope.row.localSetting">
              <wh-code-to-name
                :isExt="true"
                :cType="3"
                :patchObj="{
                  list: scope.row.localSetting.materialSkuObject.ext,
                  isInfo: false
                }"
              ></wh-code-to-name>
            </span>
            <i class="iconfont icon-shuoming" @click="drugOpen(scope.row)"></i>
          </div>
          <p class="red" v-if="scope.row.outpatientDispenseItem">
            <i class="f12 iconfont icon-wodebaojing red mr10"></i>
            {{scope.row.outpatientDispenseItem.cdssResult}}
          </p>
          <p
            class="red"
            v-if="scope.row.outpatientDispenseItem && scope.row.outpatientDispenseItem.identification"
          >{{`异常原因：${scope.row.outpatientDispenseItem.exceptionCause}`}}</p>
        </template>
      </el-table-column>
      <el-table-column width="120" label="规格">
        <template slot-scope="scope">
          <span v-if="scope.row.localSetting && CONSUMABLES_TYPE.includes(adviceType)">
            <wh-code-to-name
              :showIcon="false"
              :isExt="true"
              :patchObj="{
                code: [SPEC, PACKAGE_CODE],
                list: scope.row.localSetting.materialSkuObject.ext,
                isInfo: false,
                mark: '/'
              }">
            </wh-code-to-name>
          </span>
          <span
            v-if="scope.row.localSetting"
          >
            <wh-code-to-name
              :showIcon="false"
              :isExt="true"
              :patchObj="{
                code: [SPU_SPEC_CODE],
                list: scope.row.localSetting.materialSkuObject.ext,
                isInfo: false
              }"
            ></wh-code-to-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="剂型" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope">
          <wh-single-code-to-name
            v-if="scope.row.localSetting"
            :isExt="true"
            :patchObj="{
              list: scope.row.localSetting.materialSkuObject.ext,
              code: DOSAGE
            }"
          ></wh-single-code-to-name>
        </template>
      </el-table-column>
      <el-table-column width="100" label="每次用量" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template
          slot-scope="scope"
          v-if="scope.row.outpatientDispenseItem"
        >{{scope.row.outpatientDispenseItem.measure}}{{scope.row.outpatientDispenseItem.measureUnitName}}</template>
      </el-table-column>
      <el-table-column width="100" label="频次" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope" v-if="scope.row.outpatientDispenseItem">
          <span>{{scope.row.outpatientDispenseItem.useFreqTxt}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="天数" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope" v-if="scope.row.outpatientDispenseItem">
          <span>{{`${scope.row.outpatientDispenseItem.totalUseDay}天`}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140" label="途径" v-if="!CONSUMABLES_TYPE.includes(adviceType)">
        <template slot-scope="scope">
          <span v-if="scope.row.outpatientDispenseItem">
            {{scope.row.outpatientDispenseItem.employtxt}}
            <sys-value
              type="THC_CPOE_DropRate"
              v-if="scope.row.outpatientDispenseItem.dropSpeed"
              :code="scope.row.outpatientDispenseItem.dropSpeed"
            ></sys-value>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="right" label="数量">
        <template slot-scope="scope">
          <span v-if="scope.row.outpatientDispenseItem">{{scope.row.outpatientDispenseItem.num}}</span>
          <span
            v-if="scope.row.localSetting"
            class="light-gray"
          >
          <wh-single-code-to-name
            :isExt="true"
            :patchObj="{
              list: scope.row.localSetting.materialSkuObject.ext,
              code: PACKAGE_CODE
            }"
          ></wh-single-code-to-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="货位号">
        <template slot-scope="scope">
          <span
            v-if="scope.row.outpatientDispenseItem && scope.row.outpatientDispenseItem.containerId"
          >{{JSON.parse(scope.row.outpatientDispenseItem.containerId)[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" v-if="curStatus > 3 && curStatus < 7 && (curInvalid != 2)">
        <template slot-scope="scope">
          <div v-if="scope.row.outpatientDispenseItems">
            <a
              v-if="scope.row.outpatientDispenseItem.isMine >= 1"
              @click="handelMakeUpdebounce({data: mineArr, types: curTypes, curMine: scope.row.outpatientDispenseItem.isMine, isSingle: true, curAdviceType})"
            >补打标签</a>
            <a
              v-if="!scope.row.outpatientDispenseItem.isMine"
              @click="handelMakeUpdebounce({data: scope.row, types: curTypes, isSingle: true, curAdviceType})"
            >补打标签</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="thisObjData.localSettingObject" ref="drugTips" :objData="thisObjData"></drug-instructions>
  </div>
</template>
<script>
import { patch, MATERILA_CODE, SPU_SPEC_CODE, DOSAGE, debounce, IDENTIFICATION_CODE, whComFn, WEST_MEDICINE_TYPE, CONSUMABLES_TYPE, SPEC, PACKAGE_CODE, parserJSON } from '@/util/common'
import drugInstructions from '@/warehouse/page/storages/dispensings/components/drug.instructions'
import needIcon from '@/warehouse/page/storages/dispensings/mixins/needicon.mixins.js'
import storage from '@/util/storage'
import Vue from 'vue'
const filters = Vue.options.filters
export default {
  mixins: [needIcon],
  /**
     * props                        字段含义
     * @param isMatchSearch         是否匹配搜索改变颜色
     */
  props: ['otherData', 'tableData', 'tableCellClassName', 'changeTableBg', 'isMatchSearch', 'curPutCode', 'showTips', 'curStatus', 'curInvalid', 'curTypes', 'curAdviceType', 'modelType', 'showSelectable', 'adviceType'],
  data () {
    return {
      IDENTIFICATION_CODE,
      MATERILA_CODE,
      WEST_MEDICINE_TYPE,
      SPU_SPEC_CODE,
      CONSUMABLES_TYPE,
      parserJSON,
      SPEC,
      PACKAGE_CODE,
      DOSAGE,
      mineIndex: '',
      mineArr: [],
      thisObjData: {},
      filters,
      storage
    }
  },
  components: {
    drugInstructions
  },
  watch: {
    tableData: {
      handler: function (v) {
        const oMineObj = whComFn.adviceResetData(v)
        v.forEach((item, i) => {
          if (item.outpatientDispenseItemObject && item.outpatientDispenseItemObject.adviceId) {
            item.oMineObj = oMineObj
            if (item.oMineObj[item.outpatientDispenseItemObject.adviceId]) item.oMineObj[item.outpatientDispenseItemObject.adviceId].sub = i
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    showSelected () {
      return !this.showSelectable
    }
  },
  methods: {
    drugOpen (data) {
      this.thisObjData = data
      this.$nextTick(_ => {
        this.$refs.drugTips.open()
      })
    },
    renderHeader (h) {
      return (
        <span>
          <i style="color: rgb(40, 105, 8); font-size: 20px;" class="alg_c iconfont icon-zhuyuan-yizhu-yizhix"></i>
        </span>
      )
    },
    handelMakeUpdebounce: debounce(function ({ data, types, curMine, isSingle, curAdviceType }) {
      this.$emit('sendPrint', data, this.otherData.code)
    }),
    // 发药匹配改变背景颜色 start
    tableHeaderRowClassName ({ row, rowIndex }) {
      if (this.isMatchSearch && this.curPutCode && this.changeTableBg && this.curPutCode === this.changeTableBg) {
        return 'mark-row'
      }
      return ''
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.outpatientDispenseItem && row.outpatientDispenseItem.cdssResult) {
        return 'mark-cdss-row'
      }
      if (this.isMatchSearch && this.curPutCode && this.changeTableBg && this.curPutCode === this.changeTableBg) {
        return 'mark-row'
      }
      return ''
    },
    handleSelectionChange (val) {
      this.$emit('selectOpbBack', val)
    },
    selectable (row, index) {
      if (row.status === 7 || row.status === 10) {
        return false
      } else {
        return true
      }
    },
    // end
    ...patch
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 0;
}
</style>
