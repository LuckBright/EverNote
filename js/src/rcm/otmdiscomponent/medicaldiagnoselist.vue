<template>
  <el-dialog
    title="医保诊断对照"
    :visible.sync="v"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-table :data="tableData" border stripe>
      <el-table-column label="临床诊断" prop align="center">
        <el-table-column label="类别" prop="hospitalType"></el-table-column>
        <el-table-column label="诊断" prop="hospitalDiagnose"></el-table-column>
        <el-table-column label="编码" prop="hospitalCode"></el-table-column>
      </el-table-column>
      <el-table-column label="医保诊断" prop align="center">
        <el-table-column label="类别" prop="medicalType">
          <template slot-scope="scope">
            <medicaldiagnosetype v-model="scope.row.medicalType"></medicaldiagnosetype>
          </template>
        </el-table-column>
        <el-table-column label="诊断" prop="medicalDiagnose">
          <template slot-scope="scope">
            <medicalDiagnose v-model="scope.row.medicalDiagnose"></medicalDiagnose>
          </template>
        </el-table-column>
        <el-table-column label="编码" prop="medicalCode">
          <template slot-scope="scope">{{scope.row.medicalDiagnose.id}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="addNewRow">
              <i class="iconfont icon-tianjia"></i>
            </el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.$index)">
              <i class="iconfont icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="buttons">
      <el-button type="primary" size="small" @click="sure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import medicaldiagnosetype from '@/rcm/otmdiscomponent/medicaldiagnosetype.vue'
import medicalDiagnose from '@/rcm/otmdiscomponent/medicaldiagnose.vue'
export default {
  props: {
    visible: {
      type: [Boolean],
      default: false
    }
  },
  data () {
    return {
      tableData: [{
        hospitalType: '123',
        hospitalDiagnose: '拉肚子',
        hospitalCode: '123code',
        medicalType: '0',
        medicalDiagnose: '医保拉肚子',
        medicalCode: '456code'
      }],
      emptyRow: {
        medicalType: '0',
        medicalDiagnose: '',
        medicalCode: ''
      }
    }
  },
  methods: {
    addNewRow () {
      this.tableData.push(JSON.parse(JSON.stringify(this.emptyRow)))
    },
    deleteRow (index) {
      let selectedData = this.tableData[index]
      if (!selectedData.hospitalType) {
        this.tableData.splice(index, 1)
      } else {
        // 相当于把右侧内容清空
        Object.assign(selectedData, this.emptyRow)
      }
    },
    sure () {
      this.$emit('update:visible', false)
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  components: {
    medicaldiagnosetype,
    medicalDiagnose
  }
}
</script>
<style scoped>
.buttons {
  text-align: right;
}
</style>
