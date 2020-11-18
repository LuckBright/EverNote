<template>
  <div class="flex_column_full_hidden">
    <div class="layout_inner flex_column_full_hidden" style="overflow-y: auto">
      <ever-form2
        v-if="!isShowQuery"
        :schema="schema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        @query="query(queryObj)"
      >
        <template slot="classifyId">
          <ever-select
            v-model="queryObj.type1"
            filterable
            placeholder="一级分类"
            :clearable="true"
            :options="options1"
            class="queryClass"
          ></ever-select>
          <ever-select
            v-if="queryObj.type1 && options2.length"
            filterable
            v-model="queryObj.type2"
            placeholder="二级分类"
            :clearable="true"
            :options="options2"
            class="queryClass"
          ></ever-select>
          <ever-select
            v-if="queryObj.type2 && options3.length"
            filterable
            v-model="queryObj.type3"
            placeholder="三级分类"
            :clearable="true"
            :options="options3"
            class="queryClass"
          ></ever-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="default" @click="query(queryObj)">
              <i class="el-icon-search"></i>查询
            </el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <div class="things-header pos_re">
        <el-checkbox
          v-model="checkall"
          :disabled="disabledCheck"
          class="pos_ab check_all"
          style="position: absolute; top: 10px; left: 25px;"
          @change="handleSelected"
        >全选</el-checkbox>
        <ul>
          <li>{{customType + '类型'}}</li>
          <li>模版名称</li>
          <li></li>
        </ul>
      </div>
      <templet-tree
        :tableData="tableData"
        :systemType="systemType"
        @handleHistory="handleHistory"
        :checkbox="true"
        :set-all="checkall"
        :defaultChecked="defaultChecked"
        @checkChange="handleCheckChange"
        :customPathsee="customPathsee"
        :btnselectall="btnSelectAll"
        :customPathList="customPathList"
      ></templet-tree>
      <el-button
        :disabled="!ids ? true : false"
        type="primary"
        class="mt20"
        style="width: 140px"
        @click="handleCreateTemplet"
      >引用至本地</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/groupmaterial/store/templetapi'
import classify from '@/warehouse/util/classify'
import templetTree from '@/warehouse/page/components/templettree'
let schema = [
  {
    name: 'classifyId',
    label: '',
    comp: 'custom'
  }
]
export default {
  // isShowQuery   是否展示查询  默认展示 --（传入数据为真不展示）
  props: ['systemType', 'backListRoute', 'customType', 'customPathsee', 'customPathList', 'isShowQuery'],
  mixins: [classify],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.type1 = ''
    queryObj.type2 = ''
    queryObj.type3 = ''
    queryObj.systemType = this.systemType
    return {
      api,
      queryObj,
      schema,
      loading: false,
      tableData: [],
      defaultChecked: [],
      ids: '',
      deleteId: '',
      checkall: false,
      inUseDialog: false,
      notUseDialog: false,
      btnSelectAll: false,
      disabledCheck: false
    }
  },
  created () {
    this.getTempletList()
    this.$ever.getFieldFromSchema(this.schema, 'classifyId').label = `${this.customType + '类型'}`
  },
  methods: {
    handleSelected () {
      this.btnSelectAll = true
    },
    handleCheckChange (arr) {
      let ids = []
      arr.forEach(item => {
        if (!item.classifyList && item.relevance !== 5) {
          item.templetDictObject && item.templetDictObject.id && ids.push(item.templetDictObject.id)
        }
      })
      let arrAll = this._isSelectAll(arr)
      this.ids = ids.join(',')
      this.checkall = arrAll.length === this.tableData.length
    },
    handleCreateTemplet () {
      this.api.create({ ids: this.ids, systemType: this.systemType }).then(result => {
        if (typeof result === 'object') {
          this.$messageTips(this, 'success', '创建模版成功')
          this.$router.push(this.backListRoute)
        }
      })
    },
    query (queryObject) {
      this.queryObj = queryObject
      this.getTempletList()
    },
    handleHistory ({ store, data }) {
      // let correspondId = data.id
      // let params = {
      //   correspondId,
      //   objectName: 'TempletDict'
      // }
      // modifyRecordApi.list(params).then(result => {
      //   this.$refs.history.open(result)
      // })
    },
    getTempletList () {
      this.loading = true
      this.queryObj.id = this.queryObj.classifyId
      this.api.listblock(this.queryObj).then(result => {
        if (result && result.length) {
          this._recursion(result, 'classifyList')
          this.tableData = []
          this.tableData = result
        }
        this.loading = false
      })
    },
    _recursion (data, name) {
      // this.defaultChecked = []
      data.forEach(item => {
        if (item[name]) {
          this._recursion(item[name], name)
        }
        if (item.relevance === 5) {
          this.defaultChecked.push(item.id)
          item.disabled = true
        }
      })
    },
    _isSelectAll (data) {
      if (data.length) {
        let arrAll = []
        data.forEach(item => {
          if (!item.parentId) arrAll.push(item)
        })
        this.btnSelectAll = false
        return arrAll
      }
      return []
    }
  },
  watch: {
    'queryObj': {
      handler: function (val) {
        this.query(this.queryObj)
      },
      deep: true
    },
    // 'queryObj.classifyId' (val) {
    //   this.query(this.queryObj)
    // },
    'defaultChecked' (arr) {
      this.checkall = arr.length === this.tableData.length
      this.disabledCheck = arr.length === this.tableData.length
    }
  },
  components: {
    templetTree
  }
}
</script>
<style lang="scss" scoped>
.check_all {
  left: 25px;
  top: 10px;
}
</style>

