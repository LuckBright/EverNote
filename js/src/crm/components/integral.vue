<template>
  <div class="flex_column_full_hidden">
    <ever-form2
      :nosubmit="true"
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      @objsaved="afterSave()"
      label-width="80px"
      class="flex_col_1_auto memform">
      <template slot="points" class="mgl40">
        <el-popover placement="right" width="400" trigger="click">
          <el-table :data="gridData">
            <el-table-column width="160" prop="updateTime" label="时间"></el-table-column>
            <el-table-column align="center" prop="opTypeCn" label="操作类型"></el-table-column>
            <el-table-column align="center" prop="operator.name" label="操作人"></el-table-column>
            <el-table-column align="center" prop="pointsChange" label="积分变更"></el-table-column>
            <el-table-column align="center" prop="pointsChangeAfter" label="账户积分"></el-table-column>
          </el-table>
          <el-pagination
            v-show="totalCount > params.pagesize"
            layout="prev, pager, next"
            small
            :page-size="params.pagesize"
            :total="totalCount"
            @current-change="handleCurrentChange"
          ></el-pagination>
          <el-button type="text" slot="reference" class="mgl40">
            <span>余额 &nbsp;</span>
            <span>{{ obj.points ? obj.points : '0'}}</span>
          </el-button>
        </el-popover>
      </template>

      <template slot="type">
        <el-radio v-model="radio" label="1">消费积分</el-radio>
        <el-radio v-model="radio" label="2">赠送积分</el-radio>
      </template>
      <template slot="pointstype">
        <div class="mgl65" v-if="radio === '1'">
          <el-form-item>
            <span>兑换类型</span>
            <sys-type class="ml5" code="THC_MARKET_JFDHFS" v-model="obj.type"></sys-type>
          </el-form-item>
          <el-form-item>
            <span>兑换产品</span>
            <el-select
              v-model="obj.exchange"
              placeholder="请选择"
              class="ml5"
              clearable
              value-key="id">
              <el-option
                v-for="item in exchangeOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span>积分数量</span>
            <span class="ml13">
              <span v-if="obj.exchange&&obj.exchange.exchangePoints">{{obj.exchange.exchangePoints}}</span>
              <span v-else>--</span>
            </span>
          </el-form-item>
        </div>
        <div class="mgl40" v-if="radio === '2'">
          <span>数额</span>
          <el-input v-model="obj.pointsChange" type="number" style="width: 200px;" class="ml13"></el-input>
        </div>
      </template>
      <template slot="remark">
        <el-input
          v-model="obj.remark"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 4}"
          :maxlength="100"
        ></el-input>
      </template>
    </ever-form2>
    <div class="form_footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/integralapi'
import memberapi from '@/crm/store/memberapi'
let schema = [
  {
    name: 'points',
    comp: 'custom'
  },
  {
    name: 'type',
    label: '类型',
    comp: 'custom'
  },
  {
    name: 'pointstype',
    comp: 'custom'
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'custom'
  }
]
export default {
  props: ['patientId'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.exchange = {}
    // obj.exchangeId = ''
    obj.pointsChange = ''
    return {
      api,
      obj,
      schema,
      radio: '1',
      options: [],
      exchangeOptions: [],
      rules: {},
      gridData: [],
      currentPage: 1,
      totalCount: 0,
      params: {
        patientId: ''
      }
    }
  },
  watch: {
    patientId (val) {
      if (val) {
        this.getPoints()
      } else {
        this.reset()
      }
    },
    'obj.type': {
      handler (val) {
        if (val) {
          api.getTypeListAll({ typeCode: val }).then(result => {
            if (
              val === 'thc_market_pointExchangeType_benefit' &&
              result.data.length > 0
            ) {
              result.data.forEach(item => {
                item.name = item.benefitName
              })
            }
            this.exchangeOptions = result.data
            this.obj.exchange = this.exchangeOptions[0]
          })
        }
        this.obj.exchange = null
        this.obj.pointsChange = ''
      },
      immediate: true
    },
    radio: {
      handler: function (val) {
        this.getPoints()
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getGridData(this.params)
    },
    getPoints () {
      this.patientId &&
        api.getPoints({ patientId: this.patientId }).then(rs => {
          if (rs.head.errCode === 0) {
            this.obj.points = rs.data && rs.data.points
            this.obj.pointsChange = null
            this.obj.remark = ''
          }
        })
    },
    save () {
      if (this.obj.exchange && this.obj.exchange.id) {
        this.obj.exchangeId = this.obj.exchange.id
      }
      this.obj.patientId = this.patientId
      let request =
        this.radio === '1' ? this.api.exchangePoints : this.api.addPoints
      this.patientId &&
        request(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            if (this.radio === '1') {
              this.$messageTips(this, 'success', '消费成功')
            } else {
              this.$messageTips(this, 'success', '充值成功')
            }
            this.getPoints()
            this.params.patientId = this.patientId
            this.getGridData(this.params)
          }
        })
    },
    getGridData (params) {
      memberapi.pointSearch(params).then(rs => {
        this.totalCount = rs.data.totalCount
        this.gridData = rs.data.resultList ? rs.data.resultList : []
      })
    },
    reset () {
      this.obj.points = ''
      this.obj.type = ''
      this.obj.exchange = ''
      this.obj.pointsChange = ''
      this.obj.remark = ''
      this.radio = '1'
    }
  }
}
</script>
<style  lang="scss" scoped>
.form_footer{
  padding-top: 10px;;
  padding-left: 80px;
  border-top: 1px solid #eee;
}
.ml13 {
  margin-left: 8px;
}
.mgl40 {
  margin-left: -40px;
}
.mgl65 {
  margin-left: -65px;
}
.memform /deep/ .el-form-item{margin-bottom: 10px;}
</style>

