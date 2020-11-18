<template>
  <el-dialog
    title="病种选择"
    :visible.sync="v"
    width="70%"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="formArea">
      <fieldset>
        <legend>基本信息</legend>
        <el-row>
          <el-col :span="8" class="rowunit">
            <span class="labelText">个人编号：</span>
            <span class="content">{{cardParams.personalNo}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">单位编号：</span>
            <span class="content">{{cardParams.unitNo}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">单位名称：</span>
            <span class="content">{{cardParams.unitName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="rowunit">
            <span class="labelText">姓名：</span>
            <span class="content">{{cardParams.name}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">性别：</span>
            <span class="content">{{cardParams.sex | genderFilter}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">出生日期：</span>
            <span class="content">{{cardParams.birthday}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="rowunit">
            <span class="labelText">IC卡卡号：</span>
            <span class="content">{{cardParams.icCard}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">身份证号：</span>
            <span class="content">{{cardParams.idCard}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">待遇类别：</span>
            <span class="content">{{cardParams.treatmentTypeName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="rowunit">
            <span class="labelText">账户余额：</span>
            <span class="content">{{cardParams.currentPersonalAccountBalance}}</span>
          </el-col>
          <el-col :span="8" class="rowunit">
            <span class="labelText">医疗类别：</span>
            <span class="content">{{diseaseType | hanldeMedicalType}}</span>
          </el-col>
        </el-row>
      </fieldset>
    </div>
    <div class="formArea">
      <fieldset>
        <legend>类别病种</legend>
        <el-col :span="2" class="leftRadio">
          <el-radio-group v-model="diseaseType">
            <el-radio :label="'13'">慢病</el-radio>
            <el-radio :label="'14'">大病</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="22">
          <el-table
            :data="tableList"
            border
            stripe
            ref="table"
            @select="handleSelect"
            @select-all="selectAll"
          >
            <el-table-column type="selection" prop></el-table-column>
            <el-table-column label="病种编号" prop="diseaseNo"></el-table-column>
            <el-table-column label="病种名称" prop="diseaseName" show-overflow-tooltip></el-table-column>
            <el-table-column label="信息提示" prop="diseaseInformation" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-col>
      </fieldset>
    </div>
    <div slot="footer" class="footer">
      <el-button size="small" type="primary" @click="handleConform">确认</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { medicalType } from '@/rcm/otmdiscomponent/config-js/jljh-regInfo-config.js'
export default {
  props: {
    specialDis: [Boolean],
    cardParams: {
      type: [Object],
      default: () => { }
    },
    tableData: {
      type: [Array],
      default: () => []
    },
  },
  data () {
    return {
      // 默认选中门诊慢病
      diseaseType: '13',
      selection: null
    }
  },
  computed: {
    v: {
      get () {
        return this.specialDis
      },
      set (newval) {
        this.$emit('update:specialDis', newval)
      }
    },
    tableList () {
      return this.tableData.filter(item => item.approvalType === this.diseaseType)
    }
  },
  methods: {
    handleConform () {
      if (!this.selection) {
        this.$messageTips(this, 'error', '请至少选择一项疾病')
        return false
      }
      this.$emit('confirm', this.diseaseType)
      this.v = false
    },
    cancel () {
      this.v = false
    },
    handleSelect (selection, row) {
      if (selection && selection.length >= 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, true)
        this.selection = row
      } else {
        this.selection = null
      }
    },
    selectAll (selection) {
      if (this.selection) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(this.selection, true)
      } else {
        this.$refs.table.clearSelection()
      }
      return false
    }
  },
  filters: {
    genderFilter (val) {
      return val === '1' ? '男' : '女'
    },
    hanldeMedicalType (val) {
      let result = medicalType.find(item => item.id === val)
      return result && result.name || '--'
    }
  }
}
</script>
<style scoped>
.formArea + .formArea {
  margin-top: 15px;
}
.rowunit {
  margin: 5px 0;
}
.labelText {
  text-align: right;
}
.leftRadio {
  margin-top: 10px;
}
.el-radio {
  margin-bottom: 10px;
}
</style>

