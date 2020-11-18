<template>
  <div>
	<el-table
		:data="data"
		style="width:100%"
    border>
		<el-table-column show-overflow-tooltip type="expand">
			<template slot-scope="scope">
				<el-table
          v-if="scope.row.batchList"
          ref="multipleTable"
          :data="scope.row.batchList"
          style="width: 100%"
          border
          label-position="left" inline class="demo-table-expand">
          <el-table-column show-overflow-tooltip
          	prop="lineNum"
            label="行号"
            width="60"
            type=index>
          </el-table-column>
          <el-table-column show-overflow-tooltip
          	prop="batchNum"
            label="批次">
          </el-table-column>
          <el-table-column show-overflow-tooltip
          	prop="sumStockNum"
            label="账面数量">
          </el-table-column>
          <el-table-column show-overflow-tooltip
          	prop="sumNum"
            label="实物数量">
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip
          	prop="unitName"
            label="单位">
          </el-table-column> -->
				</el-table>
			</template>
		</el-table-column>
		<el-table-column show-overflow-tooltip
	    prop="lineNum"
	    label="行号"
      width="60"
	    type=index>
	  </el-table-column>
	  <el-table-column show-overflow-tooltip
	    prop="name"
	    label="货位">
	  </el-table-column>
	  <el-table-column show-overflow-tooltip
  	prop="sumStockNum"
    label="账面数量">
  </el-table-column>
  <el-table-column show-overflow-tooltip
  	prop="sumNum"
    label="实物数量">
  </el-table-column>
  <!-- <el-table-column show-overflow-tooltip
		prop="unitName"
	  label="单位"> -->
  </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  // mixins: [list],
  props: ['data'],
  data () {
    return {
    }
  },
  methods: {
  },
  beforeCreate () {
  },
  created () {
  },
  watch: {
  }
}
</script>
