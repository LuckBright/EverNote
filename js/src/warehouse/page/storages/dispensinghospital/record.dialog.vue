<template>
  <el-dialog title="操作记录" :visible.sync="visibleDialog" class="ui_dialog_02 spe">
    <el-table :data.sync="tableData">
      <el-table-column label="操作时间" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.staffObject">{{scope.row.staffObject.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作行为">
        <template slot-scope="scope">
          <span>{{CONTROL_TYPE[scope.row.action]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <div v-if="scope.row.dispenseLogItemList && scope.row.dispenseLogItemList.length">
            <div v-for="(item, index) in scope.row.dispenseLogItemList" :key="index">
              <div>
                <span
                  v-if="scope.row.uddDispenseObject.code"
                >{{`药包编号：${scope.row.uddDispenseObject.code}`}}</span>
                <span v-if="item.localSettingObject">
                  <wh-code-to-name
                    :showIcon="false"
                    :patchObj="{
                      code: [SEARCH_CODE[1], SEARCH_CODE[0]],
                      list: item.localSettingObject.materialSkuObject.materialPropertys,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </span>
                <span v-if="item.localSettingObject">
                  <wh-code-to-name
                    :showIcon="false"
                    :patchObj="{
                      code: [SPEC_CODE],
                      list: item.localSettingObject.materialSkuObject.materialPropertys,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </span>
              </div>
              <div v-if="item.operationTxt">{{`异常原因：${item.operationTxt}`}}</div>
            </div>
          </div>
          <div v-else>
            <template>
              {{`药包编号：`}}
              <span>{{scope.row.uddDispenseObject.code}}</span>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { patch, SEARCH_CODE, SPEC_CODE, CONTROL_TYPE } from '@/util/common'
export default {
  props: ['tableData', 'value'],
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
        this.$emit('update:value', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  methods: {
    ...patch
  }
}
</script>
