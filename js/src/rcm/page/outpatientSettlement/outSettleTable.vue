<!--
 * @Author: renpengfei
 * @Date: 2019-08-08 14:50:52
 * @LastEditors: yunshan.wang
 * @LastEditTime: 2020-10-20 11:13:52
 -->
<template>
  <div>
    <ever-table
      ref="everTable"
      :key="time"
      :time="time"
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      :is-record-url-params="false"
      :class="[{ allSettleTable: isAllDetail }, 'settleTable']"
      :table-class="'no-hover'"
      :defaultExpandAll="true"
      :maxHeight="!isAllDetail ? bodyHeight : 10000"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectAll"
      :showCheckbox="!isAllDetail"
      :checkboxFixed="'left'"
      table-default-cell-value
      :selectable="selectable"
      :notSelectCheckbox="true"
    >
      <template slot="itemname">
        <el-table-column prop="itemname" label="名称" width="500">
          <template slot-scope="scope">
            <span class="weight">
              {{
              `医生：${scope.row.doctorName} &nbsp;&nbsp;&nbsp;${scope.row.recipeName}单号：${scope.row.recipeCode}&nbsp;&nbsp;&nbsp; `
              }}
              <span
                class="bfont"
              >小计：{{ scope.row.myFeeAfterBenefit | formatToFinacial }}</span>
            </span>
          </template>
        </el-table-column>
      </template>
      <template slot="insuritemcode">
        <!-- 这里的v-show不能换成v-if，否则动态渲染造成右边展开箭头重复，下面那个insuritemcode也一样 -->
        <el-table-column prop="insuritemcode" label="医保项目编码" width="170"></el-table-column>
      </template>
      <template slot="quantity">
        <el-table-column prop="itemname" label="数量/单位" width="100" align="right"></el-table-column>
      </template>
      <template slot="adviceStatus">
        <el-table-column prop="adviceStatus" label="执行状态" width="100"></el-table-column>
      </template>
      <template slot="mealFlag">
        <el-table-column prop="mealFlag" label="套餐及保障计划" width="150"></el-table-column>
      </template>
      <!-- <template slot="useInsurance">
        <el-table-column prop="useInsurance" label="商保" width="80"></el-table-column>
      </template>-->
      <!-- <template slot="useInsuranceDiscount">
        <el-table-column prop="useInsuranceDiscount" label="商保报销比例" width="180"></el-table-column>
      </template>-->
      <template slot="majorAccount">
        <el-table-column prop="majorAccount" label="大客户" width="80"></el-table-column>
      </template>
      <template slot="majorAccountDiscount">
        <el-table-column prop="majorAccountDiscount" label="大客户报销比例" width="180"></el-table-column>
      </template>
      <template slot="discount">
        <el-table-column prop="discount" label="打折%"></el-table-column>
      </template>
      <template slot="comInsuranceRemarks">
        <el-table-column prop="comInsuranceRemarks" label="备注"></el-table-column>
      </template>
      <template slot="data">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ever-table
              :key="time"
              :class="{ setwidth: setwidth }"
              refs="everTableChild"
              :columns="columns"
              :data="scope.row.recipeDetails"
              :showHeader="false"
              class="listTable"
              :row-class-name="tableRowClassName"
              :showCheckbox="!isAllDetail"
              :checkboxFixed="'left'"
              table-default-cell-value
              :notSelectCheckbox="true"
            >
              <template slot="itemname">
                <el-table-column prop="itemname" label="名称" width="500">
                  <template slot-scope="scope">
                    <div
                      class="deleteIcon"
                      v-if="
                        scope.row.orderid.indexOf('norder') > -1 &&
                          !obj.id &&
                          !isAllDetail&&($route.meta && $route.meta.status==0)
                      "
                      @click="deleteMakeupItem(scope.row)"
                    >
                      删除
                      <i class="el-icon-delete"></i>
                    </div>
                    <span
                      :class="{mg:scope.row.orderid.indexOf('norder') > -1 &&
                          !obj.id &&
                          !isAllDetail&&($route.meta && $route.meta.status==0)}"
                    >{{ scope.row.itemname }}</span>
                    <!-- freeSheet -->
                    <i class="color iconmenzhenshoufei-miandan cor" v-if="scope.row.freeSheet == 1"></i>
                    <!-- hasMealOrder支付完成变成false,引用套餐shopSetItemId支付完成还会有 -->
                    <!-- 未支付套餐在自费结算状态后只要套餐勾选上都显示蓝色，未支付套餐只有自费结算状态下并且勾中才显示红色 -->
                    <!-- 引用未付 mealPaidFlag0-不是套餐，1-已支付套餐，2-未支付套餐-->
                    <i
                      class="icon iconfont icon-taocan packageIconInrow"
                      style="fontSize:18px"
                      :class="{
                        packactive:
                          scope.row.mealFlag &&
                          scope.row.mealPaidFlag == 1 &&
                          scope.row.useMealDisabled &&
                          multiConfig.includes(obj.settleStatus),
                        unpackactive:
                          scope.row.mealFlag &&
                          scope.row.mealPaidFlag == 2 &&
                          scope.row.useMealDisabled &&
                          !obj.settleStatus
                      }"
                      title="套餐"
                      v-if="scope.row.mealPaidFlag || scope.row.mealFlag"
                    ></i>
                  </template>
                </el-table-column>
              </template>
              <template>
                <el-table-column slot="insuritemcode" prop="insuritemcode" label="医保项目编码" width="170">
                  <template slot-scope="scope">
                    <el-input
                      clearable
                      v-if="obj.settleStatus == 1&&!obj.recollect"
                      v-model="scope.row.insuritemcode"
                    ></el-input>
                    <template v-else>{{scope.row.insuritemcode}}</template>
                  </template>
                </el-table-column>
              </template>
              <template slot="quantity">
                <el-table-column prop="itemname" label="数量/单位" width="100" align="right">
                  <template slot-scope="scope">{{ `${scope.row.quantity} ${scope.row.unit || ""}` }}</template>
                </el-table-column>
              </template>
              <template slot="adviceStatus">
                <el-table-column prop="adviceStatus" label="执行状态" width="100">
                  <template slot-scope="scope">{{ getstatus(scope.row.adviceStatus) }}</template>
                </el-table-column>
              </template>
              <!-- 套餐 -->
              <template slot="mealFlag">
                <el-table-column prop="mealFlag" label="套餐及保障计划" width="100">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.mealFlag"
                      @change="mealChange($event, scope.row)"
                      :disabled="
                        !(scope.row.useMealDisabled && obj.settleStatus == 0&&!obj.recollect&&scope.row.hasMealOrder)
                      "
                      v-if="checkIfShow(scope.row)"
                    ></el-checkbox>
                    <el-tooltip
                      class="item"
                      effect="light"
                      placement="bottom-end"
                      :open-delay="500"
                      v-if="!scope.row.hasMealOrder&&scope.row.mealPaidFlag&&!obj.returnFlag"
                    >
                      <i
                        style="color: #BBBBBB;font-size:14px;"
                        class="iconfont icon-gantanhao font16"
                      ></i>
                      <span slot="content">套餐项目数量少于账单项目数量，请拆分账单或使用其他方式进行结算</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
              <!-- 商保 -->
              <!-- <template slot="useInsurance">
                <el-table-column prop="useInsurance" label="商保" width="80">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.useInsurance"
                      @change="insuranceChange"
                      :disabled="
                        !(
                          scope.row.useInsuranceDisabled &&
                          obj.settleStatus == 2 &&
                          !obj.recollect
                        )
                      "
                      v-if="(!scope.row.useMedInsurance)&&((scope.row.freeSheet != 1&&obj.settleStatus==2) || (scope.row.freeSheet != 1&&scope.row.useInsurance))"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </template>-->
              <!-- 商保报销比例 -->
              <!-- <template slot="useInsuranceDiscount">
                <el-table-column prop="useInsuranceDiscount" label="商保报销比例" width="180">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.useInsuranceDiscount"
                      @input="val => useInsuranceDiscountChange(val, scope.row)"
                      :disabled="
                        !(
                          scope.row.useInsuranceDiscountDisabled &&
                          obj.settleStatus == 2
                        )
                      "
                      v-if="(!scope.row.useMedInsurance)&&(scope.row.freeSheet != 1)"
                      type="number"
                      @mousewheel.native="mousewheelevent"
                    ></el-input>
                  </template>
                </el-table-column>
              </template>-->
              <!-- 大客户-->
              <template slot="majorAccount">
                <el-table-column prop="majorAccount" label="大客户" width="80">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.majorAccount"
                      :disabled="
                        !(
                          scope.row.majorAccountDisabled &&
                          obj.settleStatus == 7 &&
                          !obj.recollect
                        )
                      "
                      @change="majorChange"
                      v-if="scope.row.isInBigCustomer || scope.row.majorAccount"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </template>
              <!-- 大客户报销比例 -->
              <template slot="majorAccountDiscount">
                <el-table-column prop="majorAccountDiscount" label="大客户报销比例" width="180">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.majorAccountDiscount"
                      :disabled="
                        !(
                          scope.row.majorAccountDiscountDisabled &&
                          obj.settleStatus == 7
                        )
                      "
                      @input="val => majorDiscountChange(val, scope.row)"
                      v-if="scope.row.isInBigCustomer"
                      type="number"
                      @mousewheel.native="mousewheelevent"
                    ></el-input>
                  </template>
                </el-table-column>
              </template>
              <!-- 自费折扣 -->
              <template slot="discount">
                <el-table-column prop="discount" label="打折%">
                  <template slot-scope="$scope">
                    <el-input
                      v-model="$scope.row.discount"
                      @input="val => discountChange(val, scope.$index, $scope.$index)"
                      :disabled="selfDiscountDis($scope.row)"
                      type="number"
                      @mousewheel.native="mousewheelevent"
                    ></el-input>
                  </template>
                </el-table-column>
              </template>
              <template slot="comInsuranceRemarks">
                <el-table-column prop="comInsuranceRemarks" label="备注">
                  <template slot-scope="scope">
                    <template v-if="obj.settleStatus == 0">
                      <el-input
                        v-model="scope.row.comInsuranceRemarks"
                        :disabled="
                          !(scope.row.discountDisabled && obj.settleStatus == 0)
                        "
                        @mousewheel.native="mousewheelevent"
                      ></el-input>
                    </template>
                    <template v-else>
                      {{
                      scope.row.comInsuranceRemarks
                      }}
                    </template>
                  </template>
                </el-table-column>
              </template>
              <template slot="data">
                <el-table-column type="expand"></el-table-column>
              </template>
            </ever-table>
          </template>
        </el-table-column>
      </template>
    </ever-table>
  </div>
