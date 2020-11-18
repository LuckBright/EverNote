<template>
    <div class="phr_detail_yizhu">
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
                    <span class="name" v-if="item.price">¥{{item.price|formatToFinacial(2)}}/{{item.measureUnitName}}</span>
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
    </div>
</template>
<script>
import {flatten} from 'lodash'
import phrapi from '@/workspace/store/component'
// 父子医嘱标识：0、常规医嘱；1、父医嘱；2、子医嘱
export default {
  props: {
    medicineType: {
      type: Number // 1中药2西药
    },
    params: {
      type: Object
    },
    queryObj: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      formatTableData: [],
      adviceTypes: [],
      adviceGroups: {},
      columns: [],
      westernMedicine: [
        {
          prop: 'adviceTypeName',
          slotName: 'adviceTypeName',
          showOverflowTooltip: true
        },
        {
          prop: 'orderDatetime',
          label: '开立时间',
          showOverflowTooltip: true
          // comp: 'custom'
        },
        {
          prop: 'medicineSpecification',
          label: '规格',
          showOverflowTooltip: true
        },
        {
          prop: 'medicineUseDosage',
          label: '剂量',
          showOverflowTooltip: true,
          formatter: ({value, row}) => {
            return '每次' + row.medicineUseDosage + row.medicineUseDosageUnit
          }
        },
        {
          prop: 'medicineUseWayName',
          label: '用法',
          showOverflowTooltip: true
        },
        {
          prop: 'medicineUseFrequencyName',
          label: '用药频次',
          showOverflowTooltip: true
        },
        {
          prop: 'validDays',
          label: '天数',
          showOverflowTooltip: true,
          formatter: ({value}) => {
            return value + '天'
          }
        },
        {
          prop: 'medicineReceivedDosage',
          label: '数量',
          showOverflowTooltip: true,
          formatter: ({value, row}) => {
            return row.medicineReceivedDosage + '' + row.medicineReceivedDosageUnit
          }
        },
        {
          prop: 'sourceName',
          label: '渠道',
          showOverflowTooltip: true
        },
        {
          prop: 'remark',
          label: '备注',
          showOverflowTooltip: true
        }
      ],
      chineseMedicine: [
        {
          prop: 'adviceTypeName',
          slotName: 'adviceTypeName',
          showOverflowTooltip: true
        },
        {
          prop: 'orderDatetime',
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
          prop: 'tcmDosageCount',
          label: '剂数',
          showOverflowTooltip: true
        },
        {
          prop: 'sourceName',
          label: '渠道',
          showOverflowTooltip: true
        },
        {
          prop: 'adviceExecuteDept',
          label: '执行科室',
          showOverflowTooltip: true
        },
        {
          prop: 'decoctFlag',
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
            total = total * row.tcmDosageCount
            return '¥ ' + this.$filters.formatToFinacial(total, 2)
          },
          showOverflowTooltip: true
        },
        {
          prop: 'remark',
          label: '嘱托',
          showOverflowTooltip: true
        }
      ]
    }
  },
  created () {
    // 301西药 302中成药 303中药饮片 304中药颗粒
    if (this.medicineType === 1) { // 中药
      this.adviceTypes = ['303', '304']
      this.columns = this.chineseMedicine
    } else if (this.medicineType === 2) { // 西药
      this.adviceTypes = ['301', '302']
      this.columns = this.westernMedicine
    }
    // console.log(this.params, 'params')
    // console.log(this.queryObj, 'queryObj')
    let params = {
      adviceTypes: this.adviceTypes,
      orgId: this.params.visitOrgId,
      visitNumber: this.params.visitSerialNumber,
      // status: 3,
      offset: 0,
      pagesize: 10000
    }
    if (this.params && this.params.memberModule) params.patientId = this.params.patientId
    if (Number(this.params.visitType) === 3) { // 住院还没接口控制一下
      this.tableData = []
    } else {
      phrapi.opPrescriptionView(params).then(res => {
        this.tableData = res.data.resultList ? res.data.resultList : []
        this.getAdviceGroups()
      })
    }
  },
  methods: {
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      const c1 = rowIndex < (this.tableData.length - 1)
      const c2 = () => {
        if (c1) {
          return this.tableData[rowIndex].parentGroupId === this.tableData[rowIndex + 1].parentGroupId
        }
      }
      const c3 = columnIndex === 0
      if (c1 && c2() && c3) {
        return 'noborder'
      }
    },
    setAdviceClass (row) {
      var currentGroups = this.adviceGroups[row.parentGroupId]

      if (row.parentAdviceFlag === 1 && row.id === currentGroups[0].id) { // 父医嘱
        return 'first'
      } else if (row.parentAdviceFlag === 2) { // 子医嘱
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
      // 将parentGroupId相同的放到一个集合里
      this.tableData.map((item, index) => {
        if (!this.adviceGroups[item.parentGroupId]) {
          this.adviceGroups[item.parentGroupId] = [item]
        } else {
          this.adviceGroups[item.parentGroupId].push(item)
        }
      })
      // 将每个集合里面父医嘱放到一起
      for (let name in this.adviceGroups) {
        this.adviceGroups[name].sort((n1, n2) => {
          return n1.parentAdviceFlag - n2.parentAdviceFlag
        })
        tmpArr.push(this.adviceGroups[name])
      }
      this.tableData = flatten(tmpArr)
      // console.log(this.formatTableData)
    }
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

