<template>
  <el-dialog :visible.sync="dialogVisible" class="ui_dialog_02 spe2">
    <el-row class="patient_item_box">
      <el-col :span="6" class="item_menu_wrap">
        <el-menu default-active="2-2" class="item_menu">
          <el-submenu index="1">
            <template slot="title">检验</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">检验</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="18" class="item_con_wrap">
        <el-row class="con_wrap_head">
          <el-col :span="12" class="title">血常规</el-col>
          <el-col :span="12" class="handle_box alg_r">
            <span><i class="iconfont icon-zhuyuan-bingli-tlieb"></i><i class="iconfont icon-zhuyuan-bingli-tuxin"></i></span><span class="close_btn" @click="closeDialog"><i class="iconfont icon-shanchu"></i></span>
          </el-col>
        </el-row>
        <el-row class="con_wrap_box">
          <el-col>
            <calendar :date="dateTime" @select="dateChange"></calendar>
          </el-col>
          <el-col>
            <el-table
              :data="tableData"
              style="width: 100%"
              height="400"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                label="项目名称">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="测试结果"
                width="120">
              </el-table-column>
              <el-table-column
                prop="address"
                label="单位"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                label="参考区间"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="dialog-footer">
              <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
              <el-button type="primary"><i class="iconfont icon-tijiao"></i>确定</el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import calendar from '@/inpatient/components/calendar'
  export default {
    data () {
      return {
        dialogVisible: false,
        tableData: [],
        dateTime: ['2018-04-23 14:12:00', '2018-04-25 14:12:00', '2018-04-26 14:12:00']
      }
    },
    components: {
      calendar
    },
    methods: {
      openDialog () {
        this.dialogVisible = true
      },
      closeDialog () {
        this.dialogVisible = false
      },
      handleSelectionChange (val) {
        console.log(val)
      },
      dateChange (date) {
        console.log(date)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .patient_item_box{
    display: flex;
    .item_menu_wrap{
      flex: 1;
    }
    .item_menu{
      height: 100%;
      background: #f8f8f8;
      .el-submenu{
        /deep/ .el-submenu__title{
          height: 60px;
          line-height: 60px;
          font-size: 16px;
          font-weight: 500;
          color: #000;
          border-bottom: 1px solid #eee;
          background: #f8f8f8;
        }
        /deep/ .el-menu{
          border-bottom: 1px solid #eee;
          background: #f4f4f4;
        }
      }
    }
    .item_con_wrap{
      flex: 3;
      .con_wrap_head{
        height: 60px;
        line-height: 60px;
        padding:0 20px;
        .title{
          font-size:20px;
          color: #000;
        }
        .handle_box{
          .iconfont{
            padding: 10px;
            color: #aaa;
            font-size: 12px;
          }
          .iconfont.active{
            color: #1c7bef;
          }
          .close_btn{
            .iconfont{
              font-size: 20px;
            }
          }
        }
      }
      .con_wrap_box{
        padding: 0 20px 20px;
        .el-table{
          margin: 0;
          border: none;
          /deep/ th, /deep/ td{
            height: 40px;
            line-height: 40px;
            background: #fff;
            border-bottom: 1px solid #e6e6e6;
            font-weight: normal;
            /deep/ .cell{
              background: #fff;
            }
          }
          &:after{
            background: none;
           }
        }
      }
    }
  }
</style>
