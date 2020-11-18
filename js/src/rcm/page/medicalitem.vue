<template>
  <div>
  	<el-table
      :data="medicalitemarr"
      style="width: 100%"
      class="medicalitemtable"
      :show-header="false">
      <el-table-column
        prop="name"
        label="处方"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fee"
        label="费用"
        align="center">
      </el-table-column>
    </el-table>
    <div style="width: 100%; height: 80px;"></div>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ['medicalitemarr'],
    data () {
      return {
        tableData: []
      }
    },
    components: {
    },
    computed: {
      v: {
        get () {
          return this.medicalsettlevisable
        },
        set (val) {
          this.$emit('update:medicalsettlevisable', val)
        }
      }
    }
  }
</script>
<style scoped>
  .medicalitemtable /deep/ tr td:first-child { border-right: 1px solid #eee; background: #f8f8f8; }
  .medicalitemtable /deep/ td { border-top: 1px solid #eee; }
</style>
