<template>
  <div>
    <!-- <phr-detail-yzhu :medicineType="1" :params="queryObj"></phr-detail-yzhu> -->
    <ever-table
      ref="table"
      :columns="columns"
      :data="tableData"
      :cell-class-name="cellClassName"
      border>
      <template slot="adviceTypeName">
        <el-table-column label="医嘱名称">
          <template slot-scope="scope">
            <!--需要判断父子医嘱-->
            <!-- 1，找到相同的groupId这一项
            2，找到flag=1这一项，找到flag===2最后一项 -->
            <div :class="setAdviceClass(scope.row)">
              <div v-if="scope.row.feeItems">
                <div v-for="(item, index) in scope.row.feeItems" :key="index">
                  <span class="name" v-if="item.chnMedName">{{item.chnMedName}},</span>
                  <span class="unit" v-if="item.measure">{{item.measure}} {{item.measureUnitName}},</span>
                  <span class="method" v-if="item.tcmHerbDecoctionName">{{item.tcmHerbDecoctionName}},</span>
                  <span class="name" v-if="item.price">¥{{item.price | formatToFinacial(2)}}/{{item.measureUnitName}}</span>
                </div>
              </div>
              <div v-else>
                {{scope.row.medicineName}}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
  </div>
</template>

<script>
import PhrDetailYzhu from '@/components/phr/phr.detail.yizhu'
import list from '@/util/list'
import { flatten } from 'lodash'
import api from '@/workspace/store/component'
export default {
  mixins: [list],
  data () {
    return {
      // queryObj: {
      //   visitOrgId: '',
      //   visitNumber: '',
      //   memberModule: true,
      //   patientId: this.$route.params.patientId
      // }
      api,
      listApiName: 'opPrescriptionView',
      tableData: [],
      adviceGroups: {},
      columns: [
        {
          prop: 'adviceTypeName',
          slotName: 'adviceTypeName',
          showOverflowTooltip: true
        },
        {
          prop: 'prescriptionWriteDate',
          label: '开立时间',
          showOverflowTooltip: true
        },
        {
          prop: 'medicineUseFrequencyName',
          label: '频次',
          showOverflowTooltip: true
        },
        {
          prop: 'medicineUseWayName',
          label: '用法',
          showOverflowTooltip: true
        },
        {
          prop: 'chnMedDosageCount',
          label: '剂数',
          showOverflowTooltip: true
        },
        {
          prop: 'channelName',
          label: '渠道',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceExecuteTenantSubjectName',
          label: '执行科室',
          showOverflowTooltip: true
        },
        {
          prop: 'replaceDecoctFlag',
          label: '是否代煎',
          formatter ({value}) {
            if (value === 1) {
              return '是'
            } else if (value === 0) {
              return '否'
            } else {
              return ''
            }
          },
          showOverflowTooltip: true
        },
        {
          prop: 'medicinePrice',
          label: '金额',
          formatter: ({value, row}) => {
            let total = 0
            row.feeItems.map(item => {
              total += item.price * item.measure
            })
            total = total * row.chnMedDosageCount
            return '¥ ' + this.$filters.formatToFinacial(total, 2)
          },
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceRemark',
          label: '嘱托',
          showOverflowTooltip: true
        }
      ]
    }
  },
  created () {},
  methods: {
    list (refresh) {
      let params = {
        adviceTypes: ['303', '304'],
        patientId: this.$route.params.patientId
      }
      params.page = this.current // 兼容需要page作为分页参数的接口
      params.offset = this.offset
      params.pagesize = this.pagesize
      api.opPrescriptionView(params).then(res => {
        this.tableData = res.data.resultList || []
        this.totalCount = res.data.totalCount || 0
        this.getAdviceGroups()
      })
    },
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      const c1 = rowIndex < (this.tableData.length - 1)
      const c2 = () => {
        if (c1) {
          return this.tableData[rowIndex].parentChildGroupId === this.tableData[rowIndex + 1].parentChildGroupId
        }
      }
      const c3 = columnIndex === 0
      if (c1 && c2() && c3) {
        return 'noborder'
      }
    },
    setAdviceClass (row) {
      let currentGroups = this.adviceGroups[row.parentChildGroupId]
      if (row.parentChildAdviceFlag === 1 && row.id === currentGroups[0].id) { // 父医嘱
        return 'first'
      } else if (row.parentChildAdviceFlag === 2) { // 子医嘱
        if (row.doctorAdviceId === currentGroups[currentGroups.length - 1].doctorAdviceId) {
          return 'last'
        } else {
          return 'middle'
        }
      } else { // 普通医嘱
        return ''
      }
    },
    getAdviceGroups () {
      let tmpArr = []
      this.adviceGroups = {}
      // 将parentGroupId相同的放到一个集合里
      this.tableData.map((item, index) => {
        if (!this.adviceGroups[item.parentChildGroupId]) {
          this.adviceGroups[item.parentChildGroupId] = [item]
        } else {
          this.adviceGroups[item.parentChildGroupId].push(item)
        }
      })
      // 将每个集合里面父医嘱放到一起
      for (let name in this.adviceGroups) {
        this.adviceGroups[name].sort((n1, n2) => {
          return n1.parentChildAdviceFlag - n2.parentChildAdviceFlag
        })
        tmpArr.push(this.adviceGroups[name])
      }
      this.tableData = flatten(tmpArr)
      // console.log(this.formatTableData)
    }
  },
  components: {
    PhrDetailYzhu
  }
}
</script>

<style lang="scss" scoped>
.name{
  font-size: 14px;
  color: #000000;
}
.method{
  font-size: 12px;
  color: #333;
}
.unit{
  font-size: 14px;
  color: #000000;
}
.phr_detail_yizhu /deep/ .el-table__row .noborder{
  border-bottom:none;
}
.first{
  position:relative;
  padding-left:10px;
}
.first:before{
  width: 6px;
  display: block;
  content: '';
  color: red;
  border-left: 3px solid #000;
  border-top: 3px solid #000;
  height: 100%;
  padding-left: 1px;
  position: absolute;
  left: -3px;
  top: 50%;
}
.middle{
  position:relative;
  padding-left:10px;
}
.middle:before{
  width: 6px;
  display: block;
  content: '';
  color: red;
  border-left: 3px solid #000;
  height: 100%;
  padding-left: 1px;
  position: absolute;
  left: -3px;
  top:-3px;
}
.last{
  position:relative;
  padding-left:10px;
}
.last:before{
  width: 6px;
  display: block;
  content: '';
  color: red;
  border-left: 3px solid #000;
  border-bottom: 3px solid #000;
  height: 100%;
  padding-left: 1px;
  position: absolute;
  left: -3px;
  top: -60%;
}
</style>
