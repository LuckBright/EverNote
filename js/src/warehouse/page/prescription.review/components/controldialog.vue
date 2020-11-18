<!-- 操作记录弹窗 -->
<template>
  <div class="record-dialog">
    <el-dialog title="操作记录" :visible.sync="visibleDialog" class="ui_dialog_02" :modal-append-to-body="false">
      <el-table :data.sync="recordData">
        <el-table-column width="180" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作行为">
          <template slot-scope="scope">
            <span>{{scope.row.type === 1 ? '点评' : '编辑点评'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <el-row :gutter="2">
              <el-col :span="6" align="right">处方点评：</el-col>
              <el-col :span="18" align="left">{{scope.row.status === 1 ? '合理' : '不合理'}}</el-col>
            </el-row>
            <el-row :gutter="2" v-if="scope.row.content">
              <el-col :span="6" align="right">点评：</el-col>
              <el-col :span="18" align="left">{{scope.row.content}}</el-col>
            </el-row>
            <el-row :gutter="2" v-if="scope.row.classifyList">
              <el-col :span="6" align="right">不合理的原因：</el-col>
              <el-col :span="18" align="left">
                <p v-for="(item, index) in scope.row.classifyList" :key="index">
                  <span class="cGray">{{index + 1}}、</span>
                  {{item}}
                </p>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visibleDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { patch, SEARCH_CODE, SPEC_CODE, CONTROL_TYPE } from '@/util/common'
export default {
  props: ['recordData', 'visible'],
  data () {
    return {
      SEARCH_CODE,
      SPEC_CODE,
      CONTROL_TYPE
    }
  },
  computed: {
    visibleDialog: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  },
  methods: {
    ...patch
  }
}
</script>
<style lang="less" scoped>
</style>
