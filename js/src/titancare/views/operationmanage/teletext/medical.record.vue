<template>
  <div class='medicalBox'>
    <el-row class="mb20">
      <el-col class='theme' :span="6">诊断：</el-col>
      <el-col class='value-info' :span="18">
        <template v-if="values.diagnoseList">
          <el-row v-for="(row, i) in values.diagnoseList" style="width: 600px;margin:0;" :key="i">
            <el-col :span="8">
                {{row.diagnose.value}}
            </el-col>
            <el-col class='value-info' :span="16">
                诊断备注：{{row.diagnoseDetail || '--'}}
            </el-col>
          </el-row>
        </template>
      </el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">主诉：</el-col>
      <el-col class='value-info' :span="18">{{values.chiefComplaint ? values.chiefComplaint : '--'}}</el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">现病史：</el-col>
      <el-col class='value-info' :span="18">{{values.presentMedicalHistory ? values.presentMedicalHistory : '--'}}</el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">既往史：</el-col>
      <el-col class='value-info' :span="18">{{values.previousHistory ? values.previousHistory : '--'}}</el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">药物过敏史：</el-col>
      <el-col class='value-info' :span="18">
      <el-table v-if="values.allergicHistory && values.allergicHistory.isAllergicHis" :data="values.allergicHistory && values.allergicHistory.isAllergicHis ? values.allergicHistory.guomin : []" style="width: 600px;margin:0;">
        <el-table-column label="分类">
          <template slot-scope="scope">
            {{scope.row.allergen[0].name}}
          </template>
        </el-table-column>
        <el-table-column label="药品">
          <template slot-scope="scope">
            {{scope.row.allergen[1].name}}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{scope.row.remark}}
          </template>
        </el-table-column>
      </el-table>
      <span v-else>--</span>
      </el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">辅助检查：</el-col>
      <el-col class='value-info' :span="18">{{values.auxiliary ? values.auxiliary : '--'}}</el-col>
    </el-row>
    <el-row class="mb20">
      <el-col class='theme' :span="6">诊疗计划：</el-col>
      <el-col class='value-info' :span="18">{{values.opinion ? values.opinion : '--'}}</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['values'],
  created () {
    // console.log(this.values)
  }
}
</script>
<style lang='less' scoped>
  .medicalBox p{
    line-height: 20px;
  }
  .theme{
    display: inline-block;
    width: 100px;
    line-height: 14px;
    text-align: right;
  }
</style>
