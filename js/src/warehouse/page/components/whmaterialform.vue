<template>
  <div>
    <div class="layout_inner">
      <!-- 返回栏 -->
      <h2 class="alg_c">{{breadCrumbName}}</h2>
      <!-- 顶部搜索区域 -->
      <div class="content-top">
        <!-- <el-input v-if="objId" :disabled="true" v-model="classifyName"></el-input> -->
        <el-form v-if="showClassifyName" label-width="120px" style="background-color: #F5F5F5;">
          <el-form-item label="分类：">{{showClassifyName}}</el-form-item>
        </el-form>
        <ever-form2
          v-show="!showClassifyName"
          label-width="0px"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="10"
          :rules="rules"
          @submit="submitForm()"
          :nosubmit="true"
          style="background-color: #F5F5F5; height: 40px; padding: 10px 200px;"
        >
          <template slot="classifyId">
            <ever-select
              v-model="obj.type1"
              filterable
              placeholder="一级分类"
              :clearable="true"
              :options="options1"
              class="queryClass"
            ></ever-select>
            <ever-select
              v-if="obj.type1 && options2.length"
              v-model="obj.type2"
              filterable
              placeholder="二级分类"
              :clearable="true"
              :options="options2"
              class="queryClass"
            ></ever-select>
            <ever-select
              v-if="obj.type2 && options3.length"
              v-model="obj.type3"
              filterable
              placeholder="三级分类"
              :clearable="true"
              :options="options3"
              class="queryClass"
            ></ever-select>
            <div class="query-model" v-if="obj.classifyId && saveBtn">
              <el-select
                v-model="queryVal"
                filterable
                :default-first-option="true"
                clearable
                style="width: 100%"
                remote
                @change="handelChange"
                value-key="id"
                :placeholder="queryPlaceholder"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="(option, i) in options"
                  :key="i"
                  :label="option.name"
                  :value="option"
                ></el-option>
              </el-select>
            </div>
          </template>
        </ever-form2>
      </div>
      <!-- 西药/中药/耗材 -->
      <template
        v-if="[...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE, ...CONSUMABLES_TYPE].includes(obj.classifyId)"
      >
        <!-- 中间schema表单区域 -->
        <div class="content-center">
          <el-row class="mt15 row-container">
            <!-- 左侧内容区域 -->
            <el-col :span="16">
              <div class="content-center-left" :class="{'content-center-left-bottom': saveBtn}">
                <!-- 表单 -->
                <ever-form2
                  :key="onlyKey"
                  ref="formLeft"
                  :schema="schemaLeft"
                  v-model="objLeft"
                  :rules="rulesLeft"
                  @submit="submitForm()"
                  :nosubmit="true"
                >
                  <template slot="basicInfo" v-if="saveBtn">
                    <h3 class="primary-info primary-title">基础信息</h3>
                  </template>
                  <template
                    slot="signInfo"
                    v-if="saveBtn && [...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                  >
                    <h3 class="primary-info primary-title">标志信息</h3>
                  </template>
                  <template
                    slot="financeInfo"
                    v-if="saveBtn && [...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                  >
                    <h3 class="primary-info primary-title">财务信息</h3>
                  </template>
                  <template
                    slot="manageInfo"
                    v-if="saveBtn && ![...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                  >
                    <h3 class="primary-info primary-title">管理信息</h3>
                  </template>
                  <template
                    slot="saleInfo"
                    v-if="saveBtn && ![...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                  >
                    <h3 class="primary-info primary-title">销售信息</h3>
                  </template>
                  <template
                    slot="doctorAdvice"
                    v-if="saveBtn && [...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                  >
                    <h3 class="primary-info primary-title">
                      医嘱信息
                      <span class="doctor-tip">注意：以下内容，请依据临床医嘱实际情况填写</span>
                      <span
                        v-if="!isClinic && statusEdit && WEST_MEDICINE_TYPE.includes(obj.classifyId)"
                        class="test-data"
                        @click="handlerCheckData"
                      >检查数据正确性</span>
                    </h3>
                  </template>
                  <template slot="pictureDescribe" v-if="saveBtn">
                    <div class="showpicture">
                      <el-popover
                        popper-class="carousel-example-img"
                        placement="right"
                        trigger="click"
                      >
                        <el-carousel
                          :interval="5000"
                          :arrow="legend.length > 1 ? 'always' : 'never'"
                        >
                          <el-carousel-item v-for="item in legend" :key="item">
                            <img :src="item" :alt="item">
                          </el-carousel-item>
                        </el-carousel>
                        <el-button
                          type="text"
                          :disabled="isClinic || !statusEdit"
                          slot="reference"
                        >{{!isClinic && statusEdit ? '图例说明' : ''}}</el-button>
                      </el-popover>
                    </div>
                  </template>
                </ever-form2>
                <!-- 规格表格 -->
                <div class="content-center-table" v-if="saveBtn">
                  <el-table :data="specTableData">
                    <!-- 包装规格：西药 -->
                    <el-table-column
                      v-if="WEST_MEDICINE_TYPE.includes(obj.classifyId)"
                      label="包装规格"
                    >
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            :class="{'require-red': haveSubmit && !scope.row['SXX000049']}"
                            v-model="scope.row['SXX000049']"
                            :disabled="!!objId && !disabledTable(scope.$index)"
                          >
                            <template slot="append">{{showLabel(ZHIJI_CODE, objLeft[ZHIJI_CODE])}}</template>
                          </el-input>
                        </div>
                        <div class="subHr pos_re">/</div>
                      </template>
                    </el-table-column>
                    <!-- 型号规格：耗材 / 规格：中药 -->
                    <el-table-column
                      v-if="[...CONSUMABLES_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                      :label="CONSUMABLES_TYPE.includes(obj.classifyId) ? '型号规格'
                      : CHINESE_MEDICINE_TYPE.includes(obj.classifyId) ? '规格' : ''"
                    >
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :class="{'require-red': haveSubmit && !scope.row['SXX000008']}"
                            v-model="scope.row['SXX000008']"
                            :disabled="!!objId && !disabledTable(scope.$index)"
                          >
                            <template
                              v-if="CHINESE_MEDICINE_TYPE.includes(obj.classifyId)"
                              slot="append"
                            >{{showLabel(ZHIJI_CODE, objLeft[ZHIJI_CODE])}}</template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 单位 -->
                    <el-table-column
                      width="120"
                      :label="CONSUMABLES_TYPE.includes(obj.classifyId) ? '计量单位' : ''"
                      v-if="[...WEST_MEDICINE_TYPE, ...CONSUMABLES_TYPE].includes(obj.classifyId)"
                    >
                      <template slot-scope="scope">
                        <div class="is-required">
                          <ever-select
                            v-model="scope.row['SXX000048']"
                            :class="{'require-red': haveSubmit && !scope.row['SXX000048']}"
                            :options="specSchemaData.schema[1].props.initOptions"
                            :disabled="!!objId && !disabledTable(scope.$index)"
                          ></ever-select>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 单价 -->
                    <el-table-column
                      label="销售单价"
                      v-if="[...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(obj.classifyId)
                      || (CONSUMABLES_TYPE.includes(obj.classifyId) && objLeft.ifService == '2')"
                    >
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            :class="{'require-red': haveSubmit && !scope.row[PRICE_CODE]}"
                            v-model="scope.row[PRICE_CODE]"
                            :disabled="!!objId && !statusEdit"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 条码 -->
                    <el-table-column
                      label="条码"
                      v-if="[...WEST_MEDICINE_TYPE, ...CONSUMABLES_TYPE].includes(obj.classifyId)"
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row['SXX000050']"
                          :disabled="!!objId && !statusEdit"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <!-- 药效比：中药颗粒 -->
                    <el-table-column label="药效比" v-if="CHINESE_PATENT_MEDICINE === obj.classifyId">
                      <template slot-scope="scope">
                        <el-input
                          type="number"
                          v-model="scope.row['SXX000052']"
                          :disabled="!!objId && !statusEdit"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <!-- 状态 - 启用/禁用 -->
                    <el-table-column v-if="!statusEdit" label="状态" align="center" width="150">
                      <template slot-scope="scope">
                        <div
                          v-if="scope.row.switchState && !skuState(Number(scope.row.switchState))"
                          class="group-disabled red"
                        >集团禁用</div>
                        <el-switch
                          v-else
                          :disabled="switchStateLoading"
                          :value="skuState(scope.row.state)"
                          @change="clickSwitchSkuState(specTableData, scope.row)"
                          active-text="启用"
                          inactive-text="禁用"
                        ></el-switch>
                      </template>
                    </el-table-column>
                    <!-- 删除按钮 -->
                    <el-table-column v-else align="center" width="150">
                      <template slot-scope="scope">
                        <el-button
                          v-if="disabledTable(scope.$index) && scope.$index"
                          type="danger"
                          size="small"
                          class="spec-button"
                          @click="removeSpecData(scope.$index)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 允许按制剂单位销售 -->
                  <el-table
                    :show-header="false"
                    :data="specExtraTableData"
                    style="margin-top: -1px"
                  >
                    <el-table-column label="包装规格">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            v-model="scope.row.packageVal"
                            :disabled="true"
                          >
                            <template slot="append">{{showLabel(ZHIJI_CODE, objLeft[ZHIJI_CODE])}}</template>
                          </el-input>
                        </div>
                        <div class="subHr pos_re">/</div>
                      </template>
                    </el-table-column>
                    <el-table-column width="120">
                      <template slot-scope="scope">
                        <ever-select
                          v-model="objLeft[ZHIJI_CODE]"
                          :options="specSchemaData.schema[1].props.initOptions"
                          :disabled="true"
                        ></ever-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="销售单价">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            :class="{'require-red': haveSubmit && !scope.row.extraPrice}"
                            type="number"
                            :disabled="!!objId && !statusEdit"
                            v-model="scope.row.extraPrice"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="条码">
                      <template slot-scope="scope">{{scope.row.title}}</template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="150">
                      <template slot-scope="scope">
                        <div
                          v-if="!statusEdit && scope.row.switchState && !skuState(Number(scope.row.switchState))"
                          class="group-disabled red"
                        >集团禁用</div>
                        <el-switch
                          v-else-if="!statusEdit"
                          :disabled="switchStateLoading"
                          :value="skuState(scope.row.state)"
                          @change="clickSwitchSkuState(specExtraTableData, scope.row)"
                          active-text="启用"
                          inactive-text="禁用"
                        ></el-switch>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-table
                    :data="specExtraTableData"
                    class="extra-table">
                    <el-table-column width="420">
                      <template slot-scope="scope">{{scope.row.title}}</template>
                    </el-table-column>
                    <el-table-column>
                      <template slot-scope="scope">
                        <el-input :class="{'require-red': haveSubmit && !scope.row.extraPrice}" type="number" :disabled="!!objId && !statusEdit" v-model="scope.row.extraPrice"></el-input>
                        <span class="unit-span">元</span>
                      </template>
                    </el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column width="100"></el-table-column>
                  </el-table>-->
                  <div v-if="!isClinic && statusEdit" class="add-specifications">
                    <span
                      class="add-tips"
                      @click="addSpecData(obj.classifyId)"
                      v-if="showSpecBtn"
                    >添加规格</span>
                    <div class="checked" v-if="WEST_MEDICINE_TYPE.includes(obj.classifyId)">
                      <el-checkbox
                        v-model="specExtraPrice"
                        :disabled="Boolean(specTableData.length === 0 || (!!objId && resultObj.splitFlag))"
                      >允许按制剂单位销售</el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <!-- 右侧内容区域 -->
            <el-col :span="8" class="row-right">
              <div class="content-center-right" v-if="saveBtn">
                <p class="right-title">说明书信息</p>
                <div class="right-content">
                  <ever-form2
                    ref="formRight"
                    :schema="schemaRight"
                    v-model="objRight"
                    :rules="rulesRight"
                    @submit="submitForm()"
                    :nosubmit="true"
                  ></ever-form2>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 底部按钮区域 -->
        <div class="table-btn-ml_80" v-if="buttonVisible && !statusEdit">
          <el-button v-if="saveBtn || objId" type="primary" @click="editTable()" size="large">编辑</el-button>
        </div>
        <div class="table-btn-ml_80" v-if="buttonVisible && statusEdit">
          <el-button
            v-if="saveBtn || objId"
            type="primary"
            @click="submitForm()"
            size="large"
            :loading="submitDisableBtn"
          >保存</el-button>
        </div>
      </template>
      <!-- 非西药 -->
      <template v-else>
        <div class="content-box">
          <ever-form2
            label-width="180px"
            :schema="schemaNew"
            v-model="obj"
            ref="formOther"
            :span="12"
            :rules="rules"
            @submit="submitForm()"
            :nosubmit="true"
          >
            <template slot="primaryInfo" v-if="saveBtn">
              <h3 class="primary-info">基本信息</h3>
            </template>
            <template slot="skuInfo">
              <div class="hr primary-info"></div>
              <h3 class="primary-info">规格</h3>
              <div class="primary-info" style="margin-top: 20px;">
                <el-table class="hide-table-body" style="width: 100%" :data="tempTableData">
                  <el-table-column width="50"></el-table-column>
                  <el-table-column v-if="objId" min-width="150px" label="物资编码" prop="code"></el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === BLOOD_CLASSIFYID"
                    min-width="150px"
                    label="创建医嘱项目"
                  >
                    <template slot-scope="scope">
                      <ever-select
                        class="is-required"
                        v-model="medicalOrder"
                        :options="yesno"
                        placeholder="创建医嘱项目"
                      ></ever-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === BLOOD_CLASSIFYID"
                    min-width="150px"
                    label="基础价"
                  >
                    <template slot-scope="scope">
                      <sys-text
                        v-if="medicalOrder && medicalOrder === yesno[1].id"
                        class="is-required"
                        v-model="basePrice"
                        placeholder="基础价"
                      ></sys-text>
                    </template>
                  </el-table-column>
                  <el-table-column
                    min-width="150px"
                    :resizable="false"
                    v-for="(item, index) in skuTableData"
                    :key="index"
                    :label="item.label"
                  >
                    <template slot-scope="scope">
                      <div>
                        <sku-table
                          :data="item"
                          v-model="scope.row[item.prop]"
                          :value="item.value"
                          :objId="scope.row.id"
                        ></sku-table>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :resizable="false" label="操作" width="150" prop>
                    <template slot-scope="scope">
                      <el-button type="success" size="small" @click="handleSaveSku(scope.row)">保存</el-button>
                      <el-button type="primary" size="small" @click="handleCancleSku(scope.row)">取消</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  :data="tableData"
                  style="width: 100%; margin-top: -10px; z-index: 2; border-top: none"
                  :show-header="false"
                  border
                  @selection-change="handleSelectionChange"
                  :stripe="false"
                >
                  <el-table-column type="selection" width="50"></el-table-column>
                  <el-table-column v-if="objId" min-width="150px" prop="code"></el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === BLOOD_CLASSIFYID"
                    min-width="150px"
                    prop
                  >
                    <template slot-scope="scope">
                      <ever-select
                        style="width: 90%;"
                        v-model="scope.row.ifService"
                        :options="yesno"
                        placeholder="创建医嘱项目"
                        :disabled="true"
                      ></ever-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === BLOOD_CLASSIFYID"
                    min-width="150px"
                    prop="price"
                  ></el-table-column>
                  <el-table-column
                    min-width="150px"
                    v-for="(item, index) in skuTableData"
                    :key="index"
                    :label="item.label"
                    prop
                  >
                    <template slot-scope="scope">{{_setColumnName(scope.row, item.prop)}}</template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" prop>
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleEdit(scope.row, scope.$index)"
                      >编辑</el-button>
                      <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(scope.row, scope.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <template slot="managementModel">
              <!-- <el-checkbox
                label="按数量管理"
                v-model="obj.isNum"
                disabled
                :true-label="1"
                :false-label="0"
              ></el-checkbox>-->
              <el-checkbox
                label="按有效期管理"
                v-model="obj.isExpiryDate"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
              <el-checkbox
                label="按唯一码管理"
                v-model="obj.isManageAlone"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
              <span
                class="ml20 pl20 light-gray"
                style="color: red;"
              >药品和医疗耗材必须勾选有效期管理，一物一码的物资还需要勾选唯一码管理</span>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <div v-if="schemaNew.length && !slots && saveBtn">
            <div v-for="(item, i) in slotsData" :key="i">
              <ever-form2
                label-width="180px"
                class="mt20"
                :schema="item.schemaSlot"
                v-model="item.objSlot"
                :ref="item.formSlot"
                :span="12"
                :rules="item.rulesSlot"
                :nosubmit="true"
              >
                <div slot="default"></div>
              </ever-form2>
            </div>
          </div>
          <div v-if="schemaNew.length && slots">
            <slot v-for="item in slots" :name="item"></slot>
          </div>
          <div class="table-btn-ml_80">
            <el-button
              v-if="saveBtn || objId"
              type="primary"
              @click="submitForm()"
              size="large"
              :loading="submitDisableBtn"
            >保存</el-button>
          </div>
        </div>
      </template>
      <!-- 检查数据正确性 -->
      <dialog-slot title="检查数据正确性" :dialogSlot.sync="dialogSlot">
        <material-calc
          v-if="dialogSlot"
          :params="calcParams"
          :obj="objLeft"
          :type="unitType"
          :schema="schemaLeft"
          :unitName="defUnitName"
          :channelName="channelName"
          :frequencyName="frequencyName"
          :adviceName="adviceName"
          :frequencyNum="frequencyNum"
          :preparationUnitName="preparationUnitName"
          :packageUnitObj="packageUnitObj"
          :name="unitName"
        ></material-calc>
        <div slot="footer" class="dialog-footer alg_c">
          <el-button type="primary" @click="dialogSlot = !dialogSlot">关闭</el-button>
        </div>
      </dialog-slot>
    </div>
  </div>
</template>
<script>
import { convertCharToPinyin } from '@/components/pinyin.js'
import { MATERIALTEMPLATE, WEST_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE, CONSUMABLES_TYPE, CHINESE_PATENT_MEDICINE, CONSUMABLES_MEDICAL_TYPE, CONSUMABLES_OFFICE_TYPE } from '@/util/warehouseconfig'
import classify from '@/warehouse/util/classify'
import SkuTable from '@/warehouse/page/components/skutable'
import frequencyApi from '@/warehouse/store/sob.api'
import { floatTool, whComFn, debounce, PROPERTY_TYPE_FOR_TEMPLET, GLOBAL_ATTR, PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY, dateFormat, patch, CHECK_CODE, MATERILA_PINYIN_CODE, SEARCH_CODE, BLOOD_CLASSIFYID, yesno, MATERIALTYPE, DRUGTYPE, CUSTOM_MATERIAL_CODE_DICT, CUSTOM_MATERIAL_CODE, GENERAL_CODE, DOSAGE, FREQUENCY_CODE, ZHIJI_CODE, PACKAGE_CODE, PACKAGE_TRANSFORM_CODE, BAR_CODE, DOSE, SPEC, PRODUCER } from '@/util/common'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
import { createdSchemaAndObjectValue, readonlyObjItem, setUpClassifyName, _findIndex } from '@/util/formcustom'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import materialCalc from './material.calc'
const rulesInfo = {
  managementModel: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
}
const PRICE_CODE = 'price' // 'SXX190309000018h4dd'
const specSchemaArr = ['SXX000049', 'SXX000048', PRICE_CODE, 'SXX000050']
export default {
  props: ['systemType', 'isEdit', 'isLocalPrice', 'parentSchema', 'customApi', 'customType', 'isSearch', 'backListRoute', 'propertyName', 'propertyNameValues', 'organization', 'slots', 'slotsData', 'titleCode', 'propertyParentName', 'relationName', 'relationType', 'isSubmitForm', 'isClinic'],
  mixins: [classify],
  data () {
    return {
      onlyKey: '',
      changeTotalCount: 0, // 记录剂量单位变化次数更改默认剂量是否为空
      dialogSlot: false,
      PRICE_CODE,
      unitType: '', // 1:成分  2:成药  3:制剂
      unitName: '',
      defUnitName: '', // 剂量单位名
      preparationUnitName: '', // 制剂单位名
      packageUnitObj: {}, // 包装规格
      channelName: '', // 给药途径名
      frequencyName: '', // 用药频次名
      frequencyNum: 1, // 用药频次次数
      adviceName: '', // 医嘱名称
      calcParams: {}, // 参与计算数据
      dosageOptions: [],
      unitOptionns: [], // 制剂单位
      showClassifyName: '',
      PACKAGE_CODE,
      PACKAGE_TRANSFORM_CODE,
      ZHIJI_CODE,
      BLOOD_CLASSIFYID, // 类型 - 血液
      WEST_MEDICINE_TYPE, // 类型 - 西药/中成药
      CHINESE_MEDICINE_TYPE, // 类型 - 中药饮片/中药颗粒
      CONSUMABLES_TYPE, // 类型 - 医疗耗材/办公耗材/商品
      CHINESE_PATENT_MEDICINE, // 类型 - 中药颗粒
      queryVal: '',
      obj: {},
      schema: [],
      tempObj: {},
      resultObj: {},
      tempSchema: [],
      objId: this.$route.params.id,
      rules: {},
      saveBtn: false,
      loading: false,
      materialDictSkuId: '',
      options: [],
      skuTableData: [],
      tableData: [],
      tempTableData: [],
      thisKeysForSku: [],
      thisKeysForSpu: [],
      countId: 0,
      notUseDialog: false,
      inUseDialog: false,
      deleteId: 0,
      statusEdit: false, // 是否可以编辑状态
      showSpecBtn: false,
      cacheResult: {},
      schemaInfo: [],
      spuObj: {},
      // 编辑缓存关联关系
      cacheRelation: [],
      // 查询placeholder
      queryPlaceholder: '通用名 / 商品名 / 批准文号',
      breadCrumbName: '',
      yesno,
      // 创建医嘱项目
      medicalOrder: '',
      submitDisableBtn: false, // 保存按钮loading
      switchStateLoading: false, // 状态启用禁用loading
      // 基础价
      basePrice: '',
      // +++++++++++++++++++++++++非西药++++++++++++++++++++++++++++++
      schemaNew: [],
      // ++++++++++++++++++++++++++西药+++++++++++++++++++++++++++++++
      classifyName: '', // 物资类型名称
      categoryList: [], // 药理分类
      arraySpu: [], // 后台返回的spu数据
      arraySku: [], // 后台返回的sku数据
      propertiesSpuSku: [], // 后台返回的spu+sku的properties数据
      // 左侧form表单Schema
      fixedCodeArr: [], // 左侧固定模版
      fixedSchema: [], // 左侧固定模版
      fixedObj: {}, // 左侧固定模版
      fixedRules: {}, // 左侧固定模版
      schemaLeft: [],
      objLeft: {},
      rulesLeft: {},
      legend: [], // 图例说明
      // 规格表格数据
      specSchemaArr,
      specSchemaData: {},
      specTableData: [],
      specExtraPrice: false, // 是否允许按制剂单位销售
      specExtraRowData: {
        title: '以制剂单位销售',
        packageVal: 1,
        extraPrice: ''
      },
      specExtraTableData: [], // 以制剂单位销售的价格
      // 右侧form表单Schema
      schemaRight: [],
      objRight: {},
      rulesRight: {},
      haveSubmit: false // 是否点过提交按钮
    }
  },
  created () {
    this.fetchCategoryRelations() // 请求药理分类
    if (!this.objId) { // 新建
      this.statusEdit = true
      this.breadCrumbName = '新建' + this.customType
      let schema = []
      schema.push({
        name: 'classifyId',
        label: '',
        comp: 'custom',
        span: 24
      })
      if (this.isSearch) schema.push({ name: 'queryModel', label: '', comp: 'custom', span: 24 })
      this.schema = schema
      this.obj = this.$ever.createObjFromSchema(schema)
      this.obj.classifyId = ''
      this.obj.type1 = ''
      this.obj.type2 = ''
      this.obj.type3 = ''
      this.obj = Object.assign({}, this.obj)
      this.tempObj = Object.assign({}, this.obj)
      this.obj.isExpiryDate = 0
      this.obj.isManageAlone = 0
      this.tempSchema = this.schema
      if (this.organization) {
        this._queryDictModel(this.organization)
      }
    } else { // 编辑
      this.schemaInfo.splice(0, 1)
      this.schemaInfo.push({
        name: 'classifyName',
        label: '',
        comp: 'readonlyitem',
        span: 24
      })
      this.obj.classifyId = ''
      this.getDetail()
    }
  },
  mounted () {
    document.getElementById('layout_box').style.height = 'calc(100vh - 85px)' // 解决内容过多，引起整个页面的滑动，影响最顶部状态栏
  },
  beforeDestroy () {
    document.getElementById('layout_box').style.height = '' // 还原高度
  },
  computed: {
    // 按钮是否可见
    buttonVisible () {
      return (!this.isClinic && this.saveBtn && !this.isEdit) || this.isLocalPrice
    }
  },
  methods: {
    // ==========================================================
    // 请求药理分类数据
    fetchCategoryRelations () {
      templetApi.categoryList().then(res => {
        this.categoryList = whComFn.sectionMap(res, 'pharmacologyCategories')
      })
    },
    // 编辑查看请求详情数据
    getDetail () {
      this.customApi.getById(this.objId, '', this.isClinic).then(result => {
        if (result && (result.flag || result.id)) {
          this.obj.classifyId = result.classifyId
          // this._dataRendering(result)
          this._dataNewRendering({ result, flag: true })
        }
      })
    },
    // 通过搜索框搜索选择物资
    async handelChange (v) {
      this.materialDictSkuId = ''
      this.schema = this.tempSchema
      this.tempTableData = []
      if (v) {
        this.materialDictSkuId = v.id
        this._dataNewRendering({ result: this.cacheResult })
        this.obj = readonlyObjItem(this.obj, v.materialDictPropertys, true)
        this.objLeft = readonlyObjItem(this.objLeft, v.materialDictPropertys, true)
        this.objRight = readonlyObjItem(this.objRight, v.materialDictPropertys, true)
        this._filterSchema(this.spuObj)
        let materialArr = await this.customApi.getthismaterialinfo(this.materialDictSkuId, this.obj.classifyId)

        if (materialArr && materialArr.flag) {
          let resultList = JSON.parse(JSON.stringify(materialArr))
          if ((this.obj.type1 === DRUGTYPE || this.obj.type1 === MATERIALTYPE || this.obj.type1 === BLOOD_CLASSIFYID) && resultList.materialDictSkus && resultList.materialDictSkus.length) {
            resultList.materialDictSkus.forEach(item => {
              item.ifService = ''
              item.price = ''
            })
          }
          // 全局药理分类字典
          if (resultList.categoryMaterialDictRelations) {
            this.$ever.getFieldFromSchema(this.schemaNew, 'categoryMaterialDictRelations').props.valueArray = resultList.categoryMaterialDictRelations
            this.obj.categoryMaterialDictRelations = resultList.categoryMaterialDictRelations
          }
          this.tableData = resultList.materialDictSkus ? resultList.materialDictSkus : []
        }
      } else {
        this.queryVal = ''
        this.tableData = []
        this._dataNewRendering({ result: this.cacheResult, flag: true })
      }
    },
    // 查询物资
    remoteMethod (query) {
      let codeQuery = []
      // 判断是否是血液
      if (this.obj.classifyId === BLOOD_CLASSIFYID) {
        codeQuery = GENERAL_CODE
        this.queryPlaceholder = '血液品种 / ABO血型 / RH(D)血型'
      } else {
        codeQuery = MATERILA_PINYIN_CODE.concat(SEARCH_CODE)
        this.queryPlaceholder = '通用名 / 商品名 / 批准文号'
      }
      let params = {
        classifyId: this.obj.classifyId,
        codesMatchValues: [{ codes: codeQuery, value: query }],
        offset: 0,
        pagesize: 20
      }
      templetApi.materialList(params).then(result => {
        if (result) {
          result.forEach(item => {
            if (this.obj.classifyId === BLOOD_CLASSIFYID) {
              item.name = this._resetMaterialName({ rows: item.materialDictPropertys, code: GENERAL_CODE, attributeValue: 'materialDictPropertyValues', isInfo: false })
            } else {
              item.name = this._resetMaterialName({ rows: item.materialDictPropertys })
            }
          })
          this.options = result
        } else {
          this.options = []
        }
      })
    },
    // 根据所选物资类型查询模版
    _queryDictModel (val) {
      templetApi.queryDictModel({ classifyId: val, systemType: this.systemType }).then(result => {
        if (result && result.flag) {
          this.cacheResult = result
          this._dataNewRendering({ result, flag: true })
          // 耗材规格根据是否生成医嘱项变化而变化，已在生成动态模版中处理
          if (!CONSUMABLES_TYPE.includes(val)) this.addSpecData(val)
        } else {
          this.resetFormData()
          this.saveBtn = false
        }
      })
    },
    // 新的渲染模版方法
    _dataNewRendering ({ result, flag, change }) {
      // 查看编辑 - 更新标题名称
      if (this.objId) {
        this.breadCrumbName = this._resetMaterialName({ rows: result.materialPropertys })
        this.showClassifyName = setUpClassifyName(result.classifyVoObject)
      }
      // 区分物资类型，创建schema
      if (WEST_MEDICINE_TYPE.includes(result.classifyId)) { // 西药/中成药
        this.fixedSchemaByCodes(result, MATERIALTEMPLATE.WEST_TEMPLATE)
      } else if (CHINESE_MEDICINE_TYPE.includes(result.classifyId)) { // 中药饮片/中药颗粒
        this.fixedSchemaByCodes(result, MATERIALTEMPLATE.CHINESE_TEMPLATE)
      } else if (CONSUMABLES_TYPE.includes(result.classifyId)) { // 耗材
        if (CONSUMABLES_MEDICAL_TYPE === result.classifyId) { // 医疗耗材
          this.fixedSchemaByCodes(result, MATERIALTEMPLATE.CONSUMABLES_TEMPLATE)
        } else { // 其他耗材
          this.fixedSchemaByCodes(result, Object.assign({}, MATERIALTEMPLATE.CONSUMABLES_TEMPLATE, MATERIALTEMPLATE.CONSUMABLES_TEMPLATE2))
        }
      } else { // 其他
        if (result.classifyId !== BLOOD_CLASSIFYID) this.medicalOrder = 1 // 默认医嘱项为否
        let bedIndex = -1
        if (this.slotsData && result.classifyId && this.slotsData.BED_CLASSIFYID) bedIndex = _findIndex(this.slotsData.BED_CLASSIFYID, result.classifyId)
        let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
        let SPU
        if (flag) {
          this.resetFormData()
          SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu)
        } else {
          this.resetFormData()
          SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly: true })
        }
        // 存储spu propertyCode
        this.spuObj = SPU.obj
        let index = this.schemaNew.findIndex(item => {
          return item.name === 'primaryInfo'
        })
        if (index > 0) this.schemaNew.splice(index, 1)
        this.schemaNew.push({
          name: 'primaryInfo',
          label: '',
          comp: 'custom',
          span: 24
        })
        this.schemaNew = this.schemaNew.concat(SPU.schema).concat(this.parentSchema || [])
        // 添加管理方式
        if (!change) this._customSchema({ schema: this.schemaNew, obj: this.obj, dataRes: this.obj })
        this.schemaNew.push({ name: 'managementModel', label: '管理方式', comp: 'custom', span: 24 })
        this.schemaNew.push({ name: 'skuInfo', label: '', comp: 'custom', span: 24 })
        this.obj.managementModel = 1
        this.obj.isNum = 1
        this.obj.isExpiryDate = 0
        this.obj.isManageAlone = 0
        if (result.keysForSku && result.keysForSku.length) {
          this.skuTableData = this._tableHeaders(result.keysForSku, result.templetPropertiesForSku || result.templetDictPropertiesForSku, flag)
          this.thisKeysForSku = result.keysForSku
          let tempInit = {}
          for (let i = 0; i < this.skuTableData.length; i++) {
            let item = this.skuTableData[i]
            // sku去重判断增加属性当前index,和code
            CHECK_CODE.forEach((checkItem, i) => {
              if (item.prop === checkItem.code) {
                item.checkIndex = i
                item.checkCode = checkItem.code
              }
            })
            tempInit[item.prop] = item.value
          }
          this.tempTableData = [tempInit]
        }
        if (result.length > 1) {
          this.tableData = result
          this.tableData.splice(0, 1)
        }
        this.obj = Object.assign({}, this.obj, SPU.obj)
        this.rules = Object.assign(SPU.rules, rulesInfo)
        this.resultObj = Object.assign({}, result, this.obj)
        this.saveBtn = true
        // 机构关联关系需要往父级组件通信   目前临时解决方案
        if (bedIndex > -1) this.$emit('typeSelectChange', { name: result.classifyId, code: result.code || '' })
      }
    },
    // 根据物资类型 - 添加规格
    addSpecData: debounce(function (materialType) {
      this.haveSubmit = false
      this.showSpecBtn = false
      if (WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
        this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.WEST_OPTIONS.SPECSCHEMAARR))
      } else if (CHINESE_MEDICINE_TYPE.includes(materialType) && CHINESE_PATENT_MEDICINE !== materialType) { // 中药饮片
        this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_ONE))
      } else if (CHINESE_MEDICINE_TYPE.includes(materialType) && CHINESE_PATENT_MEDICINE === materialType) { // 中药颗粒
        this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_TWO))
      } else if (CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        if (Number(this.objLeft.ifService) === 2) { // 生成医嘱项
          this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE))
        } else { // 不生成医嘱项
          this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO))
        }
      }
    }),
    // 根据固定模版查找SPU+SKU 返回schema数据
    fixedSchemaByCodes (resultObj, template) {
      this.resultObj = Object.assign({}, resultObj)
      if (resultObj.materialPropertys) { // 生产厂商
        const produceIndex = resultObj.materialPropertys.findIndex(v => v.propertyCode === PRODUCER)
        if (produceIndex > -1) this.currentProduce = resultObj.materialPropertys[produceIndex].propertyValue
      }
      if (resultObj.classifyVoObject) this.classifyName = setUpClassifyName(resultObj.classifyVoObject) // 物资名称
      // 拼合 后台数据返回properties
      this.propertiesSpuSku = resultObj.templetPropertiesForSpu.concat(resultObj.templetPropertiesForSku)
      this.arraySpu = resultObj.keysForSpu
      this.arraySku = resultObj.keysForSku
      // 拼合 基础信息/标志信息/财务信息/医嘱信息
      this.fixedCodeArr = [] // 获取左侧所有code集合（用来过滤后台返回的SPU+SKU，未匹配到的均为右侧form表单schema）
      let tempObj = {} // 待拼合数据对象，格式为：标题 + 基础 + 标题 + 标志 + 标题 + 财务 + 标题 + 医嘱
      for (let key in template) {
        this.fixedCodeArr = this.fixedCodeArr.concat(template[key].INFO)
        tempObj[key] = createdSchemaAndObjectValue(template[key].INFO, this.propertiesSpuSku, { disabled: !!this.objId && !this.statusEdit })
      }
      // 拼合左侧schema对象
      this.fixedSchema = []
      for (let key in template) {
        // 添加标题
        if (template[key].TITLE) {
          this.fixedSchema.push({
            name: template[key].TITLE.name,
            comp: 'custom',
            span: template[key].TITLE.span || 24,
            attrs: template[key].TITLE.attrs || {}
          })
        }
        // 添加内容
        this.fixedSchema = this.fixedSchema.concat(tempObj[key].schema)
        this.fixedObj = Object.assign({}, this.fixedObj, tempObj[key].obj)
        this.fixedRules = Object.assign({}, this.fixedRules, tempObj[key].rules)
        // 添加后补内容
        if (template[key].SUB) {
          this.fixedSchema.push({
            name: template[key].SUB.name,
            comp: 'custom',
            span: template[key].SUB.span || 24,
            attrs: template[key].SUB.attrs || {}
          })
        }
      }
      // 处理不同物资类型，特殊化操作
      this.materialBusiness(resultObj.classifyId)
    },
    // 区分物资类型具体业务
    materialBusiness (materialType) {
      if ([...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE].includes(materialType)) { // 药品
        // 医嘱剂量单位设置宽度
        this.fixedSchema.forEach(v => {
          if (v.name === 'SXX000011') v.span = 8
        })
        // 处理药理分类
        let categoryRelationsIndex = this.fixedSchema.findIndex(v => v.name === 'categoryRelations')
        this.fixedSchema.splice(categoryRelationsIndex, 1, {
          name: 'categoryRelations',
          label: '药理分类',
          comp: 'whCascaderMulti',
          span: 12,
          props: {
            options: this.categoryList,
            disabled: !!this.objId,
            searchPlaceholder: '请输入药理分类',
            placeholder: '请输入药理分类'
          }
        })
        // 拼合左侧模版属性及教验规则
        if (this.objId) this.fixedObj = readonlyObjItem(this.fixedObj, this.resultObj.materialPropertys, true)
        this.objLeft = Object.assign({}, this.fixedObj)
        this.rulesLeft = Object.assign({}, this.fixedRules)
        // 默认财务分类
        if (!this.objId) this.setDefaultDisabled(this.fixedSchema, 'SXX19030500001ATTD+', true, false)
        if (WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
          // 默认剂量单位 - 成分单位
          if (!this.objId) this.objLeft['SXX000011'] = 'f49cff24-4c96-4be7-9f79-889b423ae975'
          // 监听剂量单位
          this.$watch('objLeft.SXX000011', val => {
            if (val) {
              this.changeTotalCount++
              this.dynamicSchemaByCodes(val, this.resultObj.classifyId, false)
              // 清空默认剂量
              if (this.changeTotalCount > 1) this.objLeft[DOSE] = ''
            }
          })
        } else if (CHINESE_MEDICINE_TYPE.includes(materialType)) { // 中药饮片/中药颗粒
          if (!this.objId) {
            // 默认剂型并禁止编辑
            this.setDefaultDisabled(this.fixedSchema, 'SXX000007', true, true)
            // 默认剂量单位 - 制剂单位
            this.objLeft['SXX000011'] = '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a'
          }
          // 设置制剂单位占位长度
          this.fixedSchema[this.fixedSchema.findIndex(v => v.name === ZHIJI_CODE)].span = 8
        }
        this.dynamicSchemaByCodes(this.objLeft['SXX000011'], this.resultObj.classifyId, true)
        // 药理分类回写
        if (this.objId && this.resultObj.categoryMaterialRelations) {
          this.objLeft.categoryRelations = []
          this.resultObj.categoryMaterialRelations.forEach(v => {
            if (v.levelRelation) this.objLeft.categoryRelations.push(v.levelRelation)
          })
        }
      } else if (CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        // 处理 按有效期管理
        this.appendCustomComponent(this.fixedSchema, 'isExpiryDate', '按有效期管理', 'sysSelect', MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE)
        // 处理 一物一码管理
        this.appendCustomComponent(this.fixedSchema, 'isManageAlone', '一物一码管理', 'sysSelect', MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE)
        // 处理 生成医嘱项 (办公耗材不需要生成)
        if (CONSUMABLES_OFFICE_TYPE === materialType) {
          const serviceIndex = this.fixedSchema.findIndex(v => v.name === 'ifService')
          this.fixedSchema.splice(serviceIndex, 1)
        } else {
          this.appendCustomComponent(this.fixedSchema, 'ifService', '生成医嘱项', 'sysSelect', MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_TWO)
        }
        // 自定义验证规则
        const customRules = [{ required: true, message: '必填项' }]
        // 拼合左侧模版属性及教验规则
        if (this.objId) this.fixedObj = readonlyObjItem(this.fixedObj, this.resultObj.materialPropertys, true)
        this.objLeft = Object.assign({}, this.fixedObj)
        this.rulesLeft = Object.assign({}, this.fixedRules, {
          isExpiryDate: customRules,
          isManageAlone: customRules,
          ifService: customRules
        })
        this.dynamicSchemaByCodes(1, this.resultObj.classifyId, true)
        // 动态模版
        if (!this.objId) { // 新增
          // 默认 有效期管理 & 一物一码管理
          this.objLeft.isExpiryDate = MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE[1].id
          this.objLeft.isManageAlone = MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE[0].id
          // 默认 办公耗材不需要生成医嘱项
          if (CONSUMABLES_OFFICE_TYPE === materialType) this.objLeft.ifService = MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_TWO[0].id
        } else { // 编辑
          // 数据回写
          this.objLeft.isExpiryDate = String(this.resultObj.isExpiryDate) // 按有效期管理
          this.objLeft.isManageAlone = String(this.resultObj.isManageAlone) // 一物一码管理
          this.objLeft.ifService = String(this.resultObj.materialSkus[0].ifService) // 生成医嘱项
        }
      }
    },
    // 设置默认项，并禁止编辑
    setDefaultDisabled (schema, code, defaultValue, disabledEdit) {
      try {
        const index = schema.findIndex(v => v.name === code)
        if (defaultValue) this.objLeft[code] = schema[index].props.initOptions[0].id
        if (disabledEdit) schema[index].props.disabled = true
      } catch (error) { }
    },
    // 添加自定义组件
    appendCustomComponent (schema, name, label, comp, options) {
      // 查找索引
      const index = schema.findIndex(v => v.name === name)
      // 添加组件
      schema.splice(index, 1, {
        name,
        label,
        comp,
        span: 12,
        props: {
          options,
          disabled: !!this.objId,
          placeholder: `请选择${label}`
        }
      })
    },
    // 非固定schema
    dynamicSchemaByCodes (id, materialType, first) {
      if (first) this.handleProduceItem()
      this.onlyKey = new Date().getTime()
      if (WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
        // ================== 动态变化模块 ==================
        const aList = MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEOPTIONS[id || 'f49cff24-4c96-4be7-9f79-889b423ae975']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 8, disabled: !!this.objId && !this.statusEdit })
        medicineOption.schema[medicineOption.schema.length - 1].span = 24 // 最后一个占满一行
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        if (this.objId) medicineOption.obj = readonlyObjItem(medicineOption.obj, this.resultObj.materialPropertys, true)
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        this.calcParams = aList // 参与计算参数
        // 初始化成分单位option
        this.unitOptionns = this.findOriginOptions(this.schemaLeft, 'SXX000053') // 获取制剂单位options
        Object.assign(this.rulesLeft, medicineOption.rules)
        // ================== 规格表格模块 ==================
        this.specSchemaData = createdSchemaAndObjectValue(Object.keys(MATERIALTEMPLATE.WEST_OPTIONS.SPECSCHEMAARR), this.propertiesSpuSku)
        if (this.objId) {
          this.specTableData = []
          this.resultObj.materialSkus.forEach(v => {
            this.specTableData.push(Object.assign(
              JSON.parse(JSON.stringify(readonlyObjItem(this.specSchemaData.obj, v.materialPropertys || {}, true))),
              { [PRICE_CODE]: v.price },
              { id: v.id, state: this.isClinic ? v.localState : v.state, switchState: this.isClinic ? String(v.state) : '', isClinic: this.isClinic }
            ))
          })
        }
        // 监听剂量单位
        const selectUnitOptions = this.findOriginOptions(this.schemaLeft, 'SXX000011') // 获取剂量单位options
        const unitId = id || 'f49cff24-4c96-4be7-9f79-889b423ae975'
        let watchName = 'objLeft.SXX000053'
        let slotCode = DOSE
        // 医嘱图例说明数据
        this.legend = MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEIMGS[unitId]
        this.dosageOptions = this.findOriginOptions(this.schemaLeft, DOSAGE) // 获取剂型options
        if (unitId === 'f49cff24-4c96-4be7-9f79-889b423ae975') { // 成分
          watchName = 'objLeft.SXX000053'
          this.unitType = 1
        } else if (unitId === '340fa155-327b-479b-8c5c-bc24c23b2734') { // 成药
          this.unitOptionns = this.findOriginOptions(this.schemaLeft, 'SXX000054') // 获取制剂单位options
          watchName = 'objLeft.SXX000054'
          this.unitType = 2
        } else if (unitId === '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a') { // 制剂
          this.unitOptionns = this.findOriginOptions(this.schemaLeft, ZHIJI_CODE) // 获取制剂单位options
          watchName = `objLeft.${ZHIJI_CODE}`
          this.unitType = 3
        }
        // 初始化计量slot
        this.setPropertySlots(this.unitOptionns, DOSE, this.objLeft[watchName.split('.')[1]])
        this.watchPropertySchema(watchName, this.unitOptionns, slotCode)
        this.unitName = this.findOptinsName(selectUnitOptions, unitId)
        // 是否以制剂单位销售
        if (this.objId && this.resultObj.splitFlag) this.specExtraPrice = true
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEOPTIONS)
      } else if (CHINESE_MEDICINE_TYPE.includes(materialType)) { // 中药饮片/中药颗粒
        // ================== 动态变化模块 ==================
        const aList = MATERIALTEMPLATE.CHINESE_OPTIONS.MEDICINEOPTIONS[id || '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 8, disabled: !!this.objId && !this.statusEdit })
        medicineOption.schema[medicineOption.schema.length - 1].span = 24 // 最后一个占满一行
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        if (this.objId) medicineOption.obj = readonlyObjItem(medicineOption.obj, this.resultObj.materialPropertys, true)
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        Object.assign(this.rulesLeft, medicineOption.rules)
        // ================== 规格表格模块 ==================
        if (CHINESE_PATENT_MEDICINE !== materialType) { // 中药饮片
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_ONE), this.propertiesSpuSku)
        } else { // 中药颗粒
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_TWO), this.propertiesSpuSku)
        }
        if (this.objId) {
          this.specTableData = []
          this.resultObj.materialSkus.forEach(v => {
            this.specTableData.push(Object.assign(
              JSON.parse(JSON.stringify(readonlyObjItem(this.specSchemaData.obj, v.materialPropertys || {}, true))),
              { [PRICE_CODE]: v.price },
              { id: v.id, state: this.isClinic ? v.localState : v.state, switchState: this.isClinic ? String(v.state) : '', isClinic: this.isClinic }
            ))
          })
        }
        // 监听制剂单位
        let watchName = `objLeft.${ZHIJI_CODE}`
        let slotCode = DOSE
        this.unitOptionns = this.findOriginOptions(this.schemaLeft, ZHIJI_CODE) // 获取制剂单位options
        // 初始化计量slot
        this.setPropertySlots(this.unitOptionns, DOSE, this.objLeft[watchName.split('.')[1]])
        this.watchPropertySchema(watchName, this.unitOptionns, slotCode)
        // 是否以制剂单位销售
        if (this.objId && this.resultObj.splitFlag) this.specExtraPrice = true
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(MATERIALTEMPLATE.CHINESE_OPTIONS.MEDICINEOPTIONS)
      } else { // 耗材
        // ================== 动态变化模块 ==================
        const aList = MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE[id || '1']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 12, disabled: !!this.objId && !this.statusEdit })
        const lastSchemaItem = medicineOption.schema[medicineOption.schema.length - 1] // 获取最后一个schema元素
        if (lastSchemaItem) lastSchemaItem.span = 24 // 最后一个占满一行
        // 确认生成医嘱项，处理销售单位option，修改 包装单位 为 计量单位
        if (Number(id) === 2) {
          const indexArr = [
            medicineOption.schema.findIndex(v => v.name === 'SXX19030700004BLxfN'),
            medicineOption.schema.findIndex(v => v.name === 'SXX19030700003BLuIE')
          ]
          indexArr.forEach(index => {
            medicineOption.schema[index].props.initOptions.forEach(v => {
              if (v.name === '包装单位') v.name = '计量单位'
            })
          })
        }
        if (this.objId) medicineOption.obj = readonlyObjItem(medicineOption.obj, this.resultObj.materialPropertys, true)
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        Object.assign(this.rulesLeft, medicineOption.rules)
        // 默认财务分类 & 销售单位
        if (Number(id) === 2) {
          if (CONSUMABLES_MEDICAL_TYPE === materialType) { // 医疗耗材
            this.setDefaultDisabled(this.schemaLeft, 'SXX19030500001ATTD+', true, false) // 财务分类
          }
          ['SXX19030700004BLxfN', 'SXX19030700003BLuIE'].forEach(code => { // 销售单位
            this.setDefaultDisabled(this.schemaLeft, code, true, false)
          })
        }
        // ================== 规格表格模块 ==================
        // 规格表格
        this.specTableData = []
        if (Number(id) === 2) { // 生成医嘱项
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE), this.propertiesSpuSku)
          this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE))
        } else { // 不生成医嘱项
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO), this.propertiesSpuSku)
          this.specTableData.push(Object.assign({}, MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO))
        }
        if (this.objId) {
          this.specTableData = []
          this.resultObj.materialSkus.forEach(v => {
            this.specTableData.push(Object.assign(
              JSON.parse(JSON.stringify(readonlyObjItem(this.specSchemaData.obj, v.materialPropertys || {}, true))),
              { [PRICE_CODE]: v.price },
              { id: v.id, state: this.isClinic ? v.localState : v.state, switchState: this.isClinic ? String(v.state) : '', isClinic: this.isClinic }
            ))
          })
        }
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE)
      }
      if (this.objId) this.showSpecBtn = true
    },
    // 生产厂商单独处理（因为生产厂商是接口查询数据，没有固定option，会出现变成id的bug）
    handleProduceItem () {
      const produceIndex = this.fixedSchema.findIndex(v => v.name === PRODUCER)
      if (produceIndex > -1) {
        this.fixedSchema[produceIndex].props.isAutoSeach = false
        this.fixedSchema[produceIndex].props.useObject = true
      }
    },
    // 右侧剩余schema
    leftSchemaByCodes (codeList) {
      // 拼合右侧Schema
      let leftCode = []
      Object.values(codeList).map(item => {
        leftCode.push(...item)
      })
      leftCode = [...this.fixedCodeArr, ...leftCode]
      let tempCodeArrRight = this.arraySpu.filter(v => {
        return !leftCode.includes(v)
      })
      this.schemaRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku, { span: 24, disabled: !!this.objId && !this.statusEdit }).schema
      this.objRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku).obj
      this.rulesRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku).rules
      if (this.objId) this.objRight = readonlyObjItem(this.objRight, this.resultObj.materialPropertys, true)
      this.saveBtn = true
    },
    // 监控属性
    watchPropertySchema (watchName, options, code) {
      this.$watch(watchName, (v) => {
        if (v) this.setPropertySlots(options, code, v)
      })
    },
    setPropertySlots (options, code, val) {
      const index = this.schemaLeft.findIndex(item => {
        return item.name === DOSE
      })
      if (index > -1) {
        this.schemaLeft[index].slots = [
          {
            name: 'append',
            template: `<span>${val ? this.findOptinsName(options, val) : ''}</span>`
          }
        ]
      }
      this.defUnitName = this.findOptinsName(options, val)
      this.schemaLeft = JSON.parse(JSON.stringify(this.schemaLeft))
    },
    findOptinsName (list, val) {
      const index = list.findIndex(item => {
        return item.id === val
      })
      return index > -1 ? list[index].name : ''
    },
    findOriginOptions (list, code) {
      let options = []
      list.map(item => {
        if (item.name === code) {
          options = [...item.props.initOptions]
        }
      })
      return options
    },
    // 检查数据正确性(仅西药)
    async handlerCheckData () {
      // 初始化包装规格单位
      this.packageUnitObj = {}
      // 初始化用药频次
      this.frequencyNum = 1
      // 给药途径
      let aChannel = []
      // 频次code
      let frequencyCode = this.objLeft[FREQUENCY_CODE]
      // 包装单位options
      const packageOptions = this.specSchemaData.schema[1].props.initOptions
      const specData = this.specTableData[0]
      // 添加了至少一条规格数据
      if (specData) {
        this.packageUnitObj.value = specData[PACKAGE_TRANSFORM_CODE]
        this.packageUnitObj.name = this.findOptinsName(packageOptions, specData[PACKAGE_CODE])
      }
      if (frequencyCode) {
        await frequencyApi.getFrequency(frequencyCode).then(res => {
          if (res.data) this.frequencyNum = res.data.num
        })
      }
      const channelOption = this.findOriginOptions(this.schemaLeft, 'SXX000016')
      this.objLeft['SXX000016'].map(item => {
        aChannel.push(this.findOptinsName(channelOption, item))
      })
      this.channelName = aChannel.join(',') // 途径
      this.frequencyName = this.findOptinsName(this.findOriginOptions(this.schemaLeft, 'SXX000017'), this.objLeft['SXX000017']) // 频次
      this.preparationUnitName = this.findOptinsName(this.findOriginOptions(this.schemaLeft, ZHIJI_CODE), this.objLeft[ZHIJI_CODE]) // 频次
      // let aTempName = []
      // tempAdviceCode.map(item => {
      // })
      this.adviceName = ''
      this.adviceName += this.objLeft[GENERAL_CODE]
      this.adviceName += ' - ' + this.findOptinsName(this.dosageOptions, this.objLeft[DOSAGE])
      // this.adviceName += this.objLeft[GENERAL_CODE]
      // let aValid = []
      // this.calcParams.map(key => {
      //   if ((Array.isArray(this.objLeft[key]) && this.objLeft[key].length) || (!Array.isArray(this.objLeft[key]) && this.objLeft[key])) {
      //     aValid.push((Array.isArray(this.objLeft[key]) && this.objLeft[key].length) || (!Array.isArray(this.objLeft[key]) && this.objLeft[key]))
      //   }
      // })
      // if (aValid.length && aValid.every(flag => flag === true))
      this.dialogSlot = true
    },
    // 删除规格
    removeSpecData: debounce(function (index) {
      this.specTableData.splice(index, 1)
      this.showSpecBtn = true
    }),
    // 规格输入框/选择框/勾选框等。。是否禁用
    disabledTable (index) {
      // 1.非详情的时候（新建），不禁用；
      // 2.详情的时候，sku表格数据数量小于等于索引值的时候，说明是新增了数据，此时不禁用；
      return !this.resultObj.materialSkus || (this.resultObj.materialSkus && this.resultObj.materialSkus.length <= index)
    },
    // 显示规格单位
    showLabel (code, id) {
      let tempSchema = this.schemaLeft.filter(v => {
        return v.name === code
      })
      let tempResult = tempSchema[0].props.initOptions.filter(v => {
        return v.id === id
      })
      if (tempResult[0]) {
        return tempResult[0].name
      } else {
        return ''
      }
    },
    // SKU禁用启用状态
    skuState (state) {
      if (state === 0) {
        return true
      } else if (state === 1) {
        return false
      }
    },
    // 点击启用禁用
    clickSwitchSkuState: debounce(function (data, row) {
      if (!this.isClinic) { // 集团
        this.$confirm(`
          <p class="confirm-title">是否${row.state === 1 ? '启用' : '禁用'}该物资？</p>
          <p class="confirm-text">1、该物资对应的医嘱项和收费项一同${row.state === 1 ? '启用' : '禁用'}</p>
          <p class="confirm-text">2、机构中${row.state === 1 ? '被禁用的物资不会自动启用' : '该物资一同禁用'}</p>`,
          `${row.state === 1 ? '启用' : '禁用'}物资`, {
            customClass: 'confirmstyle',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.switchSkuState(data, row)
          }).catch(() => { })
      } else { // 机构
        this.$confirm(`
          <p class="confirm-title">是否${row.state === 1 ? '启用' : '禁用'}该物资？</p>
          <p class="confirm-text">该物资对应的医嘱项和收费项一同${row.state === 1 ? '启用' : '禁用'}</p>`,
          `${row.state === 1 ? '启用' : '禁用'}物资`, {
            customClass: 'confirmstyle',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.switchSkuState(data, row)
          }).catch(() => { })
      }
    }),
    // 更改sku状态
    switchSkuState: debounce(function (data, row) {
      this.switchStateLoading = true
      let state = 0
      if (this.skuState(row.state)) state = 1
      this.customApi.updateMaterialSkuMaster({
        id: row.id,
        state,
        isClinic: this.isClinic
      }).then(res => {
        this.switchStateLoading = false
        if (res && res.flag) {
          this.$messageTips(this, 'success', `${state === 0 ? '启用' : '禁用'}成功`, ' ')
          const tempIndex = data.findIndex(v => v.id === row.id)
          if (tempIndex > -1) data[tempIndex].state = state
        }
      })
    }),
    // 编辑
    editTable: debounce(function () {
      this.statusEdit = true
      if (!this.isLocalPrice) {
        [...this.fixedSchema, ...this.schemaLeft, ...this.schemaRight].forEach(v => {
          if (v.hasOwnProperty('props') && v.props.disabled) v.props.disabled = false
        })
        this.availableSchema(this.obj.classifyId)
      }
    }),
    // 处理不同业务下编辑框的特性
    availableSchema (materialType) {
      if (CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        ['isExpiryDate', 'isManageAlone'].forEach(code => { // 有效期管理 & 唯一码管理 都设置为禁用
          this.setDefaultDisabled(this.fixedSchema, code, false, true)
        })
      }
    },
    // 提交
    submitForm: debounce(function () {
      if (!this.obj.classifyId && !this.organization) {
        return this.$messageTips(this, 'warning', '请先选择好物资类型', ' ')
      }
      if ([...WEST_MEDICINE_TYPE, ...CHINESE_MEDICINE_TYPE, ...CONSUMABLES_TYPE].includes(this.obj.classifyId)) { // 西药/中成药
        this.$refs.form.$refs.form.validate(valid => { // 校验顶部类型
          if (valid) {
            this.$refs.formLeft.$refs.form.validate(validLeft => { // 校验左侧form
              if (validLeft) {
                const specTableLen = this.specTableData.length // 规格数量
                if (specTableLen === 0) {
                  return this.$messageTips(this, 'warning', '请先添加规格', ' ')
                }
                this.haveSubmit = true // 标志点击过保存按钮了
                // 校验是否以制剂单位销售
                if (this.specExtraPrice && !this.specExtraTableData[0].extraPrice) return this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
                // 校验规格表格
                if (specTableLen) {
                  let validSpec = true
                  for (let i = 0; i < specTableLen; i++) {
                    const item = this.specTableData[i]
                    for (let key in item) { // 判断必填字段是否有值
                      // 区分物资类型
                      if (WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 西药/中成药
                        if ([PACKAGE_TRANSFORM_CODE, PACKAGE_CODE, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      } else if (CHINESE_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 中药饮片/中药颗粒
                        if ([SPEC, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      } else if (CONSUMABLES_TYPE.includes(this.obj.classifyId)) { // 耗材
                        if ([SPEC, PACKAGE_CODE, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      }
                    }
                    // 是否制剂单位和包装单位相同并且转换比为1 并且规格数量大于1
                    if (this.objLeft[ZHIJI_CODE] === item[PACKAGE_CODE] && +item[PACKAGE_TRANSFORM_CODE] === 1 && specTableLen > 1) {
                      item.splitFlag = 1
                    }
                    // 以制剂单位销售 并且ZHIJI_CODE（制剂单位）值 == PACKAGE_CODE（包装单位）值 PACKAGE_TRANSFORM_CODE（包装转换比） === 1
                    if (this.specExtraPrice && this.objLeft[ZHIJI_CODE] === item[PACKAGE_CODE] && +item[PACKAGE_TRANSFORM_CODE] === 1) {
                      return this.$messageTips(this, 'warning', '填写规格有重复，请核对后再保存', ' ')
                    }
                    if (+this.objLeft[ZHIJI_CODE] === +item[PACKAGE_CODE] && +item[PACKAGE_TRANSFORM_CODE] !== 1) {
                      setTimeout(_ => {
                        item[PACKAGE_TRANSFORM_CODE] = 1
                      }, 1000)
                      return this.$messageTips(this, 'warning', '制剂单位和包装单位相同时，包装转换比只能为1', ' ')
                    }
                    // 2.规格表格 --->
                    for (let n = i + 1; n < specTableLen; n++) {
                      const items = this.specTableData[n]
                      for (let keys in item) {
                        if (keys !== BAR_CODE) {
                          // PACKAGE_TRANSFORM_CODE（包装转换比）相等 并且PACKAGE_CODE（包装单位）相同
                          if (item[PACKAGE_TRANSFORM_CODE] === items[PACKAGE_TRANSFORM_CODE] && item[PACKAGE_CODE] === items[PACKAGE_CODE]) {
                            return this.$messageTips(this, 'warning', '填写规格有重复，请核对后再保存', ' ')
                          }
                        }
                      }
                    }
                    // ==================================================================================
                  }
                  if (!validSpec) return this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
                }
                this.$refs.formRight.$refs.form.validate(validRight => { // 校验右侧form
                  if (validRight) {
                    this.mergeFormData()
                  } else {
                    this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
                  }
                })
              } else {
                this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
              }
            })
          } else {
            this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
          }
        })
      } else { // 非西药/非中成药
        this.$refs.formOther.$refs.form.validate(valid => {
          if (valid) {
            if ((this.obj.materialDictSku === undefined || this.obj.materialDictSku.length === 0)) {
              return this.$messageTips(this, 'warning', '请先选择规格', ' ')
            }
            if (this.obj.materialDictSku && this.obj.materialDictSku.length) {
              this.obj.materialDictSku.forEach(item => {
                if (!item.ifService) {
                  return this.$messageTips(this, 'warning', '已选规格中有医嘱项目必填，请核对后再保存', ' ')
                }
                if (!item.price && !this.objId && item.ifService && item.ifService === yesno[1].id) {
                  return this.$messageTips(this, 'warning', '已选规格中有基础价必填，请核对后再保存', ' ')
                }
              })
            }
            let params = {}
            // 关联关系表单验证
            let slotFlag = true
            let slotArr = {}
            if (this.relationName) {
              params[this.relationName] = []
              if (!this.slots) {
                slotFlag = false
                this.slotsData.forEach(formItem => {
                  this.$refs[formItem.formSlot][0].$refs.form.validate(validSlot => {
                    if (validSlot) {
                      slotFlag = true
                      if (this.relationType) {
                        for (let slotkye in formItem.objSlot) {
                          slotArr[slotkye] = this._relationFilterData({ key: slotkye, data: formItem.objSlot[slotkye] })
                          params[this.relationName] = [...params[this.relationName], ...slotArr[slotkye]]
                        }
                      }
                    }
                  })
                })
              } else {
                if (!this.slotsData.hospitalBedRelationList.length) return this.$messageTips(this, 'warning', '请添加床号、床态、关联病区等信息')
                // 床位关联关系
                this.slotsData.hospitalBedRelationList.forEach((bedItem, index) => {
                  if (this.slotsData.hospitalBedRelationList.length > 1 && index > 0) {
                    if (!bedItem.bedNum && !bedItem.relationId && !bedItem.ifAvailable) {
                      slotFlag = true
                      params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                      params[this.relationName].splice(index, 1)
                    } else {
                      if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
                        slotFlag = false
                        return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
                      } else {
                        slotFlag = true
                        params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                      }
                    }
                  } else {
                    if (!bedItem.bedNum || !bedItem.relationId || !bedItem.ifAvailable) {
                      slotFlag = false
                      return this.$messageTips(this, 'warning', '当前关联关系中必填项录入，请录入后再保存', ' ')
                    } else {
                      slotFlag = true
                      params[this.relationName] = [...this.slotsData.hospitalBedRelationList]
                    }
                  }
                })
              }
              if (this.cacheRelation.length && params[this.relationName].length) {
                this.cacheRelation.forEach(rItem => {
                  params[this.relationName].forEach((sItem, i) => {
                    if (sItem.relationId && rItem.relationId === sItem.relationId) Object.assign(rItem, sItem)
                  })
                })
              }
              params.serviceId = this.slotsData.serviceId
            }
            // 关联关系必填校验
            if (this.relationName && !slotFlag) return
            let materialSpu
            materialSpu = !this.statusEdit ? params.materialSpu = {} : params.materialDictSpu = {}
            Object.assign(materialSpu, {
              materialDictSkus: this.obj.materialDictSku,
              materialDictPropertys: [],
              classifyId: this.obj.classifyId,
              templetId: this.resultObj.templetId || this.resultObj.templetDictId,
              isNum: this.obj.isNum,
              isExpiryDate: this.obj.isExpiryDate,
              isManageAlone: this.obj.isManageAlone
            })
            if (this.materialDictSkuId && !this.objId) {
              Object.assign(materialSpu, { id: this.materialDictSkuId })
            }
            for (let key in this.obj) {
              let array = ['classifyId', 'type1', 'type2', 'type3', 'code', 'classifyVoObject', 'templetPropertiesForSpu', 'keysForSpu'].concat(this.parentObj || [])
              if (!this.objId) {
                array.push('managementModel', 'templetPropertiesForSku', 'keysForSku', 'materialDictSku', 'isNum', 'isExpiryDate', 'isManageAlone', 'queryModel')
              }
              if (this.objectFilter(array, key)) {
                let val = this.obj[key]
                let listParams = {}
                if (this._findPropertyType(key).propertyType === GLOBAL_ATTR[2].id || this._findPropertyType(key).propertyType === GLOBAL_ATTR[3].id) {
                  if (val.constructor !== Array) {
                    listParams[this.propertyNameValues] = {}
                    this.objId ? listParams.materialPropertyValues = this._findSingle(val, key, true) : listParams.materialDictPropertyValues = this._findSingle(val, key, true)
                  } else {
                    this.objId ? listParams.materialPropertyValues = this._findMultiple(val, key, true) : listParams.materialDictPropertyValues = this._findMultiple(val, key, true)
                  }
                } else {
                  listParams.propertyValue = val
                }
                let isDictOrNotDict = ''
                this.objId ? isDictOrNotDict = 'materialPropertys' : isDictOrNotDict = 'materialDictPropertys'
                if ((key === CUSTOM_MATERIAL_CODE_DICT[0].name || key === CUSTOM_MATERIAL_CODE[0].name) && listParams.propertyValue.length) {
                  let propertyValue = []
                  listParams.propertyValue.forEach(item => {
                    propertyValue.push({ pharmacologyCategoryId: item[item.length - 1] })
                    // item.idName && delete item.idName
                    // item.idOptions && delete item.idOptions
                    // item.pharmacologyCategoryObject && delete item.pharmacologyCategoryObject
                    // item.idLists && delete item.idLists
                  })
                  this.objId ? materialSpu.categoryMaterialRelations = propertyValue : materialSpu.categoryMaterialDictRelations = propertyValue
                } else {
                  if (this._findPropertyType(key).propertyCode === key) {
                    materialSpu[isDictOrNotDict].push(Object.assign({
                      propertyCode: key,
                      propertyType: this._findPropertyType(key).propertyType,
                      propertyRelationCode: this._findPropertyType(key).propertyRelationCode,
                      type: PROPERTY_TYPE_FOR_TEMPLET[0].id
                    }, listParams))
                  }
                }
                if (this.objId && this.cacheResult.materialPropertys.length) {
                  this.cacheResult.materialPropertys.forEach(item => {
                    materialSpu[isDictOrNotDict].forEach(itemSpu => {
                      if (item.propertyCode === itemSpu.propertyCode && item.propertyCode === key) Object.assign(itemSpu, item, listParams)
                    })
                  })
                }
              }
            }
            params.systemType = this.systemType
            this.submitDisableBtn = true
            templetApi.createOrUpdate(params).then(result => {
              if (result) {
                this.submitDisableBtn = false
                this.$messageTips(this, 'success', '创建成功', ' ')
                this.$router.push(this.backListRoute)
              }
            })
          } else {
            this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
          }
        })
      }
    }),
    // 聚合待提交的数据
    mergeFormData () {
      // 获取form表单数据
      let allFormData = Object.assign({}, this.objLeft, this.objRight)
      // ===========处理SPU=============
      let paramsSpu = {}
      let materialSpu = {}
      paramsSpu.materialDictSpu = {}
      // 处理药理分类
      let categoryMaterialDictRelations = []
      if (Array.isArray(allFormData.categoryRelations)) {
        allFormData.categoryRelations.forEach(v => {
          categoryMaterialDictRelations.push({
            pharmacologyCategoryId: v[v.length - 1]
          })
        })
      }
      Object.assign(materialSpu, {
        materialDictSkus: this.objLeft.materialDictSku,
        materialDictPropertys: [],
        classifyId: this.obj.classifyId,
        categoryMaterialDictRelations,
        splitFlag: this.specExtraPrice ? 1 : 0,
        preparationUnitId: allFormData[ZHIJI_CODE],
        isExpiryDate: Number(allFormData.isExpiryDate),
        isManageAlone: Number(allFormData.isManageAlone),
        price: this.specExtraPrice ? Number(this.specExtraRowData.extraPrice) : ''
      })
      // 搜索的物资
      if (this.materialDictSkuId && !this.objId) {
        Object.assign(materialSpu, { id: this.materialDictSkuId })
      }
      const allKeys = [...this.resultObj.keysForSpu, ...this.resultObj.keysForSku]
      allKeys.map(key => {
        let val = allFormData[key] || ''
        let listParams = {}
        if (this._findPropertyType(key).propertyType === GLOBAL_ATTR[2].id || this._findPropertyType(key).propertyType === GLOBAL_ATTR[3].id) { // 单选或者多选
          if (val.constructor !== Array) {
            listParams.materialDictPropertyValues = this._findSingle(val, key, true)
          } else {
            listParams.materialDictPropertyValues = this._findMultiple(val, key, true)
          }
        } else { // 普通文本
          listParams.propertyValue = val
        }
        if ((key === CUSTOM_MATERIAL_CODE_DICT[0].name || key === CUSTOM_MATERIAL_CODE[0].name) && listParams.propertyValue.length) { // 处理药理分类
          listParams.propertyValue.forEach(item => {
            item.idName && delete item.idName
            item.idOptions && delete item.idOptions
            item.pharmacologyCategoryObject && delete item.pharmacologyCategoryObject
            item.idLists && delete item.idLists
          })
          materialSpu.categoryMaterialDictRelations = listParams.propertyValue
        } else {
          if (this._findPropertyType(key).propertyCode === key) {
            materialSpu['materialDictPropertys'].push(Object.assign({
              propertyCode: key,
              propertyType: this._findPropertyType(key).propertyType,
              propertyRelationCode: this._findPropertyType(key).propertyRelationCode,
              type: PROPERTY_TYPE_FOR_TEMPLET[0].id
            }, listParams))
          }
        }
      })
      paramsSpu.materialDictSpu = materialSpu
      paramsSpu.systemType = this.systemType
      let params = JSON.parse(JSON.stringify(paramsSpu))
      params.materialDictSpu.materialDictSkus = []
      // ===========处理SKU=============
      this.specTableData.forEach(data => {
        let paramsSku = {
          materialDictPropertys: []
        }
        for (let keys in data) {
          let val = data[keys]
          let listParams = {}
          if (!val) {
            if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[3].id) { // 单选或者多选
              listParams.materialDictPropertyValues = []
            } else {
              listParams.propertyValue = ''
            }
          } else {
            if (val.constructor !== Array) {
              if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id) {
                listParams.materialDictPropertyValues = this._findSingle(val, keys)
              } else {
                listParams.propertyValue = val
              }
            } else {
              listParams.materialDictPropertyValues = this._findMultiple(val, keys)
            }
          }
          if (keys !== PRICE_CODE) {
            if (CHINESE_MEDICINE_TYPE.includes(params.materialDictSpu.classifyId) && keys === PACKAGE_CODE) { // 中药类型包装单位使用制剂单位
              listParams.materialDictPropertyValues = params.materialDictSpu.materialDictPropertys.filter(v => {
                return v.propertyCode === ZHIJI_CODE
              })[0].materialDictPropertyValues
            }
            paramsSku.materialDictPropertys.push(Object.assign(
              {
                propertyCode: keys,
                propertyType: this._findPropertySkuType(keys).propertyType,
                propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
                type: PROPERTY_TYPE_FOR_TEMPLET[1].id
              }, listParams))
          }
        }
        if (data.splitFlag) paramsSku.splitFlag = data.splitFlag // 规格中有splitFlag 就添加进skus中
        params.materialDictSpu.materialDictSkus.push(Object.assign(paramsSku, {
          ifService: allFormData.ifService || 2, // 西药中药均默认为医嘱项，耗材根据选择
          price: allFormData.ifService === 1 ? '' : data[PRICE_CODE]
        }))
      })
      // ===========提交数据=============
      if (this.objId) { // 更新
        let tempParams = JSON.parse(JSON.stringify(this.resultObj))
        // 处理spu
        let tempParamsLack = [] // 找到后端返回的已有数据属性项和模版属性项缺失的某些字段
        materialSpu.materialDictPropertys.map(item => {
          if (tempParams.materialPropertys.findIndex(property => property.propertyCode === item.propertyCode) === -1) tempParamsLack.push(item)
        })
        tempParams.materialPropertys = tempParams.materialPropertys.concat(tempParamsLack) // 拼接缺失属性项
        params.materialDictSpu.materialDictPropertys.forEach(value => {
          tempParams.materialPropertys.forEach(val => {
            if (value.hasOwnProperty('materialDictPropertyValues')) {
              value.materialPropertyValues = [...value.materialDictPropertyValues]
              delete value.materialDictPropertyValues
            }
            if (val.propertyCode === value.propertyCode) {
              if (val.hasOwnProperty('materialPropertyValues') && !value.hasOwnProperty('materialPropertyValues')) {
                value.materialPropertyValues = [] // 置为空，标志该条数据其实并没有修改，而是直接清空不要了
              }
              Object.assign(val, value)
            }
          })
        })
        // 处理药理分类
        if (Array.isArray(params.materialDictSpu.categoryMaterialDictRelations) && Array.isArray(tempParams.categoryMaterialRelations)) {
          params.materialDictSpu.categoryMaterialDictRelations.forEach(value => {
            tempParams.categoryMaterialRelations.forEach(val => {
              if (value.pharmacologyCategoryId === val.pharmacologyCategoryId) {
                value.id = val.id
                value.materialSpuId = val.materialSpuId
              }
            })
          })
        }
        tempParams.categoryMaterialRelations = params.materialDictSpu.categoryMaterialDictRelations
        // 处理sku
        params.materialDictSpu.materialDictSkus.forEach((value, index) => {
          value.materialDictPropertys.forEach(val => {
            tempParams.materialSkus.forEach((v, i) => {
              v.materialPropertys.forEach(a => {
                if (val.hasOwnProperty('materialDictPropertyValues')) {
                  val.materialPropertyValues = JSON.parse(JSON.stringify(val.materialDictPropertyValues))
                  delete val.materialDictPropertyValues
                }
                if ((index === i && a.propertyCode === val.propertyCode)) {
                  Object.assign(val, Object.assign(a, val))
                }
              })
            })
          })
        })
        // 以制剂销售
        if (this.specExtraPrice) {
          tempParams.price = params.materialDictSpu.price
          tempParams.splitFlag = params.materialDictSpu.splitFlag
          tempParams.preparationUnitId = this.objLeft[ZHIJI_CODE]
        }
        let tempMaterialSkusArr = [...tempParams.materialSkus]
        params.materialDictSpu.materialDictSkus.forEach((v, i) => { // 最终操作sku的地方
          v.materialPropertys = [...v.materialDictPropertys]
          delete v.materialDictPropertys
          if (tempMaterialSkusArr[i]) {
            Object.assign(tempMaterialSkusArr[i], v)
          } else {
            tempMaterialSkusArr.push(v)
          }
        })
        tempParams.materialSkus = tempMaterialSkusArr
        delete tempParams.templetPropertiesForSku
        delete tempParams.templetPropertiesForSpu
        this.submitDisableBtn = true
        // 处理生产厂商
        const produceIndex = tempParams.materialPropertys.findIndex(v => v.propertyCode === PRODUCER)
        if (typeof tempParams.materialPropertys[produceIndex].propertyValue === 'object') {
          tempParams.materialPropertys[produceIndex].propertyValue =
            tempParams.materialPropertys[produceIndex].propertyValue.id
        } else if (typeof tempParams.materialPropertys[produceIndex].propertyValue === 'string') {
          tempParams.materialPropertys[produceIndex].propertyValue = this.currentProduce
        }
        if (this.isLocalPrice) {
          let priceArr = []
          tempParams.materialSkus.map(item => {
            priceArr.push({
              serviceId: item.serviceId,
              price: item.price
            })
          })
          templetApi.updateRcmPrice(priceArr).then(result => {
            if (result) {
              this.$messageTips(this, 'success', '更新成功', ' ')
              // 建辉让缓1s再请求
              setTimeout(() => {
                this.submitDisableBtn = false
                this.$router.push(this.backListRoute)
              }, 1000)
            }
          })
        } else {
          templetApi.createOrUpdate(tempParams).then(result => {
            if (result.flag) {
              this.$messageTips(this, 'success', '更新成功', ' ')
              // 建辉让缓1s再请求
              setTimeout(() => {
                this.submitDisableBtn = false
                this.$router.push(this.backListRoute)
              }, 1000)
            }
          })
        }
      } else { // 创建
        this.submitDisableBtn = true
        // 处理生产厂商
        const produceIndex = params.materialDictSpu.materialDictPropertys.findIndex(v => v.propertyCode === PRODUCER)
        if (typeof params.materialDictSpu.materialDictPropertys[produceIndex].propertyValue === 'object') {
          params.materialDictSpu.materialDictPropertys[produceIndex].propertyValue =
            params.materialDictSpu.materialDictPropertys[produceIndex].propertyValue.id
        }
        // 模拟提交 +++++++++++++++++++++
        // console.log(JSON.stringify(params))
        // setTimeout(() => {
        //   this.submitDisableBtn = false
        // }, 1000)
        // +++++++++++++++++++++++++++++
        templetApi.createOrUpdate(params).then(result => {
          if (result) {
            this.$messageTips(this, 'success', '创建成功', ' ')
            // 建辉让缓1s再请求
            setTimeout(() => {
              this.submitDisableBtn = false
              this.$router.push(this.backListRoute)
            }, 1000)
          }
        })
      }
    },
    objectFilter (array, key) {
      let inow = true
      for (let i = 0; i < array.length; i++) {
        if (key === array[i]) {
          inow = false
        }
      }
      return inow
    },
    // 校验价格格式是否正确
    validatePrice (price) {
      const dotNumber = String(price).split('.')[1]
      return Number(price) >= 0 && (!dotNumber || (dotNumber && dotNumber.length <= 4))
    },
    // 重置数据
    resetFormData () {
      this.schemaNew = []
      // =========================
      this.arraySpu = []
      this.arraySku = []
      this.propertiesSpuSku = []
      this.fixedCodeArr = []
      this.fixedSchema = []
      this.fixedObj = {}
      this.fixedRules = {}
      this.schemaLeft = []
      this.objLeft = {}
      this.rulesLeft = {}
      this.specSchemaData = {}
      this.specTableData = []
      this.specExtraPrice = false
      this.specExtraTableData = []
      this.schemaRight = []
      this.objRight = {}
      this.rulesRight = {}
      // =========================
    },
    // ========================== 老方法 ==========================
    // 非西药非中成药 删除规格
    handleDelete (data, index) {
      this.tableData.splice(this.deleteId, 1)
    },
    // 选择表格数据
    handleSelectionChange (tab) {
      this.obj.materialDictSku = tab
    },
    // ********** 已废弃的渲染模版方法 **********
    _dataRendering (results) {
      let result = results[this.propertyParentName] || results
      // 缓存update数据
      this.cacheResult = result
      // 更新标题名称
      let json = { rows: this.propertyName ? result[this.propertyName] : result.materialPropertys }
      // titleCode 外部传入需要标题名称code
      if (this.titleCode) json.code = this.titleCode
      this.breadCrumbName = this._resetMaterialName(json)
      let renderSpu = result.templetPropertiesForSpu || result.templetProperties
      // 机构编辑部门or科室只能查看
      let SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly: true })
      // 存储spu propertyCode
      this.spuObj = SPU.obj
      this.statusEdit === 'edit' ? this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true) : this.obj = readonlyObjItem(SPU.obj, result.materialPropertys, true)
      this.rules = Object.assign(SPU.rules, rulesInfo)
      this.schemaNew = this.schemaInfo.concat(SPU.schema)
      this._customSchema({ schema: this.schemaNew, obj: this.obj, dataRes: result })
      this.obj.code = result.code
      this.obj.classifyName = setUpClassifyName(result.classifyVoObject)
      this.obj.classifyId = result.classifyId
      this.resultObj = result
      // 机构编辑关联关系部门&科室无须判断必要项是否为空
      this._filterSchema(this.spuObj)
      this.cacheRelation = result[this.relationName] ? result[this.relationName] : []
      this.saveBtn = true
      // 机构关联关系需要往父级组件通信   目前临时解决方案
      this.$emit('typeSelectChange', { name: results.classifyId, code: results.code || '', data: this.cacheRelation, parentData: result })
    },
    // 关联关系处理数据 stat
    _relationArr2Json (arr, type) {
      let resArr = []
      arr.length && arr.forEach(item => {
        // if (item.idName) {
        if (Array.isArray(item)) { // 关联科室处理（级联多选）
          resArr.push({ relationType: type, relationId: item[item.length - 1] })
        } else {
          resArr.push({ relationType: type, relationId: item })
        }
      })
      return resArr
    },
    _relationFilterData ({ key, data }) {
      let backRelation = []
      this.relationType.forEach(tItem => {
        if (key === tItem.relation) {
          if (Array.isArray(data)) {
            backRelation = this._relationArr2Json(data, tItem.id)
          } else {
            backRelation = [{ relationType: tItem.id, relationId: data }]
          }
        }
      })
      return backRelation
    },
    // end
    _findPropertyType (val) {
      let obj = this.resultObj.templetPropertiesForSpu || this.resultObj.templetDictPropertiesForSpu || this.resultObj.templetProperties
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _findPropertySkuType (val) {
      let obj = this.resultObj.templetPropertiesForSku || this.resultObj.templetDictPropertiesForSku
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _tableHeaders (keys, data, flag) {
      let arr = []
      for (let i = 0; i < keys.length; i++) {
        let item = keys[i]
        let { label, options, type, value, isMust, certainly, apiUrl, globalFlag } = this._findPropertValue(item, data, flag)
        arr.push({
          label,
          prop: item,
          options,
          type,
          value,
          isMust,
          certainly,
          apiUrl,
          globalFlag
        })
      }
      return arr
    },
    _findPropertValue (id, data, flag) {
      let index = data.findIndex(item => {
        return item.propertyCode === id
      })
      let label = data[index].propertyObject ? data[index].propertyObject.name : ''
      let options = []
      let isMust = data[index].isMust
      let certainly = data[index].certainly
      let propertyValues = data[index].templetPropertyValues || data[index].templetDictPropertyValues
      if (propertyValues) {
        for (let i = 0; i < propertyValues.length; i++) {
          let item = propertyValues[i]
          options.push({
            id: item.propertyValueId,
            name: item.propertyValueObject ? item.propertyValueObject.name : '未知'
          })
        }
      }
      let apiUrl = data[index].propertyObject && data[index].propertyObject.valueUrl
      let type = data[index].propertyType
      let value = ''
      let globalFlag = false
      if (!flag) globalFlag = data[index].certainly === PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id
      if (type === GLOBAL_ATTR[3].id) value = []
      return { label, options, type, value, isMust, certainly, apiUrl, globalFlag }
    },
    _setColumnName (data, name) {
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      let index = row.findIndex(item => {
        return item.propertyCode === name
      })
      let value = ''
      if (index > -1) {
        if ((row[index].propertyType === GLOBAL_ATTR[2].id || row[index].propertyType === GLOBAL_ATTR[3].id) && row[index].materialDictPropertyValues && row[index].materialDictPropertyValues.length) {
          let tempArr = []
          for (let i = 0; i < row[index].materialDictPropertyValues.length; i++) {
            let item = row[index].materialDictPropertyValues[i]
            tempArr.push((item.propertyValueObject && item.propertyValueObject.name) || '')
          }
          row[index].propertyType === GLOBAL_ATTR[2].id ? value = tempArr.join(' ') : value = tempArr.join(',')
        } else if (row[index].propertyType === GLOBAL_ATTR[5].id) {
          value = row[index].specialName ? row[index].specialName : row[index].propertyValue ? row[index].propertyValue : '-'
        } else if (row[index].propertyType === GLOBAL_ATTR[6].id) {
          value = row[index].propertyValue ? dateFormat(row[index].propertyValue, 'YYYY-MM-DD') : ''
        } else if (row[index].propertyType === GLOBAL_ATTR[10].id) {
          if (row[index].propertyValue) {
            let cityStr = JSON.parse(row[index].propertyValue)
            value += cityStr.citysName ? `${cityStr.citysName} ${cityStr.addressDetail}` : cityStr.addressDetail
          }
        } else {
          value = row[index].propertyValue
        }
      }
      return value
    },
    handleCancleSku (row) {
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      this.medicalOrder = ''
      this.basePrice = ''
    },
    handleSaveSku (data) {
      let params = {
        code: '',
        materialDictSpuId: this.objId || '',
        materialDictPropertys: [],
        keysForSku: this.thisKeysForSku
      }
      // 判断医嘱项目&基础价是否为空
      if (!this.medicalOrder) return this.$messageTips(this, 'warning', '医嘱项目必填，请核对后再保存', ' ')
      if (!this.basePrice && this.medicalOrder === yesno[1].id) return this.$messageTips(this, 'warning', '基础价必填，请核对后再保存', ' ')
      // 遍历当前行字段「key」
      for (let keys in data) {
        for (let i = 0; i < this.skuTableData.length; i++) {
          let item = this.skuTableData[i]
          if (item.prop === keys && item.isMust && !data[keys]) {
            this.$messageTips(this, 'warning', item.label + '必填，请核对后再保存', ' ')
            return
          }
        }
        let val = data[keys]
        let listParams = {}
        if (!val) {
          if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[3].id) {
            listParams.materialDictPropertyValues = []
          } else {
            listParams.propertyValue = ''
          }
        } else {
          if (val.constructor !== Array) {
            if (this._findPropertySkuType(keys).propertyType === GLOBAL_ATTR[2].id) {
              listParams.materialDictPropertyValues = this._findSingle(val, keys)
            } else {
              listParams.propertyValue = val
            }
          } else {
            listParams.materialDictPropertyValues = this._findMultiple(val, keys)
          }
        }
        params.materialDictPropertys.push(Object.assign({
          propertyCode: keys,
          propertyType: this._findPropertySkuType(keys).propertyType,
          propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
          type: PROPERTY_TYPE_FOR_TEMPLET[1].id
        }, listParams))
      }
      // 基础价格&医嘱项目
      Object.assign(params, { ifService: this.medicalOrder, price: this.basePrice, id: data.id })
      if (this.medicalOrder === yesno[0].id) params.price = ''
      !params.materialDictSpuId && delete params.materialDictSpuId
      if (this.tempTableData[0].index) {
        this.$set(this.tableData, this.tempTableData[0].index - 1, params)
      } else {
        this.tableData.unshift(params)
      }
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      this.medicalOrder = ''
      this.basePrice = ''
    },
    handleEdit (data, index) {
      let tempInit = {}
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      for (let i = 0; i < this.thisKeysForSku.length; i++) {
        let item = data.keysForSku && data.keysForSku[i].propertyCode ? data.keysForSku[i].propertyCode : this.thisKeysForSku[i]
        tempInit[item] = this._returnPropertyVal(item, row)
      }
      tempInit.id = data.id
      tempInit.index = index + 1
      tempInit.code = data.code
      this.medicalOrder = data.ifService
      this.basePrice = data.price
      this.tempTableData = [tempInit]
    },
    _setCertainly (name, itemValues) {
      if (itemValues.length) {
        itemValues.forEach(el => {
          if (el.propertyCode === name) return el.certainly
        })
      }
    },
    _returnPropertyVal (name, data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.propertyCode === name) {
          if (item.propertyType === GLOBAL_ATTR[3].id || item.propertyType === GLOBAL_ATTR[2].id) {
            if (item.propertyType === GLOBAL_ATTR[2].id) {
              return item.materialDictPropertyValues[0].propertyValueId || []
            } else {
              return this._getSkuIdList(item.materialDictPropertyValues) || []
            }
          } else {
            return item.propertyValue
          }
        }
      }
      return ''
    },
    _filterSchema (cacheObj) {
      // 判断必要项是否为空
      if (Object.keys(cacheObj).length) {
        for (let key in cacheObj) {
          if (!this.obj[key] && this.$ever.getFieldFromSchema(this.schemaNew, key) && this.$ever.getFieldFromSchema(this.schemaNew, key).props) {
            this.$ever.getFieldFromSchema(this.schemaNew, key).props.disabled = false
          }
        }
      }
    },
    // 自定义属性添加schema
    _customSchema ({ obj, schema, dataRes }) {
      let isSchemaFlag = false
      if ((dataRes && dataRes.classifyVoObject && dataRes.classifyVoObject.classifyObject.id === DRUGTYPE) || (dataRes && dataRes.type1 === DRUGTYPE)) isSchemaFlag = true
      const categoryMaterialRelations = []
      if (isSchemaFlag) {
        const category = { disabled: false, options: this.categoryList, searchPlaceholder: '请输入药理分类', placeholder: '请选择药理分类' }
        if (!this.objId) {
          dataRes.categoryMaterialDictRelations && dataRes.categoryMaterialDictRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          CUSTOM_MATERIAL_CODE_DICT[0].props = category
          schema.push(CUSTOM_MATERIAL_CODE_DICT[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialDictRelations: categoryMaterialRelations || [] })))
        } else {
          dataRes.categoryMaterialRelations && dataRes.categoryMaterialRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          CUSTOM_MATERIAL_CODE[0].props = category
          schema.push(CUSTOM_MATERIAL_CODE[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialRelations: categoryMaterialRelations || [] })))
        }
      }
    },
    ...patch
  },
  watch: {
    'obj.type1' (val) {
      if (!this.statusEdit) this.schema = this.tempSchema
      this.tempTableData = []
      this.saveBtn = false
      this.resetFormData()
    },
    'obj.type2' (val) {
      if (!this.statusEdit) this.schema = this.tempSchema
      this.tempTableData = []
      this.saveBtn = false
      this.resetFormData()
    },
    'obj.classifyId' (val) {
      this.queryVal = ''
      if (!val) {
        this.saveBtn = false
        // 机构关联关系需要往父级组件通信   目前临时解决方案
        this.$emit('typeSelectChange', { name: val })
      }
      if (!this.statusEdit) this.schema = this.tempSchema
      if (val && !this.objId && ![DRUGTYPE, MATERIALTYPE].includes(val)) {
        // 清除搜索框规格数据
        this.tableData = []
        this.saveBtn = false
        this.resetFormData()
        this._queryDictModel(val)
      } else {
        this.resetFormData()
      }
    },
    'specTableData': { // 监控销售单价
      handler (val) {
        val.forEach((v, i) => {
          if (v.hasOwnProperty('price') && v.price && !this.validatePrice(v.price)) {
            this.$messageTips(this, 'warning', '价格格式输入有误')
            if (this.objId) {
              v.price = String(val[i].price).slice(0, -1)
            } else {
              v.price = ''
            }
          }
        })
      },
      deep: true
    },
    'objLeft.ifService' (val) { // 监控是否生成医嘱项
      if (val) this.dynamicSchemaByCodes(val, this.resultObj.classifyId, false)
    },
    'specExtraPrice' (val) { // 监控是否以制剂单位销售
      if (val) {
        if (this.objId && this.resultObj.splitFlag) {
          this.specExtraRowData.extraPrice = Number(this.resultObj.price ? this.resultObj.price : '0')
        } else {
          if (WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) {
            this.specExtraRowData.extraPrice = Number(floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(2))
          } else {
            this.specExtraRowData.extraPrice = Number(floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(4))
          }
        }
        // 拆零状态处理
        this.specExtraRowData.id = this.resultObj.materialSkuId
        this.specExtraRowData.state = this.isClinic ? this.resultObj.localState : this.resultObj.state
        this.specExtraRowData.switchState = this.isClinic ? String(this.resultObj.state) : ''
        this.specExtraRowData.isClinic = this.isClinic
        // ==========
        this.specExtraTableData.push(this.specExtraRowData)
      } else {
        this.specExtraTableData = []
      }
    },
    'objLeft.SXX000003' (val) { // 监控通用名 转化为拼音
      if (!val) return
      if (this.statusEdit) this.objLeft['SXX000004'] = convertCharToPinyin(val).shoupin.toUpperCase()
    },
    'objLeft.SXX000005' (val) { // 监控商品名 转化为拼音
      if (!val) return
      if (this.statusEdit) this.objLeft['SXX000006'] = convertCharToPinyin(val).shoupin.toUpperCase()
    }
  },
  components: {
    SkuTable,
    dialogSlot,
    materialCalc
  }
}
</script>
<style lang="scss" scoped>
.cascader-multi:not(.disabled) {
  background: #fff;
}
.content-box {
  float: left;
  border-top: none;
}
.query-model {
  background: #f4f4f4;
  width: calc(100% - 860px);
  border-radius: 4px;
  display: inline-block;
}
.primary-info {
  margin: 0;
  margin-left: -110px;
  margin-top: 10px;
  font-size: 16px !important;
}
.primary-title {
  &::before {
    width: calc(100% + 165px);
    content: " ";
    position: absolute;
    top: -1px;
    right: -45px;
    border-bottom: 1px solid #ccc;
  }
  border-left: 3px solid #1c7bef;
  height: 14px;
  line-height: 14px;
  padding-left: 5px;
  margin-top: 20px;
}
.doctor-tip {
  font-size: 12px;
  color: #000000;
  line-height: 14px;
  font-weight: normal;
  margin-left: 10px;
}
.hr.primary-info {
  margin: 0;
  margin-left: -180px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: calc(100% + 180px);
}
.red {
  color: #e43;
}
.necessary {
  margin: 0 20px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 20px;
  .title {
    line-height: 30px;
    height: 30px;
    font-size: 14px;
    color: #999;
    .require {
      color: #000;
    }
    span:last-child {
      padding-left: 30px;
    }
  }
  .content {
    ul.list {
      padding-bottom: 10px;
    }
    .el-tag {
      margin-bottom: 10px;
    }
  }
}
.necessary /deep/ .el-tag,
.list-item.fl /deep/ .el-tag {
  height: 30px;
  line-height: 28px;
  padding: 0;
  padding-right: 10px;
  span {
    display: inline-block;
    padding-left: 10px;
  }
}
.queryClass {
  min-width: 220px;
  display: inline-block;
  margin-right: 5px;
}
// ul, li {list-style-type: none; margin: 0; padding: 0}
.steps {
  padding: 30px 0;
  padding-bottom: 50px;
}
.steps-box ul li {
  display: inline;
  line-height: 24px;
  color: #999;
}
.steps-box ul li .line {
  background: #e9e9e9;
  height: 3px;
  display: inline-block;
  margin: 0 50px;
  margin-top: 10px;
  width: 50%;
}
.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e9e9e9;
  display: inline-block;
  text-align: center;
  color: #ccc;
  margin-right: 10px;
}
.steps-box ul li.active {
  color: #1c7bef;
}
.steps-box ul li.active .circle,
.steps-box ul li.active .line {
  background: #1c7bef;
  color: #fff;
}
.titleBtn {
  transform: rotate(180deg);
  display: inline-block;
  margin-left: 5px;
  .iconfont {
    font-size: 12px;
  }
}
.titleBtn.active {
  transform: rotate(270deg);
  animation: animated 0.35s;
}
.titleBtn.visited {
  transform: rotate(180deg);
  animation: animated_back 0.35s;
}
.list-item.fl {
  margin-top: 10px;
  margin-right: 10px;
}
@keyframes animated {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(270deg);
  }
}
@keyframes animated_back {
  from {
    transform: rotate(270deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.el-form--label-right {
  /deep/ .parent_label {
    border-top: 1px solid #ccc;
    margin-top: 30px;
    padding-top: 30px;
  }
}
.table-btn-ml_80 {
  margin-top: 15px;
  margin-left: 47px;
  /deep/ .el-button {
    width: 150px;
  }
}
// .hr {width: calc(100% + 180px); margin-left: -180px;}
</style>
<style lang="scss" scoped>
.layout_inner {
  padding: 15px;
  overflow: hidden;
}
.alg_c {
  height: 30px;
  margin: 0;
  font-size: 24px;
  line-height: 30px;
  padding-bottom: 15px;
}
.content-top {
  /deep/ .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      height: 40px;
    }
    .el-form-item__content {
      display: flex;
      .query-model {
        flex: 1;
      }
    }
  }
}
.content-center {
  .content-center-left {
    background-color: #f5f5f5;
    padding-right: 45px;
    /deep/ .cascader-multi:not(.disabled) {
      background: #fff;
    }
    .test-data {
      font-size: 14px;
      color: #1c7bef;
      text-align: right;
      line-height: 14px;
      cursor: pointer;
      float: right;
    }
    .showpicture {
      margin-left: -110px;
      font-size: 14px;
      color: #1c7bef;
      span {
        cursor: pointer;
      }
    }
    .position-block {
      background: pink;
    }
    /deep/ .require-red .el-input__inner {
      border-color: #f56c6c;
    }
    .content-center-table {
      position: relative;
      margin-top: 20px;
      &::before {
        width: calc(100% + 92px);
        content: " ";
        position: absolute;
        top: -20px;
        left: -46px;
        // border-top: 1px solid #ccc;
      }
      margin-left: 45px;
      // border: 1px solid #bbb;
      > div {
        margin: 0;
      }
      .extra-table /deep/ .has-gutter,
      /deep/ .el-table__empty-block {
        display: none;
      }
      .add-specifications {
        padding: 10px 15px;
        background: #e5e5e5;
        border: 1px solid #ccc;
        margin-top: -1px;
        .checked {
          margin-left: 30px;
          display: inline-block;
          font-size: 14px;
          color: #000;
          text-align: center;
          line-height: 14px;
        }
        .add-tips {
          font-size: 14px;
          color: #1c7bef;
          line-height: 14px;
          cursor: pointer;
        }
      }
      .group-disabled {
        display: flex;
        width: 100%;
        justify-content: center;
      }
    }
    /deep/ .has-gutter > tr > th,
    /deep/ .has-gutter > tr > th > div,
    /deep/ .el-table__row,
    /deep/ .el-table__empty-block {
      background: #e5e5e5;
    }
    /deep/ .el-table__row td > div {
      display: flex;
      align-items: center;
      .unit-span {
        white-space: nowrap;
        margin-left: 5px;
      }
    }
    /deep/ .el-table__row .is-right > div {
      display: block;
    }
    /deep/ .is-disabled .el-input-group__append {
      border: 1px solid #ddd !important;
    }
  }
  .content-center-left-bottom {
    padding-bottom: 15px;
    border: 1px solid #ddd;
  }
  .row-container {
    position: relative;
    .row-right {
      position: absolute;
      right: 0;
      height: 100%;
      overflow: auto;
    }
  }
  .content-center-right {
    margin-left: 15px;
    border-top: 1px solid #ddd;
    .right-title {
      font-size: 14px;
      font-weight: bold;
      padding: 15px 0;
      margin: 0;
    }
    .right-content {
      padding: 0 15px;
    }
  }
}
.is-required {
  width: 100%;
}
.subHr {
  right: -10px;
}
</style>
<style lang="scss">
.carousel-example-img {
  width: 492px;
  border: none;
  background: none;
  padding: 0;
  .el-carousel__container {
    height: 315px;
  }
}
</style>
