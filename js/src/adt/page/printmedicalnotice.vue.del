<template>
  <div>
    <div class="print_reg">
      <div class="hf">{{(printobj ? printobj.title : '')}}</div>
      <div class="hf">医保未审核通知单</div>
      <div class="regis">
        <!-- <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="病案号" prop="inpatientNumber"></el-table-column>
        <el-table-column label="患者姓名" prop="name"></el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="入院科室" prop="admitDepartmentName"></el-table-column>
        <el-table-column label="入院时间" :formatter="convertTime"></el-table-column>
        <template slot="append">
          <div class="declaration">
            说明: 尊敬的患者，您的医保资料提交不全或其他原因造成医保审核未通过，请您向您的责任护士提供相关资料或找医保部门补充资料，24小时审核未通过将影响医保报销。
          </div>
        </template>
        </el-table>-->
        <table
          width="100%"
          border="1"
          cellpadding="5"
          cellspacing="5"
          style="border-collapse:collapse;"
        >
          <tr>
            <td>病案号</td>
            <td>患者姓名</td>
            <td>出生日期</td>
            <td>入院科室</td>
            <td>入院时间</td>
          </tr>
          <tr>
            <td>{{printobj.inpatientNumber}}</td>
            <td>{{printobj.name}}</td>
            <td>{{printobj.birthday&&$moment(printobj.birthday).format('YYYY-MM-DD')}}</td>
            <td>{{printobj.admitDepartmentName}}</td>
            <td>{{printobj.createTime&&$moment(printobj.createTime).format('YYYY-MM-DD')}}</td>
          </tr>
          <tr>
            <td colspan="5">
              <p
                class="instruction"
              >说明: 尊敬的患者，您的医保资料提交不全或其他原因造成医保审核未通过，请您向您的责任护士提供相关资料或找医保部门补充资料，24小时审核未通过将影响医保报销。</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['printobj']
}
</script>

<style scoped>
/*@page {
    size: A5 portrait;
  }*/
.print_reg {
  width: 80%;
  padding: 20px;
  margin: 0 auto;
}
.print_reg .hf {
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: #000;
}
.print_reg .regis {
  padding: 0;
  margin: 0;
  font-size: 12px;
  width: 100%;
}
.layout_box table td {
  font-size: 10px;
  color: #000;
  background: none;
  font-weight: normal;
}
</style>
