<template>
  <div>
    <div class="layout_inner">
      <el-row class="border-b">
        <el-col :span="24">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="queryRepeat()"
          ></ever-form2>
        </el-col>
      </el-row>
      <el-row class="pdt20">
        <el-col>
          <div>
            <span class="boldspan">重复条件:</span>
            <span class="mglf20" v-bind:class="{'class-a': isIdNo}" @click="getIdno()">证件号码重复</span>
            <span
              class="mglf20"
              v-bind:class="{'class-a': isName}"
              @click="getNameandMobile()"
            >姓名+手机号重复</span>
            <span
              class="mglf20"
              v-bind:class="{'class-a': isBlue}"
              @click="getBirthday()"
            >姓名+性别+出生日期重复</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="layout_inner">
      <!-- todo 临时注释掉入口，后面需求完整之后会放出来 -->
      <!-- <el-row>
        <el-col :span="24" align="right">
          <el-button @click="linkList">客户关联</el-button>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-table v-if="visible" :data="tableData" border>
            <el-table-column
              prop="repeatNum"
              label="疑似数据"
              width="100"
              align="center"
              :cell-style="'background-color:green;'"
            ></el-table-column>
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <label
                  v-if="scope.row.member && scope.row.member.labelColor"
                  :style="'font-weight:bold;color:' + scope.row.member.labelColor"
                >{{scope.row.name}}</label>
                <label v-else>{{scope.row.name}}</label>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="90">
              <template slot-scope="scope">
                <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="年龄" width="100" prop="ageShowText"></el-table-column>
            <el-table-column show-overflow-tooltip label="手机号" prop="mobile" width="120"></el-table-column>
            <el-table-column label="身份证号" width="200">
              <template slot-scope="scope">{{scope.row.idNo || '--'}}</template>
            </el-table-column>
            <el-table-column label="社保卡号" width="200">
              <template slot-scope="scope">{{scope.row.socialSecurityNo || '--'}}</template>
            </el-table-column>
            <el-table-column label="护照号" width="200">
              <template slot-scope="scope">{{scope.row.passportNo || '--'}}</template>
            </el-table-column>
            <!-- todo 临时注释掉入口，后面需求完整之后会放出来 -->
            <!-- <el-table-column label="操作" align="center" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button size="small" @click="linkRepeatPage(scope.row.id)">查重</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
          ></ever-pagination>
        </el-col>
      </el-row>
      <member-concat
        ref="concat"
        :title="'客户关联'"
        :visible="canPop"
        @close="closeUserPop"
        @update="updateUserDia"
      ></member-concat>
    </div>
  </div>
</template>
<script>
import api from '../store/empiapi'
import memberConcat from '../components/memberconcat'
import { ageShow } from '@/util/common'
let querySchema = [
  {
    name: 'name',
    label: '客户姓名',
    comp: 'el-input',
    props: {
      placeholder: '请输入客户姓名'
    }
  },
  {
    name: 'idType',
    label: '证件类型',
    comp: 'sys-type',
    span: 20,
    props: {
      code: 'CV02.01.101',
      useValue: true
    }
  },
  {
    name: 'idNo',
    comp: 'el-input',
    span: 20,
    placeholder: '请输入证件号码',
    props: {
      placeholder: '请输入证件号码'
    }
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.offset = 0
    queryObj.pagesize = 20
    queryObj.name = queryObj.name ? queryObj.name : null
    queryObj.idType = queryObj.idType ? queryObj.idType : null
    queryObj.idNo = queryObj.idNo ? queryObj.idNo : null
    return {
      api: api,
      querySchema: querySchema,
      options4: [],
      labelIds: [],
      taglist: [],
      loading: false,
      visible: true,
      sourceName: '',
      queryObj: queryObj,
      showTags: false,
      canPop: false,
      selected: [],
      isIdNo: true,
      isBlue: false,
      isName: false,
      tableData: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      type: 1,
      states: [],
      ageShow
    }
  },
  created () {
    this.getIdno()
  },
  methods: {
    queryRepeat () {
      switch (this.type) {
        case 1:
          this.getIdno()
          break
        case 2:
          this.getNameandMobile()
          break
        default:
          this.getBirthday()
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = this.taglist.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },
    linkRepeatPage (id) {
      let queryData = {}
      queryData['id'] = id
      queryData['type'] = this.type
      this.$router.push({ path: 'repeatdetail', query: queryData })
    },
    linkList () {
      this.canPop = true
    },
    closeUserPop () {
      this.canPop = false
    },
    updateUserDia (val) {
      this.canPop = val
    },
    getIdno () {
      this.isIdNo = true
      this.isBlue = false
      this.isName = false
      this.api.getIdno(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
          this.type = 1
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    getNameandMobile () {
      this.isName = true
      this.isIdNo = false
      this.isBlue = false
      this.api.getNameandMobile(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
          this.type = 2
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    getBirthday () {
      this.isBlue = true
      this.isIdNo = false
      this.isName = false
      this.api.getBirthday(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.type = 3
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    handleSizeChange (val) {
      this.queryObj.pagesize = val
      this.queryRepeat()
    },
    handleCurrentChange (val) {
      this.queryObj.offset = (val - 1) * this.queryObj.pagesize
      this.queryRepeat()
    }
  },
  components: {
    memberConcat
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
}
.mgt20 {
  margin-top: 20px;
}
.border-b {
  border-bottom: 1px #eeeeee solid;
}
.boldspan {
  font-weight: bold;
}
.class-a {
  color: #1c7bef;
}
</style>
