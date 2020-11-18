<template>
<div>
  <el-dialog
  title="选择会员卡优惠券"
  :visible.sync="dialogShow"
  class="ui_dialog_02"
  >
  <div style="margin-bottom:30px">
    <label class="el-form-item__label" style="margin-top:">优惠券</label>
    <gift-comp :patientid="obj.patientid"
      v-model="obj.details.settlementCouponDet"
      :items="items"
      :init="preobj.details.settlementCouponDet">
    </gift-comp>
  </div>
  <div style="margin-bottom:30px">
    <label class="el-form-item__label">会员卡</label>
    <membercard
      :patientid="obj.patientid"
      v-model="obj.details.settlementMemberDet"
      :init="preobj.details.settlementMemberDet"
      >
    </membercard>
  </div>
    <div slot="footer" class="footer">
      <el-button @click="dialogShow=false;$emit('save')"><i class="iconfont icon-tijiao"></i>确定</el-button>
    </div>
  </el-dialog>
  <el-table
    :data="[obj]"
    style="width: 100%"
    >

    <el-table-column
      label="结算方案">
      <template slot-scope="scope">
        <el-radio class="radio" v-model="settleSuite" label="1">
          默认方案
        </el-radio>
      </template>
    </el-table-column>
    <el-table-column
      prop="totalFee"
      label="总金额">
    </el-table-column>
    <el-table-column
      prop="medInsurOwnPayFee"
      label="医保金额">
    </el-table-column>
    <el-table-column
      prop="comInsuranceDirectFee"
      label="商保金额">
    </el-table-column>
    <el-table-column
      prop="memberactcutfee"
      label="优惠券优惠">
    </el-table-column>
    <el-table-column
      prop="membergradecutfee"
      label="会员优惠">
    </el-table-column>
    <el-table-column
      prop="memberCardFee"
      label="会员卡支付">
    </el-table-column>
    <el-table-column
      prop="payedfee"
      label="自费金额">
    </el-table-column>
    <el-table-column
      label="是否商保">
      <template slot-scope="scope">
        {{scope.row.isComInsurance ? '是' : '否'}}
      </template>
    </el-table-column>

    <el-table-column
      prop="comInsurancePlanFee"
      label="预计理赔">
    </el-table-column>
  </el-table>
  <div class="layout_inner">
    <div class="panel-body">
      <el-form label-position="top">
        <el-form-item label="保险">
          <insurance-comp
            :disabled="obj.status === 1"
            :patientid="obj.patientid"
            v-model="obj.details.settlementComInsurDet"
            :init="preobj.details.settlementComInsurDet">
          </insurance-comp>
        </el-form-item>
        <el-form-item label="会员卡优惠券">
          <el-button @click="dialogShow=true" :disabled="obj.status === 1">选择会员卡、优惠券</el-button>
        </el-form-item>
      </el-form>

      <label class="el-form-item__label">已选择优惠券</label>
      <el-table
        :data="preobj.details.settlementCouponDet"
        style="width: 100%"
        ref="table"
        >
        <el-table-column   type="expand">
          <template slot-scope="scope">
            <el-table
              :data="getItems(scope.row.detailId)"
              style="width: 90%"
              >
              <el-table-column
                prop="itemcode"
                label="项目编号">
              </el-table-column>
              <el-table-column
                prop="itemname"
                label="项目名称">
              </el-table-column>
              <el-table-column
                label="数量">
                <template slot-scope="scope">
                  {{scope.row.quantity }} {{scope.row.unit}}
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="couponName"
          label="名称">
        </el-table-column>
        <el-table-column
          label="优惠卷类型">
          <template slot-scope="scope">
            <sys-value :code="scope.row.type" type="THC_CARD_GIFTBATCH_TYPE"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="面额">
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="有效期起">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="有效期至">
        </el-table-column>
        <el-table-column
          prop="itemAmount"
          label="对应项目总金额">
        </el-table-column>
        <el-table-column
          prop="disamount"
          label="优惠金额">
        </el-table-column>
      </el-table>

      <label class="el-form-item__label">已选择会员卡</label>
      <el-table
        :data="preobj.details.settlementMemberDet"
        style="width: 100%"
        ref="table"
        >
        <el-table-column
              prop="code"
              label="会员卡编号">
            </el-table-column>
            <el-table-column
              label="会员卡类型">
              <template slot-scope="scope">
                <sys-value :code="scope.row.type" type="THC_CARD_MEMBERCARD_TYPE"></sys-value>
              </template>
            </el-table-column>
            <el-table-column
              label="会员卡折扣">
              <template slot-scope="scope">
                {{(scope.row.discount/10) || ''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="储值金额">
            </el-table-column>
            <!-- <el-table-column
              prop="presentAmount"
              label="赠送余额">
            </el-table-column> -->
            <el-table-column
              prop="beginDate"
              label="有效期起">
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="有效期至">
            </el-table-column>
            <el-table-column
              prop="discountAmount"
              label="会员优惠">
            </el-table-column>
            <el-table-column
              prop="useAmount"
              label="会员卡支付">
            </el-table-column>
            <el-table-column
              prop=""
              label="会员卡余额">
              <template slot-scope="scope">
              {{(Number(scope.row.amount) - Number(scope.row.useAmount)).toFixed(2)}}
              </template>
            </el-table-column>

      </el-table>

    </div>
  </div>
</div>

</template>

<script>
  import membercard from './settlement-member'
  import giftComp from './settlement-gift'
  import insuranceComp from './settlement-insurance'
  export default {
    props: ['obj', 'preobj', 'items'],
    data () {
      return {
        dialogShow: false,
        settleSuite: '1'
      }
    },
    components: {
      membercard,
      giftComp,
      insuranceComp
    },
    methods: {
      getItems (ids) {
        ids = ids.split(',')
        return ids.map(v => {
          return this.obj.details.settlementDetail.filter(item => {
            return item.id === Number(v)
          })[0]
        })
      }
    }
  }
</script>
