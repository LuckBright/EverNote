<template>
  <div>
    <el-row>
      <el-col :span="12">
        <ever-query-form :schema="schema" v-model="queryObj" @query="query"></ever-query-form>
      </el-col>
      <el-col :span="12" class="alg_r">
        <el-button v-if="belongType === '1'" @click="pTplShow">复制科室模版</el-button>
        <el-button type="primary" @click="create">新建</el-button>
      </el-col>
    </el-row>
    <el-table v-loading.body="loading" :data="tableData" border>
      <el-table-column label="模版名称">
        <template slot-scope="scope">
          <div class="p_tpl_name">
            <div class="t_name">
              <b>
                {{scope.row.name}}
                <template v-if="tplType === '2' && scope.row.content">
                  <template v-if="JSON.parse(scope.row.content).drugType === 303">（中药饮片）</template>
                  <template v-if="JSON.parse(scope.row.content).drugType === 304">（中药颗粒）</template>
                </template>
              </b>
            </div>
            <div
              class="t_drug_list"
              v-if="JSON.parse(scope.row.content).recipeItems && JSON.parse(scope.row.content).recipeItems.length"
            >
              <template
                v-for="item,index in JSON.parse(scope.row.content).recipeItems"
                v-if="tplType === '2'"
              >
                <span class="drug_item">
                  <em>{{item.materialName}}</em>
                  <sup>
                    <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="item.decoction"></sys-value>
                  </sup>
                  <template v-if="item.amount || item.amountUnitTxt">(</template>
                  {{item.amount}}{{item.amountUnitName || item.amountUnitTxt}}
                  <template
                    v-if="item.amount || item.amountUnitTxt"
                  >)</template>
                  <template v-if="index < (JSON.parse(scope.row.content).recipeItems.length - 1)">；</template>
                </span>
              </template>
              <template
                v-for="item,index in JSON.parse(scope.row.content).recipeItems"
                v-if="tplType === '3'"
              >
                <span class="drug_item">
                  <em>{{item.materialName}}</em>
                  <template v-if="item.singleAmount || item.singleAmountUnitTxt">(</template>
                  {{item.totalAmount}}{{item.totalAmountUnitTxt}}
                  <template
                    v-if="item.singleAmount || item.singleAmountUnitTxt"
                  >)</template>
                  <template v-if="index < (JSON.parse(scope.row.content).recipeItems.length - 1)">；</template>
                </span>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" width="300">
        <template slot-scope="scope">{{scope.row.dptName}}</template>
      </el-table-column>
      <el-table-column prop label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native="edit(scope.row.id)">编辑</el-button>
          <ever-confirm
            :msg="'确定删除 '+scope.row.name+' ？'"
            action="删除"
            @confirm="del(scope.row.id, scope.row)"
          ></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
    <tpl-dialog
      ref="ptplDialog"
      :tpl-type="tplType"
      :belong-type="belongType"
      :page-type="pageType"
      :edit-path="editPath"
      :user-id="userId"
    ></tpl-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/sob/store/casecontentapi'
import apidept from '@/sob/store/casecontentdeptapi'
import tplDialog from './tpl.dialog'

export default {
  data () {
    let schema = [
      {
        name: 'name',
        placeholder: '请输入模版名称',
        type: 'text',
        options: []
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.type = this.tplType
    return {
      schema,
      queryObj,
      editPath: `/warehouse/prescription/template/${this.tplType}/${this.belongType}/form/`
    }
  },
  props: ['tplType', 'belongType', 'pageType', 'userId'],
  mixins: [list],
  components: {
    tplDialog
  },
  computed: {
    api () {
      this.queryObj.type = this.tplType
      return this.belongType === '1' ? api : apidept
    }
  },
  methods: {
    async del (id) {
      if (id) {
        const res = await this.api.del(id)
        if (res && res.head && res.head.errCode === 0) {
          this.list(true)
        } else {
          this.$messageTips(this, 'warning', '删除失败')
        }
      }
    },
    edit (id) {
      this.$router.push(`${this.editPath}${id}`)
    },
    create () {
      this.$router.push(`${this.editPath}-1`)
    },
    pTplShow () {
      this.$refs.ptplDialog.onDialogOpen()
    }
  },
  watch: {
    'tplType' (val) {
      this.queryObj.type = val
      this.editPath = `/warehouse/prescription/template/${val}/${this.belongType}/form/`
      this.list(true)
    },
    'belongType' (val) {
      this.editPath = `/warehouse/prescription/template/${this.tplType}/${val}/form/`
      this.list(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.p_tpl_name {
  padding: 0 8px 10px;
  .t_name {
    height: 35px;
    line-height: 35px;
  }
  .t_drug_list {
    .drug_item {
      white-space: nowrap;
      line-height: 25px;
      em {
        font-style: normal;
      }
      sup {
        font-size: 12px;
      }
    }
  }
}
</style>
