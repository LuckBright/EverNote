<template>
  <div class="paper_yizhu">
    <el-row>
      <h3 class="title">{{headerData['doctorAdviceTermCode']}}</h3>
    </el-row>
    <el-row class="header">
      <template v-for="item in header">
        <el-col
          :span="item.span || 4"
          :key="item.key">
          <span>{{ item.label }}:</span>
          <span>{{ headerData[item.key] }}</span>
        </el-col>
      </template>
    </el-row>
    <el-table
      :data="tableData"
      :row-style="rowStyle"
      size="medium"
      border
      style="width: 100%">
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="date"
        label="日期"
        width="100">
      </el-table-column>
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="time"
        label="时间"
        width="80">
      </el-table-column>
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="doctorAdviceContent"
        label="医嘱">
        <template slot-scope="scope">
          <div>
            <!-- 医嘱名称 规格 医嘱内容 -->
            {{ scope.row.doctorAdviceName }}  {{ scope.row.specification }}  {{ scope.row.doctorAdviceContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="adviceOrderDoctorSignature"
        label="医师签名"
        width="100">
      </el-table-column>
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="doctorAdviceExecuteTime"
        label="执行时间"
        width="100">
      </el-table-column>
      <el-table-column
        :resizable="false"
        header-align="center"
        prop="doctorAdviceExecutorSignName"
        label="执行者签名"
        width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'PaperYizhu',
    data () {
      return {
        rowStyle: {
          border: '1px solid'
        },
        header: [
          {
            label: '姓名',
            key: 'name'
          },
          {
            label: '性别',
            key: 'sex',
            span: 3
          },
          {
            label: '年龄',
            key: 'age'
          },
          {
            label: '科别',
            key: 'kebie'
          },
          {
            label: '床号',
            key: 'bed',
            span: 3
          },
          {
            label: '住院号',
            key: 'outpatientVisitNumber',
            span: 6
          }
        ]
      }
    },
    props: {
      headerData: {
        type: Object
      },
      tableData: {
        type: Array
      }
    }
  }
</script>

<style lang="scss" scoped>
  .paper_yizhu{
    width:210mm;
    background:#fff;
    padding:20px;
    font-size:12px;
    margin: auto;
  }
  .title{
    text-align: center;
    font-size:18px;
  }
  .header{
    font-size:13px;
    padding:10px 0;
    line-height:16px;
    text-align: left;
  }
  //table样式(专门做a4纸张的样式)
  .paper_yizhu{
    /deep/.el-table{
      border:1px solid #000;
    }
    /deep/.el-table td, /deep/.el-table th{
      border-right:1px solid #000;
      border-bottom:1px solid #000;
    }
    /deep/.el-table th{
      background:#fff;
    }
    /deep/.el-table:not(.no-hover) tr.hover-row td, .el-table:not(.no-hover) tr:hover td {
      background-color: #fff;
    }
  }

  //设置父子医嘱的相关样式
  .first{
    position:relative;
    padding-left:10px;
  }
  .first:before{
    width: 6px;
    display: block;
    content: '';
    color: red;
    border-left: 2px solid #000;
    border-top: 2px solid #000;
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
    border-left: 2px solid #000;
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
    border-left: 2px solid #000;
    border-bottom: 2px solid #000;
    height: 100%;
    padding-left: 1px;
    position: absolute;
    left: -3px;
    top: -60%;
  }
</style>
