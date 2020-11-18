<!-- 操作记录弹窗 -->
<template>
  <div class="record-dialog">
    <el-dialog
      v-loading="loading"
      title="操作记录"
      :visible.sync="visibleDialog"
      :modal-append-to-body="false"
      class="ui_dialog_02"
    >
      <el-table :data.sync="recordData" height="450">
        <el-table-column width="180" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.dispenseLog.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.dispenseLog.operationBy}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作行为">
          <template slot-scope="scope">
            <span>{{CONTROL_TYPE[scope.row.dispenseLog.action]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <div
              v-if="scope.row.dispenseLog.action === '6' || scope.row.dispenseLog.action === '7'"
            >
              <div v-for="(item, index) in scope.row.dispenseLogListItemJson" :key="index">
                <div>
                  <span v-if="item.outpatientDispense.adviceExecuteId">{{`执行单：${item.outpatientDispense.adviceExecuteId}`}}</span>
                  <span v-else-if="item.outpatientDispense.recipeCode">{{`处方单：${item.outpatientDispense.recipeCode}`}}</span>
                  <wh-code-to-name
                    v-if="item.LocalSetting"
                    :showIcon="false"
                    :patchObj="{
                      code: MATERILA_CODE,
                      list: item.LocalSetting.materialSkuObject.materialPropertys,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </div>
                <div v-if="item.dispenseLogItem && item.dispenseLogItem.operationTxt">
                  <strong>异常原因：</strong>
                  <div v-html="item.dispenseLogItem.operationTxt"></div>
                </div>
              </div>
            </div>
            <div
              v-else-if="scope.row.dispenseLog.action !== '6' && scope.row.dispenseLog.action !== '7'"
            >
              <template v-if="scope.row['_excute'].length">
                执行单：<span
                  v-for="(item, index) in scope.row['_excute']"
                  :key="index"
                >{{`${item}${index === scope.row['_excute'].length - 1 ? '' : '、'}`}}</span>
              </template>
              <template v-if="scope.row['_recipe'].length">
                处方单：<span
                  v-for="(item, index) in scope.row['_recipe']"
                  :key="index"
                >{{`${item}${index === scope.row['_recipe'].length - 1 ? '' : '、'}`}}</span>
              </template>
            </div>
            <div
              v-if="scope.row.dispenseLog.action === '17'"
            >
              <template>
                <span v-for="(item, index) in scope.row.dispenseLogListItemJson" :key="index">
                  <span v-html="item.dispenseLogItem.operationTxt"></span>
                </span>
              </template>
            </div>
            <div v-if="scope.row.dispenseLog.action === '16'">
              <span>{{scope.row.dispenseLogListItemJson[0].dispenseLogItem.operationTxt}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { patch, MATERILA_CODE, CONTROL_TYPE } from '@/util/common'
export default {
  props: ['recordData', 'visible', 'loading'],
  data () {
    return {
      MATERILA_CODE,
      CONTROL_TYPE
    }
  },
  created () {
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
