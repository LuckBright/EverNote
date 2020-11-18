<template>
  <div class="pdt20">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div id="sourcelist">
      <el-row>
        <el-col :span="24">
          <el-menu mode="horizontal" :default-active="currentPage" router>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcelist/'">渠道管理</el-menu-item>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcekpi/'">渠道业绩</el-menu-item>
            <el-menu-item class="sourcemenu bulec" :index="'/crm/sourcemember/'">渠道客户</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          @query="list(true)"
        >
            <template slot="times">
              <ever-range-picker :start.sync="queryObj.start" :end.sync="queryObj.end"></ever-range-picker>
            </template>
            <template slot="idNo">
              <el-input v-model="queryObj.idNo" placeholder="请输入证件号码" :disabled="queryObj.type?false:true"></el-input>
            </template>
            <template slot="labelIds">
            <el-select
              v-model="queryObj['labelIds']"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options4"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row class="pdr20">
        <el-col :span="24" align="right">
          <el-button :disabled="selected.length==0" @click="sendMessage">发短信</el-button>
          <el-button @click="memberadd">添加客户</el-button>
          <el-button @click="moreAdd">批量添加</el-button>
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <el-table
            v-if="visible"
            @selection-change="handleSelectionChange"
            :data="tableData"
            border
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              label="患者档案号"
              width="160"
              align="center"
              :cell-style="'background-color:green;'"
            >
              <template
                slot-scope="scope"
              >{{scope.row.patientNumber != 'temporary' ? scope.row.patientNumber : '- -'}}</template>
            </el-table-column>
            <el-table-column label="姓名" width="150" align="center">
              <template slot-scope="scope">
                <label v-if="scope.row.name">
                  {{scope.row.name}}
                  <!-- <i class="iconfont icon-huiyuan_dianhu" style="cursor: pointer;color: #1C7BEF;position: relative;top:1px;" @click="calling(scope.row)"></i> -->
                </label>
                <router-link
                  v-else
                  :to="{ name: 'userBaseAdd' }"
                  class="col-red"
                  tag="a"
                  target="_blank"
                >新用户</router-link>
              </template>
            </el-table-column>
            <el-table-column label="性别" align="center" width="120">
              <template slot-scope="scope">
                <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" align="center" width="120"></el-table-column>
            <el-table-column prop="mobile" label="手机号码" align="center" width="120"></el-table-column>
            <el-table-column label="证件类型" width="160" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.idens || !scope.row.idens[0]">- -</span>
                <span v-else>
                  <sys-value type="CV02.01.101" :code="scope.row.idens[0].type"></sys-value>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="证件号码" width="180" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.idens || !scope.row.idens[0]">- -</span>
                <span v-else>{{scope.row.idens[0].idNo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签" align="center" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.member ? scope.row.member.labelNames : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="渠道来源" width="160" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.source != null ">{{scope.row.sourceName}}</span>
                <span v-else>- -</span>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" width="160" align="center">
              <template slot-scope="scope">{{scope.row.createTime || '- -'}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click="linkDetailPage(scope.row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
      <send-message ref="sendmessage" :users="selected" :allparams="allparams"></send-message>
    </div>
  </div>
</template>
<script>
import api from '../store/sourcememberapi'
import capi from '../../warehouse/store/clinicapi'
import coopapi from '../store/cooperationapi'
import tagapi from '../store/tagapi'
import depart from '../../warehouse/store/departmentapi'
import sendMessage from '../page/sendmessage'
import utillist from '../../util/list'
import SourceCascader from '@/crm/components/sourcecascader'
let querySchema = [
  {
    name: 'times',
    label: '时间范围',
    comp: 'custom'
  },
  {
    name: 'sex',
    label: '性别',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useValue: true,
      placeholder: '全部',
      clearable: true
    },
    style: {
      width: '80px',
      display: 'block'
    }
  },
  {
    name: 'type',
    label: '证件类型',
    comp: 'sys-type',
    span: 20,
    props: {
      code: 'CV02.01.101',
      useValue: true,
      clearable: true
    }
  },
  {
    name: 'idNo',
    comp: 'custom'
    // span: 20,
    // props: {
    //   disabled: !this.queryObj.type,
    //   placeholder: '请输入证件号码'
    // }
  },
  {
    name: 'name',
    comp: 'el-input',
    props: {
      placeholder: '请输入客户姓名'
    }
  },
  {
    name: 'mobile',
    comp: 'el-input',
    props: {
      placeholder: '请输入手机号'
    }
  },
  // {
  //   name: 'labelName',
  //   label: '标签',
  //   comp: 'el-input',
  //   props: {
  //     placeholder: '请输入标签'
  //   }
  // },
  {
    name: 'labelIds',
    label: '标签',
    comp: 'custom'
  },
  {
    name: 'source',
    label: '渠道来源',
    placehoder: '选择渠道来源',
    comp: SourceCascader,
    parentClass: 'source-parent',
    props: {
      multiple: true
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    // queryObj.times = []
    queryObj.start = ''
    queryObj.end = ''
    return {
      api: api,
      capi,
      coopapi,
      options4: [],
      taglist: [],
      depart,
      querySchema,
      visible: true,
      queryObj,
      selected: [],
      tagapi,
      allparams: {
        msgType: 110
      }
    }
  },
  created () {
    this.currentPage = this.$route.path
    this.queryObj.times = ''
  },
  mounted () {
    this.tagapi.list().then(rs => {
      this.taglist = rs.data && rs.data.resultList || []
    })
  },
  watch: {
    'queryObj.type': {
      handler (val, old) {
        if (!val) {
          this.queryObj.idNo = ''
        }
      }
    },
    'queryObj.idNo': {
      handler (val, old) {
        if (val) {
          this.list()
        }
        if (!val && old) {
          this.list()
        }
      }
    },
    'queryObj.labelIds': {
      handler: function (val) {
        if (val.length > 0) {
          if (this.queryObj.labelIdName && this.queryObj.labelIdName) this.options4 = this.queryObj.labelIdName
          this.queryObj['labelIds'] = val
        } else {
          this.queryObj.labelIdName && delete this.queryObj.labelIdName
          this.options4 = []
        }
      },
      deep: true
    },
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.queryObj.labelIdName && delete this.queryObj.labelIdName
        this.loading = true
        let labelIdArr = []
        setTimeout(() => {
          this.loading = false
          labelIdArr = this.taglist.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
          this.queryObj.labelIds && this.queryObj.labelIds.length ? this.options4 = [...labelIdArr, ...this.options4] : this.options4 = labelIdArr
          if (this.options4 && this.options4.length) this.options4 = [...new Set(this.options4)]
        }, 200)
      } else {
        if (!this.queryObj.labelIds) this.options4 = []
      }
    },
    linkDetailPage (id) {
      this.$router.push({ path: '/crm/memberinfo/userinfo/memberbaseinfo/' + id })
    },
    addCreatesource () {
      this.$router.push({ name: 'createsource', path: 'createsource' })
    },
    memberadd () {
      this.$router.push({ path: '/crm/memberadd' })
    },
    moreAdd () {
      this.$router.push({ path: '/crm/moreadd' })
    },
    sendMessage () {
      if (this.selected.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择接收短信客户',
          type: 'warning'
        })
        return false
      }
      this.$refs.sendmessage.sendVisible = true
    },
    handleSelectionChange (val) {
      this.selected = val.filter(item => {
        item.mobile = item.contactMobile
        return item.patientId !== null
      })
    },
    calling (val) {
      this.$parent.$parent.$parent.callData = { mobile: val.mobile, patientName: val.contact, patientId: val.idenId }
      this.$parent.$parent.$parent.$refs.iphone.visible = true
    }
  },
  components: {
    sendMessage,
    SourceCascader
  }
}
</script>
<style scoped>
#sourcelist {
  border: 1px solid #d1dbe5;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.pd20 {
  padding: 20px;
}
.sourcemenu {
  margin: 0px 20px;
  width: 90px;
  text-align: center;
}
.pdl20 {
  padding-left: 20px;
}
.pdr20 {
  padding-right: 20px;
}
.bulec {
  color: #1c7bef;
}
.el-form.el-form--inline /deep/ .el-form-item.source-parent .el-form-item__content .el-cascader  .el-cascader__search-input{
 margin: 2px 0 2px 10px!important;
}
</style>
