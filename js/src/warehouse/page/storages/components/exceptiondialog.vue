<!-- 异常标记弹窗 -->
<template>
  <div class="exception-dialog">
    <el-dialog
      title="请选择取消异常的药品"
      :visible.sync="visibleDialog"
      :modal-append-to-body="false"
      class="ui_dialog_02"
    >
      <el-checkbox-group v-model="dialogData.checkedItems">
        <div
          class="table-content"
          style="padding: 0 10px"
          v-for="(item, index) in exceptionData"
          :key="index"
          :class="Array.isArray(item) && (item[0].adviceType === '303' || item[0].adviceType === '304') ? 'table-tcm-content' : ''"
        >
          <!-- 门诊发药才有 -->
          <el-row
            type="flex"
            align="middle"
            justify="start"
            class="table_title"
            v-if="Array.isArray(item)"
          >
            <el-col :span="24">
              <span>处方单号：</span>
              <span v-if="item[0].recipeCode">{{item[0].recipeCode}}</span>
              <span class="ml20" v-if="item[0].adviceExecuteId">执行单号： {{item[0].adviceExecuteId}}</span>
              <span class="ml20">申请时间：</span>
              <span v-if="item[0].createTime">{{item[0].createTime | formatDateByExp}}</span>
            </el-col>
          </el-row>
          <!-- 门诊发药 -->
          <!-- 西药 -->
          <el-table
            v-if="Array.isArray(item) && item[0].adviceType !== '303' && item[0].adviceType !== '304'"
            :data.sync="item[1]"
            style="width: 100%"
            height="300px"
            border
          >
            <el-table-column width="30">
              <template slot-scope="scope">
                <span
                  v-if="operate === 'cancel' && !scope.row.outpatientDispenseItem.identification"
                ></span>
                <el-checkbox v-else :label="scope.row">{{scope.row.index}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  v-if="scope.row.outpatientDispenseItem.identification == 1"
                  content="异常"
                  placement="top"
                >
                  <svg class="icon" aria-hidden="true" style="font-size: 18px; height: 18px">
                    <use xlink:href="#icon-yi"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column :width="!CONSUMABLES_TYPE.includes(item[0].adviceType) ? 255 : 600" label="物资名称">
              <template slot="header" slot-scope="scope">
                <el-tooltip v-if="!CHINESE_MEDICINE_TYPE.includes(item[0].adviceType)" class="item" :content="`${needIcon.name}`" effect="dark" placement="top">
                  <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
                    <use :xlink:href="'#' + needIcon.icon"></use>
                  </svg>
                </el-tooltip>
                <span>物资名称</span>
              </template>
              <template slot-scope="scope">
                <wh-code-to-name
                  :isExt="true"
                  :patchObj="{
                    code: SEARCH_CODE,
                    list: scope.row.localSetting && scope.row.localSetting.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
                <p class="red" v-if="scope.row.outpatientDispenseItem.identification">
                  <span>{{"异常原因："}}</span>
                  <span v-html="filterClassifyList(scope.row.outpatientDispenseItem.classifyList)"></span>
                </p>
              </template>
            </el-table-column>
            <el-table-column width="100" label="规格">
              <template slot-scope="scope">
                <wh-code-to-name
                  :isExt="true"
                  v-if="scope.row.localSetting && CONSUMABLES_TYPE.includes(item[0].adviceType)"
                  :showIcon="false"
                  :patchObj="{
                    code: [SPEC, PACKAGE_CODE],
                    list: scope.row.localSetting.materialSkuObject.ext,
                    isInfo: false,
                    mark: '/'
                  }">
                </wh-code-to-name>
                <wh-code-to-name
                  v-else
                  :isExt="true"
                  :showIcon="false"
                  :patchObj="{
                    code: [SPU_SPEC_CODE],
                    list: scope.row.localSetting && scope.row.localSetting.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </template>
            </el-table-column>
            <el-table-column width="100" label="剂型" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
              <template slot-scope="scope">
                <wh-single-code-to-name
                  :isExt="true"
                  v-if="scope.row.localSetting"
                  :patchObj="{list: scope.row.localSetting.materialSkuObject.ext, code: DOSAGE}"
                ></wh-single-code-to-name>
              </template>
            </el-table-column>
            <el-table-column width="80" label="每次用量" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
              <template
                slot-scope="scope"
              >{{scope.row.outpatientDispenseItem.measure}}{{scope.row.outpatientDispenseItem.measureUnitName}}</template>
            </el-table-column>
            <el-table-column width="100" label="频次" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
              <template slot-scope="scope">
                <span>{{scope.row.outpatientDispenseItem.useFreqTxt}}</span>
              </template>
            </el-table-column>
            <el-table-column width="60" label="天数" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
              <template slot-scope="scope">
                <span>{{`${scope.row.outpatientDispenseItem.totalUseDay}天`}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" label="途径" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
              <template slot-scope="scope">
                <span>
                  {{scope.row.outpatientDispenseItem.employtxt}}
                  <sys-value
                    type="THC_CPOE_DropRate"
                    v-if="scope.row.outpatientDispenseItem.dropSpeed"
                    :code="scope.row.outpatientDispenseItem.dropSpeed"
                  ></sys-value>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="数量">
              <template slot-scope="scope">
                <span>{{scope.row.outpatientDispenseItem.num}}</span>
                <!-- <span
                  v-if="scope.row.localSetting"
                >{{parserComplex({data: scope.row.localSetting.materialSkuObject.ext})}}</span> -->
                <wh-single-code-to-name
                  :isExt="true"
                  v-if="scope.row.localSetting"
                  :patchObj="{
                    list: scope.row.localSetting.materialSkuObject.ext
                  }"
                ></wh-single-code-to-name>
              </template>
            </el-table-column>
          </el-table>
          <!-- 中药 -->
          <div
            class="tcm-template"
            v-else-if="(Array.isArray(item) && item[0].adviceType === '303') || (Array.isArray(item) && item[0].adviceType === '304')"
          >
            <el-row class="tcm-item">
              <el-col :span="8" v-for="(items, index) in item[1]" :key="index" class="f16">
                <span v-if="operate === 'cancel' && !items.outpatientDispenseItem.identification"></span>
                <el-checkbox v-else :label="items">{{items.index}}</el-checkbox>
                <chinese-name :data="items" :otherData="items.outpatientDispenseItem"></chinese-name>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" justify="start" class="tcm-bottom">
              <el-col :span="3">
                <span class="span-label">剂数：</span>
                <span
                  class="red big"
                >{{item[1][0].outpatientDispenseItem.num / item[1][0].outpatientDispenseItem.measure}}</span>剂
              </el-col>
              <el-col :span="6">
                <span class="span-label ml20">频次：</span>
                <span>{{item[1][0].outpatientDispenseItem.useFreqTxt}}</span>
              </el-col>
              <el-col :span="5">
                <span class="span-label ml20">用法：</span>
                <span>{{item[1][0].outpatientDispenseItem.employtxt}}</span>
              </el-col>
              <el-col :span="4">
                <span class="span-label ml20">是否代煎：</span>
                <span>{{item[1][0].outpatientDispenseItem.decoct === '1' ? '代煎' : '否'}}</span>
              </el-col>
              <el-col :span="6" v-if="item[1][0].outpatientDispenseItem.entrust">
                <span class="span-label fl">嘱托：</span>
                <el-tooltip placement="top">
                  <div slot="content">{{item[1][0].outpatientDispenseItem.entrust}}</div>
                  <span class="tooltip fl">{{item[1][0].outpatientDispenseItem.entrust}}</span>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <!-- 住院发药 -->
          <el-table
            v-else-if="item.uddDispenseItemList"
            :data.sync="item.uddDispenseItemList"
            style="width: 100%"
            border
          >
            <el-table-column width="50">
              <template slot-scope="scope">
                <!-- <el-checkbox :label="scope.row">{{scope.row.index}}</el-checkbox> -->
                <span v-if="operate === 'cancel' && !scope.row.identification"></span>
                <el-checkbox v-else :label="scope.row">{{scope.row.index}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  v-if="scope.row.identification == 1"
                  content="异常"
                  placement="top"
                >
                  <svg class="icon" aria-hidden="true" style="font-size: 18px; height: 18px">
                    <use xlink:href="#icon-yi"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="140" label="开嘱医生">
              <template slot-scope="scope">
                <span v-if="scope.row.doctorObject">{{scope.row.doctorObject.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="物资名称">
              <template slot="header" slot-scope="scope">
                <el-tooltip class="item" :content="`${needIcon.name}`" effect="dark" placement="top">
                  <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
                    <use :xlink:href="'#' + needIcon.icon"></use>
                  </svg>
                </el-tooltip>
                <span>物资名称</span>
              </template>
              <template slot-scope="scope">
                <!-- <chinese-name
                  :data="scope.row"
                  :otherData="scope.row.outpatientDispenseItem">
                </chinese-name>-->
                <wh-code-to-name
                  v-if="scope.row.localSettingObject"
                  :isExt="true"
                  :patchObj="{
                    code: SEARCH_CODE,
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                  :showSourceValue="scope.row.source"
                ></wh-code-to-name>
                <p class="red" v-if="scope.row.identification">
                  <span>{{"异常原因："}}</span>
                  <span v-html="filterClassifyList(scope.row.classifyList)"></span>
                </p>
              </template>
            </el-table-column>
            <el-table-column width="70" label="规格">
              <template slot-scope="scope">
                <wh-code-to-name
                  :isExt="true"
                  v-if="scope.row.localSettingObject"
                  :showIcon="false"
                  :patchObj="{
                    code: [SPU_SPEC_CODE],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </template>
            </el-table-column>
            <el-table-column width="100" label="剂型">
              <template slot-scope="scope">
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    code: [DOSAGE],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </template>
            </el-table-column>
            <el-table-column width="100" label="每次用量">
              <template slot-scope="scope">{{scope.row.measure}}{{scope.row.unitName}}</template>
            </el-table-column>
            <!-- <el-table-column
              label="频次">
              <template slot-scope="scope">
                <span>{{scope.row.useFreqTxt}}</span>
              </template>
            </el-table-column>-->
            <el-table-column align="right" width="80" label="数量">
              <template slot-scope="scope">
                <span>{{scope.row.num}}</span>
                <wh-single-code-to-name
                v-if="scope.row.localSettingObject"
                :isExt="true"
                :patchObj="{
                  list: scope.row.localSettingObject.materialSkuObject.ext
                }">
              </wh-single-code-to-name>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <div class="ml10">
          <el-input
            v-if="operate === 'sign'"
            v-model="dialogData.inputVal"
            maxlength="100"
            placeholder="请输入异常原因"
          ></el-input>
          <el-button
            class="ml10"
            @click="handleSave"
            :disabled="dialogData.checkedItems.length === 0 || (operate === 'sign' && dialogData.inputVal === '')"
            :loading="submitLoading"
            type="primary"
          >保存</el-button>
          <el-button @click="handleCancle" type="text">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SEARCH_CODE, patch, SPU_SPEC_CODE, DOSAGE, MATERILA_CODE, CONSUMABLES_TYPE, SPEC, PACKAGE_CODE, CHINESE_MEDICINE_TYPE, WEST_MEDICINE_TYPE, parserComplex } from '@/util/common'
import chineseName from '@/warehouse/page/storages/dispensings/components/chinese.name'
import { setUpClassifyName } from '@/util/formcustom'
export default {
  props: ['exceptionData', 'visible', 'operate'],
  data () {
    return {
      SEARCH_CODE,
      SPEC,
      PACKAGE_CODE,
      parserComplex,
      WEST_MEDICINE_TYPE,
      SPU_SPEC_CODE,
      CHINESE_MEDICINE_TYPE,
      DOSAGE,
      CONSUMABLES_TYPE,
      submitLoading: false,
      MATERILA_CODE,
      setUpClassifyName,
      dialogData: {
        checkedItems: [],
        inputVal: ''
      }
    }
  },
  methods: {
    handleSave () {
      this.submitLoading = true
      this.$emit('confirm', this.dialogData)
    },
    handleCancle () {
      this.$emit('update:visible', false)
    },
    filterClassifyList (list) {
      if (list && list.length) {
        let arr = []
        list.map((item, index) => {
          arr.push(`<div><span>${index + 1}、</span>${setUpClassifyName(item, true, 'childClassifyItem', 'contentText')}</div>`)
        })
        // 异常原因只有一条不显示前面的 1、
        if (arr.length === 1) {
          arr[0] = arr[0].replace(new RegExp('<span>1、</span>'), '')
        }
        return arr.join('')
      }
    },
    ...patch
  },
  computed: {
    needIcon () {
      let adviceType = this.exceptionData[0].adviceType ? this.exceptionData[0].adviceType : this.exceptionData[0][0].adviceType
      let needname = {}
      const typeId = {
        301: 'iconyaopin1',
        299: 'iconhaocai',
        300: 'iconhaocai',
        10008: 'iconshangpin1',
        302: 'iconyaopin1'
      }
      needname = {
        name: adviceType === '301' ? '西药' : adviceType === '300' ? '医疗耗材' : adviceType === '10008' ? '商品' : '中成药',
        icon: typeId[adviceType]
      }
      return needname
    },
    visibleDialog: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.submitLoading = false
        this.dialogData.checkedItems = []
        this.dialogData.inputVal = ''
      }
    }
  },
  components: {
    chineseName
  }
}
</script>
<style lang="less" scoped>
// .hospital-layout .list-msg p /deep/ span {
//   margin-left: 0;
// }
.ui_dialog_02
  .el-dialog
  .el-dialog__footer
  .el-button.el-button--primary.is-disabled {
  color: #fff;
}
.exception-dialog {
  p {
    span {
      margin-right: 10px;
      button {
        padding: 0;
      }
    }
  }
  .dialog-footer {
    > div {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 500px;
      }
      /deep/ .ml10 {
        margin-left: 10px;
      }
    }
  }
  .el-checkbox-group {
    font-size: 14px;
  }
  .table-tcm-content {
    padding-bottom: 20px;
    .tcm-template {
      margin-top: 10px;
      padding: 0 10px;
      background-color: #f0f0f0;
      .tcm-item {
        padding: 10px 0;
      }
      .tcm-bottom {
        padding-bottom: 10px;
      }
      .span-label {
        color: #9ea09e;
      }
      .big {
        font-size: 18px;
      }
    }
  }
  .red {
    color: #ee4433;
  }
  .tooltip {
    width: 50%;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
}
</style>
