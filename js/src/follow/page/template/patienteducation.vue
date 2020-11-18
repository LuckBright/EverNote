<template>
  <div class="goods">
     <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :rules="rules"
      :label-width="'70px'"
      @submit.native.prevent
      ref="patientedc">
      <div slot="default"></div>
      <template slot="contentType">
        <el-radio v-model="obj.contentType" :label="1">短视频</el-radio>
      </template>
      <template slot="content">
        <el-form-item label="正文" class="ml70">
          <el-input class="wid220" v-model="searchValue" @change="searchMore(true)" placeholder="请通过搜索查询更多商品"></el-input>
          <el-table
            border
            style="width:660px;"
            :data="tableData"
            @row-click="rowclick">
              <el-table-column
                width="36"
                align="center">
                <template slot-scope="scope">
                  <el-radio :label="true" v-model="scope.row.isRadio">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="mark"
                label="标题"
                width="264">
              </el-table-column>
              <el-table-column
                prop="uploaderName"
                label="发布医生"
                width="359">
              </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="pagesizes"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </el-form-item>
      </template>
      <template slot="executeMethod">
        <el-radio v-model="obj.executeMethod" :label="2">微信</el-radio>  
      </template>
      <template slot="executeJson">
        <div style="width:660px;">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            :maxlength="120"
            :minlength="2"
            placeholder="请输入内容"
            v-model="obj.executeJson">
          </el-input>
        </div>
      </template>
    </ever-form2>
  </div>
</template>

<script>
import { requestIh } from '@/util/req'
import urlMap from '@/util/urls'
let schema = [
  {
    name: 'contentType',
    label: '类型',
    comp: 'custom'
  },
  {
    name: 'content',
    comp: 'custom'
  },
  {
    name: 'executeMethod',
    label: '发送通道',
    comp: 'custom'
  },
  {
    name: 'executeJson',
    comp: 'custom'
  }
]
export default {
  props: {
    packageId: {
      type: String,
      default: ''
    },
    detailId: {
      type: String,
      default: ''
    },
    nodeId: {
      type: String,
      default: ''
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.executeMethod = 2
    obj.contentType = 1
    obj.executeJson = ''
    obj.name = ''
    obj.category = 3
    obj.executeExtendJson = {}
    return {
      urlMap,
      obj,
      schema,
      searchValue: '',
      tableData: [],
      dialogVisible: false,
      totalCount: 0,
      current: 1,
      pagesize: 5,
      pagesizes: [5],
      rules: {
        contentType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        executeJson: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 2, max: 120, message: '请输入2-120个字符', trigger: 'blur' },
        ],
      }
    }
  },
  watch: {
    'obj.contentType': {
      handler (val) {
        this.searchValue = ''
        this.obj.executeJson = ''
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    open () {
      this.resetForm()
      if (this.detailId) this.getById()
      this.dialogVisible = true
    },
    resetForm () {
      this.obj.id = ''
      this.obj.executeJson = ''
      this.searchValue = ''
      this.obj.contentType = 1
      this.obj.content = ''
      this.obj.executeExtendJson = {}
      this.searchMore()
    },
    save () {
      let flag = false
      this.obj.parentId = this.nodeId
      this.$refs.patientedc.$refs.form.validate(valid => {
        if (!valid) {
          this.$messageTips(this, 'warning', '请填写正确的内容')
          flag = false
        } else {
          flag = true
        }
      })
      return flag
    },
    searchMore (val = false) {
      this.current = val ? 0 : this.current
      this.list()
    },
    list () {
      let params = {
        keyword: this.searchValue,
        status: 1,
        currentPage: this.current,
        pagesize: this.pagesize
      }
      requestIh(urlMap.titan.video.query, params).then(rs => {
        if (rs.errCode === 0) {
          this.tableData = rs.data.resultList && rs.data.resultList.map(v => ({
            ...v, isRadio: false
          }))
          this.totalCount = rs.data.totalCount
        }
      })
    },
    rowclick (row, column, event) {
      this.tableData = this.tableData.filter(item => {
        item.isRadio = item.id === row.id
        return item
      })
      this.obj.executeJson = row.mark
      this.obj.name = row.mark
      this.obj.executeExtendJson = JSON.stringify(row)
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.current = val
      this.searchMore()
    }
  }
}
</script>
<style lang="scss" scoped>
.wid220{width: 220px;}
.goods /deep/ .el-table th {
    color: #000;
    background-color: #F0F5FA;
}
.ml70{margin-left: -70px;}
.w470{width:470px;}
.wid40{width: 60px;}
</style>
