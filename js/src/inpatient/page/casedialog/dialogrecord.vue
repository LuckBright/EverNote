<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="close"
    class="ui_dialog_02 spe">
    <div style="height:600px;text-align: center;font-size: 20px">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          label="操作时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.operateTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作人"
          width="180">
          <template slot-scope="scope">
            {{scope.row.oper}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作" v-if="type=='mod'">
          <template slot-scope="scope">
            <!-- {{modifyObj}}-{{scope.row.modify}} -->
            {{modifyObj[scope.row.modify]}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作内容" align="left">
          <template slot-scope="scope" v-if="scope.row.comment">
            <p  v-for="(item,index) in scope.row.comment" :key="index">
              {{index+1}},{{item}}
            </p>
            <!-- {{scope.row.comment&&scope.row.comment.join('/n')}} -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close" type="primary"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </span>
  </el-dialog>
</template>
<script>
// import list from '@/util/list'
import phrapi from '@/form/store/phrapi'
// let tableData = [
//   {
//     operateTime: '2016-05-02',
//     oper: '王小虎',
//     modify: 1,
//     comment: ['上海市普', '陀区金沙江路', '1518 弄']
//   }
// ]
export default {
  // mixins: [list],
  props: ['open', 'id', 'visitId', 'type'],
  data () {
    return {
      title: '',
      tableData: [],
      dialogVisible: false,
      queryObj: {},
      modifyObj: {
        1: '新增',
        2: '修改',
        3: '删除'
      }
    }
  },
  watch: {
    open: function (val) {
      // console.log(val)
      this.dialogVisible = val
      this.getRecord()
    },
    type: function (val) {
      this.getRecord()
    },
    '$store.state.obj.id': function (val) {
      this.getRecord()
      // console.log('操作记录的id是', val)
    }
  },
  created () {
  },
  methods: {
    getRecord () {
      this.tableData = []
      switch (this.type) {
        case 'mod':
          this.title = '修改记录'
          this.getModRecord()
          break
        case 'del':
          this.title = '删除记录'
          this.getDelRecord()
          break
       // default:
          // alert('type类型错误')
      }
    },
    getModRecord () {
      phrapi.modRecord({id: this.$store.state.obj.id}).then(res => {
        // console.log('修改记录', res)
        this.tableData = res
      })
    },
    getDelRecord () {
      phrapi.delRecord({visitId: this.visitId}).then(res => {
        // console.log('删除记录', res)
        this.tableData = res
      })
    },
    close (done) {
      this.$emit('close', false)
      if (typeof done === 'function')done()
    },
    submit () {
      // this.$emit('submit', {
      //   auditStatus: this.radio,
      //   auditComment: this.reason
      // })
    }
  }
}
</script>
