<template>
  <div>
    <ever-bread-crumb name="病历模版" path="/warehouse/casecontents"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body spe">
        <div class="ever_menu_nav">
          <el-tabs v-model="listName" @tab-click="handleClick">
            <el-tab-pane label="个人模版" name="person"></el-tab-pane>
            <el-tab-pane
              label="科室模版"
              name="dept"
              v-if="$hasPermission('Auth_menu_clinic_medicalset_casecontent_dpt')"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="main-wrap">
          <div class="main-head">
            <el-row class="c">
              <el-col :span="24">
                <ever-query-form :schema="schema" v-model="queryObj" @query="query"></ever-query-form>
              </el-col>
            </el-row>
            <!-- <el-form :inline="true" style="display:inline-block">
              <el-form-item style="margin-bottom: 0">
                <el-input placeholder="请输入模版名称" v-model="queryObj.name" @keyup.enter.native="query(queryObj)">
                  <el-button slot="append" icon="icon iconfont icon-chaxun" @click="query(queryObj)"></el-button>
                </el-input>
              </el-form-item>
            </el-form>-->
          </div>
          <div class="main-option alg_r">
            <el-button
              type="default"
              @click="dialogVisible=true"
              v-if="listName === 'person'"
            >复制科室模版</el-button>
            <router-link :to="'/warehouse/casecontents/-1?type='+listName">
              <el-button type="primary">新建</el-button>
            </router-link>
          </div>
          <el-dialog title="复制模版" :visible.sync="dialogVisible" class="ui_dialog_02">
            <el-table :data="providerTpls" border>
              <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip label="所属科室">
                <template slot-scope="scope">{{scope.row.dptName}}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="toEdit('-1', scope.row)">复制</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-table v-loading.body="loading" :data="tableData" border>
            <el-table-column show-overflow-tooltip label="名称">
              <template slot-scope="scope">
                <a href="javascript:void(0)" @click="toEdit(scope.row.id)">{{scope.row.name}}</a>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="所属科室">
              <template slot-scope="scope">{{scope.row.dptName}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="toEdit(scope.row.id)">编辑</el-button>
                <ever-confirm
                  :msg="'确定删除 '+scope.row.name+' ？'"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/casecontentapi'
import apidept from '../store/casecontentdeptapi'
import list from '@/util/list'
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

    return {
      listName: this.$route.query.type || 'person',
      schema,
      queryObj: Object.assign(queryObj, {
        type: [1]
      }),
      dialogVisible: false,
      providerTpls: []
    }
  },
  mixins: [list],
  methods: {
    handleClick (comp) {
      this.$router.push({
        path: this.$route.path,
        query: { type: comp.name }
      })
    },
    toEdit: function (id, content) {
      this.$router.push({
        name: 'casedetail',
        query: { type: this.listName },
        params: { content, id }
      })
    }
  },
  computed: {
    api () {
      return this.listName === 'person' ? api : apidept
    }
  },
  watch: {
    '$route.query.type': function () {
      this.list(true)
    },
    'dialogVisible': function (newVal) {
      if (newVal) {
        apidept.list({ type: 1 }).then(results => {
          this.providerTpls = (results && results.resultList) ? results.resultList : []
        })
      }
    }
  }
}
</script>

<style scoped>
.c {
  padding: 10px 0;
}
</style>
