<template>
  <el-dialog title="复制科室模版" :visible.sync="dialogVisible" class="ui_dialog_02">
    <el-table v-loading.body="loading" :data="tableData" border>
      <el-table-column label="模版名称">
        <template slot-scope="scope">
          <div class="p_tpl_name">
            <div class="t_name">
              <b>{{scope.row.name}}</b>
            </div>
            <!--<div class="t_drug_list" v-if="JSON.parse(scope.row.content).recipeItems && JSON.parse(scope.row.content).recipeItems.length">-->
            <!--<template v-for="item,index in JSON.parse(scope.row.content).recipeItems" v-if="tplType === '2'">-->
            <!--<span class="drug_item"><em>{{item.materialName}}</em><sup><sys-value type="THC_SYS_DECOCTINGMETHOD" :code="item.footnote"></sys-value></sup><template v-if="item.amount || item.amountUnitTxt">(</template>{{item.amount}}{{item.amountUnitName || item.amountUnitTxt}}<template v-if="item.amount || item.amountUnitTxt">)</template><template v-if="index < (JSON.parse(scope.row.content).recipeItems.length - 1)">；</template></span>-->
            <!--</template>-->
            <!--<template v-for="item,index in JSON.parse(scope.row.content).recipeItems" v-if="tplType === '3'">-->
            <!--<span class="drug_item"><em>{{item.materialName}}</em><template v-if="item.singleAmount || item.singleAmountUnitTxt">(</template>{{item.singleAmount}}{{item.singleAmountUnitTxt}}<template v-if="item.singleAmount || item.singleAmountUnitTxt">)</template><template v-if="index < (JSON.parse(scope.row.content).recipeItems.length - 1)">；</template></span>-->
            <!--</template>-->
            <!--</div>-->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" width="300">
        <template slot-scope="scope">{{scope.row.dptName}}</template>
      </el-table-column>
      <el-table-column prop label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native="copy(scope.row)">复制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import list from '@/util/list'
import storage from '@/util/storage'
import apidept from '@/sob/store/casecontentdeptapi'
export default {
  data () {
    return {
      dialogVisible: false,
      api: apidept,
      queryObj: {
        type: this.tplType,
        requestSwitch: true
      }
    }
  },
  props: ['tplType', 'belongType', 'pageType', 'visible', 'editPath', 'userId'],
  mixins: [list],
  methods: {
    copy (tpl) {
      if (tpl.content) {
        this.$router.push({
          name: 'prescipeTplEdit',
          query: { type: this.listName },
          params: {
            tplType: this.tplType,
            belong: this.belongType,
            page: 'form',
            id: '-1',
            tpl: tpl
          }
        })
        storage.setLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`, tpl.content)
      }
    },
    onDialogClose () {
      this.dialogVisible = false
    },
    onDialogOpen () {
      this.tableData = []
      this.dialogVisible = true
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (val) {
        this.list(true)
      }
    }
  }
}
</script>
