<template>
  <div class="hospital-container">
    <div class="hospital-layout inner">
      <el-table ref="configTable" :data="configData" border :stripe="false" style="width: 100%">
        <el-table-column property="name" label="设置"></el-table-column>
        <el-table-column property="value" label="值">
          <template slot-scope="scope">
            <el-select
              @change="change(scope.row.id)"
              v-model="configObj[scope.row.id]"
              placeholder="请选择"
            >
              <el-option
                v-for="item in scope.row.type == 1 ? yesno : barcode"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import { yesno, barcode } from '@/util/common'
import dispenseSettingApi from '@/warehouse/page/storages/store/dispensesettingapi'
import { _findIndex } from '@/util/formcustom'
export default {
  mixins: [sendDrug],
  data () {
    return {
      barcode,
      yesno
    }
  },
  methods: {
    change (val) {
      dispenseSettingApi.updateDispenseSetting({
        id: this.configData[_findIndex(this.configData, val)].oldId,
        value: this.configObj[val]
      }).then(res => {
        // this.$store.dispatch('getStorageConfig') 发药改版后， 此处应该不需要了
      })
    }
  }
}
</script>