</template>
<script>
import insurancePrice from './computeinsunance.js'
import { deleteByAccountBillId } from '@/rcm/store/outpatient/outpatient'
import {
  computedInsurance,
  getstatus,
  mousewheelevent,
  multiConfig,
  limitInputValue
} from './settleconfig.js'
import { floatTool } from '@/util/common'
export default {
  mixins: [insurancePrice],
  props: {
    obj: {
      type: Object,
      default () {
        return {}
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    multipleSelection: {
      type: Array,
      default () {
        return []
      }
    },
    isAllDetail: {
      // 批量展示所有账单
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    time: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data: function () {
    return {
      setwidth: false,
      getstatus: getstatus,
      mousewheelevent: mousewheelevent,
      multiConfig: multiConfig,
      browserHeight: document.body.clientWidth,
      computeBenefitTimers: null,
      discountInfo: null
    }
  },
  computed: {
    tableMultipleSelection: {
      get () {
        return this.multipleSelection
      },
      set (v) {
        this.$emit('update:multipleSelection', v)
      }
    },
    bodyHeight: function () {
      return floatTool.multiply(
        floatTool.divide(floatTool.subtract(this.browserHeight, 300), 10),
        2
      )
    }
  },
  watch: {
    time: {
      handler: function (val, oldval) {
        // elementui会动态计算table宽度导致拉伸后宽度不正确nextTick暂不能解决
        setTimeout(v => {
          var aa = document.getElementsByClassName('el-table__body')
          Array.from(aa).map(v => {
            v.style.width = '100%'
          })
        }, 800)
      },
      immediate: true
    }
  },
  methods: {
    eventChange () { },
    // 补费删除
    async deleteMakeupItem (row) {
      try {
        let params = {
          accountIds: []
        }
        params.accountIds.push(row.accountbilldetailid)
        let data = await deleteByAccountBillId(params)
        if (data.data) {
          this.$notify({
            message: '删除成功',
            type: 'success'
          })
          this.$emit('getSettleStatus')
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 为了处理待退费
    handleSelect (selection, row) {
      // CPOE来的同一个源单来的退费账单同生共死
      if (this.obj.settleStatus === 5 && !this.obj.writeOff) {
        setTimeout(() => {
          if (!row.selected) {
            row.selected = true
            this.tableData.filter(rowData => rowData.sourceSettlementId === row.sourceSettlementId).map(item => {
              item.selected = true
              this.$refs.everTable.$refs.everTable.toggleRowSelection(item, true)
            })
          } else {
            row.selected = false
            this.tableData.filter(rowData => rowData.sourceSettlementId === row.sourceSettlementId).map(item => {
              item.selected = false
              this.$refs.everTable.$refs.everTable.toggleRowSelection(item, false)
            })
          }
        })
      }
    },
    // 勾选事件
    handleSelectionChange (v) {
      this.tableMultipleSelection = v
      let receiptArr = v.reduce((total, cur) => {
        total.push(cur.recipeId)
        return total
      }, [])
      this.obj.mergedReceiptData.map(x => {
        if (receiptArr.includes(x.recipeId)) {
          x.recipeDetails.map(n => {
            // 商保
            this.$set(n, 'useInsuranceDisabled', true)
            this.$set(n, 'useInsuranceDiscountDisabled', true)
            // 大客户
            this.$set(n, 'majorAccountDisabled', true)
            this.$set(n, 'majorAccountDiscountDisabled', true)
            // 套餐
            this.$set(n, 'useMealDisabled', true)
            // 自费折扣
            this.$set(n, 'discountDisabled', !this.obj.parameters.discount_modify)
          })
        } else {
          x.recipeDetails.map(n => {
            // 商保
            this.$set(n, 'useInsuranceDisabled', false)
            this.$set(n, 'useInsuranceDiscountDisabled', false)
            // 大客户
            this.$set(n, 'majorAccountDisabled', false)
            this.$set(n, 'majorAccountDiscountDisabled', false)
            // 套餐
            this.$set(n, 'useMealDisabled', false)
            // 自费折扣
            this.$set(n, 'discountDisabled', !!this.obj.parameters.discount_modify)
          })
        }
      })
      if (this.obj.settleStatus === 1) {
        // 医保
        computedInsurance(this.obj.multipleSelection, this.obj)
      } else if (this.obj.settleStatus === 2) {
        // 商保
        computedInsurance(this.obj.multipleSelection, this.obj)
      } else if (this.obj.settleStatus === 7) {
        // 大客户
        computedInsurance(this.obj.multipleSelection, this.obj)
      } else if (this.obj.settleStatus === 0) {
        // 自费,不在这里调计算优惠的接口了，挪到推荐最优组合之后了
        this.computeBenefitTimeout()
      } else if (this.obj.settleStatus === 5 && !this.obj.writeOff) {
        // 账单退费
        this.computeRefundFee()
      }
    },
    handleSelectAll (selection) {
      if (selection.length === 0) {
        this.tableData.forEach(row => (row.selected = false))
      } else {
        this.tableData.forEach(row => (row.selected = true))
      }
    },
    // 全部勾选
    computeBenefitTimeout () {
      window.clearTimeout(this.computeBenefitTimers)
      this.computeBenefitTimers = null
      this.computeBenefitTimers = window.setTimeout(_ => {
        this.computeBenefit()
      }, 300)
    },
    // 商保背景标示
    tableRowClassName ({ row, rowIndex }) {
      return 'noOrder'
    },
    codeFormatter (r, c, v) {
      // element 原生的formatter方法与everTable定义的formatter方法的参数顺序不一致，需要注意！
      return v + 'formatter'
    },
    // 商保勾选
    async insuranceChange (val) {
      if (this.obj.settleStatus === 2) {
        await this.getInsurPrice()
        computedInsurance(this.obj.multipleSelection, this.obj)
      }
    },
    // 商保比例
    useInsuranceDiscountChange (val, row) {
      if (this.obj.settleStatus === 2) {
        row.useInsuranceDiscount = limitInputValue(val, this)
        computedInsurance(this.obj.multipleSelection, this.obj)
      }
    },
    // 禁用勾选
    selectable (row, index) {
      if (this.$route.query.settlementid) {
        return false
      } else {
        // 账单情况下，是否允许修改受参数控制，1允许修改，2不允许修改
        return this.obj.parameters.recipe_checked !== '2' && (!row.bufei || this.obj.settleStatus !== 1)
      }
    },
    // 大客户勾选
    majorChange (val) {
      if (this.obj.settleStatus === 7) {
        computedInsurance(this.obj.multipleSelection, this.obj)
      }
    },
    // 大客户比例
    majorDiscountChange (val, row) {
      if (this.obj.settleStatus === 7) {
        row.majorAccountDiscount = limitInputValue(val, this)
        computedInsurance(this.obj.multipleSelection, this.obj)
      }
    },
    // 套餐的勾选
    mealChange (val, row) {
      // 套餐勾选，禁用医保，商保，大客户，自费折扣
      if (val) {
        if (row.mealPaidFlag === 1 || row.mealPaidFlag === 2) {
          // 没有引用关系且已付款的套餐，才反算折扣
          row.discountDisabled = false // 用了套餐，折扣只能禁掉
          row.feeAfterBenefit = floatTool.multiply(
            row.mealItemPrice,
            row.quantity
          ) // 折后价格换算成套餐价
          if (row.preFee === 0) {
            row.discount = 0
          } else {
            row.discount =
              Number(floatTool.divide(row.feeAfterBenefit, row.preFee) * 100).toFixed(2) // 反算折扣
          }
        }
      } else {
        // 没用套餐，恢复成配置状态
        row.discountDisabled = !this.obj.parameters.discount_modify
      }
      this.computeBenefit()
    },
    discountFn () { // 执行该方法时当前table是重新从接口拿到的数据，需要根据两个index进行定位row
      let row = this.obj.mergedReceiptData[this.discountInfo.parentIndex]['recipeDetails'][this.discountInfo.index]
      row.discount = limitInputValue(this.discountInfo.val, this)
      row.feeAfterBenefit = floatTool.multiply(row.preFee, row.discount / 100)
      this.computeBenefit()
    },
    // 自费的勾选
    discountChange (val, parentIndex, index) { // 人工输入折扣和营销活动不能共存，如果手输折扣时，先清空营销优惠计算的数据。再将本次手输的折扣覆盖上去，获取最新的折扣金额
      this.discountInfo = {
        val: val,
        parentIndex: parentIndex,
        index: index
      }
      let benefit = this.obj.benefitInfo
      // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
      if (benefit.promotionId || benefit.memberCardId || benefit.benefitCardId || benefit.giftcardIds.length > 0) { // 当前使用了营销优惠的话才先清空数据
        this.$parent.emptyStep()
        this.computeBenefit(this.discountFn)
      } else {
        this.discountFn()
      }
    },
    // 检查套餐勾选按钮是否可见,套餐与商保，大客户，免单都冲突，只有它们都不为真时才可显示
    checkIfShow (row) {
      if (
        (!row.useInsurance &&
          !row.majorAccount &&
          !row.freeSheet &&
          row.mealPaidFlag) ||
        row.mealFlag
      ) {
        return true
      }
      return false
    },
    selfDiscountDis (row) {
      if (
        this.obj.settleStatus === 0 &&
        this.obj.parameters.discount_modify === '1' &&
        !row.discountDisabled &&
        !row.useMedInsurance &&
        !row.useInsurance &&
        !row.majorAccount &&
        !row.mealFlag &&
        !this.obj.recollect
      ) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.setwidth /deep/ .el-table__body {
  width: 100% !important;
}
.listTable /deep/ .el-table {
  margin: 0;
  border: none;
}
.settleTable /deep/ .el-table {
  margin-top: 0;
  /* border: none; */
}
.settleTable .listTable /deep/ .el-table td:not(:first-child) {
  border-bottom: 1px solid #ccc;
}
.settleTable /deep/ .el-table td {
  border-bottom: none;
  overflow: hidden;
}
.settleTable /deep/ .el-table td:first-child {
  border-right: 1px solid #ccc;
}
.settleTable /deep/ .el-table th:first-child {
  border-right: 1px solid #ccc;
}
.settleTable /deep/ .el-table td.el-table__expanded-cell {
  border: none;
}
.listTable /deep/ .el-table-column--selection .cell .el-checkbox {
  visibility: hidden;
}
.listTable /deep/ .el-table__expand-column .cell .el-table__expand-icon {
  visibility: hidden;
}
.settleTable /deep/ .el-table__expanded-cell {
  padding: 0;
}
.cor {
  color: #f27700;
}
.settleTable
  /deep/
  .el-table
  tr.el-table__row.noOrder:hover
  td:not(:first-child) {
  background-color: #deeeff;
}
.settleTable /deep/ .el-table tr.el-table__row.noOrder td .deleteIcon {
  position: absolute;
  transition: all linear 0.3s;
  color: #409eff;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 0 4px 4px 0;
  line-height: 20px;
  height: 27px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 2px;
  left: -30px;
  bottom: 8px;
}
.settleTable /deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.settleTable /deep/ .el-table tr.el-table__row.noOrder:hover td .deleteIcon {
  transform: translateX(30px);
  -webkit-transform: translateX(30px);
  -moz-transform: translateX(30px);
  -ms-transform: translateX(30px);
  -o-transform: translateX(30px);
}
.settleTable /deep/ .packageIconInrow {
  vertical-align: -0.04em;
  color: #999;
  cursor: auto;
}
.settleTable /deep/ .packactive {
  color: #1c7bef;
}
.settleTable /deep/ .unpackactive {
  color: #ee4433;
}
/* 批量展示所有账单时的样式 */
.allSettleTable /deep/ .el-table td:first-child {
  border-right: none !important;
}
.allSettleTable /deep/ .el-table {
  margin-bottom: 0 !important;
  border-right: none !important;
}
.el-table .cell .weight {
  font-weight: 500;
}
.mg {
  margin-left: 15px;
}
</style>
