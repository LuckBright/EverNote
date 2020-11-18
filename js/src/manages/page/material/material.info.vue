<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb :name="breadCrumbName" :path="path" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
      <form-template
        class="page_layout_full"
        :multi-column="isMultiColumn"
        :custom-form-schemas="schemas"
        :custom-right-schema="customSchema"
        :filter-right-key="filterRightKey"
        :custom-local-schema="customLocalSchema"
        id-key="id"
        :only-read="onlyRead"
        :watch-key-callback="watchKeyCallback"
        :show-sub-title="true"
        :form-main-title="formMainTitle"
        :get-by-id-form-data="getByIdFormData"
        :ever-hook="everHook"
        :api="materialApi"
        :classify-id="classifyId"
        source-key="templetProperties"
        :system-type-object="systemTypeObject"
        :is-clinic="isClinic"
        :changeObj.sync="changeObj"
        :formSchemas.sync="formSchemas"
        :router-query-array="routerQueryArray"
        :need-save="needSave"
        :serviceInfo="serviceInfo"
        :priceManage="priceManage"
        ref-tree-name="treeTable"
        ref-tree-save-relation="handlerRelation"
        form-title="新建物资">
          <!-- 分类选择 -->
          <div slot="materialheader" class="materialheader">
            <form-classify
              :classifyId.sync="classifyId"
              :classifyObject.sync="classifyObject"
              v-if="!objId"
              placeholder="请先选择分类"
              :useObject="true"
              :multiple="false"
              :systemType="systemTypeObject.id">
            </form-classify>
          </div>
          <!-- 商品条形码 -->
          <template slot="materialBarCodes">
            <material-code-number
              v-if="classifyId"
              :classifyId="classifyId"
              :objData="materialBarCodes"
              :checkMaterialBarCode="materialApi.checkMaterialBarCode"
              @emitMaterialBarCodes="emitMaterialBarCodes">
            </material-code-number>
          </template>
          <!-- 中药饮片 中药颗粒价格 -->
          <template slot="price">
            <div class="is-required">
              <el-input
                ref="focusinput"
                @input="focusInput"
                @blur="blurInput(chinesePrice, undefined, 'chinesePrice')"
                placeholder="请输入销售价"
                :class="{error: (saveBtn && (chinesePrice == '' || chinesePrice == undefined || chinesePrice == null))}"
                v-model="chinesePrice"
                type="text"
                :disabled="!!objId">
                <template slot="append">元</template>
              </el-input>
            </div>
          </template>
          <!-- 中药饮片 中药颗粒最高限价 -->
          <template slot="ceilingPrice">
            <div>
              <el-input
                v-if="!onlyRead"
                placeholder="请输入最高限价"
                v-model="chineseCeilingPrice"
                @input="markupBlur('chineseCeilingPrice')"
                @blur="blurInput(chineseCeilingPrice, undefined, 'chineseCeilingPrice')"
                type="number">
              </el-input>
              <span v-else>{{chineseCeilingPrice || '-'}}</span>
            </div>
          </template>
          <!-- 加成率 -->
          <template slot="markupPercentage">
            <el-input v-model="markupPercentage" type="number" @input="markupBlur('markupPercentage')" placeholder="请输入加成率">
              <template slot="append">%</template>
            </el-input>
          </template>
          <!-- 中药展示物资编码 -->
          <template slot="code">
            <el-input
              v-if="!objId"
              maxlength="15"
              :class="{error: chinesCodeObj.error}"
              placeholder="请输入最大15位英文或数字"
              @blur="checkCodes(chinesCodeObj)"
              v-model="chinesCodeObj.code">
            </el-input>
            <span v-else>{{getBySkuDTOList[0] ? getBySkuDTOList[0].code : ''}}</span>
          </template>
          <!-- 图例说明 -->
          <template slot="pictureDescribe">
            <div class="showpicture" v-if="!onlyRead">
              <el-popover
                popper-class="carousel-example-img"
                style="margin-left: -170px"
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
                  :disabled="false"
                  slot="reference">
                  {{'图例说明'}}
                </el-button>
              </el-popover>
              <span
                v-if="enumConfig.WEST_MEDICINE_TYPE.includes(classifyId)"
                class="test-data fr"
                @click="handlerCheckData"
              >检查数据正确性</span>
            </div>
          </template>
          <!-- 规格表格 -->
          <div class="content-center-table" slot="spec">
            <span v-if="enumConfig.WEST_MEDICINE_TYPE.includes(classifyId) && !onlyRead" style="position: absolute;top: -45px;"><el-checkbox :disabled="splitDisabled || (specTableData[0] && specTableData[0]['SXX000049'] !== '' && specTableData[0]['SXX000049'] < 1.0001)" v-model="isSplitFlat">是否生成拆零物资</el-checkbox></span>
            <el-table :data="specTableData">
              <el-table-column
              v-if="!enumConfig.CHINESE_MEDICINE_TYPE.includes(classifyId)"
              label="物资编码">
                <template slot-scope="scope">
                  <div class="codeflex">
                    <el-input
                      v-if="!objId || (objId && !getBySkuDTOList[scope.$index])"
                      maxlength="15"
                      placeholder="请输入最大15位英文或数字"
                      @blur="checkCodes(scope.row)"
                      :class="{error: scope.row.error}"
                      v-model="scope.row.code">
                    </el-input>
                    <span v-else>{{getBySkuDTOList[scope.$index].code}}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 包装规格：西药 -->
              <el-table-column
                v-if="enumConfig.WEST_MEDICINE_TYPE.includes(classifyId)"
                label="包装规则">
                <template slot-scope="scope">
                  <div class="is-required">
                    <el-input
                      placeholder="请输入规格"
                      type="number"
                      :class="{error: (saveBtn && scope.row['SXX000049'] == '')}"
                      @blur="setBlur(scope.$index)"
                      v-model="scope.row['SXX000049']"
                      :disabled="!!objId || scope.$index === 1 || (scope.row['SXX000048'].id && changeObj['SXX000047'].id && scope.row['SXX000048'].id === changeObj['SXX000047'].id)">
                      <template
                        slot="append">
                        {{bozhuang.name || bozhuang || ''}}
                      </template>
                    </el-input>
                  </div>
                  <div class="subHr pos_re">/</div>
                </template>
              </el-table-column>
              <!-- 型号规格：耗材 / 规格：中药 -->
              <el-table-column
                v-if="[...enumConfig.CONSUMABLES_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(classifyId)"
                :label="enumConfig.CONSUMABLES_TYPE.includes(classifyId) ? '型号规格'
                :enumConfig.CHINESE_MEDICINE_TYPE.includes(classifyId) ? '规格' : ''">
                <template slot-scope="scope">
                  <div class="is-required">
                    <el-input
                      type="number"
                      placeholder="请输入规格"
                      v-model="scope.row['SXX000008']"
                      :class="{error: (saveBtn && scope.row['SXX000008'] == '')}"
                      :disabled="!!objId ||  scope.$index === 1">
                      <template
                        v-if="enumConfig.CHINESE_MEDICINE_TYPE.includes(classifyId)"
                        slot="append">
                        {{bozhuang.name || bozhuang || ''}}
                      </template>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <!-- 单位 -->
              <el-table-column
                width="120"
                :label="enumConfig.CONSUMABLES_TYPE.includes(classifyId) ? '计量单位' : ''"
                v-if="[...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CONSUMABLES_TYPE].includes(classifyId)">
                <template slot-scope="scope">
                  <div class="is-required">
                    <ever-select
                      placeholder="请选择单位"
                      :class="{error: (saveBtn && scope.row['SXX000048'] == '')}"
                      v-model="scope.row['SXX000048']"
                      :options="initOptions"
                      :disabled="!!objId || scope.$index === 1"
                      :needObjFlag="true"
                    ></ever-select>
                  </div>
                </template>
              </el-table-column>
              <!-- 单价 -->
              <el-table-column
                :label="'销售价'"
                v-if="priceShow">
                <template slot-scope="scope">
                  <div class="is-required">
                    <el-input
                      type="text"
                      :placeholder="'请输入销售价'"
                      :class="{error: (saveBtn && (scope.row[PRICE_CODE] == '' || scope.row[PRICE_CODE] == undefined || scope.row[PRICE_CODE] == null))}"
                      v-model="scope.row[PRICE_CODE]"
                      @input="focusInputs(scope.row[PRICE_CODE], scope.$index)"
                      @blur="blurInput(scope.row[PRICE_CODE], scope.$index)"
                      :disabled="scope.$index == 1 ? !isSplitFlat : priceDisabled">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <!-- 最高限价 -->
              <el-table-column label="最高限价">
                <template slot-scope="scope">
                  <el-input type="number" placeholder="请输入最高限价" @input="markupBlur('ceilingPrice', scope.$index)" v-model="scope.row.ceilingPrice" :disabled="onlyRead"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 血液/器械/设备  skuDTOList 展示 -->
          <template slot="skuInfo">
            <div class="hr primary-info" v-if="tempTableData.length || tableData.length"></div>
            <h3 class="primary-info" v-if="tempTableData.length || tableData.length">规格</h3>
            <div class="primary-info" style="margin-top: 20px;" v-if="tempTableData.length || tableData.length">
              <!-- 表头/新增 -->
              <el-table class="hide-table-body" style="width: 100%" v-if="!onlyRead" :data="tempTableData">
                <el-table-column width="50" v-if="!objId"></el-table-column>
                <el-table-column
                  v-if="classifyId === enumConfig.BLOOD_CLASSIFYID"
                  min-width="150px"
                  label="创建医嘱项目">
                  <template slot-scope="scope">
                    <ever-select
                      :disabled="!!scope.row.id && onlyRead"
                      class="is-required"
                      v-model="medicalOrder"
                      :options="enumConfig.yesno"
                      placeholder="创建医嘱项目"
                    ></ever-select>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="classifyId === enumConfig.BLOOD_CLASSIFYID"
                  min-width="150px"
                  label="销售价">
                  <template slot-scope="scope">
                    <sys-text
                      v-if="medicalOrder && medicalOrder === enumConfig.yesno[1].id"
                      :disabled="!!scope.row.id && onlyRead"
                      class="is-required"
                      v-model="basePrice"
                      placeholder="销售价">
                    </sys-text>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="150px"
                  :resizable="false"
                  v-for="(item, index) in skuTableData"
                  :key="index + 'label'"
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
                v-if="tableData.length"
                ref="skutablelist"
                :data="tableData"
                style="width: 100%; margin-top: -10px; z-index: 2; border-top: none"
                :show-header="!!objId && onlyRead"
                @selection-change="handleSelectionChange"
                :stripe="false">
                <el-table-column type="selection" width="50" v-if="!objId"></el-table-column>
                <el-table-column
                  label="创建医嘱项目"
                  v-if="classifyId === enumConfig.BLOOD_CLASSIFYID"
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
                  label="销售价"
                  v-if="classifyId === enumConfig.BLOOD_CLASSIFYID"
                  min-width="150px"
                  prop="price">
                </el-table-column>
                <el-table-column
                  min-width="150px"
                  v-for="(item, index) in skuTableData"
                  :key="index + 'table'"
                  :label="item.label"
                  prop>
                  <template slot-scope="scope">{{_setColumnName(scope.row, item.prop)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" prop v-if="!objId || !onlyRead">
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
          <el-button :loading="statueLoading" v-if="objId && isClinic" slot="footer" size="small" @click="discontinueUseHandler()">{{getByIdFormData && transformStatue(this.state)}}</el-button>
      </form-template>
    </div>
    <!-- 检查数据正确性 -->
    <dialog-slot title="检查数据正确性" :dialogSlot.sync="dialogSlot">
      <material-calc
        v-if="dialogSlot"
        :obj="changeObj"
        :specTableData="specTableData"
      ></material-calc>
      <div slot="footer" class="dialog-footer alg_c">
        <el-button type="primary" @click="dialogSlot = !dialogSlot">关闭</el-button>
      </div>
    </dialog-slot>
  </div>
</template>

<script>
import { convertCharToPinyin } from '@/components/pinyin.js'
import * as enumConfig from '@/util/common'
import * as formCustom from '@/util/formcustom'
// import ManageConfigMixin from '@/manages/mixin/manageconfigmixin'
import FormTemplate from '@/manages/components/form.template'
import FormClassify from '@/manages/components/form.classify'
import materialApi from '@/manages/page/material/materialapi'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import materialCalc from '@/manages/components/material.calc'
import SkuTable from '@/warehouse/page/components/skutable'
import westernMixin from '@/manages/page/material/mixins/western.mixin' //  西药物资处理mixin
import chineseMixin from '@/manages/page/material/mixins/chinese.mixin' //  中成药物资处理mixin
import consumablesMixin from '@/manages/page/material/mixins/consumables.mixin' //  耗材物资处理mixin
import materilotherMixin from '@/manages/page/material/mixins/materilother.mixin' //  其他物资类型处理mixin
import fetchcategoryrelationsMixin from '@/manages/page/material/mixins/fetchcategoryrelations.mixin' //  药理分类处理Fn
import materialTreeTable from '@/manages/page/material/index'
import materialCodeNumber from '@/manages/page/material/components/material.code.number'
import resetRouteMeta from '@/manages/mixin/resetroutemeta'
import priceApi from '@/manages/api/price.js'
const PRICE_CODE = 'price'
export default {
  mixins: [
    // ManageConfigMixin,
    westernMixin,
    chineseMixin,
    consumablesMixin,
    materilotherMixin,
    fetchcategoryrelationsMixin,
    resetRouteMeta
  ],
  props: {
    isClinic: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      enumConfig,
      PRICE_CODE,
      formCustom,
      haveManage: Number(this.$route.query.haveManage),
      priceManage: !!Number(this.$route.query.priceManage),
      statueLoading: false,
      onlyRead: false,
      dialogSlot: false,
      loading: false,
      priceShow: false,
      priceDisabled: false,
      isSplitFlat: false,
      splitDisabled: false,
      saveBtn: false,
      isMultiColumn: true,
      needSave: true,
      schemas: [],
      digitCapacity: 4,
      customLocalSchema: [],
      chinesePrice: '',
      chineseCeilingPrice: '',
      chinesCodeObj: {
        code: '',
        error: false
      },
      materialApi,
      classifyId: '',
      queryVal: '',
      markupPercentage: '',
      queryPlaceholder: '通用名 / 商品名 / 批准文号',
      classifyObject: null,
      changeObj: {},
      formSchemas: null,
      customSchema: [],
      filterRightKey: [],
      specTableData: [],
      getBySkuDTOList: [],
      initOptions: [],
      legend: [], // 图例说明
      materialBarCodes: [],
      materialCheckBarCodes: [],
      readDomCount: 0,
      templateObject: {},
      getByIdFormData: {},
      objId: this.$route.params.id,
      activeName: 'first',
      systemTypeObject: enumConfig.STENCIL_TYPE[0], // 类型
      breadCrumbName: `返回`,
      materialTitle: '新建物资',
      serviceInfo: null,
      everHook: {
        beforeFormCreated: this.beforeFormCreated,
        beforeSubmitForm: this.beforeSubmitForm,
        formCreated: this.formCreated,
        formUpdated: this.formUpdated,
        formMainTitle: this.formMainTitle,
        beforeSeeObject: this.beforeSeeObject,
        submitParamsHandle: this.submitParamsHandle,
        afterSubmitForm: this.afterSubmitForm,
        conciseSyncSubmit: this.conciseSyncSubmit,
        setInputDisabled: this.setInputDisabled
      },
      watchKeyCallback: [
        { key: 'SXX000011', cb: this.SXX000011CallBack },
        { key: 'SXX000003', cb: this.SXX000003CallBack },
        { key: 'SXX000005', cb: this.SXX000005CallBack },
        { key: 'SXX000047', cb: this.SXX000047CallBack },
        { key: 'SXX000053', cb: this.SXX00005354CallBack },
        { key: 'SXX000054', cb: this.SXX00005354CallBack }
      ],
      bozhuang: '',
      ifService: 1,
      state: 1,
      routerQueryArray: [
        {
          name: 'groupId',
          value: 'id',
          isFind: true,
        },
        {
          name: 'haveManage',
          value: '1'
        }
      ]
    }
  },
  async mounted () {
    await priceApi.pricePrecision().then(res => {
      if (res) {
        this.digitCapacity = res.digitCapacity || 4
      }
    })
  },
  created () {
    if (this.objId) {
      this.onlyRead = true
      this.getDetail()
      if (this.isClinic && !this.haveManage) this.needSave = false
      if (this.$route.path.indexOf('/workspace/materialdetail') > -1) this.needSave = false
    }
  },
  computed: {
    path () {
      // 此处是CPOE引用，查看物资详情，返回需回到CPOE的界面（必须保留
      const isBatch = this.$route.query && this.$route.query.isBatch
      if (this.$route.path.indexOf('workspace') > -1) return '/workspace/druglist'
      return this.isClinic ? `/warehouse/materiallists/${isBatch ? 'batchpriceings' : 'unifiedpricing'}` : '/manages/material'
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.path.indexOf('/manages/materialinfo') > -1 && to.meta.thirdActiveIndex === '/') {
      to.meta.thirdActiveIndex = '/manages/material'
    }
    next()
  },
  methods: {
    // 加成率限制2位小数
    markupBlur (name, index) {
      let num = String(name === 'ceilingPrice' ? this.specTableData[index][name] : this[name])
      if (num.length > 10) {
        name === 'ceilingPrice' ? (this.specTableData[index][name] = Number(num.substring(0, 10))) : (this[name] = Number(num.substring(0, 10)))
      }
      if (num.indexOf('.') > -1) {
        let arr = num.split('.')
        if (arr[1] && arr[1].length > this.digitCapacity) {
          arr[1] = arr[1].substring(0, this.digitCapacity)
          if (name === 'ceilingPrice') {
            this.specTableData[index][name] = Number(arr.join('.'))
          } else {
            this[name] = Number(arr.join('.'))
          }
        }
      }
    },
    // 调用后台接口查询当前物资编码是否已经存在
    checkCodes: enumConfig.debounce(async function (row) {
      if (!row.code.length) {
        this.$set(row, 'error', false)
        return
      }
      if (!/^([a-z]|[A-Z]|\d)+$/.test(row.code)) {
        row.code = ''
        this.$set(row, 'error', false)
        return this.$messageTips(this, 'warning', '请输入正确的物资编码')
      }
      if (this.specTableData.length > 1) {
        if (this.specTableData[0].code && this.specTableData[1].code && this.specTableData[0].code === this.specTableData[1].code) {
          this.$set(row, 'error', true)
          return this.$messageTips(this, 'warning', '当前物资编码重复')
        }
      }
      let params = { code: row.code }
      await this.materialApi.checkMaterialCode(params).then(res => {
        if (res.data.flag) {
          this.$set(row, 'error', false)
        } else {
          this.$set(row, 'error', true)
          this.$messageTips(this, 'warning', res.data.message)
        }
      })
    }),
    setBlur (index) {
      if (this.specTableData[index]['SXX000049'] <= 0) {
        this.specTableData[index]['SXX000049'] = ''
        return this.$messageTips(this, 'warning', '包装规则不能小于等于0')
      }
    },
    emitMaterialBarCodes (data) {
      this.materialCheckBarCodes = data
    },
    chiserePriceSet (val, index) {
      val = val + ''
      if (~val.indexOf('.')) {
        let newNumber = val.split('.')
        if (newNumber[1]) {
          let count = parseFloat(newNumber[1])
          if (isNaN(count)) {
            newNumber[1] = ''
          } else {
            if (/^[0-9]*$/.test(newNumber[1])) count = newNumber[1]
            if (String(count).length > this.digitCapacity) {
              newNumber[1] = `${String(count).substring(0, String(count).length - 1)}`
            } else {
              newNumber[1] = count
            }
          }
        }
        if (typeof index !== 'undefined') {
          this.specTableData[index][PRICE_CODE] = `${newNumber[0]}.${newNumber[1]}`
        } else {
          this.chinesePrice = `${newNumber[0]}.${newNumber[1]}`
        }
      } else {
        if (typeof index !== 'undefined') {
          this.specTableData[index][PRICE_CODE] = val.substring(0, val.length - 1)
        } else {
          this.chinesePrice = val.substring(0, val.length - 1)
        }
      }
    },
    blurInput (val, index, name) {
      this.$nextTick(_ => {
        setTimeout(_ => {
          if (val && val.indexOf('.') === val.length - 1) {
            if (typeof index !== 'undefined') {
              this.specTableData[index][PRICE_CODE] = val.substring(0, val.length - 1)
            } else {
              this[name] = val.substring(0, val.length - 1)
            }
          } else {
            if (typeof index !== 'undefined') {
              this.specTableData[index][PRICE_CODE] = parseFloat(val) + ''
            } else {
              this[name] = parseFloat(val) + ''
            }
          }
        }, 500)
      })
    },
    focusInput () {
      this.$nextTick(_ => {
        this.$refs.focusinput.focus()
      })
    },
    focusInputs (val, index) {
      let prices = parseFloat(val)
      const float = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (isNaN(prices) || prices < 0) {
        val = ''
      }
      if (!float.test(val)) {
        this.chiserePriceSet(val, index)
      } else {
        const chinesePrice = val + ''
        if (chinesePrice && ~chinesePrice.indexOf('.')) this.chiserePriceSet(val, index)
      }
    },
    setInputDisabled () {
      if (!this.priceDisabled && this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        if (this.getBySkuDTOList.length && this.getBySkuDTOList.some(item => item.ext.price)) this.priceDisabled = true
      }
    },
    afterSubmitForm (reset) {
      if (reset === 'reset') {
        this.classifyId = ''
        this.objId = 'reset'
        setTimeout(() => {
          this.objId = ''
        }, 100)
      } else {
        this.$router.go(-1)
      }
    },
    transformStatue (state) {
      return state ? '启用' : '停用'
    },
    // 机构 启用/停用 物资 操作机构属性state
    discontinueUseHandler () {
      this.$confirm(`
      <p class="confirm-title">是否${this.state ? '启用' : '停用'}该物资？</p>
      <p class="confirm-text">该物资若有对应的医嘱项和收费项一同${this.state ? '启用' : '停用'}</p>`,
        `${this.state ? '启用' : '停用'}物资`,
        {
          customClass: 'confirmstyle',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.switchSkuState()
        }).catch(() => { })
    },
    switchSkuState () {
      let params = []
      this.statueLoading = true
      let state = 0
      if (this.skuState(this.state)) state = 1
      this.getByIdFormData.skuDTOList.length && this.getByIdFormData.skuDTOList.forEach(item => {
        params.push({
          id: item.id,
          serviceId: item.serviceId,
          isClinic: this.isClinic,
          state
        })
      })
      materialApi.updateSkuState(params).then(res => {
        if (res) {
          this.state = state
          this.$messageTips(this, 'success', `${!state ? '启用' : '停用'}成功`, ' ')
        }
        this.statueLoading = false
      })
    },
    // SKU停用启用状态
    skuState (state) {
      if (state === 0) {
        return true
      } else if (state === 1) {
        return false
      }
    },
    //  查看物资  管理方式/医嘱  ID回显为汉字
    finldArrName (obj, codeArr) {
      codeArr.forEach(item => {
        if (item === 'ifService') {
          enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_TWO.map(arr => {
            if (arr.id === obj[item]) obj[item] = arr.name
          })
        } else if (item === 'ifCharge') {
          enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE.map(arr => {
            if (arr.id === obj.ext[item]) obj[item] = arr.name
          })
        } else {
          enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.STATUS_ONE.map(arr => {
            if (obj[item] !== undefined && arr.id === Number(obj[item])) obj[item] = arr.name
          })
        }
      })
    },
    //  处理查看 需要特殊处理的字段
    beforeSeeObject (obj, schema) {
      this.ifService = obj.ext.ifService
      let arr = []
      obj.skuDTOList.forEach(item => {
        if (this.isClinic && item.ext.price === undefined) item.ext[PRICE_CODE] = ''
        arr.push(Object.assign({}, item.ext))
      })
      this.specTableData = arr
      this.bozhuang = obj['SXX000047']
      if (this.onlyRead) {
        this.finldArrName(obj, ['isExpiryDate', 'ifCharge', 'ifService'])
      }
      if (obj.markupPercentage !== '' && String(obj.markupPercentage).indexOf('%') === -1) obj.markupPercentage = obj.markupPercentage + '%'
      // 查看西药/中成药 需要处理的数据 回显
      this.beforeSeeWestObject(obj)
      // 查看中药饮片/中药颗粒
      this.beforeSeeChineseObject(obj)
      // 其他物资类型 查看数据
      this.beforeSeeMaterialOtherObject(obj)
      // 编辑物资  特定字段不能修改
      this.objId && this.handlerDefaultStr(obj, schema)
    },
    handlerDefaultStr (obj, schema) {
      if (this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        let isExpiryDate = schema[1].schema.find(item => item.name === 'isExpiryDate')
        if (isExpiryDate) isExpiryDate.props.disabled = true
      }
      if ([...this.enumConfig.WEST_MEDICINE_TYPE, ...this.enumConfig.CHINESE_MEDICINE_TYPE].includes(this.classifyId) && schema[3]) {
        let isExpiryDate = schema[3].schema.find(item => item.name === 'SXX000047')
        if (isExpiryDate) isExpiryDate.props.disabled = true
      }
    },
    handlerCheckData () {
      this.dialogSlot = true
    },
    beforeFormCreated (beforeFormData, only, result) {
      beforeFormData.obj = {}
      beforeFormData.schema = []
      beforeFormData.rules = {}
      // 耗材  商品/办公耗材/医疗耗材  给属性添加默认值
      this.defaultConsumablesObject(beforeFormData, only)
      // 血液/医疗器械/办公设备  sku模版生成
      this.createdMaterialOtherSku(beforeFormData, result, only)
      // 规格 SXX000048 从模版获取options的下拉列表
      const formData = formCustom.createdSchemaAndObjectValue(result.keysForSku, result.templetPropertiesForSku, {}, true)
      const thisObj = formData.schema.find(item => {
        return item.name === 'SXX000048'
      })
      this.initOptions = thisObj ? thisObj.props.initOptions : []
    },
    // 物资 提交数据之前的处理 【外层需要处理的数据】
    beforeSubmitForm (obj) {
      /*
      【各类 物资 需要提交的skuDTOList 处理】
      */
      let skuDTOList = []
      if (!this.objId) {
        // 西药/中成药 需要提交的skuDTOList
        this.westSubmitSkuDTOList(skuDTOList, obj)
        // 中药饮片/中药颗粒 需要提交的skuDTOList
        this.chineseSubmitSkuDTOList(skuDTOList, obj)
        // 耗材/ 需要提交的skuDTOList
        this.consumablesSubmitSkuDTOList(skuDTOList, obj)
        // 其他物资类型 skuDTOList 数据处理
        this.submitParamsMaterialOtherSku(skuDTOList, obj)
      } else {
        this.getBySkuDTOList && this.getBySkuDTOList.forEach((item, index) => {
          if (this.objId && this.isClinic && !this.haveManage) {
          } else {
            item.ifService = obj.ifService
          }
          Object.assign(item.ext, this.specTableData[index])
        })
        if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId) && this.isSplitFlat && this.getBySkuDTOList.length === 1 && this.specTableData.length === 2) {
          this.getBySkuDTOList.push({
            ext: this.specTableData[1],
            ifService: obj.ifService,
            code: this.specTableData[1].code,
            splitFlag: 1
          })
        }
        skuDTOList = [...this.getBySkuDTOList]
        // 其他物资类型 skuDTOList 数据处理
        this.submitParamsMaterialOtherSku(skuDTOList, obj)
      }
      // 调整价格为string类型
      try {
        skuDTOList.forEach(item => {
          if (typeof item.price === 'number') item.price = String(item.price)
          if (typeof item.ext.price === 'number') item.ext.price = String(item.ext.price)
          delete item.ext.code
          delete item.ext.error
        })
      } catch (error) { }
      // 提交药理分类数据
      let categoryMaterialRelations = []
      Array.isArray(obj.categoryMaterialRelationList) && obj.categoryMaterialRelationList.length && obj.categoryMaterialRelationList.forEach(item => {
        categoryMaterialRelations.push({
          pharmacologyCategoryId: item[item.length - 1]
        })
      })
      // 西药、中成药、商品、办公耗材、医疗耗材 验证商品条码输入规则是否合法
      if ([...this.enumConfig.WEST_MEDICINE_TYPE, ...this.enumConfig.CONSUMABLES_TYPE].includes(this.classifyId)) {
        if (this.materialCheckBarCodes.some(item => item.code && (item.error || item.repeat))) {
          return this.$messageTips(this, 'warning', '请输入正确的商品条形码')
        }
      }
      if (this.submitSkuDTOlistCheck(obj)) return false
      if (!this.objId) {
        const { id, name } = this.classifyObject
        obj['classifyObject'] = { id, name }
      } else {
        // obj.ext && delete obj.ext
        obj.skuDTOList && delete obj.skuDTOList
        obj.categoryMaterialRelations && delete obj.categoryMaterialRelations
      }
      let callBanckData = { skuDTOList: skuDTOList }
      // 中药cdss
      if (obj.cdssRuleRelation) {
        callBanckData.cdssRuleRelation = Object.assign({}, obj.cdssRuleRelation, obj.cdssRuleRelationKeyId ? { id: obj.cdssRuleRelationKeyId } : {})
        if (!this.objId || (this.objId && !obj.cdssRuleRelationKeyId)) delete callBanckData.cdssRuleRelation.id
        delete callBanckData.cdssRuleRelation.value
      }
      if (categoryMaterialRelations.length) callBanckData.categoryMaterialRelations = categoryMaterialRelations
      //  slot skuDTOlist 必填 外层数据验证
      return callBanckData
    },
    checkKeyNull (arr, checkArr, ifService) {
      let check = false
      arr.forEach(item => {
        if (item.error) check = true
        checkArr.forEach(keys => {
          if (item[keys] === '' || item[keys] === null || item[keys] === undefined) check = true
        })
      })
      return check
    },
    // 验证 包装规格/包装单位/价格 必填项
    submitSkuDTOlistCheck (obj) {
      let isCheck = false
      // 西药/中成药
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        if (this.checkKeyNull(this.specTableData, ['SXX000049', 'SXX000048', 'price'])) {
          isCheck = true
          this.saveBtn = true
        }
        // 中药饮片/ 中药颗粒
      } else if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
        if (this.chinesePrice === '' || this.chinesePrice === undefined || this.chinesCodeObj.error) {
          isCheck = true
          this.saveBtn = true
        }
        // 耗材
      } else if (this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        let sku = ['SXX000008', 'SXX000048', 'price']
        if (obj.ifService === 1 && obj.ifCharge === 0) sku = ['SXX000008', 'SXX000048']
        if (this.checkKeyNull(this.specTableData, sku)) {
          isCheck = true
          this.saveBtn = true
        }
      }
      if (isCheck) this.$messageTips(this, 'warning', '请检查您输入的内容是否有误，或者有必填项未填写')
      if (this.noOtherMaterialCode.includes(this.classifyId)) {
        if (this.materialOtherCheckSkuDTOObject(obj)) {
          isCheck = true
        }
      }
      return isCheck
    },
    // 已经生成的提交数据处理 params 最终提交给后台的数据
    submitParamsHandle (params) {
      Object.keys(params.ext).forEach(item => {
        if (enumConfig.objGet(params, 'ext.ext', '') && !Object.keys(params.ext.ext).includes(item) && item.indexOf('SXX') > -1) {
          params.ext.ext[item] = params.ext[item]
        }
      })
      let paramsData = JSON.parse(JSON.stringify(params))
      if (paramsData.ext && paramsData.ext.ifCharge && paramsData.ext.ifCharge === 1 && paramsData.ext.ifService === 1) {
        paramsData.ext.ifService = 3
        paramsData.skuDTOList.forEach(item => {
          item.ifService = 3
        })
        paramsData.ext.ifCharge && delete paramsData.ext.ifCharge
      }
      ['SXX19061000002BmaAT', 'SXX19061000001BmIMC', 'SXX19030700004BLxfN', 'SXX19030700003BLuIE'].forEach(item => {
        if (typeof paramsData.ext[item] !== 'undefined' && !paramsData.ext[item]) {
          paramsData.ext[item] = []
        }
      })
      if (paramsData.ext['SXX000017']) paramsData.ext['SXX000017'] = { id: paramsData.ext['SXX000017'].id, name: paramsData.ext['SXX000017'].name }
      if (!this.haveManage && this.isClinic) {
        paramsData.ext['SXX000010'] = parseFloat(paramsData.ext['SXX000010']) + ''
        if (paramsData.ext['SXX000010'] === 'NaN') paramsData.ext['SXX000010'] = ''
        const arr = ['skuDTOList', 'ext', 'id', 'isClinic', 'classifyId', 'categoryMaterialRelations', 'cdssRuleRelation']
        for (let key in paramsData) {
          if (!arr.includes(key)) {
            delete paramsData[key]
          } else {
            !paramsData[key] && delete paramsData[key]
          }
        }
        this.chinesePriceSetSku(paramsData)
        paramsData.isClinic = this.isClinic
      }
      if (this.objId && this.haveManage && this.isClinic) {
        this.chinesePriceSetSku(paramsData)
      }
      this.isExpiryDateProp(paramsData)
      this.clearExtOver(paramsData)
      // 西药、中成药、商品、办公耗材、医疗耗材 商品条码
      if ([...this.enumConfig.WEST_MEDICINE_TYPE, ...this.enumConfig.CONSUMABLES_TYPE].includes(this.classifyId)) {
        paramsData.ext.materialBarCodes = this.materialCheckBarCodes.filter(item => item.code).map(item => { return item.code })
      }
      // 中药cdss
      if (typeof paramsData.ext.cdssRuleRelation !== 'undefined') {
        delete paramsData.ext.cdssRuleRelation
      }
      // 加成率
      paramsData.markupPercentage = Number(this.markupPercentage)
      if (typeof paramsData.ext.markupPercentage !== 'undefined') {
        delete paramsData.ext.markupPercentage
      }
      // 最高限价
      paramsData.skuDTOList && paramsData.skuDTOList.forEach(item => {
        item.ceilingPrice = item.ext.ceilingPrice ? Number(item.ext.ceilingPrice) : ''
        if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
          item.ceilingPrice = this.chineseCeilingPrice ? Number(this.chineseCeilingPrice) : ''
          delete paramsData.ext.ceilingPrice
        }
        delete item.ext.ceilingPrice
      })
      for (let key in paramsData.ext) {
        if (!paramsData.ext[key]) delete paramsData.ext[key]
      }
      return paramsData
    },
    isExpiryDateProp (paramsData) {
      if (![...this.enumConfig.WEST_MEDICINE_TYPE, ...this.enumConfig.CHINESE_MEDICINE_TYPE].includes(this.classifyId)) {
        paramsData.isExpiryDate = Number(paramsData.ext.isExpiryDate)
      }
    },
    clearExtOver (params) {
      let paramsExt = {}
      if (this.objId && params.ext.ext) {
        Object.keys(params.ext.ext).forEach(key => {
          paramsExt[key] = params.ext[key]
        })
        params.ext = paramsExt
      }
      let clearKeyArr = [
        'id',
        'categoryMaterialRelationList',
        'categoryRelations',
        'classifyId',
        'createBy',
        'createTime',
        'current',
        'sourceId',
        'spec',
        'ifStance',
        'ifCharge',
        'isExpiryDate'
      ]
      params.ext && clearKeyArr.forEach(item => {
        if (typeof params.ext[item] !== undefined) delete params.ext[item]
      })
    },
    formCreated (data, only, cacheObj) {
      this.templateObject = data
      this.onlyRead = only
      //  西药/中成药 给属性添加默认值
      this.defaultWestObjectData(this.templateObject, cacheObj)
      //  中药饮片/中药颗粒 给属性添加默认值
      this.defaultChineObjectData(this.templateObject, cacheObj)
      // 其他物资类型  给属性增加默认值
      this.defaultOtherData(this.templateObject, only)
      // 包装规格 包装单位给默认的下拉选择
      data.schema.forEach(item => {
        if (item.name === 'SXX19030500001ATTD') this.$set(data.obj, 'SXX19030500001ATTD', item.props.initOptions[0])
        if (item.name === 'SXX000017') {
          if (item.props.initOptions.length) {
            item.props.isInitOptions = false
          } else {
            item.props.isInitOptions = true
          }
          item.props.isParams = true
        }
      })
      this.ifService = data.obj.ifService
      if (this.objId && !this.onlyRead) {
        let arr = []
        this.getBySkuDTOList && this.getBySkuDTOList.forEach(item => {
          if (this.isClinic && item.ext.price === undefined) item.ext[PRICE_CODE] = ''
          arr.push(Object.assign({}, item.ext))
        })
        this.specTableData = arr
      }
    },
    formMainTitle (obj) {
      return this.objId ? enumConfig.parserComplex({ data: obj.ext, propertys: enumConfig.GOLBAL_VAL_MATERIL_NAME.NAME_ONE }) : ''
    },
    SXX000003CallBack: enumConfig.debounce(function ({ newVal, oldVal, obj }) {
      if (this.objId && !oldVal) return
      if (!newVal) {
        obj['SXX000004'] = ''
        return
      }
      obj['SXX000004'] = convertCharToPinyin(newVal).shoupin.toUpperCase()
    }),
    SXX000005CallBack: enumConfig.debounce(function ({ newVal, oldVal, obj }) {
      if (this.objId && !oldVal) return
      if (!newVal) {
        obj['SXX000006'] = ''
        return
      }
      obj['SXX000006'] = convertCharToPinyin(newVal).shoupin.toUpperCase()
    }),
    // 编辑查看请求详情数据
    getDetail () {
      materialApi.getById(this.objId, this.isClinic).then(result => {
        if (result) {
          result.isExpiryDate = String(result.isExpiryDate)
          if (result.ext.ifService === 3) {
            result.ext.ifService = 1
            result.ext.ifCharge = 1
          } else {
            result.ext.ifCharge = 0
          }
          if (result.cdssRuleRelation) {
            result.cdssRuleRelationKeyId = result.cdssRuleRelation.id
            result.cdssRuleRelation = Object.assign(result.cdssRuleRelation, { id: result.cdssRuleRelation.constantObjectPropertyCode })
          }
          result.ext['isExpiryDate'] = result.isExpiryDate
          this.markupPercentage = result.markupPercentage
          this.classifyId = result.classifyId
          this.materialBarCodes = result.ext.materialBarCodes || []
          // 最高限价
          this.getBySkuDTOList = result.skuDTOList.map(item => {
            item.ext.ceilingPrice = item.ceilingPrice
            return item
          })
          this.getByIdFormData = JSON.parse(JSON.stringify(result))
          this.state = result.skuDTOList && result.skuDTOList[0] && result.skuDTOList[0].state
          this.serviceInfo = result.skuDTOList[0]
          // 西药物资是否能拆零  需要后端增加一个字段来判断这个物资是否可以拆零
          this.splitDisabled = !result.isSplit
        }
      })
    },
    ...enumConfig.patch
  },
  components: {
    FormClassify,
    FormTemplate,
    dialogSlot,
    materialCalc,
    SkuTable,
    materialTreeTable,
    materialCodeNumber,
  },
  watch: {
    'chinesePrice' (v) {
      let prices = parseFloat(v)
      const float = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (isNaN(prices) || prices < 0) {
        v = ''
      }
      if (!float.test(v)) {
        this.chiserePriceSet(v)
      } else {
        const chinesePrice = v + ''
        if (chinesePrice && ~chinesePrice.indexOf('.')) this.chiserePriceSet(v)
      }
    },
    changeObj: {
      handler (v, oldVal) {
        if ([...enumConfig.WEST_MEDICINE_TYPE, ...enumConfig.CHINESE_MEDICINE_TYPE].includes(this.classifyId)) {
          this.priceShow = true
          if (v['SXX000051'] && v['SXX000051'].length > 10) v['SXX000051'] = v['SXX000051'].substring(0, 10)
          if (v['SXX2009240000165TqS'] && v['SXX2009240000165TqS'].length > 10) v['SXX2009240000165TqS'] = v['SXX2009240000165TqS'].substring(0, 10)
          if (v['SXX000051'] && !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(v['SXX000051'])) {
            v['SXX000051'] = ''
            this.$messageTips(this, 'warning', '请输入文字、数字、字母; 不可特殊字符')
          }
          if (v['SXX2009240000165TqS'] && !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(v['SXX2009240000165TqS'])) {
            v['SXX2009240000165TqS'] = ''
            this.$messageTips(this, 'warning', '请输入文字、数字、字母; 不可特殊字符')
          }
        }
        if (enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
          if (v.ifService === 2 || (v.ifService === 1 && v.ifCharge === 1)) {
            this.priceShow = true
          } else {
            this.priceShow = false
          }
        }
        if (enumConfig.CONSUMABLES_TYPE.includes(this.classifyId) && this.objId && this.onlyRead && v.ext) {
          if (v.ext.ifService === 2 || (v.ext.ifService === 1 && v.ext.ifCharge === 1)) {
            this.priceShow = true
          } else {
            this.priceShow = false
          }
        }
        if (!this.objId) {
          this.priceDisabled = false
        } else {
          if (!this.onlyRead && oldVal) {
            if (this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
              let skuPrice = this.getBySkuDTOList.length ? this.getBySkuDTOList[0].ext.price : null
              let priceEdit = false
              if (skuPrice === null || skuPrice === '' || skuPrice === undefined) priceEdit = true
              if ((v.ifService === 2 && this.getByIdFormData.ext.ifService === 1 && priceEdit) || (v.ifCharge === 1 && this.getByIdFormData.ext.ifCharge === 0 && priceEdit)) {
                this.priceDisabled = false
              } else {
                this.priceDisabled = true
              }
            }
          } else {
            this.priceDisabled = true
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
.materialheader{
  padding-bottom: 10px;
}
.is-required {
  width: 100%;
}
.subHr {
  right: 0px;
  display: inline-block;
  top: 10px;
  position: absolute;
}
.test-data{
  cursor: pointer;
  font-size: 12px;
  color: #1c7bef;
  font-weight: 500;
}
.error /deep/ .el-input__inner{
  border: 1px solid #ff0000;
  background-color: #FFDEDE!important;
}
.is-disabled /deep/ .el-input-group__append{
  border: 1px solid #e4e7ed!important;
}
.carousel-example-img {
  width: 492px;
  border: none;
  background: none;
  padding: 0;
  /deep/ .el-carousel__container {
    height: 315px;
  }
}
.el-table{
  width:99.9%!important;
}
</style>
