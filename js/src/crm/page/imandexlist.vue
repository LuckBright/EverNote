<template>
  <div>
    <ever-bread-crumb name="导入导出记录" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
  <el-card>
    <el-row>
      <el-col :span="24">
        <el-table
          v-if="visible"
          :data="tableData"
          border
          class="el-td-border"
          highlight-current-row>
          <el-table-column
            label="操作人"
            :span="3"
            align="center">
            <template slot-scope="scope">
              {{scope.row.creator || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作类型"
            align="center"
            :span="3">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">导入</span>
              <span v-else>导出</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作时间"
            align="center"
            :span="3">
            <template slot-scope="scope">
              {{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作结果"
            align="center"
            :span="6">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">导入数据{{JSON.parse(scope.row.content).totalNum}}条,上传数据{{JSON.parse(scope.row.content).successNum}}条, 补充数据{{JSON.parse(scope.row.content).appendNum}}条,失败数据{{JSON.parse(scope.row.content).errorNum}}条</span>
              <span v-else>导出数据{{JSON.parse(scope.row.content).totalNum}}条</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="download(scope.row.fileUrl)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current">
        </ever-pagination>
      </el-col>
    </el-row>
  </el-card>
  </div>
</template>
<script>
  import api from '../store/memberapi'
  import utillist from '../../util/list'
  export default {
    mixins: [utillist],
    data () {
      return {
        api: api,
        visible: true,
        listApiName: 'memberRecord'
      }
    },
    methods: {
      download (file) {
        if (file) {
          window.open(`${this.$ever.fileUrl2}${file}`, '_blank')
        }
      }
    }
  }
</script>

