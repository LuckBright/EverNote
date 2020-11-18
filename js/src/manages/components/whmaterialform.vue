<template>
  <div>
    <div class="layout_inner">
      <!-- 返回栏 -->
      <h2 class="alg_c">{{breadCrumbName}}</h2>
      <!-- 顶部搜索区域 -->
      <div class="content-top">
        <el-form v-if="showClassifyName && [...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(obj.classifyId)" label-width="120px" style="background-color: #F5F5F5;">
          <el-form-item label="分类：">{{showClassifyName}}</el-form-item>
        </el-form>
        <ever-form2
          v-show="!showClassifyName && !this.objId"
          label-width="0px"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="10"
          :rules="rules"
          @submit="submitForm()"
          :nosubmit="true"
          style="background-color: #F5F5F5; height: 40px; padding: 10px 200px;">
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
      <template v-if="[...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(obj.classifyId)">
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
                  :nosubmit="true">
                  <template slot="basicInfo" v-if="saveBtn">
                    <h3 class="primary-info primary-title">基础信息</h3>
                  </template>
                  <template
                    slot="signInfo"
                    v-if="saveBtn && [...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)">
                    <h3 class="primary-info primary-title">标志信息</h3>
                  </template>
                  <template
                    slot="financeInfo"
                    v-if="saveBtn && [...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)">
                    <h3 class="primary-info primary-title">财务信息</h3>
                  </template>
                  <template
                    slot="manageInfo"
                    v-if="saveBtn && ![...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)">
                    <h3 class="primary-info primary-title">管理信息</h3>
                  </template>
                  <template
                    slot="saleInfo"
                    v-if="saveBtn && ![...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)">
                    <h3 class="primary-info primary-title">销售信息</h3>
                  </template>
                  <template
                    slot="doctorAdvice"
                    v-if="saveBtn && [...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)">
                    <h3 class="primary-info primary-title">
                      医嘱信息
                      <span class="doctor-tip">注意：以下内容，请依据临床医嘱实际情况填写</span>
                      <span
                        v-if="!isClinic && statusEdit && enumConfig.WEST_MEDICINE_TYPE.includes(obj.classifyId)"
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
                        trigger="click">
                        <el-carousel
                          :interval="5000"
                          :arrow="legend.length > 1 ? 'always' : 'never'">
                          <el-carousel-item v-for="item in legend" :key="item">
                            <img :src="item" :alt="item">
                          </el-carousel-item>
                        </el-carousel>
                        <el-button
                          type="text"
                          :disabled="isClinic || !statusEdit"
                          slot="reference">
                          {{!isClinic && statusEdit ? '图例说明' : ''}}
                        </el-button>
                      </el-popover>
                    </div>
                  </template>
                </ever-form2>
                <!-- 规格表格 -->
                <div class="content-center-table" v-if="saveBtn">
                  <el-table :data="specTableData">
                    <!-- 包装规格：西药 -->
                    <el-table-column
                      v-if="enumConfig.WEST_MEDICINE_TYPE.includes(obj.classifyId)"
                      label="包装规格">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            :class="{'require-red': haveSubmit && !scope.row['SXX000049']}"
                            v-model="scope.row['SXX000049']"
                            :disabled="!!objId && !disabledTable(scope.$index)">
                            <template
                              slot="append">
                              {{showLabel(enumConfig.ZHIJI_CODE, objLeft[enumConfig.ZHIJI_CODE].id)}}
                            </template>
                          </el-input>
                        </div>
                        <div class="subHr pos_re">/</div>
                      </template>
                    </el-table-column>
                    <!-- 型号规格：耗材 / 规格：中药 -->
                    <el-table-column
                      v-if="[...enumConfig.CONSUMABLES_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)"
                      :label="enumConfig.CONSUMABLES_TYPE.includes(obj.classifyId) ? '型号规格'
                      : enumConfig.CHINESE_MEDICINE_TYPE.includes(obj.classifyId) ? '规格' : ''">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :class="{'require-red': haveSubmit && !scope.row['SXX000008']}"
                            v-model="scope.row['SXX000008']"
                            :disabled="!!objId && !disabledTable(scope.$index)">
                            <template
                              v-if="enumConfig.CHINESE_MEDICINE_TYPE.includes(obj.classifyId)"
                              slot="append">
                              {{showLabel(enumConfig.ZHIJI_CODE, objLeft[enumConfig.ZHIJI_CODE].id)}}
                            </template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 单位 -->
                    <el-table-column
                      width="120"
                      :label="enumConfig.CONSUMABLES_TYPE.includes(obj.classifyId) ? '计量单位' : ''"
                      v-if="[...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(obj.classifyId)">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <ever-select
                            v-model="scope.row['SXX000048']"
                            :class="{'require-red': haveSubmit && !scope.row['SXX000048']}"
                            :options="specSchemaData.schema[1].props.initOptions"
                            :disabled="!!objId && !disabledTable(scope.$index)"
                            :needObjFlag="true"
                          ></ever-select>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 单价 -->
                    <el-table-column
                      label="销售单价"
                      v-if="[...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(obj.classifyId)
                      || (enumConfig.CONSUMABLES_TYPE.includes(obj.classifyId) && objLeft.ifService == '2')">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            :class="{'require-red': haveSubmit && !scope.row[PRICE_CODE]}"
                            v-model="scope.row[PRICE_CODE]"
                            :disabled="!!objId && !disabledTable(scope.$index) && (!statusEdit || !isLocalPrice)">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 条码 -->
                    <el-table-column
                      label="条码"
                      v-if="[...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(obj.classifyId)">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row['SXX000050']"
                          :disabled="!!objId && !disabledTable(scope.$index) && (!statusEdit || isLocalPrice)"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <!-- 药效比：中药颗粒 -->
                    <el-table-column
                      label="药效比"
                      v-if="enumConfig.CHINESE_PATENT_MEDICINE === obj.classifyId">
                      <template slot-scope="scope">
                        <el-input
                          type="number"
                          v-model="scope.row['SXX000052']"
                          :disabled="!!objId && !disabledTable(scope.$index) && (!statusEdit || isLocalPrice)"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <!-- 状态 - 启用/禁用 -->
                    <el-table-column v-if="!statusEdit" :label="isLocalPrice ? '状态' : ''" align="center" width="150">
                      <template slot-scope="scope" v-if="isLocalPrice">
                        <!-- <div v-if="scope.row.switchState && !skuState(Number(scope.row.switchState))"
                          class="group-disabled red">集团禁用</div> -->
                        <!-- v-else -->
                        <el-switch
                          :disabled="switchStateLoading"
                          :value="skuState(scope.row.state)"
                          @change="clickSwitchSkuState(specTableData, scope.row)"
                          active-text="启用"
                          inactive-text="禁用"
                        ></el-switch>
                      </template>
                    </el-table-column>
                    <!-- 删除按钮 -->
                    <el-table-column v-if="statusEdit" align="center" width="150">
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
                    style="margin-top: -1px">
                    <el-table-column label="包装规格">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            type="number"
                            v-model="scope.row['SXX000049']"
                            :disabled="true">
                            <template
                              slot="append"
                            >{{showLabel(enumConfig.ZHIJI_CODE, objLeft[enumConfig.ZHIJI_CODE].id)}}</template>
                          </el-input>
                        </div>
                        <div class="subHr pos_re">/</div>
                      </template>
                    </el-table-column>
                    <el-table-column width="120">
                      <template slot-scope="scope">
                        <ever-select
                          v-model="objLeft[enumConfig.ZHIJI_CODE]"
                          :options="specSchemaData.schema[1].props.initOptions"
                          :disabled="true"
                          :needObjFlag="true"
                        ></ever-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="销售单价">
                      <template slot-scope="scope">
                        <div class="is-required">
                          <el-input
                            :min="0"
                            :class="{'require-red': haveSubmit && !scope.row.price}"
                            type="number"
                            :disabled="!!objId && !!materialInfo.splitFlag && (!statusEdit || !isLocalPrice)"
                            v-model="scope.row.price">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="条码">
                      <template slot-scope="scope">{{scope.row.title}}</template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="150">
                      <template slot-scope="scope" v-if="isLocalPrice">
                        <!-- <div
                          v-if="!statusEdit && scope.row.switchState && !skuState(Number(scope.row.switchState))"
                          class="group-disabled red"
                        >集团禁用</div> -->
                        <!-- v-else-if="!statusEdit" -->
                        <el-switch
                          v-if="!statusEdit"
                          :disabled="switchStateLoading"
                          :value="skuState(scope.row.state)"
                          @change="clickSwitchSkuState(specExtraTableData, scope.row)"
                          active-text="启用"
                          inactive-text="禁用"
                        ></el-switch>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div v-if="!isClinic && statusEdit" class="add-specifications">
                    <span
                      class="add-tips"
                      @click="addSpecData(obj.classifyId)"
                      v-if="showSpecBtn && !enumConfig.WEST_MEDICINE_TYPE.includes(obj.classifyId)"
                    >添加规格</span>
                    <div
                      class="checked"
                      v-if="enumConfig.WEST_MEDICINE_TYPE.includes(obj.classifyId)">
                      <el-checkbox
                        v-model="specExtraPrice"
                        :disabled="!!objId && !!materialInfo.splitFlag"
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
        <div class="table-btn-ml_80" v-if="buttonVisible && !statusEdit && (haveManage || isLocalPrice)">
          <el-button v-if="saveBtn" type="primary" @click="editTable()" size="large">编辑</el-button>
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
            :nosubmit="true">
            <template slot="primaryInfo" v-if="saveBtn">
              <h3 class="primary-info">基本信息</h3>
            </template>
            <template slot="materialType" v-if="objId">
              <span>{{showClassifyName}}</span>
            </template>
            <template slot="skuInfo">
              <div class="hr primary-info"></div>
              <h3 class="primary-info">规格</h3>
              <div class="primary-info" style="margin-top: 20px;">
                <!-- 表头/新增 -->
                <el-table class="hide-table-body" style="width: 100%" :data="tempTableData" v-if="!objId || (objId && statusEdit)">
                  <el-table-column width="50" v-if="!objId"></el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === enumConfig.BLOOD_CLASSIFYID"
                    min-width="150px"
                    label="创建医嘱项目">
                    <template slot-scope="scope">
                      <ever-select
                        :disabled="!!scope.row.id"
                        class="is-required"
                        v-model="medicalOrder"
                        :options="enumConfig.yesno"
                        placeholder="创建医嘱项目"
                      ></ever-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="obj.classifyId === enumConfig.BLOOD_CLASSIFYID"
                    min-width="150px"
                    label="基础价">
                    <template slot-scope="scope">
                      <sys-text
                        v-if="medicalOrder && medicalOrder === enumConfig.yesno[1].id"
                        :disabled="!!scope.row.id"
                        class="is-required"
                        v-model="basePrice"
                        placeholder="基础价">
                      </sys-text>
                    </template>
                  </el-table-column>
                  <el-table-column
                    min-width="150px"
                    :resizable="false"
                    v-for="(item, index) in skuTableData"
                    :key="index"
                    :label="item.label">
                    <template slot-scope="scope">
                      <div>
                        <sku-table
                          :data="item"
                          v-model="scope.row[item.prop]"
                          :value="item.value"
                          :objId="scope.row.id">
                        </sku-table>
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
                <!-- 编辑 -->
                <el-table
                  :data="tableData"
                  style="width: 100%; margin-top: -10px; z-index: 2; border-top: none"
                  :show-header="!!objId && !statusEdit"
                  border
                  @selection-change="handleSelectionChange"
                  :stripe="false">
                  <el-table-column type="selection" width="50" v-if="!objId"></el-table-column>
                  <el-table-column
                    label="创建医嘱项目"
                    v-if="obj.classifyId === enumConfig.BLOOD_CLASSIFYID"
                    min-width="150px"
                    prop>
                    <template slot-scope="scope">
                      <ever-select
                        style="width: 90%;"
                        v-model="scope.row.ifService"
                        :options="enumConfig.yesno"
                        placeholder="创建医嘱项目"
                        :disabled="true">
                      </ever-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="基础价"
                    v-if="obj.classifyId === enumConfig.BLOOD_CLASSIFYID"
                    min-width="150px"
                    prop="price">
                  </el-table-column>
                  <el-table-column
                    min-width="150px"
                    v-for="(item, index) in skuTableData"
                    :key="index"
                    :label="item.label"
                    prop>
                    <template slot-scope="scope">{{_setColumnName(scope.row, item.prop)}}</template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" prop v-if="!objId || (objId && statusEdit)">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleEdit(scope.row, scope.$index)"
                      >编辑</el-button>
                      <el-button
                        v-if="!objId"
                        type="danger"
                        size="small"
                        @click="handleDelete(scope.row, scope.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <!-- 管理方式 -->
            <template slot="managementModel">
              <el-checkbox
                label="按有效期管理"
                v-model="obj.isExpiryDate"
                :true-label="1"
                :false-label="0"
                :disabled="!!objId"
              ></el-checkbox>
              <el-checkbox
                label="按唯一码管理"
                v-model="obj.isManageAlone"
                :true-label="1"
                :false-label="0"
                :disabled="!!objId"
              ></el-checkbox>
              <span
                class="ml20 pl20 light-gray"
                style="color: red;"
              >药品和医疗耗材必须勾选有效期管理，一物一码的物资还需要勾选唯一码管理</span>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <!-- 没用到？？ -->
          <div v-if="schemaNew.length && !slots && saveBtn">
            <div v-for="(item, i) in slotsData" :key="i">
              <div class="hr"></div>
              <ever-form2
                label-width="180px"
                class="mt20"
                :schema="item.schemaSlot"
                v-model="item.objSlot"
                :ref="item.formSlot"
                :span="12"
                :rules="item.rulesSlot"
                :nosubmit="true">
                <div slot="default"></div>
              </ever-form2>
            </div>
          </div>
          <div v-if="schemaNew.length && slots">
            <slot v-for="item in slots" :name="item"></slot>
          </div>
          <!-- ？？ -->
          <div class="table-btn-ml_80">
            <el-button
              v-if="(saveBtn || objId) && !statusEdit && buttonVisible"
              type="primary"
              @click="changeEditStatus"
            >编辑</el-button>
            <el-button
              v-if="(saveBtn || objId) && statusEdit && buttonVisible"
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
import * as enumConfig from '@/util/common'
import classify from '@/warehouse/util/classify'
import SkuTable from '@/warehouse/page/components/skutable'
import frequencyApi from '@/warehouse/store/sob.api'
import templateApi from '@/manages/api/template'
import materialApi from '@/manages/page/material/materialapi'
import { createdSchemaAndObjectValue, readonlyObjItem, _findIndex } from '@/util/formcustom' // setUpClassifyName
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
  props: ['systemType', 'isEdit', 'isLocalPrice', 'parentSchema', 'customType', 'isSearch', 'backListRoute', 'propertyName', 'propertyNameValues', 'slots', 'slotsData', 'titleCode', 'propertyParentName', 'relationType', 'isSubmitForm', 'isClinic', 'haveManage'],
  mixins: [classify],
  data () {
    return {
      enumConfig, // 环境常量配置
      onlyKey: '', // 唯一标识
      changeTotalCount: 0, // 记录剂量单位变化次数更改默认剂量是否为空
      dialogSlot: false,
      PRICE_CODE, // 价格
      unitType: '', // 1:成分  2:成药  3:制剂
      unitName: '', // 单位名称
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
      queryVal: '',
      obj: {},
      schema: [],
      tempObj: {},
      resultObj: {}, // 模版
      materialInfo: {}, // 数据
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
      deleteId: 0,
      statusEdit: false, // 是否可以编辑状态
      showSpecBtn: false,
      cacheResult: {},
      spuObj: {},
      // 编辑缓存关联关系
      cacheRelation: [],
      // 查询placeholder
      queryPlaceholder: '通用名 / 商品名 / 批准文号',
      breadCrumbName: '',
      // 创建医嘱项目
      medicalOrder: '',
      submitDisableBtn: false, // 保存按钮loading
      switchStateLoading: false, // 状态启用禁用loading
      // 基础价
      basePrice: '',
      // +++++++++++++++++++++++++非西药++++++++++++++++++++++++++++++
      schemaNew: [],
      // ++++++++++++++++++++++++++西药+++++++++++++++++++++++++++++++
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
        'SXX000048': '',
        'SXX000049': '1',
        price: '',
        title: '以制剂单位销售'
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
    } else { // 编辑
      this.obj.classifyId = ''
      this.getDetail()
    }
  },
  computed: {
    // 按钮是否可见
    buttonVisible () {
      return this.saveBtn && ((!this.isClinic && !this.isEdit) || this.isLocalPrice)
    }
  },
  methods: {
    // 请求药理分类数据
    fetchCategoryRelations () {
      materialApi.categoryList().then(res => {
        this.categoryList = enumConfig.whComFn.sectionMap(res, 'pharmacologyCategories')
      })
    },
    // 编辑查看请求详情数据
    getDetail () {
      materialApi.getSpuById(this.objId, this.isClinic).then(result => {
        this.materialInfo = result
        this.obj.classifyId = result.classifyId
        if (![...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(result.classifyId)) {
          this.obj = Object.assign({}, this.obj)
        }
        this._queryDictModel(result.classifyId, true)
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
        let materialArr = await templateApi.getSourceByMaterialDictInfoBySpuIdForSY(this.materialDictSkuId, this.obj.classifyId)
        if (materialArr && materialArr.flag) {
          let resultList = JSON.parse(JSON.stringify(materialArr))
          if ((this.obj.type1 === enumConfig.DRUGTYPE || this.obj.type1 === enumConfig.MATERIALTYPE || this.obj.type1 === enumConfig.BLOOD_CLASSIFYID) && resultList.materialDictSkus && resultList.materialDictSkus.length) {
            resultList.materialDictSkus.forEach(item => {
              item.ifService = ''
              item.price = ''
            })
          }
          // 全局药理分类字典
          if (resultList.categoryMaterialRelationList) {
            this.$ever.getFieldFromSchema(this.schemaNew, 'categoryMaterialDictRelations').props.valueArray = resultList.categoryMaterialRelationList
            this.obj.categoryMaterialRelationList = resultList.categoryMaterialRelationList
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
      if (this.obj.classifyId === enumConfig.BLOOD_CLASSIFYID) {
        codeQuery = enumConfig.GENERAL_CODE
        this.queryPlaceholder = '血液品种 / ABO血型 / RH(D)血型'
      } else {
        codeQuery = enumConfig.MATERILA_PINYIN_CODE.concat(enumConfig.SEARCH_CODE)
        this.queryPlaceholder = '通用名 / 商品名 / 批准文号'
      }
      let params = {
        classifyId: this.obj.classifyId,
        codesMatchValues: [{ codes: codeQuery, value: query }],
        offset: 0,
        pagesize: 20
      }
      templateApi.getSourceByMaterialDictForInClincForSY(params).then(result => {
        if (result) {
          result.forEach(item => {
            if (this.obj.classifyId === enumConfig.BLOOD_CLASSIFYID) {
              item.name = this._resetMaterialName({ rows: item.materialDictPropertys, code: enumConfig.GENERAL_CODE, attributeValue: 'materialDictPropertyValues', isInfo: false })
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
    _queryDictModel (val, edit) {
      templateApi.getSourceByTempletForCreateRecord({ classifyId: val, systemType: this.systemType }).then(result => {
        if (result) {
          this.cacheResult = result
          this._dataNewRendering({ result, flag: true })
          // 耗材规格根据是否生成医嘱项变化而变化，已在生成动态模版中处理
          if (!enumConfig.CONSUMABLES_TYPE.includes(val) && !edit) this.addSpecData(val)
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
        this.breadCrumbName = enumConfig.parserComplex({ data: this.materialInfo.ext, propertys: enumConfig.GOLBAL_VAL_MATERIL_NAME.NAME_ONE })
        this.showClassifyName = enumConfig.parserJSON({ data: this.materialInfo.ext, property: 'classifyObject' })
      }
      // 区分物资类型，创建schema
      if (enumConfig.WEST_MEDICINE_TYPE.includes(result.classifyId)) { // 西药/中成药
        this.fixedSchemaByCodes(result, enumConfig.MATERIALTEMPLATE.WEST_TEMPLATE)
      } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(result.classifyId)) { // 中药饮片/中药颗粒
        this.fixedSchemaByCodes(result, enumConfig.MATERIALTEMPLATE.CHINESE_TEMPLATE)
      } else if (enumConfig.CONSUMABLES_TYPE.includes(result.classifyId)) { // 耗材
        if (enumConfig.CONSUMABLES_MEDICAL_TYPE === result.classifyId) { // 医疗耗材
          this.fixedSchemaByCodes(result, enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE)
        } else { // 其他耗材
          this.fixedSchemaByCodes(result, Object.assign({}, enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE, enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE2))
        }
      } else { // 其他
        if (result.classifyId !== enumConfig.BLOOD_CLASSIFYID) this.medicalOrder = 1 // 默认医嘱项为否
        let bedIndex = -1
        if (this.slotsData && result.classifyId && this.slotsData.BED_CLASSIFYID) bedIndex = _findIndex(this.slotsData.BED_CLASSIFYID, result.classifyId)
        let renderSpu = result.templetPropertiesForSpu || result.templetDictPropertiesForSpu || result.templetProperties
        let SPU
        if (flag) {
          this.resetFormData()
          SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, {}, true)
        } else {
          this.resetFormData()
          SPU = createdSchemaAndObjectValue(result.keysForSpu || result.keys, renderSpu, { certainly: true }, true)
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
            enumConfig.CHECK_CODE.forEach((checkItem, i) => {
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
        // 编辑
        if (this.objId) {
          this.schemaNew.splice(1, 0, {
            name: 'materialType',
            label: '类型',
            comp: 'custom',
            span: 24
          })
          // 数据回写
          Object.keys(this.materialInfo.ext).forEach(key => {
            this.obj[key] = this.materialInfo.ext[key]
          })
          this.obj.isNum = this.materialInfo.isNum
          this.obj.isExpiryDate = this.materialInfo.isExpiryDate
          this.obj.isManageAlone = this.materialInfo.isManageAlone
          // 设置为禁用
          this.schemaNew.forEach(item => {
            if (item.props) item.props.disabled = true
          })
          // 处理SKU
          this.materialInfo.skuDTOList.reverse().forEach(item => {
            this.medicalOrder = item.ifService
            this.basePrice = item.price || ''
            let tempExt = JSON.parse(JSON.stringify(item.ext))
            for (let key in tempExt) {
              if (typeof tempExt[key] === 'object') tempExt[key] = tempExt[key].id
            }
            tempExt.id = item.id
            this.handleSaveSku(tempExt)
          })
          // 选中表格
          this.$nextTick(() => {
            this.obj.materialDictSku = this.tableData
          })
        }
      }
    },
    // 根据物资类型 - 添加规格
    addSpecData: enumConfig.debounce(function (materialType) {
      this.haveSubmit = false
      this.showSpecBtn = false
      if (enumConfig.WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
        this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.SPECSCHEMAARR))
      } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(materialType) && enumConfig.CHINESE_PATENT_MEDICINE !== materialType) { // 中药饮片
        this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_ONE))
      } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(materialType) && enumConfig.CHINESE_PATENT_MEDICINE === materialType) { // 中药颗粒
        this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_TWO))
      } else if (enumConfig.CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        if (Number(this.objLeft.ifService) === 2) { // 生成医嘱项
          this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE))
        } else { // 不生成医嘱项
          this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO))
        }
      }
    }),
    // 根据固定模版查找SPU+SKU 返回schema数据
    fixedSchemaByCodes (resultObj, template) {
      this.resultObj = Object.assign({}, resultObj)
      // 拼合 后台数据返回properties
      this.propertiesSpuSku = resultObj.templetPropertiesForSpu.concat(resultObj.templetPropertiesForSku)
      this.arraySpu = resultObj.keysForSpu
      this.arraySku = resultObj.keysForSku
      // 拼合 基础信息/标志信息/财务信息/医嘱信息
      this.fixedCodeArr = [] // 获取左侧所有code集合（用来过滤后台返回的SPU+SKU，未匹配到的均为右侧form表单schema）
      let tempObj = {} // 待拼合数据对象，格式为：标题 + 基础 + 标题 + 标志 + 标题 + 财务 + 标题 + 医嘱
      for (let key in template) {
        this.fixedCodeArr = this.fixedCodeArr.concat(template[key].INFO)
        tempObj[key] = createdSchemaAndObjectValue(template[key].INFO, this.propertiesSpuSku, { disabled: !!this.objId && !this.statusEdit }, true)
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
      if ([...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(materialType)) { // 药品
        // 医嘱剂量单位设置宽度
        this.fixedSchema.forEach(v => {
          if (v.name === 'SXX000011') v.span = 8
        })
        // 处理药理分类组件
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
        if (this.objId) Object.keys(this.fixedObj).forEach(key => { this.fixedObj[key] = this.materialInfo.ext[key] }) // 合并数据和模版
        // 药理分类回写
        if (this.objId) this.fixedObj['categoryRelations'] = this.materialInfo.categoryMaterialRelationList
        this.objLeft = Object.assign({}, this.fixedObj)
        this.rulesLeft = Object.assign({}, this.fixedRules)
        // 默认财务分类
        if (!this.objId) this.setDefaultDisabled(this.fixedSchema, 'SXX19030500001ATTD', true, false)
        if (enumConfig.WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
          // 默认剂量单位 - 成分单位
          if (!this.objId) this.objLeft['SXX000011'] = { id: 'f49cff24-4c96-4be7-9f79-889b423ae975' }
          // 监听剂量单位
          this.$nextTick(() => {
            this.$watch('objLeft.SXX000011', (val, oldVal) => {
              if (val && JSON.stringify(val) !== JSON.stringify(oldVal)) { // 防止无限循环
                this.changeTotalCount++
                this.dynamicSchemaByCodes(val.id, this.resultObj.classifyId, false)
                // 清空默认剂量
                if (this.changeTotalCount > 1) this.objLeft[enumConfig.DOSE] = ''
              }
            })
          })
        } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(materialType)) { // 中药饮片/中药颗粒
          if (!this.objId) {
            // 默认剂型并禁止编辑
            this.setDefaultDisabled(this.fixedSchema, 'SXX000007', true, true)
            // 默认剂量单位 - 制剂单位
            this.objLeft['SXX000011'] = { id: '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a' }
          }
          // 设置制剂单位占位长度
          this.fixedSchema[this.fixedSchema.findIndex(v => v.name === enumConfig.ZHIJI_CODE)].span = 8
        }
        this.dynamicSchemaByCodes(this.objLeft['SXX000011'].id, this.resultObj.classifyId, true)
      } else if (enumConfig.CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        // 处理 按有效期管理
        this.appendCustomComponent(this.fixedSchema, 'isExpiryDate', '按有效期管理', 'sysSelect', enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE)
        // 处理 一物一码管理
        this.appendCustomComponent(this.fixedSchema, 'isManageAlone', '一物一码管理', 'sysSelect', enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE)
        // 处理 生成医嘱项 (办公耗材不需要生成)
        if (enumConfig.CONSUMABLES_OFFICE_TYPE === materialType) {
          this.fixedSchema.splice(this.fixedSchema.findIndex(v => v.name === 'ifService'), 1)
        } else {
          this.appendCustomComponent(this.fixedSchema, 'ifService', '生成医嘱项', 'sysSelect', enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_TWO)
        }
        // 自定义验证规则
        const customRules = [{ required: true, message: '必填项' }]
        // 拼合左侧模版属性及教验规则
        if (this.objId) Object.keys(this.fixedObj).forEach(key => { this.fixedObj[key] = this.materialInfo.ext[key] }) // 合并数据和模版
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
          this.objLeft.isExpiryDate = enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE[1].id
          this.objLeft.isManageAlone = enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE[0].id
          // 默认 办公耗材不需要生成医嘱项
          if (enumConfig.CONSUMABLES_OFFICE_TYPE === materialType) this.objLeft.ifService = enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_TWO[0].id
        } else { // 编辑
          // 数据回写
          this.objLeft.isExpiryDate = String(this.materialInfo.isExpiryDate) // 按有效期管理
          this.objLeft.isManageAlone = String(this.materialInfo.isManageAlone) // 一物一码管理
          this.objLeft.ifService = String(this.materialInfo.skuDTOList[0].ifService) // 生成医嘱项
        }
      }
    },
    // 设置默认项，并禁止编辑
    setDefaultDisabled (schema, code, defaultValue, disabledEdit, multiple) {
      try {
        const index = schema.findIndex(v => v.name === code)
        if (defaultValue) {
          if (multiple) {
            this.objLeft[code] = [schema[index].props.initOptions[0]]
          } else {
            this.objLeft[code] = schema[index].props.initOptions[0]
          }
        }
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
      this.onlyKey = new Date().getTime()
      if (enumConfig.WEST_MEDICINE_TYPE.includes(materialType)) { // 西药/中成药
        // ================== 动态变化模块 ==================
        const aList = enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEOPTIONS[id || 'f49cff24-4c96-4be7-9f79-889b423ae975']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 8, disabled: !!this.objId && !this.statusEdit }, true)
        medicineOption.schema[medicineOption.schema.length - 1].span = 24 // 最后一个占满一行
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        if (this.objId) Object.keys(medicineOption.obj).forEach(key => { medicineOption.obj[key] = this.materialInfo.ext[key] }) // 合并数据和模版
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        this.calcParams = aList // 参与计算参数
        // 初始化成分单位option
        this.unitOptionns = this.findOriginOptions(this.schemaLeft, 'SXX000053') // 获取制剂单位options
        Object.assign(this.rulesLeft, medicineOption.rules)
        // ================== 规格表格模块 ==================
        this.specSchemaData = createdSchemaAndObjectValue(Object.keys(enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.SPECSCHEMAARR), this.propertiesSpuSku, {}, true)
        // 监听剂量单位
        const selectUnitOptions = this.findOriginOptions(this.schemaLeft, 'SXX000011') // 获取剂量单位options
        const unitId = id || 'f49cff24-4c96-4be7-9f79-889b423ae975'
        let watchName = 'objLeft.SXX000053'
        let slotCode = enumConfig.DOSE
        // 医嘱图例说明数据
        this.legend = enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEIMGS[unitId]
        this.dosageOptions = this.findOriginOptions(this.schemaLeft, enumConfig.DOSAGE) // 获取剂型options
        if (unitId === 'f49cff24-4c96-4be7-9f79-889b423ae975') { // 成分
          watchName = 'objLeft.SXX000053'
          this.unitType = 1
        } else if (unitId === '340fa155-327b-479b-8c5c-bc24c23b2734') { // 成药
          this.unitOptionns = this.findOriginOptions(this.schemaLeft, 'SXX000054') // 获取制剂单位options
          watchName = 'objLeft.SXX000054'
          this.unitType = 2
        } else if (unitId === '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a') { // 制剂
          this.unitOptionns = this.findOriginOptions(this.schemaLeft, enumConfig.ZHIJI_CODE) // 获取制剂单位options
          watchName = `objLeft.${enumConfig.ZHIJI_CODE}`
          this.unitType = 3
        }
        // 初始化计量slot
        this.setPropertySlots(this.unitOptionns, enumConfig.DOSE, this.objLeft[watchName.split('.')[1]].id)
        this.watchPropertySchema(watchName, this.unitOptionns, slotCode)
        this.unitName = this.findOptinsName(selectUnitOptions, unitId)
        if (this.objId) {
          // 是否以制剂单位销售
          this.specExtraPrice = this.materialInfo.skuDTOList.some(v => v.splitFlag)
          if (this.specExtraPrice) this.materialInfo.splitFlag = 1
        }
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEOPTIONS)
      } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(materialType)) { // 中药饮片/中药颗粒
        // ================== 动态变化模块 ==================
        const aList = enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.MEDICINEOPTIONS[id || '11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 8, disabled: !!this.objId && !this.statusEdit }, true)
        medicineOption.schema[medicineOption.schema.length - 1].span = 24 // 最后一个占满一行
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        if (this.objId) Object.keys(medicineOption.obj).forEach(key => { medicineOption.obj[key] = this.materialInfo.ext[key] }) // 合并数据和模版
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        Object.assign(this.rulesLeft, medicineOption.rules)
        // ================== 规格表格模块 ==================
        if (enumConfig.CHINESE_PATENT_MEDICINE !== materialType) { // 中药饮片
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_ONE), this.propertiesSpuSku, {}, true)
        } else { // 中药颗粒
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.SPECSCHEMAARR_TWO), this.propertiesSpuSku, {}, true)
        }
        // 监听制剂单位
        let watchName = `objLeft.${enumConfig.ZHIJI_CODE}`
        let slotCode = enumConfig.DOSE
        this.unitOptionns = this.findOriginOptions(this.schemaLeft, enumConfig.ZHIJI_CODE) // 获取制剂单位options
        // 初始化计量slot
        this.setPropertySlots(this.unitOptionns, enumConfig.DOSE, this.objLeft[watchName.split('.')[1]].id)
        this.watchPropertySchema(watchName, this.unitOptionns, slotCode)
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.MEDICINEOPTIONS)
      } else { // 耗材
        // ================== 动态变化模块 ==================
        const aList = enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE[id || '1']
        let medicineOption = createdSchemaAndObjectValue(aList, this.propertiesSpuSku, { span: 12, disabled: !!this.objId && !this.statusEdit }, true)
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
        if (this.objId) Object.keys(medicineOption.obj).forEach(key => { medicineOption.obj[key] = this.materialInfo.ext[key] }) // 合并数据和模版
        this.schemaLeft = [...this.fixedSchema, ...medicineOption.schema]
        this.objLeft = Object.assign({}, this.objLeft, medicineOption.obj)
        Object.assign(this.rulesLeft, medicineOption.rules)
        // 默认财务分类 & 销售单位
        if (Number(id) === 2) {
          if (enumConfig.CONSUMABLES_MEDICAL_TYPE === materialType) { // 医疗耗材
            this.setDefaultDisabled(this.schemaLeft, 'SXX19030500001ATTD', true, false) // 财务分类
          }
          ['SXX19030700004BLxfN', 'SXX19030700003BLuIE'].forEach(code => { // 销售单位
            this.setDefaultDisabled(this.schemaLeft, code, true, false, true)
          })
        }
        // ================== 规格表格模块 ==================
        // 规格表格
        this.specTableData = []
        if (Number(id) === 2) { // 生成医嘱项
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE), this.propertiesSpuSku, {}, true)
          this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_ONE))
        } else { // 不生成医嘱项
          this.specSchemaData = createdSchemaAndObjectValue(Object.keys(enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO), this.propertiesSpuSku, {}, true)
          this.specTableData.push(Object.assign({}, enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO))
        }
        // ================== 右侧剩余模块 ==================
        if (first) this.leftSchemaByCodes(enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE)
      }
      // ================== 编辑：还原规格表格 ==================
      if (this.objId) {
        this.specTableData = []
        this.materialInfo.skuDTOList.forEach(v => {
          if (!v.splitFlag) {
            let priceObj = {}
            if (typeof v.price === 'number') priceObj[PRICE_CODE] = String(v.price)
            this.specTableData.push(Object.assign(
              JSON.parse(JSON.stringify(v.ext)),
              priceObj,
              {
                id: v.id,
                state: this.isClinic ? v.localState : v.state,
                switchState: this.isClinic ? v.state : '',
                isClinic: this.isClinic,
                serviceId: v.serviceId
              }
            ))
          }
        })
        this.showSpecBtn = true
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
      // ================ 西药添加过敏设置 ================
      if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) { // code
        tempCodeArrRight.unshift('SXX19061000001BmIMC', 'SXX19061000002BmaAT')
      }
      this.schemaRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku, { span: 24, disabled: !!this.objId && !this.statusEdit }, true).schema
      if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 组件
        this.schemaRight.splice(0, 2,
          {
            name: 'SXX19061000001BmIMC',
            label: '药物过敏源一级',
            comp: 'sys-type',
            span: 24,
            props: {
              code: 'THC_SYS_DRUG_ALLERGEN_PRIMARY',
              multiple: true,
              useObject: true,
              objSimple: true,
              disabled: !!this.objId,
              placeholder: '请输入药物过敏源一级'
            }
          },
          {
            name: 'SXX19061000002BmaAT',
            label: '药物过敏源二级',
            comp: 'sys-type',
            span: 24,
            props: {
              code: 'THC_SYS_DRUG_ALLERGEN_SECONDARY',
              multiple: true,
              useObject: true,
              objSimple: true,
              disabled: !!this.objId,
              placeholder: '请输入药物过敏源二级'
            }
          })
      }
      // ==============================================
      this.objRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku, {}, true).obj
      this.rulesRight = createdSchemaAndObjectValue(tempCodeArrRight, this.propertiesSpuSku, {}, true).rules
      if (this.objId) Object.keys(this.objRight).forEach(key => { this.objRight[key] = this.materialInfo.ext[key] })
      this.saveBtn = true
    },
    // 监控属性
    watchPropertySchema (watchName, options, code) {
      this.$watch(watchName, (v) => {
        if (v) this.setPropertySlots(options, code, v.id)
      })
    },
    setPropertySlots (options, code, val) {
      const index = this.schemaLeft.findIndex(item => {
        return item.name === enumConfig.DOSE
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
      // 用药途径
      let aChannel = []
      // 频次code
      let frequencyCode = this.objLeft[enumConfig.FREQUENCY_CODE].id
      // 包装单位options
      const packageOptions = this.specSchemaData.schema[1].props.initOptions
      const specData = this.specTableData[0]
      // 添加了至少一条规格数据
      if (specData) {
        this.packageUnitObj.value = specData[enumConfig.PACKAGE_TRANSFORM_CODE]
        this.packageUnitObj.name = this.findOptinsName(packageOptions, specData[enumConfig.PACKAGE_CODE].id)
      }
      if (frequencyCode) {
        await frequencyApi.getFrequency(frequencyCode).then(res => {
          if (res.data) this.frequencyNum = res.data.num
        })
      }
      const channelOption = this.findOriginOptions(this.schemaLeft, 'SXX000016')
      this.objLeft['SXX000016'].map(item => {
        aChannel.push(this.findOptinsName(channelOption, item.id))
      })
      this.channelName = aChannel.join(',') // 途径
      this.frequencyName = this.findOptinsName(this.findOriginOptions(this.schemaLeft, 'SXX000017'), this.objLeft['SXX000017'].id) // 频次
      this.preparationUnitName = this.findOptinsName(this.findOriginOptions(this.schemaLeft, enumConfig.ZHIJI_CODE), this.objLeft[enumConfig.ZHIJI_CODE].id) // 频次
      // let aTempName = []
      // tempAdviceCode.map(item => {
      // })
      this.adviceName = ''
      this.adviceName += this.objLeft[enumConfig.GENERAL_CODE]
      this.findOptinsName(this.dosageOptions, this.objLeft[enumConfig.DOSAGE]) && (this.adviceName += ' - ' + this.findOptinsName(this.dosageOptions, this.objLeft[enumConfig.DOSAGE]))
      // this.adviceName += this.objLeft[enumConfig.GENERAL_CODE]
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
    removeSpecData: enumConfig.debounce(function (index) {
      this.specTableData.splice(index, 1)
      this.showSpecBtn = true
    }),
    // 规格输入框/选择框/勾选框等。。是否禁用
    disabledTable (index) {
      // 1.非详情的时候（新建），不禁用；
      // 2.详情的时候，sku表格数据数量小于等于索引值(如果有拆零，则数量-1)的时候，说明是新增了数据，此时不禁用；
      return !this.materialInfo.skuDTOList || (this.materialInfo.skuDTOList && (
        (this.materialInfo.splitFlag && this.materialInfo.skuDTOList.length - 1 <= index) ||
        (!this.materialInfo.splitFlag && this.materialInfo.skuDTOList.length <= index)
      ))
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
    clickSwitchSkuState: enumConfig.debounce(function (data, row) {
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
    switchSkuState: enumConfig.debounce(function (data, row) {
      this.switchStateLoading = true
      let state = 0
      if (this.skuState(row.state)) state = 1
      materialApi.updateSkuState({
        id: row.id,
        serviceId: row.serviceId,
        isClinic: this.isClinic,
        state,
      }).then(res => {
        this.switchStateLoading = false
        if (res) {
          this.$messageTips(this, 'success', `${state === 0 ? '启用' : '禁用'}成功`, ' ')
          const tempIndex = data.findIndex(v => v.id === row.id)
          if (tempIndex > -1) data[tempIndex].state = state
        }
      })
    }),
    // 编辑
    editTable: enumConfig.debounce(function () {
      this.statusEdit = true
      if (!this.isLocalPrice) {
        [...this.fixedSchema, ...this.schemaLeft, ...this.schemaRight].forEach(v => {
          if (v.hasOwnProperty('props') && v.props.disabled) v.props.disabled = false
        })
        this.availableSchema(this.obj.classifyId)
      }
    }),
    // 更改编辑状态
    changeEditStatus: enumConfig.debounce(function () {
      // 部分启用
      this.schemaNew.forEach(item => {
        ['SXX000003', 'SXX000004'].forEach(v => {
          if (item.name === v && item.props) item.props.disabled = false
        })
      })
      this.statusEdit = true
    }),
    // 处理不同业务下编辑框的特性
    availableSchema (materialType) {
      if (enumConfig.CONSUMABLES_TYPE.includes(materialType)) { // 耗材
        ['isExpiryDate', 'isManageAlone'].forEach(code => { // 有效期管理 & 唯一码管理 都设置为禁用
          this.setDefaultDisabled(this.fixedSchema, code, false, true)
        })
      }
    },
    // 提交
    submitForm: enumConfig.debounce(function () {
      if (!this.obj.classifyId) return this.$messageTips(this, 'warning', '请先选择好物资类型', ' ')
      if ([...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(this.obj.classifyId)) { // 西药/中成药
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
                if (this.specExtraPrice && !this.specExtraTableData[0].price) return this.$messageTips(this, 'warning', '必填字段未填写，请检查填写后再保存', ' ')
                // 校验规格表格
                if (specTableLen) {
                  let validSpec = true
                  for (let i = 0; i < specTableLen; i++) {
                    const item = this.specTableData[i]
                    // 1.判断必填字段是否有值 --->
                    for (let key in item) {
                      // 区分物资类型
                      if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 西药/中成药
                        if ([enumConfig.PACKAGE_TRANSFORM_CODE, enumConfig.PACKAGE_CODE, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      } else if (enumConfig.CHINESE_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 中药饮片/中药颗粒
                        if ([enumConfig.SPEC, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      } else if (enumConfig.CONSUMABLES_TYPE.includes(this.obj.classifyId)) { // 耗材
                        if ([enumConfig.SPEC, enumConfig.PACKAGE_CODE, PRICE_CODE].includes(key) && item[key] === '') {
                          validSpec = false
                        }
                      }
                    }
                    // 3.西药拆零 --->
                    if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 西药/中成药
                      // 是否制剂单位和包装单位相同并且转换比为1 并且规格数量大于1
                      if (this.objLeft[enumConfig.ZHIJI_CODE].id === item[enumConfig.PACKAGE_CODE].id && +item[enumConfig.PACKAGE_TRANSFORM_CODE] === 1 && specTableLen > 1) {
                        item.splitFlag = 1
                      }
                      // 以制剂单位销售 并且enumConfig.ZHIJI_CODE（制剂单位）值 == enumConfig.PACKAGE_CODE（包装单位）值 enumConfig.PACKAGE_TRANSFORM_CODE（包装转换比） === 1
                      if (this.specExtraPrice && this.objLeft[enumConfig.ZHIJI_CODE].id === item[enumConfig.PACKAGE_CODE].id && +item[enumConfig.PACKAGE_TRANSFORM_CODE] === 1) {
                        return this.$messageTips(this, 'warning', '填写规格有重复，请核对后再保存', ' ')
                      }
                      if (+this.objLeft[enumConfig.ZHIJI_CODE].id === +item[enumConfig.PACKAGE_CODE].id && +item[enumConfig.PACKAGE_TRANSFORM_CODE] !== 1) {
                        setTimeout(_ => {
                          item[enumConfig.PACKAGE_TRANSFORM_CODE] = 1
                        }, 1000)
                        return this.$messageTips(this, 'warning', '制剂单位和包装单位相同时，包装转换比只能为1', ' ')
                      }
                    }
                    // 2.规格表格 --->
                    for (let n = i + 1; n < specTableLen; n++) {
                      const items = this.specTableData[n]
                      for (let keys in item) {
                        if (keys !== enumConfig.BAR_CODE) {
                          if ((enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId) &&
                            item[enumConfig.PACKAGE_TRANSFORM_CODE] === items[enumConfig.PACKAGE_TRANSFORM_CODE] &&
                            item[enumConfig.PACKAGE_CODE].id === items[enumConfig.PACKAGE_CODE].id) ||
                            (enumConfig.CHINESE_MEDICINE_TYPE.includes(this.obj.classifyId) &&
                              item[enumConfig.SPEC] === items[enumConfig.SPEC]) ||
                            (enumConfig.CONSUMABLES_TYPE.includes(this.obj.classifyId) &&
                              item[enumConfig.SPEC] === items[enumConfig.SPEC] &&
                              item[enumConfig.PACKAGE_CODE].id === items[enumConfig.PACKAGE_CODE].id)) {
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
                if (!item.price && !this.objId && item.ifService && item.ifService === enumConfig.yesno[1].id) {
                  return this.$messageTips(this, 'warning', '已选规格中有基础价必填，请核对后再保存', ' ')
                }
              })
            }
            let params = {}
            // 关联关系表单验证
            let materialSpu
            materialSpu = !this.statusEdit ? params.materialSpu = {} : params.materialDictSpu = {}
            Object.assign(materialSpu, {
              skuDTOList: this.obj.materialDictSku,
              ext: {},
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
              let array = ['classifyId', 'type1', 'type2', 'type3', 'code', 'classifyVoObject', 'templetPropertiesForSpu', 'keysForSpu']
              if (!this.objId) {
                array.push('managementModel', 'templetPropertiesForSku', 'keysForSku', 'materialDictSku', 'isNum', 'isExpiryDate', 'isManageAlone', 'queryModel')
              }
              if (this.objectFilter(array, key)) {
                materialSpu.ext[key] = this.obj[key]
              }
            }
            // 处理sku
            params.materialDictSpu.skuDTOList.forEach(item => {
              item.ext = {}
              item.materialDictPropertys.forEach(v => {
                if (Array.isArray(v.materialDictPropertyValues)) {
                  item.ext[v.propertyCode] = { id: v.materialDictPropertyValues[0].propertyValueObject.id, name: v.materialDictPropertyValues[0].propertyValueObject.name }
                } else {
                  item.ext[v.propertyCode] = v.propertyValue
                }
              })
              delete item.keysForSku
              delete item.materialDictPropertys
            })
            if (this.objId) { // 编辑
              params.materialDictSpu.id = this.objId
              params.materialDictSpu.ext['classifyObject'] = this.materialInfo.ext['classifyObject']
            } else { // 新建
              params.materialDictSpu.ext['classifyObject'] = [...this.options1, ...this.options2, ...this.options3].filter(v => {
                return v.id === this.obj.classifyId
              })[0]
            }
            // 调整价格为string类型
            try {
              params.materialDictSpu.skuDTOList.forEach(item => {
                if (typeof item.price === 'number') item.price = String(item.price)
              })
              params.materialDictSpu.ext.materialDictSku.forEach(item => {
                if (typeof item.price === 'number') item.price = String(item.price)
              })
            } catch (error) { }
            // console.log(JSON.stringify(params.materialDictSpu))
            this.submitDisableBtn = true
            materialApi.createOrUpdate(params.materialDictSpu).then(result => {
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
      let paramsExt = {}
      // ===========处理SPU=============
      let combineParams = {} // 区分不同物资类型 产生的数据对象
      if ([...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(this.obj.classifyId)) { // 药品
        // 处理药理分类
        combineParams.categoryMaterialRelations = []
        if (Array.isArray(allFormData.categoryRelations)) {
          allFormData.categoryRelations.forEach(v => {
            combineParams.categoryMaterialRelations.push({
              pharmacologyCategoryId: v[v.length - 1]
            })
          })
        }
        // 删除ext里的药理分类
        delete allFormData.categoryRelations
      } else { // 非药品（目前只是耗材）
        combineParams = {
          isExpiryDate: allFormData.isExpiryDate, // 有效期管理
          isManageAlone: allFormData.isManageAlone // 唯一码管理
        }
      }
      Object.assign(paramsExt, {
        classifyId: this.obj.classifyId,
        ext: enumConfig.defaultObjectKey(this.propertiesSpuSku, allFormData)
      }, combineParams)
      // 搜索的物资
      if (this.materialDictSkuId && !this.objId) Object.assign(paramsExt, { id: this.materialDictSkuId })
      // ===========处理SKU=============
      paramsExt.skuDTOList = []
      this.specTableData.forEach(data => {
        let paramsSku = {
          ext: enumConfig.defaultObjectKey(this.propertiesSpuSku, data)
        }
        if (data.splitFlag) { // 数据内层有拆零标志
          paramsSku.splitFlag = 1 // 将拆零标志放到外层(此种情况只适用于：手动添加的规格，刚好算拆零的标准)
          delete data.splitFlag // 删除ext里的splitFlag
        }
        if (data.id) { // 编辑时，将内层数据移动到外层，并删除内层数据
          ['id', 'state', 'switchState', 'isClinic', 'serviceId'].forEach(v => {
            paramsSku[v] = data[v]
            delete data[v]
          })
        }
        if (enumConfig.CHINESE_MEDICINE_TYPE.includes(this.obj.classifyId)) { // 中药类型包装单位使用制剂单位
          paramsSku.ext[enumConfig.PACKAGE_CODE] = paramsExt.ext[enumConfig.ZHIJI_CODE]
        }
        paramsExt.skuDTOList.push(Object.assign(paramsSku, {
          ifService: allFormData.ifService || 2, // 西药中药均默认为医嘱项，耗材根据选择
          price: allFormData.ifService === 1 ? '' : data[PRICE_CODE]
        }))
      })
      // ===========拆零SKU=============
      if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId) && this.specExtraPrice) { // 西药类型 & 拆零
        let editObj = {}
        if (this.specExtraRowData.id) { // 编辑
          ['id', 'state', 'switchState', 'isClinic', 'serviceId'].forEach(v => {
            editObj[v] = this.specExtraRowData[v]
          })
        }
        this.specExtraRowData['SXX000048'] = paramsExt.ext[enumConfig.ZHIJI_CODE]
        this.specExtraRowData.price = String(this.specExtraRowData.price)
        paramsExt.skuDTOList.push(Object.assign({ ext: this.specExtraRowData }, {
          splitFlag: 1,
          ifService: 2,
          price: String(this.specExtraRowData.price)
        }, editObj))
      }
      // ===========提交数据=============
      const flag = false
      if (flag && this.objId) { // 更新(旧)
        let materialSpu = {} // delete
        let params = {} // delete
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
          tempParams.preparationUnitId = this.objLeft[enumConfig.ZHIJI_CODE]
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
        if (this.isLocalPrice) {
          let priceArr = []
          tempParams.materialSkus.map(item => {
            priceArr.push({
              serviceId: item.serviceId,
              price: item.price
            })
          })
          materialApi.updateRcmPrice(priceArr).then(result => {
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
          materialApi.createOrUpdate(tempParams).then(result => {
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
      } else {
        if (this.objId) { // 更新
          paramsExt.id = this.objId
          paramsExt.ext['classifyObject'] = this.materialInfo.ext['classifyObject']
        } else { // 创建
          paramsExt.ext['classifyObject'] = [...this.options1, ...this.options2, ...this.options3].filter(v => {
            return v.id === this.obj.classifyId
          })[0]
        }
        // console.log(JSON.stringify(paramsExt))
        // 提交请求
        this.submitDisableBtn = true
        materialApi.createOrUpdate(paramsExt).then(result => {
          this.submitDisableBtn = false
          if (result) {
            this.submitDisableBtn = true
            this.$messageTips(this, 'success', '成功', ' ')
            // 建辉让缓1s再请求
            setTimeout(() => {
              this.submitDisableBtn = false
              this.$router.push(this.backListRoute)
            }, 1500)
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
    watchPrice (val) {
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
    validatePrice (price) {
      const dotNumber = String(price).split('.')[1]
      return Number(price) >= 0 && (!dotNumber || (dotNumber && dotNumber.length <= 4))
    },
    // 重置数据
    resetFormData () {
      this.$watch('objLeft.SXX000011', () => { return false })
      // =========================
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
      if (!flag) globalFlag = data[index].certainly === enumConfig.PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id
      if (type === enumConfig.GLOBAL_ATTR[3].id) value = []
      return { label, options, type, value, isMust, certainly, apiUrl, globalFlag }
    },
    _setColumnName (data, name) {
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      let index = row.findIndex(item => {
        return item.propertyCode === name
      })
      let value = ''
      if (index > -1) {
        if ((row[index].propertyType === enumConfig.GLOBAL_ATTR[2].id || row[index].propertyType === enumConfig.GLOBAL_ATTR[3].id) && row[index].materialDictPropertyValues && row[index].materialDictPropertyValues.length) {
          let tempArr = []
          for (let i = 0; i < row[index].materialDictPropertyValues.length; i++) {
            let item = row[index].materialDictPropertyValues[i]
            tempArr.push((item.propertyValueObject && item.propertyValueObject.name) || '')
          }
          row[index].propertyType === enumConfig.GLOBAL_ATTR[2].id ? value = tempArr.join(' ') : value = tempArr.join(',')
        } else if (row[index].propertyType === enumConfig.GLOBAL_ATTR[5].id) {
          value = row[index].specialName ? row[index].specialName : row[index].propertyValue ? row[index].propertyValue : '-'
        } else if (row[index].propertyType === enumConfig.GLOBAL_ATTR[6].id) {
          value = row[index].propertyValue ? enumConfig.dateFormat(row[index].propertyValue, 'YYYY-MM-DD') : ''
        } else if (row[index].propertyType === enumConfig.GLOBAL_ATTR[10].id) {
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
      if (!this.basePrice && this.medicalOrder === enumConfig.yesno[1].id) return this.$messageTips(this, 'warning', '基础价必填，请核对后再保存', ' ')
      // 遍历当前行字段「key」
      for (let keys in data) {
        for (let i = 0; i < this.skuTableData.length; i++) {
          let item = this.skuTableData[i]
          if (item.prop === keys && item.isMust && !data[keys]) {
            this.$messageTips(this, 'warning', item.label + '必填，请核对后再保存', ' ')
            return
          }
          if (data.id) item.globalFlag = true
        }
        let val = data[keys]
        let listParams = {}
        if (!val) {
          if (this._findPropertySkuType(keys).propertyType === enumConfig.GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === enumConfig.GLOBAL_ATTR[3].id) {
            listParams.materialDictPropertyValues = []
          } else {
            listParams.propertyValue = ''
          }
        } else {
          if (val.constructor !== Array) {
            if (this._findPropertySkuType(keys).propertyType === enumConfig.GLOBAL_ATTR[2].id) {
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
          type: enumConfig.PROPERTY_TYPE_FOR_TEMPLET[1].id
        }, listParams))
      }
      // 基础价格&医嘱项目
      Object.assign(params, { ifService: this.medicalOrder, price: this.basePrice, id: data.id })
      if (this.medicalOrder === enumConfig.yesno[0].id) params.price = ''
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
          if (item.propertyType === enumConfig.GLOBAL_ATTR[3].id || item.propertyType === enumConfig.GLOBAL_ATTR[2].id) {
            if (item.propertyType === enumConfig.GLOBAL_ATTR[2].id) {
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
      if ((dataRes && dataRes.classifyVoObject && dataRes.classifyVoObject.classifyObject.id === enumConfig.DRUGTYPE) || (dataRes && dataRes.type1 === enumConfig.DRUGTYPE)) isSchemaFlag = true
      const categoryMaterialRelations = []
      if (isSchemaFlag) {
        const category = { disabled: false, options: this.categoryList, searchPlaceholder: '请输入药理分类', placeholder: '请选择药理分类' }
        if (!this.objId) {
          dataRes.categoryMaterialDictRelations && dataRes.categoryMaterialDictRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          enumConfig.CUSTOM_MATERIAL_CODE_DICT[0].props = category
          schema.push(enumConfig.CUSTOM_MATERIAL_CODE_DICT[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialDictRelations: categoryMaterialRelations || [] })))
        } else {
          dataRes.categoryMaterialRelations && dataRes.categoryMaterialRelations.map(v => {
            v.levelRelation && categoryMaterialRelations.push(v.levelRelation)
          })
          enumConfig.CUSTOM_MATERIAL_CODE[0].props = category
          schema.push(enumConfig.CUSTOM_MATERIAL_CODE[0])
          this.obj = JSON.parse(JSON.stringify(Object.assign(this.obj, { categoryMaterialRelations: categoryMaterialRelations || [] })))
        }
      }
    },
    ...enumConfig.patch
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
      if (val && !this.objId && ![enumConfig.DRUGTYPE, enumConfig.MATERIALTYPE].includes(val)) {
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
        this.watchPrice(val)
      },
      deep: true
    },
    'specExtraTableData': { // 监控拆零销售单价
      handler (val) {
        this.watchPrice(val)
      },
      deep: true
    },
    'objLeft.ifService' (val) { // 监控是否生成医嘱项
      if (val) this.dynamicSchemaByCodes(val, this.resultObj.classifyId, false)
    },
    'specExtraPrice' (val) { // 监控是否以制剂单位销售
      if (val) {
        if (!this.objId) {
          if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) {
            this.specExtraRowData.price = Number(enumConfig.floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(2))
          } else {
            this.specExtraRowData.price = Number(enumConfig.floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(4))
          }
        } else {
          // 拆零状态处理
          const splitSku = this.materialInfo.skuDTOList.filter(v => v.splitFlag)
          if (splitSku.length) {
            this.specExtraRowData.id = splitSku[0].id
            this.specExtraRowData.price = splitSku[0].price
            this.specExtraRowData.state = this.isClinic ? splitSku[0].localState : splitSku[0].state
            this.specExtraRowData.switchState = this.isClinic ? splitSku[0].state : ''
            this.specExtraRowData.isClinic = this.isClinic
            this.specExtraRowData.serviceId = splitSku[0].serviceId
          } else {
            if (enumConfig.WEST_MEDICINE_TYPE.includes(this.obj.classifyId)) {
              this.specExtraRowData.price = Number(enumConfig.floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(2))
            } else {
              this.specExtraRowData.price = Number(enumConfig.floatTool.divide(this.specTableData[0][PRICE_CODE], this.specTableData[0]['SXX000049']).toFixed(4))
            }
          }
        }
        this.specExtraTableData.push(this.specExtraRowData)
      } else {
        this.specExtraTableData = []
      }
    },
    'objLeft.SXX000003' (val) { // 监控通用名 转化为拼音
      if (!val) {
        this.objLeft['SXX000004'] = ''
        return
      }
      if (this.statusEdit) this.objLeft['SXX000004'] = convertCharToPinyin(val).shoupin.toUpperCase()
    },
    'objLeft.SXX000005' (val) { // 监控商品名 转化为拼音
      if (!val) {
        this.objLeft['SXX000006'] = ''
        return
      }
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
  width: 220px !important;
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
