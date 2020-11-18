<template>
  <span>
    <el-popover
      placement="right"
      width="530px;"
      v-model="isVisible"
      trigger="click"
      class="custRecordPop"
    >
      <el-row>
        <el-col :span="4">
          <span>当前积分{{point}}</span>
        </el-col>
        <el-col :span="6">
          <sys-text v-model="pointsChange" type="number" placeholder="赠送积分"></sys-text>
        </el-col>
        <el-col :span="8" class="ml5 mr5">
          <sys-text v-model="remark" placeholder="备注"></sys-text>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="save">确定</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            border
            style="max-height:500px;overflow-y: auto; overflow-x:hidden;"
          >
            <el-table-column
              label="日期"
              width="120"
              align="center"
              :cell-style="'background-color:green;'"
            >
              <template
                slot-scope="scope"
              >{{$moment(scope.row.opTime).format('YYYY/MM/DD') || '- -'}}</template>
            </el-table-column>
            <el-table-column prop="opTypeCn" label="类型" align="center" width="100"></el-table-column>
            <el-table-column prop="pointsChange" label="积分流水" align="center" min-width="120"></el-table-column>
            <el-table-column prop="pointsChangeAfter" label="积分余额" align="center" width="120"></el-table-column>
            <el-table-column show-overflow-tooltip label="备注" width="160" align="center">
              <template slot-scope="scope">{{scope.row.remark || '- -'}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作人" width="160" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.operator && scope.row.operator.name || '- -'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="reference" @click="show" class="blue" v-if="point">积分：{{point}}</span>
    </el-popover>
  </span>
</template>
<script>
import api from '@/crm/store/memberapi'
import list from '@/util/list'
export default {
  props: ['point'],
  mixins: [list],
  data () {
    return {
      api,
      isVisible: false,
      pointsChange: '',
      remark: '',
      listApiName: 'pointSearch',
      queryObj: {
        patientId: this.$route.params.patientId
      }
    }
  },
  watch: {
    'isVisible': {
      handler: function (val) {
        if (val) {
          this.pointsChange = ''
          this.remark = ''
        }
      }
    }
  },
  methods: {
    show () {
      this.isVisible = true
      this.list(true)
    },
    // pointSearch () {
    //   api.pointSearch({ 'patientId': this.$route.params.patientId }).then(rs => {
    //     if (rs.head.errCode === 0) {
    //       this.tableData = rs.data.resultList
    //     }
    //   })
    // },
    save () {
      api.addPoint({
        'patientId': this.$route.params.patientId,
        'pointsChange': this.pointsChange,
        'remark': this.remark
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.isVisible = false
          this.$emit('update', rs.data.pointsChangeAfter)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.blue {
  color: #1c7bef;
}
</style>

