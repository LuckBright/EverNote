<template>
  <div id="behospitalized">
    <ever-bread-crumb :name="crumbTitle" :path="crumbUrl"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="steps" v-if="!$route.query.reset">
          <div class="steps-body">
            <span :class="[stepActive == 1 ? 'blue' : '']">1.选择药品</span>
            <span>. . .</span>
            <span :class="[stepActive == 2 ? 'blue' : '']">2.设置信息</span>
          </div>
        </div>
        <div id="selectdrug" v-if="stepActive == 1">
          <div class="selectdrug" v-if="!flag">
            <el-row :gutter="20">
              <el-col :span="6">&nbsp;</el-col>
              <el-col :span="10">
                <el-input
                  placeholder="通用名／商品名／批准文号"
                  size="large"
                  v-model="searchDrugName"
                  @keyup.enter.native="query"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="large" @click="query">查询</el-button>
              </el-col>
              <el-col :span="6">&nbsp;</el-col>
            </el-row>
          </div>
          <div class="selectdrug1" v-if="flag">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-input
                  placeholder="通用名／商品名／批准文号"
                  v-model="searchDrugName"
                  @keyup.enter.native="query"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="query">查询</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="druglist">
            <div class="list-container" v-for="item in tableData" :key="item.id">
              <div class="header" v-if="item.drugType != 3">
                <span class="byname">{{item.byname}}</span>
                <span v-if="item.name" class="goodsName">{{item.name}}</span>
                <span
                  v-if="item.produceCompanyName"
                  class="manufactureName"
                >{{item.produceCompanyName}}</span>
                <span
                  class="unit"
                >{{setName(dosageFormArr, item.dosageForm, true)}}/{{item.packageInfo}}</span>
                <span class="registerNo">{{item.ratifyCode}}</span>
              </div>
              <div class="header" v-else>
                <span class="byname">{{item.byname}}</span>
              </div>
              <div class="body">
                <el-row>
                  <el-col :span="20">
                    <div v-if="item.drugType != 3">
                      <el-radio
                        v-model="radio"
                        @change.native="handleRadioChange(item)"
                        v-for="items in item.drugs"
                        :key="items.id"
                        :label="items.id"
                      >
                        <span>{{`${items.convertRatio}${setName(preparationUnitArray, items.preparationUnit, true)} / ${setName(preparationUnitArray, items.packageUnit, true)}`}}</span>
                      </el-radio>
                    </div>
                    <div v-else>
                      <el-radio
                        v-model="radio"
                        @change.native="handleRadioChange(item)"
                        v-for="items in item.drugs"
                        :key="items.id"
                        :label="items.id"
                      >
                        <span>
                          {{items.name}}&nbsp;&nbsp;{{setName(HERBALTYPE, items.herbalType)}}&nbsp;&nbsp;药效比:{{items.drugRatio}}&nbsp;&nbsp;
                          <span
                            v-if="items.specratio"
                          >{{items.specratio}}/</span>
                          {{setName(unitArray, items.unit)}}&nbsp;&nbsp;{{items.produceCompanyName}}&nbsp;&nbsp;{{items.ratifyCode}}
                        </span>
                      </el-radio>
                    </div>
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="4" v-if="item.drugType != 3">
                    <el-button
                      @click="handlePackageUnit(item)"
                      type="text"
                      style="float: right"
                    >添加包装单位</el-button>
                  </el-col>
                  <el-col :span="4" v-else>
                    <el-button
                      @click="handlePackageUnit2(item)"
                      type="text"
                      style="float: right"
                    >添加包装单位</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-row class="ever-row-01" style="display: none">
              <el-col v-for="item in tableData" :key="item.id">
                <el-card class="box-card">
                  <el-row v-if="item.drugType != 3">
                    <el-col :span="16" class="druginfo">
                      <div class="info">
                        <el-form label-position="right" label-width="100px">
                          <el-form-item label="通用名:">
                            <span>{{item.byname}}</span>
                          </el-form-item>
                          <el-form-item label="商品名:">
                            <span>{{item.name}}</span>
                          </el-form-item>
                          <el-form-item label="说明书规格:">
                            <span>{{item.chineseSpecification}}</span>
                          </el-form-item>
                          <el-form-item label="剂量:">
                            <span>{{item.specQuantity}}</span>
                          </el-form-item>
                          <el-form-item label="剂量单位:">
                            <span>{{item.enSpecUnit}}</span>
                          </el-form-item>
                          <el-form-item label="剂型:">
                            <span>{{item.formulation}}</span>
                          </el-form-item>
                          <el-form-item label="生产厂商:">
                            <span>{{item.produceCompanyName}}</span>
                          </el-form-item>
                          <el-form-item label="批准文号:">
                            <span>{{item.registerNo}}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="info">
                        <div class="position">
                          <div class="overflow">
                            <el-radio
                              v-model="radio"
                              @change.native="handleRadioChange(item)"
                              v-for="items in item.drugs"
                              :key="items.id"
                              :label="items.id"
                            >
                              <el-tooltip
                                class="item"
                                :content="items.convertRatio + items.preparationUnitTxt + '/' + items.packageUnitTxt"
                                placement="top"
                              >
                                <span>{{`${items.convertRatio}${items.preparationUnitTxt} / ${items.packageUnitTxt}`}}</span>
                              </el-tooltip>
                            </el-radio>
                            <el-button @click="handlePackageUnit(item)" type="text">添加包装单位</el-button>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-else>
                    <el-col :span="10" class="druginfo">
                      <div class="info">
                        <el-form label-position="right" label-width="80px">
                          <el-form-item label="通用名:">
                            <span>{{item.byname}}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="14">
                      <div class="info">
                        <div class="position">
                          <div class="overflow">
                            <el-radio
                              v-model="radio"
                              @change.native="handleRadioChange(item)"
                              v-for="items in item.drugs"
                              :key="items.id"
                              :label="items.id"
                            >
                              <el-tooltip
                                class="item"
                                :content="setName(unitArray, items.unit, true) + '/' + setName(HERBALTYPE, items.herbalType)"
                                placement="top"
                              >
                                <span>{{`${setName(unitArray, items.unit, true)} / ${setName(HERBALTYPE, items.herbalType)}`}}</span>
                              </el-tooltip>
                            </el-radio>
                            <el-button @click="handlePackageUnit2(item)" type="text">添加包装单位</el-button>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
            <div v-if="!tableData.length && flag">
              <ever-NoData></ever-NoData>
            </div>
          </div>
          <div class="page" v-if="totalCount != 0">
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pagesize="pagesize"
              :pageSizes="pageSizes"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </div>
          <el-button
            v-if="tableData.length"
            style="margin-top: -30px"
            type="primary"
            @click="next"
          >下一步</el-button>
        </div>
        <div id="setdrug" v-if="stepActive == 2">
          <div class>
            <h4>药品信息</h4>
            <el-row class="infoStyle">
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="分类:">
                    <span>{{setName(drugTypeArr, drugObjInfo.drugType)}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="通用名:">
                    <span>{{drugObjInfo.byname}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="商品名:">
                    <span>{{drugObjInfo.name}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="规格:">
                    <span>
                      <strong
                        class="noStrong"
                        v-if="drugObjInfo.packageInfo"
                      >{{drugObjInfo.packageInfo}}:</strong>
                      <!-- <strong class="noStrong" v-if="drugObjInfo.unit">/{{setName(preparationUnitArray, drugObjInfo.unit, true)}}</strong> -->
                      <strong
                        class="noStrong"
                        v-if="drugObjInfo.convertRatio"
                      >{{drugObjInfo.convertRatio}}</strong>
                      <strong
                        class="noStrong"
                        v-if="drugObjInfo.preparationUnit"
                      >{{setName(preparationUnitArray, drugObjInfo.preparationUnit, true)}}</strong>
                      <strong
                        class="noStrong"
                        v-if="drugObjInfo.packageUnit"
                      >/{{setName(preparationUnitArray, drugObjInfo.packageUnit, true)}}</strong>
                    </span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8" v-if="drugObjInfo.dosageForm">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="剂型:">
                    <span>{{setName(dosageFormArr, drugObjInfo.dosageForm, true)}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="生产厂商:">
                    <span>{{drugObjInfo.manufacturerObject ? drugObjInfo.manufacturerObject.name : ''}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="批准文号:">
                    <span>{{drugObjInfo.ratifyCode}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="特殊药品:">
                    <span>{{drugObjInfo.specialClassifyName}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="120px">
                  <el-form-item label="条码:">
                    <span>{{drugObjInfo.barCode}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <div class>
            <h4>
              <el-button
                style="float:right"
                size="small"
                type="primary"
                @click.native.prevent="handleAddSupplier()"
              >添加供应商</el-button>供应商信息
            </h4>
            <el-table style="width: 100%" :data="supplierTableData" border>
              <el-table-column show-overflow-tooltip prop="name" label="供应商名称"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="supplierName"
                align="center"
                label="供应商简称"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="unifiedCode"
                align="center"
                label="社会统一信用代码"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop align="right" width="200" label="采购价格">
                <template slot-scope="scope">
                  <span
                    style="margin-right: 0"
                    v-if="scope.row.supplierId && scope.row.id"
                  >{{scope.row.price | formatToFinacial(4)}}</span>
                  <el-input v-model="scope.row.price" placeholder="请输入" style="width:100px" v-else></el-input>
                  <span v-if="scope.row.price" style="padding-left: 5px; color: #999">元</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop align="right" width="200" label="批发价格">
                <template slot-scope="scope">
                  <span
                    style="margin-right: 0"
                    v-if="scope.row.supplierId && scope.row.id"
                  >{{scope.row.tradePrcie >= 0 ? (scope.row.tradePrcie | formatToFinacial) : '-'}}</span>
                  <el-input
                    v-model="scope.row.tradePrcie"
                    placeholder="请输入"
                    style="width:100px"
                    v-else
                  ></el-input>
                  <span v-if="scope.row.tradePrcie" style="padding-left: 5px; color: #999">元</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop width="100" label>
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.price && !scope.row.id"
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class>
            <h4>单位信息</h4>
            <el-table style="width: 100%" border :data="unitTableData" :stripe="false">
              <el-table-column show-overflow-tooltip prop="unitTypeName" label="单位类型"></el-table-column>
              <el-table-column show-overflow-tooltip prop label="选择单位">
                <template slot-scope="scope">
                  <ever-select v-model="scope.row.unitId" :options="unitArr" size="small"></ever-select>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop label="生效日期">
                <template slot-scope="scope">
                  <date-picker size="small" v-model="scope.row.enableDate"></date-picker>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop label="失效日期">
                <template slot-scope="scope">
                  <date-picker size="small" v-model="scope.row.disableDate"></date-picker>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="center">
            <el-button v-if="!$route.query.reset" style="margin-top: 20px" @click="prev">上一步</el-button>
            <el-button
              v-if="!$route.query.reset"
              style="margin-top: 20px"
              type="primary"
              @click="handleSubmit"
            >提交</el-button>
            <el-button
              v-if="$route.query.reset"
              style="margin-top: 20px"
              type="primary"
              @click="handleSubmit"
            >保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <package-unit-dialog ref="packageunit" @close:query="updateQuery"></package-unit-dialog>
    <package-unit-dialog2 ref="packageunit2" @close:query="updateQuery"></package-unit-dialog2>
    <supplier-dialog ref="supplierdialog" @selectedSupplier="handleSupplier"></supplier-dialog>
  </div>
</template>
<script>
import beHospitalizedApi from '@/warehouse/store/behospitalizedapi'
import drugApi from '@/warehouse/store/drugapi'
import localDrugSettingApi from '@/warehouse/store/localdrugsettingapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { HERBALTYPE, DRUGTYPE, delObjIsNull } from '@/util/common'
import setname from '@/util/setstatusname'
import packageUnitDialog from './packageunit'
import packageUnitDialog2 from './packageunit2'
import supplierDialog from './supplierdialog'
let crumbTitle = '药品申请'
let crumbUrl = '/warehouse/behospitalizedadd'
export default {
  mixins: [setname],
  data () {
    if (this.$route.path === '/warehouse/behospitalized/' + this.$route.params.id) {
      crumbTitle = '药品设置'
      crumbUrl = '/warehouse/drugs'
    } else {
      crumbTitle = '药品申请'
      crumbUrl = '/warehouse/behospitalizedadd'
    }
    return {
      HERBALTYPE,
      DRUGTYPE,
      submitObj: {},
      selectCurrentData: {},
      crumbUrl,
      crumbTitle,
      radio: '',
      stepActive: 1,
      searchDrugName: '',
      drugObj: '',
      flag: false,
      drugObjInfo: '',
      tableData: [],
      supplierTableData: [],
      unitTableData: [],
      unitTypeNameArr: ['小包装单位', '销售单位'],
      unitTypeArr: [204, 293],
      unitArr: [],
      offset: 0,
      pagesize: 5,
      totalCount: 0,
      loading: true,
      pageSizes: [5, 10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: Number(this.$route.query.page) || 1,
      unitArray: [],
      preparationUnitArray: [],
      dosageFormArr: [],
      drugTypeArr: []
    }
  },
  created () {
    if (this.$route.query.reset === '1' && this.$route.query.localMaterialId !== '0') {
      this.getLocalSetting(this.$route.query.localMaterialId)
      this.stepActive = 2
    } else if (this.$route.query.localMaterialId === '0') {
      this.getDrugInfo(this.$route.query.id)
      this.stepActive = 2
    }
    sysvalue.listOnce('THC_WH_ZYCDW').then(res => {
      if (res) {
        this.unitArray = res
      }
    })
    sysvalue.listOnce('THC_WH_DOSE_UNIT').then(res => {
      if (res) {
        this.preparationUnitArray = res
      }
    })
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      if (res) {
        this.drugTypeArr = res
      }
    })
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    query () {
      this.handleCurrentChange(1)
    },
    list (refresh) {
      if (refresh) {
        this.offset = 0
      }
      this.flag = true
      var params = {}
      params.keyword = this.searchDrugName
      params.needSku = true
      params.offset = this.offset
      params.pagesize = this.pagesize
      beHospitalizedApi.list(params).then(res => {
        if (res.head.errCode === 0) {
          this.tableData = res.data.resultList
          this.totalCount = res.data.totalCount
        } else {
          this.tableData = []
        }
      })
    },
    next () {
      // this.radio = 50000
      if (this.selectCurrentData.id) {
        this.selectCurrentData.letterPy = this.selectCurrentData.initialTrade
        this.getInfoGlobalDrug(this.selectCurrentData)
      } else {
        this.$messageTips(this, 'warning', '请选择一个药品的包装单位')
      }
    },
    getLocalSetting (id) {
      localDrugSettingApi.getById(id).then(res => {
        this.setUnitList()
        this.drugObjInfo = res.drugObject
        this.drugObjInfo.manufacturerObject = res.manufacturerObject
        this.supplierTableData = res.supplierLocalProductVos ? res.supplierLocalProductVos : []
        this.unitArr = res.unitGroupItemList
        this._resetUnitValue(res)
      })
    },
    getDrugInfo (id) {
      drugApi.getById(id).then(res => {
        this.setUnitList()
        this.drugObjInfo = res
        this.unitArr = res.unitGroupItemList
      })
    },
    setUnitList () {
      let unitItemList = []
      for (let i = 0; i < this.unitTypeArr.length; i++) {
        unitItemList.push({
          unitId: '',
          unitType: this.unitTypeArr[i],
          unitTypeName: this.unitTypeNameArr[i],
          disableDate: '',
          enableDate: ''
        })
      }
      this.unitTableData = unitItemList
    },
    getInfoGlobalDrug (id) {
      drugApi.getInfoFromGlobalDrug(id).then(res => {
        if (res.id) {
          this.drugObjInfo = res
          this.setUnitList()
          this.unitArr = res.unitGroupItemList
          this.stepActive = 2
          this.supplierTableData = []
          // if (this.$route.query.objId) {
          //   this.$router.push(this.$route.path + '?step=2&objId=' + this.radio)
          // }
        }
      })
    },
    prev () {
      this.stepActive = 1
    },
    handleDelete (index, data) {
      this.supplierTableData.splice(index, 1)
    },
    handleSupplier (data) {
      this.supplierTableData.push(data)
    },
    handleAddSupplier () {
      this.$refs.supplierdialog.open(this.supplierTableData)
    },
    handleSubmit () {
      for (let i = 0; i < this.unitTableData.length; i++) {
        if (!this.unitTableData[i].unitId) {
          this.$messageTips(this, 'warning', '请先选择单位信息')
          return
        }
      }
      this.submitObj.materialType = DRUGTYPE
      this.submitObj.globalMaterialId = this.drugObjInfo.id
      this.submitObj.item = this.unitTableData
      let supplierArr = []
      if (this.supplierTableData && this.supplierTableData.length) {
        for (let i = 0; i < this.supplierTableData.length; i++) {
          // || !this.supplierTableData[i].tradePrcie
          if (!this.supplierTableData[i].price) {
            this.$messageTips(this, 'warning', '请填写供应商采购价格或者采购价格')
            return
          }
          supplierArr.push({
            id: this.supplierTableData[i].id ? this.supplierTableData[i].id : '',
            supplierLocalId: this.supplierTableData[i].supplierLocalId ? this.supplierTableData[i].supplierLocalId : '',
            supplierId: this.supplierTableData[i].supplierId,
            price: this.supplierTableData[i].price,
            tradePrcie: this.supplierTableData[i].tradePrcie
          })
        }
      }
      this.submitObj.supplierLocalProductVos = supplierArr
      if (this.$route.query.reset === '1' && this.$route.query.localMaterialId !== '0') {
        this.submitObj.id = this.$route.query.localMaterialId
      }
      // 药品管理方式 默认为数量管理 1
      this.submitObj.isNum = 1
      localDrugSettingApi.createOrUpdate(this.submitObj).then(res => {
        this.$router.push('/warehouse/drugs')
      })
    },
    handlePackageUnit (id) {
      this.$refs.packageunit.open(id)
    },
    handlePackageUnit2 (id) {
      this.$refs.packageunit2.open(id)
    },
    handleRadioChange (data) {
      let tempData = JSON.parse(JSON.stringify(data))
      delete tempData.drugs
      data.drugs.forEach(item => {
        if (item.id === this.radio) {
          this.selectCurrentData = delObjIsNull(Object.assign(tempData, item))
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize
      this.list()
      return this.pageAfter && this.pageAfter(this.pagesize)
    },
    updateQuery (data, curdata) {
      this.list()
      this.radio = data.data.id
      this.selectCurrentData = Object.assign({}, curdata, data.data)
    },
    _resetUnitValue (res) {
      this.unitTableData.forEach((item, i) => {
        if (item.unitType === this.unitTypeArr[0] || item.unitType === this.unitTypeArr[1]) {
          res.item.forEach(items => {
            if (item.unitType === items.unitType) {
              item.unitId = items.unitId
              item.disableDate = items.disableDate
              item.enableDate = items.enableDate
            }
          })
        }
      })
    }
  },
  components: {
    packageUnitDialog,
    packageUnitDialog2,
    supplierDialog
  },
  watch: {
    '$route' (val) {
      if (val.path === '/warehouse/behospitalizedadd') {
        this.stepActive = 1
        this.crumbTitle = '药品申请'
        this.crumbUrl = '/warehouse/behospitalizedadd'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.selectdrug {
  width: 80%;
  margin: 200px auto;
  min-height: 500px;
}
#behospitalized /deep/ .el-steps {
  width: 50%;
  margin: 20px auto;
}
#selectdrug {
  padding: 20px;
}
.ever-row-01 .el-col {
  max-width: 33.333%;
  flex: 0 0 33.333%;
}
.ever-row-01 .el-col /deep/ .el-col {
  margin-bottom: 0;
}
.druglist {
  margin-top: 20px;
}
.list-container {
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}
.header {
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #000;
}
span {
  margin-right: 20px;
}
span:last-child {
  margin-right: 0;
}
span.byname {
  font-size: 18px;
  font-weight: bold;
}
span.unit {
  color: #999;
}
span.registerNo {
  float: right;
  color: #999;
}
.body {
  padding: 10px 20px;
  background-color: #fcfcfc;
}
.col-bg {
  background-color: #f9fafc;
  border: 1px solid #eee;
  height: 322px;
}
.druginfo {
  height: 340px;
  display: block;
  border-right: 1px solid #eee;
  margin-bottom: 0;
}
.info {
  padding: 10px 0;
}
.el-form-item {
  margin-bottom: 0;
}
.position {
  position: relative;
  top: -10px;
}
.overflow {
  height: 310px;
  overflow-x: hidden;
  padding-top: 10px;
  position: relative;
  right: -10px;
}
.el-radio + .el-radio,
.el-radio {
  margin-left: 0;
  margin-right: 20px;
  line-height: 2;
}
.info /deep/ .el-form-item__content {
  padding-top: 8px;
  line-height: 1.5;
}
.ever-row-01 .el-col /deep/ .el-col {
  flex: 0 0 100%;
  max-width: 100%;
}
.center {
  display: block;
  text-align: center;
}
.noStrong {
  font-weight: normal;
}
.steps {
  color: #999;
  font-size: 14px;
  position: relative;
}
.steps-body {
  position: absolute;
  right: 0;
}
.steps-body span.blue {
  color: #1c7bef;
}
.steps-body span:nth-child(2) {
  display: inline-block;
  padding: 0 15px;
  vertical-align: top;
  margin-top: -3px;
  font-weight: bold;
}
</style>
