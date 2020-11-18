<template>
  <el-dialog title="打折" :visible.sync="v" width="500px" :close-on-click-modal="false">
    <el-row>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">应收合计：</el-col>
        <el-col :span="16">{{total}}</el-col>
      </el-col>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">实收合计：</el-col>
        <el-col :span="16">{{totalharvest}}</el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">优惠比例：</el-col>
        <el-col :span="16" style="position:relative" class="remarkicon">
          <el-input class="" placeholder="请输入折扣" v-model="discount" type="number" @keyup.native="limitDecimal(discount)">
            <template slot="append">%</template>
          </el-input>
          <div class="el-form-item__error" v-show="showerror">请输入折扣</div>
        </el-col>
      </el-col>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">优惠金额：</el-col>
        <el-col :span="16">{{discountfee}}</el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">打折人员：</el-col>
        <el-col :span="16" style="position:relative" class="remarkicon">
          <el-select v-model="people" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <div class="el-form-item__error" v-show="showepeoplerror">请输入打折人员</div>
        </el-col>
      </el-col>
      <el-col :span="12" class="discountcol">
        <el-col :span="8">打折备注：</el-col>
        <el-col :span="16" style="position:relative" class="remarkicon">
          <el-autocomplete class="inline-input" v-model="remark" :fetch-suggestions="queryComp" placeholder="请输入内容" style="width: 100%"></el-autocomplete>
          <div class="el-form-item__error" v-show="showremarkerror">请输入打折备注</div>
        </el-col>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="v = false">取 消</el-button>
      <el-button type="primary" @click="surebtn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  byClinicId,
  findByDiscountStaff
} from '@/rcm/store/outpatient/outpatient'
import { floatTool } from '@/util/common'
export default {
  props: {
    discountvisiable: {
      type: Boolean,
      required: true
    },
    obj: {
      type: Object,
      required: true
    }
  },
  watch: {
    people: function (val, oldval) {
      this.remark = ''
      this.getByDiscountStaff(val)
      if (val) {
        this.showepeoplerror = false
      } else {
        this.showepeoplerror = true
      }
    },
    remark: function (val, oldval) {
      if (val) {
        this.showremarkerror = false
      } else {
        this.showremarkerror = true
      }
    },
    discount: function (val, oldval) {
      if (val) {
        this.showerror = false
      } else {
        this.showerror = true
      }
    }

  },
  computed: {
    v: {
      get () {
        if (!this.discountvisiable) {
          this.discount = ''
          this.remark = ''
          this.people = ''
          this.showerror = false
          this.showremarkerror = false
          this.showepeoplerror = false
        }
        return this.discountvisiable
      },
      set (v) {
        this.$emit('update:discountvisiable', v)
      }
    },
    // 总额
    total ({ alltotal = 0 }) {
      // scope.row.prePrice*scope.row.quantity
      // listData
      if (this.obj.multipleSelection.length > 0) {
        alltotal = this.obj.multipleSelection
          .reduce((total, cur) => {
            cur.recipeDetails.forEach(v => {
              total = floatTool.add(total, floatTool.multiply(v.prePrice, v.quantity))
            })
            return total
          }, 0)
      }
      return alltotal
    },
    // 实收金额
    totalharvest () {
      return floatTool.divide(floatTool.multiply(this.total, this.discount), 100)
    },
    // 优惠金额
    discountfee () {
      return floatTool.multiply(this.total, floatTool.divide((100 - this.discount), 100))
    }
  },
  data () {
    return {
      dialogVisible: false,
      discount: '',
      remark: '',
      people: '',
      options: [],
      remarkoptions: [],
      showerror: false,
      showremarkerror: false,
      showepeoplerror: false
    }
  },
  created () {
    this.getByClinicId()
  },
  methods: {
    async queryComp (query, cb) {
      try {
        let params = {
          discountStaffId: this.people
        }
        let data = await findByDiscountStaff(params)
        if (data.data.length > 0) {
          this.remarkoptions = data.data
          this.remarkoptions.map(v => {
            v.value = v.reason
          })
          cb(this.remarkoptions)
        } else {
          cb([])
        }
      } catch (err) {}
    },
    async getByDiscountStaff (discountStaffId) {
      try {
        let params = {
          discountStaffId
        }
        let data = await findByDiscountStaff(params)
        if (data.data.length > 0) {
          this.remarkoptions = data.data
          this.remarkoptions.map(v => {
            v.value = v.reason
          })
          this.remark = data.data[0].reason
        }
      } catch (err) {}
    },
    async getByClinicId () {
      try {
        let params = {
          status: 1
        }
        let data = await byClinicId(params)
        if (data && data.data) {
          this.options = data.data
          data.data.length > 0 ? (this.people = data.data[0].id) : null
        }
      } catch (err) {}
    },
    limitDecimal (discount) {
      if (discount >= 0 && discount <= 100) {
      } else {
        this.discount = ''
      }
    },
    surebtn () {
      if (!this.discount) {
        this.showerror = true
        return false
      }
      if (!this.people) {
        this.showepeoplerror = true
        return false
      }
      if (!this.remark) {
        this.showremarkerror = true
        return false
      }
      let benefit = this.obj.benefitInfo
          // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
      if (benefit.promotionId || benefit.memberCardId || benefit.benefitCardId || benefit.giftcardIds.length > 0) { // 当前使用了营销优惠的话才先清空数据
        this.$parent.$parent.emptyStep()
        this.$emit('sfee', this.sureFn)
      } else {
        this.sureFn()
      }
    },
    sureFn () {
      this.obj.multipleSelection.forEach(v => {
        v.recipeDetails.forEach(n => {
          // 之前是参数配置discount_modify允许修改折扣
          // if (n.freeSheet === 1 && !Number(this.obj.parameters.discount_modify)) {
          // 如果是医保，商保，大客户，套餐，免单的任何一种，都不让修改折扣
          if (n.freeSheet === 1 || n.useInsurance || n.majorAccount || n.mealFlag) {
            return
          }
          n.discount = this.discount // 传出去之后会再调接口，接口里会除以100，这里不再需要
          n.useMealDisabled = false
          n.comInsuranceRemarks = `(${
            this.$store.state.currentUser.displayName
          })${this.remark}`
          n.discountStaff = this.people
        })
      })
      this.v = false
      this.$emit('sfee')
    }
  }
}
</script>
<style lang="less" scoped>
.discountcol /deep/ .remarkicon .el-input input {background: #FEF5BE;}
.discountcol {
  line-height: 28px;
  text-align: left;
}
.el-col-8 {
  text-align: right;
}
.el-select {
  width: 100%;
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  left: 0;
}
.el-row{
  padding-bottom: 12px;
}
</style>

