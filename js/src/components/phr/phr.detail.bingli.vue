<template>
    <div class="phr_detail_bingli">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        <el-dialog title="病历信息" :visible.sync="dialogVisible" width="50%">
          <medical-record :formObj="formObj" :key="formObj.id"></medical-record>
        </el-dialog>   
    </div>
</template>
<script>
import medicalRecord from './medical.record'
import medicalRecordApi from '@/workspace/store/phrmedicalrecord'
export default {
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      formObj: {},
      treeData: [],
      dialogVisible: false,
      defaultProps: {
        children: 'childs',
        label: 'name'
      }
    }
  },
  created () {
    medicalRecordApi.medicalRecordTree({
      patientId: this.params.patientId,
      visitInpatientSerialNumber: this.params.visitSerialNumber, // item.visitNumber,
      tenantId: this.params.tenantId
    }).then(res => {
      this.treeData = res
    })
  },
  components: {
    medicalRecord
  },
  methods: {
    handleNodeClick (data) {
      if (data.type === 3) {
        this.dialogVisible = true
        this.formObj = data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.phr_detail_bingli{
  margin-top: 10px;
  padding: 10px;
  border:1px solid #DADCE0;
}
.phr_detail_bingli /deep/.el-tree-node__label:hover{
  color: #1c7bef;
}
</style>

