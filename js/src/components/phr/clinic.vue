<template>
  <div class="phr_detail_yizhu">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="reportdate">
        <ever-range-picker
          dateType="datetimerange"
          autoWidth="true"
          :start.sync="queryObj.orderDateStart"
          :end.sync="queryObj.orderDateEnd"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="adviceType">
        <el-select
          v-model="queryObj.adviceType"
          filterable
          :placeholder="'请选择医嘱类型'"
          :clearable="true"
        >
          <el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        ref="table"
        :cell-class-name="cellClassName"
        :columns="columns"
        :data="tableData"
        border
      >
        <template slot="doctorAdviceContentJson">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <!--需要判断父子医嘱-->
              <!-- 1，找到相同的groupId这一项
              2，找到flag=1这一项，找到flag===2最后一项-->
              <div :class="setAdviceClass(scope.row)">
                <div v-if="scope.row.herbItems">
                  <div v-for="(item, index) in scope.row.herbItems" :key="index">
                    <span class="name" v-if="item.tcmHerbName">{{item.tcmHerbName}},</span>
                    <span
                      class="unit"
                      v-if="item.measure"
                    >{{item.measure}} {{item.measureUnitName}},</span>
                    <span
                      class="method"
                      v-if="item.tcmHerbDecoctionName"
                    >{{item.tcmHerbDecoctionName}},</span>
                    <span
                      class="name"
                      v-if="item.price"
                    >¥{{item.price|formatToFinacial(2)}}/{{item.measureUnitName}}</span>
                  </div>
                </div>
                <div v-else>
                  <span>{{isNull(scope.row.doctorAdviceContentJson)}} {{isNull(scope.row.specification)}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <el-row v-show="count > pagesize">
        <el-col :span="24" align="right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { flatten } from 'lodash'

const schema = [
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'status',
    label: '状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '1',
          name: '已提交'
        },
        {
          id: '2',
          name: '执行中'
        },
        {
          id: '3',
          name: '已出库'
        },
        {
          id: '4',
          name: '已完成'
        }
      ]
    }
  },
  {
    name: 'adviceType',
    label: '医嘱类型',
    comp: 'custom'
  },
  {
    name: 'reportdate',
    label: '开立时间',
    comp: 'custom'
  }
]
export default {
  props: {
    patientId: String,
    visitNum: String
  },
  async created () {
    this.getTypes()
    await this.list()
  },
  components: {},
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.pagesize = 20
    queryObj.offset = 0
    queryObj.orderDateStart = ''
    queryObj.orderDateEnd = ''
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      typeArr: [],
      chartRow: {},
      deptArr: [],
      doctorArr: [],
      pagesize: 20,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      flag: false,
      tableData: [],
      columns: [
        {
          prop: 'doctorAdviceTypeName',
          label: '类型',
          width: '100'
        },
        {
          prop: 'adviceStatusName',
          label: '状态',
          width: '100'
        },
        {
          prop: 'doctorAdviceOpenTime',
          label: '开立时间',
          width: '159'
        },
        {
          prop: 'doctorAdviceContentJson',
          slotName: 'doctorAdviceContentJson'
        },
        {
          prop: 'doctorAdviceContent',
          label: '内容',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceRemark',
          label: '嘱托'
        },
        {
          prop: 'doctorAdviceExecuteTenantSubjectName',
          label: '执行科室'
        }
      ],
      adviceGroups: {}
    }
  },
  methods: {
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      const c1 = rowIndex < this.tableData.length - 1
      const c2 = () => {
        if (c1) {
          return (
            this.tableData[rowIndex].parentChildGroupId ===
            this.tableData[rowIndex + 1].parentChildGroupId
          )
        }
      }
      const c3 = columnIndex === 3
      if (c1 && c2() && c3) {
        return 'noborder'
      }
    },
    setAdviceClass (row) {
      var currentGroups = this.adviceGroups[row.parentChildGroupId]

      if (row.parentChildAdviceFlag === 1 && row.id === currentGroups[0].id) {
        // 父医嘱
        return 'first'
      } else if (row.parentChildAdviceFlag === 2) {
        // 子医嘱
        if (row.doctorAdviceId === currentGroups[currentGroups.length - 1].doctorAdviceId) {
          return 'last'
        } else {
          return 'middle'
        }
      } else {
        // 普通医嘱
        return ''
      }
    },
    getAdviceGroups () {
      let tmpArr = []
      // 将parentChildGroupId相同的放到一个集合里
      this.adviceGroups = []
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
    },
    pushArr (str, arr) {
      return str ? arr.push(arr) : null
    },
    isNull (str) {
      return str === null ? '' : str
    },
    getTypes () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
        res.forEach(item => {
          // 去除检验 检查子项
          if (item.parentId !== '801' && item.parentId !== '800') {
            this.typeArr.push(item)
          }
        })
      })
    },
    reset () {
      this.currentPage = 1
      this.pagesize = 20
      this.count = 0
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    list () {
      if (!this.patientId || !this.visitNum) {
        return
      }
      const query = Object.assign(JSON.parse(JSON.stringify(this.queryObj)), {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        visitSerialNumber: this.visitNum,
        patientId: this.patientId
      })
      phrapi.opAdviceView(query).then(res => {
        this.tableData = res.data.resultList ? res.data.resultList : []
        this.getAdviceGroups()
        this.count = res.data.totalCount
      })
    }
  },
  watch: {
    queryObj: {
      handler () {
        this.currentPage = 1
        this.list()
      },
      deep: true
    },
    visitNum () {
      this.reset()
    },
    patientId () {
      this.reset()
    }
  }
}
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.margin {
  margin: 0 auto;
}
.name {
  font-size: 14px;
  color: #000000;
}
.method {
  font-size: 12px;
  color: #333;
}
.unit {
  font-size: 14px;
  color: #000000;
}
.phr_detail_yizhu /deep/ .el-table__row .noborder {
  border-bottom: none;
}
.first {
  position: relative;
  padding-left: 10px;
}
.first:before {
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
.middle {
  position: relative;
  padding-left: 10px;
}
.middle:before {
  width: 6px;
  display: block;
  content: '';
  color: red;
  border-left: 3px solid #000;
  height: 100%;
  padding-left: 1px;
  position: absolute;
  left: -3px;
  top: -3px;
}
.last {
  position: relative;
  padding-left: 10px;
}
.last:before {
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

