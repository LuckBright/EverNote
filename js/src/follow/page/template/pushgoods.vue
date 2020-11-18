<template>
  <div class="goods">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :rules="rules"
      :label-width="'70px'"
      @submit.native.prevent
      ref="pushgoods">
      <div slot="default"></div>
      <template slot="contentType">
          <el-radio v-if="$route.name === 'personaltplDetail'" v-model="obj.contentType" :label="5">挂号</el-radio>
          <el-radio v-model="obj.contentType" :label="3">商城商品</el-radio>
          <!-- <el-radio v-model="obj.contentType" :label="4">保障计划</el-radio> -->
      </template>
      <template slot="register" v-if="obj.contentType === 5 && $route.name === 'personaltplDetail'">
        <el-form-item label="名称" class="ml70 w470">
          <div>【挂号推荐】{{displayName}}</div>
        </el-form-item>
        <el-form-item label="内容" class="ml70 w470">
          <ever-org-select ref="eos" v-model="obj.orgObj" type="select" class="" @change="changeOrg" placeholder="请选择挂号机构"></ever-org-select>
          <ever-subject-select v-model="obj.deptObj" :params="params" type="select"  :disabled="disabledsubject" placeholder="请选择挂号科室"></ever-subject-select>
          <el-select
            class="w400"
            v-model="obj.serviceObj"
            popper-class="follow-select-down"
            placeholder="请选择服务类型"
            filterable
            clearable
            :disabled="disabledsubject"
            value-key="serviceId"
          >
            <el-option
              v-for="item in serviceList"
              :key="item.serviceId"
              :label="item.serviceName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="content" v-if="obj.contentType !== 5">
        <el-form-item label="内容" class="ml70">
          <el-input class="wid220" v-model="searchValue" @change="searchMore(true)" placeholder="请输入商品名称搜索商品"></el-input>
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
                prop="name"
                label="名称"
                width="175">
              </el-table-column>
              <el-table-column
                v-if="obj.contentType === 4"
                label="描述"
                width="358">
                <template slot-scope="scope">
                  {{obj.contentType === 3 ? scope.row.description : scope.row.instructions}}
                </template>
              </el-table-column>
              <el-table-column
                label="价格"
                :width="obj.contentType === 4 ? 90 : 448">
                <template slot-scope="scope">
                  {{obj.contentType === 3 ? scope.row.price/100 : scope.row.totalPriceDiss}}
                </template>
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
        <!-- <el-radio v-if="obj.contentType === 3" v-model="obj.executeMethod" :label="'1'">短信</el-radio> -->
        <el-radio v-model="obj.executeMethod" :label="2">微信</el-radio>  
      </template>
      <template slot="executeJson">
        <div style="width:660px;" v-if="obj.contentType !== 5">
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
import { request, requestIh } from '@/util/req'
import urlMap from '@/util/urls'
import api from '@/crm/store/packageapi.js'
// import taskSetting from '@/follow/components/task-setting.vue'
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
    name: 'register',
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
  components: {
    // taskSetting
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.category = 5 // 任务类型
    obj.executeMethod = 2 // 提醒方式
    obj.contentType = 3
    obj.executeJson = ''
    obj.executeExtendJson = {}
    obj.name = ''
    obj.orgObj = {}
    obj.deptObj = {}
    obj.serviceObj = {}
    return {
      urlMap,
      request,
      obj,
      schema,
      searchValue: '',
      tableData: [],
      serviceList: [],
      dialogVisible: false,
      totalCount: 0,
      current: 0,
      pagesize: 5,
      pagesizes: [5],
      shopToken: '',
      disabledsubject: false,
      displayName: this.$store.state.currentUser.displayName,
      params: {},
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
    'obj.orgObj': {
      handler (val) {
        if (!val || !val.id) {
          this.serviceList = []
          this.disabledsubject = false
        }
      },
      deep: true
    },
    'obj.contentType': {
      handler (val) {
        this.searchValue = ''
        this.obj.title = ''
        this.current = 0
        if (val === 4) {
          this.searchAvailable()
          this.obj.name = ''
        } else if (val === 3) {
          this.list()
          this.obj.name = ''
        } else if (val === 5) {
          this.obj.name = `${this.displayName}`
        }
        if (this.$refs.pushgoods) {
          this.$refs.pushgoods.rules.executeJson[0].required = val !== 5
        }
        this.obj.executeJson = ''
      },
      deep: true,
      immediate: true
    }
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
      this.obj.contentType = 3
      this.obj.content = ''
      this.searchMore()
    },
    save () {
      let flag = false
      if (this.obj.contentType === 5) {
        let params = {
          name: ``,
          orgId: this.obj.orgObj.id,
          orgName: this.obj.orgObj.name,
          tenantDeptId: this.obj.deptObj.id,
          tenantDeptName: this.obj.deptObj.orgSubjectName,
          serviceId: this.obj.serviceObj.serviceId,
          serviceName: this.obj.serviceObj.serviceName,
          doctorId: this.$store.state.currentUser.userId,
          doctorName: this.displayName
        }
        this.obj.executeExtendJson = JSON.stringify(params)
      }
      this.obj.parentId = this.nodeId
      if (JSON.stringify(this.obj.executeExtendJson) === '{}') {
        this.$messageTips(this, 'warning', this.obj.contentType === 3 ? '请选择商品内容' : '请选择保障计划')
        return false
      }
      this.$refs.pushgoods.$refs.form.validate(valid => {
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
      this.obj.contentType === 3 ? this.list() : this.searchAvailable()
    },
    list () {
      let params = {
        name: this.searchValue,
        currentPage: this.current,
        pagesize: this.pagesize,
        searchType: 1
      }
      requestIh(urlMap.mall.spu.list, params).then(rs => {
        if (rs.errCode === 0) {
          this.tableData = rs.data.resultList && rs.data.resultList.map(v => ({
            ...v, isRadio: false
          }))
          this.totalCount = rs.data.totalCount
          this.shopToken = rs.data.shopToken
        }
      })
    },
    searchAvailable () {
      api.searchAvailable({
        categoryId: '06',
        offset: this.current,
        pagesize: this.pagesize,
        name: this.searchValue,
        origId: this.$route.name === 'tplDetail' ? '-2' : ''
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList || []
          this.totalCount = rs.data.totalCount
        }
      })
    },
    rowclick (row, column, event) {
      this.tableData = this.tableData.filter(item => {
        item.isRadio = item.id === row.id
        item.shopToken = this.shopToken
        return item
      })
      if (this.obj.contentType === 4) {
        this.obj.name = row.name
        this.obj.executeJson = row.name + row.instructions
        let tempObj = {
          id: row.id
        }
        this.obj.executeExtendJson = JSON.stringify(tempObj)
      } else {
        this.obj.executeJson = row.name
        this.obj.name = row.name
        this.obj.executeExtendJson = JSON.stringify(row)
      }
    },
    changeOrg (val) {
      if (val && val.id) {
        this.params = {
          orgIdList: [val.id],
          orgId: val.id
        }
        this.disabledsubject = false
        this.getArrangeServiceList(val.id)
      } else {
        this.disabledsubject = true
      }
    },
    getArrangeServiceList (orgId) {
      request(urlMap.arrangeServiceList, { orgId: orgId, searchType: 2, serviceClassification: '799' }).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.serviceList = rs.data.map(v => {
            return {
              serviceId: v.id,
              serviceName: v.name
            }
          })
        } else {
          this.serviceList = []
        }
      })
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
