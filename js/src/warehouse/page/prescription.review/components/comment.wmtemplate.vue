<!--
西药模版
-->
<template>
  <div>
    <el-table
      :data.sync="tableData"
      style="width: 100%"
      class="tableiconhover"
      :cell-class-name="tableCellClassName"
      :header-row-class-name="tableHeaderRowClassName"
      :row-class-name="tableRowClassName"
    >
      <!-- <el-table-column
        header-align="center"
        v-if="isMatchSearch && changeTableBg && curPutCode && curPutCode == changeTableBg"
        :render-header="curPutCode == changeTableBg ? renderHeader : ''"
        width="80">
      </el-table-column>-->
      <el-table-column v-if="visitType === 3" width="60" label="医嘱">
        <template slot-scope="scope">
          <span>{{scope.row.termType ? '长期' : '临时'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="物资名称">
        <template slot="header" slot-scope="scope">
          <el-tooltip v-if="!CHINESE_MEDICINE_TYPE.includes(tableData[0].adviceType)" class="item" :content="`${needIcon(tableData[0].adviceType).name}`" effect="dark" placement="top">
            <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
              <use :xlink:href="'#' + needIcon(tableData[0].adviceType).icon"></use>
            </svg>
          </el-tooltip>
          <span>物资名称</span>
        </template>
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.isMine && hnxdPrint" style="display: inline-block;">
              <span class="f12" v-if="scope.row.isMine == 1">┏</span>
              <span class="f12" v-if="scope.$index == mineIndex && scope.row.isMine == 2">┗</span>
              <span class="f12" v-else-if="scope.row.isMine != 1">┣</span>
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
          </div>
          <p class="red" v-if="scope.row.identification">{{`异常原因：${scope.row.exceptionCause}`}}</p>
        </template>
      </el-table-column>
      <el-table-column width="160" label="规格">
        <template slot-scope="scope">
          <wh-code-to-name
            v-if="scope.row.localSetting && CONSUMABLES_TYPE.includes(tableData[0].adviceType)"
            :showIcon="false"
            :isExt="true"
            :patchObj="{
              standard: true,
              code: [[]],
              list: scope.row.localSetting.materialSkuObject.ext,
              isInfo: false,
              mark: '/'
            }">
          </wh-code-to-name>
          <span v-else>
            <wh-code-to-name
              :isExt="true"
              :showIcon="false"
              :patchObj="{
                standard: true,
                code: [[]],
                list: scope.row.localSetting.materialSkuObject.ext,
                isInfo: false
              }"
            ></wh-code-to-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="visitType !== 3 && !CONSUMABLES_TYPE.includes(tableData[0].adviceType)" width="100" label="剂型">
        <template slot-scope="scope">
          <wh-single-code-to-name
            :isExt="true"
            v-if="scope.row.localSetting"
            :patchObj="{
              list: scope.row.localSetting.materialSkuObject.ext,
              code: DOSAGE
            }"
          ></wh-single-code-to-name>
        </template>
      </el-table-column>
      <el-table-column width="100" label="每次用量" v-if="!CONSUMABLES_TYPE.includes(tableData[0].adviceType)">
        <template slot-scope="scope">{{scope.row.measure}}{{scope.row.measureUnitName}}</template>
      </el-table-column>
      <el-table-column width="100" label="频次" v-if="!CONSUMABLES_TYPE.includes(tableData[0].adviceType)">
        <template slot-scope="scope">
          <span>{{scope.row.useFreqTxt}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visitType !== 3 && !CONSUMABLES_TYPE.includes(tableData[0].adviceType)" width="100" label="天数">
        <template slot-scope="scope">
          <span>{{`${scope.row.totalUseDay || ''}天`}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="途径" v-if="!CONSUMABLES_TYPE.includes(tableData[0].adviceType)">
        <template slot-scope="scope">
          <span>
            {{scope.row.employTxt}}
            <sys-value
              type="THC_CPOE_DropRate"
              v-if="scope.row.dropSpeed"
              :code="scope.row.dropSpeed"
            ></sys-value>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="right" label="数量">
        <template slot-scope="scope">
          <span>{{scope.row.count}}</span>
          <span
            v-if="scope.row.localSetting"
            class="light-gray"
          >{{parserJSON({data: scope.row.localSetting.materialSkuObject.ext})}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="right" label="价格">
        <template slot-scope="scope">
          <span v-if="typeof scope.row.price !== 'undefined'">{{scope.row.price | formatToFinacial(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visitType === 3" width="120" label="开嘱医生">
        <template slot-scope="scope">
          <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visitType === 3" width="160" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visitType === 3" width="160" label="停止时间">
        <template slot-scope="scope">
          <span>{{scope.row.stopTime || '-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="countPrice mt20 mb10" style="font-size:16px">合计金额：{{countPrice | formatToFinacial(4)}}元</div>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="thisObjData.localSetting" ref="drugTips" :objData="thisObjData"></drug-instructions>
  </div>
</template>
<script>
import whCodeToName from '@/warehouse/page/components/code.to.name' //  cpoe调用组件 本身是在warehous全局下，cpoe调用单独引入  后期可以考虑main.js里面全局注册
import whSingleCodeToName from '@/warehouse/page/components/single.code.to.name' //  cpoe调用组件 本身是在warehous全局下，cpoe调用单独引入  后期可以考虑main.js里面全局注册
import { patch, SEARCH_CODE, floatTool, SPU_SPEC_CODE, DOSAGE, WEST_MEDICINE_TYPE, CONSUMABLES_TYPE, SPEC, PACKAGE_CODE, CHINESE_MEDICINE_TYPE, parserJSON } from '@/util/common'
import drugInstructions from '@/warehouse/page/storages/dispensings/components/drug.instructions'
import needIcon from '@/warehouse/page/storages/dispensings/mixins/needicon.mixins.js'
export default {
  /**
     * props                        字段含义
     * @param isMatchSearch         是否匹配搜索改变颜色
     */
  mixins: [needIcon],
  props: ['tableData', 'tableCellClassName', 'changeTableBg', 'isMatchSearch', 'curPutCode', 'showTips', 'curStatus', 'curInvalid', 'curTypes', 'curAdviceType'],
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      CONSUMABLES_TYPE,
      SPEC,
      parserJSON,
      PACKAGE_CODE,
      WEST_MEDICINE_TYPE,
      CHINESE_MEDICINE_TYPE,
      DOSAGE,
      adviceType: '',
      mineIndex: '',
      mineArr: [],
      tableDatas: [],
      visitType: 1,
      countPrice: 0,
      thisObjData: {},
      hnxdPrint: this.$ever.getClinicConfig().hnxdPrint
    }
  },
  components: {
    drugInstructions,
    whCodeToName,
    whSingleCodeToName
  },
  created () {
    this.tableData && this.tableData.length && this.tableData.forEach((item, i) => {
      if (item && item.visitType) this.visitType = item.visitType
      if (item && item.isMine) {
        this.mineIndex = i
        this.mineArr.push(item)
      }
      if (item && item.price) {
        this.countPrice = floatTool.add(this.countPrice, item.price)
      }
    })
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
    // 发药匹配改变背景颜色 start
    tableHeaderRowClassName ({ row, rowIndex }) {
      if (this.isMatchSearch && this.curPutCode && this.changeTableBg && this.curPutCode === this.changeTableBg) {
        return 'mark-row'
      }
      return ''
    },
    tableRowClassName ({ row, rowIndex }) {
      if (this.isMatchSearch && this.curPutCode && this.changeTableBg && this.curPutCode === this.changeTableBg) {
        return 'mark-row'
      }
      return ''
    },
    // end
    ...patch
  },
  watch: {}
}
</script>

<style lang="less" scoped>
</style>
