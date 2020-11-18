<template>
  <div>
    <div class="layout_inner phrtpllist">
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="queryObj.businessType">
            <el-radio-button :label="1">机构模版</el-radio-button>
            <el-radio-button :label="3">科室模版</el-radio-button>
            <el-radio-button :label="2">个人模版</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <router-link style="float:right;margin-right: 10px" to="phrtpllist/2/-1">新增个人模版</router-link>
          <router-link style="float:right;margin-right: 10px" to="phrtpllist/3/-1">新增科室模版</router-link>
          <router-link style="float:right;margin-right: 10px" to="phrtpllist/1/-1">新增机构模版</router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <ever-form2
            :schema="schema"
            v-model="obj"
            :is-query="true"
            :inline="true"
            label-position="right"
            @query="search"
          >
            <template slot="daterange">
              <ever-range-picker
                :start.sync="obj.startTime"
                :end.sync="obj.endTime"
                :outformat="'YYYY-MM-DD 00:00:00'"
              ></ever-range-picker>
            </template>
            <template slot="providerSelect">
              <provider-select v-model="obj.dptId" clearable="clearable"></provider-select>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <el-table v-loading.body="loading" :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="模版名称">
          <template slot-scope="scope">{{scope.row&&scope.row.formDataName}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="对应文书">
          <template slot-scope="scope">{{scope.row.medicalName}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="科室" v-if="queryObj.businessType==3">
          <template slot-scope="scope">{{scope.row.dptName}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建人">
          <template slot-scope="scope">{{scope.row.creatorName}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建日期">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="jumpPage(scope.row)" size="small">编辑</el-button>
            <ever-confirm :msg="'确定删除 ？'" action="删除" @confirm="del(scope.row.id)"></ever-confirm>
            <el-button type="primary" size="small" @click="check(scope.row)">查看分类</el-button>
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
    <el-dialog :visible.sync="miniDialog" size="tiny" custom-class="ui_dialog_01 w_01">
      <div style="height:160px;padding:20px; overflow-x:hidden;">
        <el-tree :data="treeData" default-expand-all></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="spe" @click="miniDialog=false">取消</el-button> -->
        <el-button type="primary" @click="miniDialog=false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '../store/phrapi'
import tplapi from '../store/phrtplapi'
import storage from '@/util/storage'
let schema = [
  {
    name: 'daterange',
    label: '创建日期',
    comp: 'custom'
  },
  {
    name: 'creator',
    label: '创建人',
    comp: 'ever-staff-select',
    props: {
      clearable: true,
      placeholder: '请输入创建人姓名',
      params: {
        everQueryType: 'out',
      }
    },
  },
  {
    name: 'formDataName',
    label: '模版名称'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      miniDialog: false,
      treeData: [],
      queryObj: {
        'businessType': 2
      },
      schema,
      obj,
      api,
      listApiName: 'getTplDatas'
    }
  },
  methods: {
    jumpPage (row) {
      this.$router.push(`phrtpllist/${this.queryObj.businessType}/${row.formDataId}`)
      storage.setLocalStorage('tplData', JSON.stringify(row))
    },
    del (id) {
      api.delTplDataById(id).then(_ => {
        this.list(true)
      })
    },
    search () {
      Object.assign(this.queryObj, this.obj)
      delete this.queryObj.daterange
      this.list(true)
    },
    check (data) {
      tplapi.getTreeById({ id: data.id }).then(res => {
        this.miniDialog = true
        this.treeData = res
      })
    },
    emptyQuery (val) {
      this.queryObj.startTime = ''
      this.queryObj.endTime = ''
      this.queryObj.creator = ''
      this.queryObj.dptId = ''
      this.queryObj.formDataName = ''
    }
  },
  watch: {
    'queryObj.businessType' (val) {
      this.emptyQuery()
      if (val === 3) {
        let item = {
          name: 'providerSelect',
          label: '科室',
          comp: 'custom'
        }
        this.schema[3] = item
      } else {
        this.schema.length = 3
      }
      this.list(true)
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
}
.ever_date_picker /deep/ .el-date-editor--daterange {
  width: 300px !important;
}
</style>

