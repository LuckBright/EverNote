<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        @query="list(true)">
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
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button :disabled="selected.length==0" @click="sendMessage">发短信</el-button>
            <el-button @click="memberadd">添加客户</el-button>
            <el-button :disabled="selected.length==0" @click="addtags">添加标签</el-button>
            <!-- <el-button @click="moreAdd" v-if="$hasPermission('Auth_menu_crm_member_importBtn')">导入客户</el-button> -->
            <el-button
              @click="exportMember"
              v-if="$hasPermission('Auth_menu_crm_member_exportBtn')"
            >导出客户</el-button>
            <el-button @click="linkList" v-if="$hasPermission('Auth_menu_crm_member_recordBtn')">导入导出记录</el-button>
            <el-button @click="addfollow" :disabled="selected.length==0">添加随访</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>

      <el-table
        ref="table"
        border
        v-if="visible"
        :data="tableData"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          :width="tableColWidth.name2W54"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="患者档案号"
          :width="tableColWidth.w170"
          :cell-style="'background-color:green;'"
        >
          <template slot-scope="scope">
            <a
              @click="linkDetailPage(scope.row.id)"
              class="pointer"
            >{{scope.row.patientNumber && scope.row.patientNumber != 'temporary' ? scope.row.patientNumber : '--'}}</a>
          </template>
        </el-table-column>
        <el-table-column label="姓名" :width="tableColWidth.w150">
          <template slot-scope="scope">
            <label v-if="scope.row.name">
              <label
                v-if="scope.row.member && scope.row.member.labelColor"
                :style="'font-weight:bold;color:' + scope.row.member.labelColor"
              >{{scope.row.name}}</label>
              <label v-else>{{scope.row.name}}</label>
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
        <el-table-column label="性别" :width="tableColWidth.name4W80">
          <template slot-scope="scope">
            <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="年龄" :width="tableColWidth.name6W105">
          <template slot-scope="scope">
            <span>{{`${scope.row.ageShowText || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="手机号"
          prop="mobile"
          :width="tableColWidth.phoneW115"
        ></el-table-column>
        <el-table-column label="身份证号" :width="tableColWidth.idCardW175">
          <template slot-scope="scope">
            <span>{{scope.row.idNo || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="居住地址">
          <template slot-scope="scope">
            <ever-address v-model="scope.row.address" :convertToFnt="true"></ever-address>
          </template>
        </el-table-column>
        <el-table-column label="标签" :width="tableColWidth.name8W180">
          <template slot-scope="scope">
            <span>{{scope.row.member && scope.row.member.labelNames ? scope.row.member.labelNames : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :width="tableColWidth.datetimeAllW160"></el-table-column>
        <el-table-column label="来源" :width="tableColWidth.w150">
          <template slot-scope="scope">
            <span v-if="scope.row.source">{{scope.row.sourceName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="备注" :width="tableColWidth.w170">
          <template slot-scope="scope">{{scope.row.remark || '--'}}</template>
        </el-table-column>
        <el-table-column label="操作" :width="tableColWidth.name7W120" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" :disabled="scope.row.relateId ? false : true" @click="split(scope.row.id)">解除关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    <send-message2
      ref="sendmessage"
      :data="allparams"
    ></send-message2>
    <add-tags ref="addtags" :users="selected" @save="saveChange"></add-tags>
    <add-follow ref="addFollow" :isInterclinic="false" :isMember="true" :patientIds="patientIds"></add-follow>
  </div>
</template>
<script>
import api from '../store/memberapi'
import tagapi from '../store/tagapi'
import depart from '../../warehouse/store/departmentapi'
import eapi from '../store/empiapi'
import utillist from '../../util/list'
import SendMessage2 from '@/crm/page/sendmessage2'
import addTags from '../components/addtags'
import config from '@/store/config'
import SourceCascader from '@/crm/components/sourcecascader'
import { tableColWidth } from '@/util/table-config'
import addFollow from '@/follow/page/template/dialog-addfollow'
import { ageShow } from '@/util/common'

let querySchema = [
  {
    name: 'number',
    label: '患者档案号',
    comp: 'el-input',
    props: {
      placeholder: '患者档案号'
    }
  },
  {
    name: 'name',
    comp: 'el-input',
    label: '姓名',
    props: {
      placeholder: '请输入客户姓名'
    }
  },
  {
    name: 'mobile',
    label: '手机号',
    comp: 'el-input',
    props: {
      placeholder: '请输入手机号'
    }
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
    props: {
      code: 'CV02.01.101',
      placeholder: '证件类型',
      clearable: true
    },
    span: 20
  },
  {
    name: 'idNo',
    comp: 'el-input',
    span: 20,
    placeholder: '请输入证件号码',
    props: {
      placeholder: '请输入证件号码'
    }
  },
  {
    name: 'source',
    label: '渠道来源',
    comp: SourceCascader,
    props: {
      multiple: true,
      placehoder: '选择渠道来源'
    }
  },
  {
    name: 'labelIds',
    label: '标签',
    comp: 'custom'
  },
  {
    name: 'relate',
    label: '是否关联',
    comp: 'el-select',
    props: {
      options: [
        {
          'id': '1',
          'label': '是'
        },
        {
          'id': '0',
          'label': '否'
        }
      ]
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      currentKey: new Date().getTime(),
      api,
      tagapi,
      querySchema,
      queryObj,
      depart,
      eapi,
      options4: [],
      taglist: [],
      loading: false,
      visible: true,
      sourceName: '',
      showTags: false,
      selected: [],
      allparams: {
        msgType: 110,
        ccMobiles: '',
        receivers: []
      },
      states: [],
      config,
      // hnFlag: this.$ever.getClinicConfig().memberModel,
      tableColWidth,
      patientIds: '',
      ageShow
    }
  },
  created () { },
  mounted () {
    this.tagapi.list().then(rs => {
      this.taglist = rs.data && rs.data.resultList || []
    })
  },
  watch: {
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
    'queryObj.source': {
      handler: function (val) {
        val ? this.queryObj['channelIds'] = val : this.queryObj['channelIds'] = ''
      },
      deep: true
    }
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
    sendMessage () {
      if (!this.selected.length) return this.$messageTips(this, 'warning', '请选择接收短信客户')
      let notSendmessageArr = []
      let messageFlag = false
      this.selected.forEach((item, index) => {
        if (!item.mobile) {
          notSendmessageArr.push(item.name)
          messageFlag = true
          this.$refs.table.toggleRowSelection(this.tableData[index], false)
          this.selected.splice(index, 1)
        }
      })
      if (messageFlag) return this.$messageTips(this, 'warning', `已选择客户“${notSendmessageArr.join(',')}”无可接收短信手机号，请增加接收短信手机号`)
      this.allparams.receivers = []
      this.selected.forEach(item => {
        let receiversObj = {
          id: item.id,
          name: item.name,
          mobile: item.mobile
        }
        this.allparams.receivers.push(receiversObj)
      })
      this.$refs.sendmessage.sendVisible = true
    },
    saveChange () {
      this.list(true)
    },
    memberadd () {
      // if (this.hnFlag === '2') {
      //   this.$router.push({ path: '/crm/HnMemberadd' })
      // } else {
      //   this.$router.push({ path: '/crm/memberadd' })
      // }
      window.open(window.location.origin + this.$ever.crmIndex + '/crm/memberadd', '_self')
    },
    // moreAdd () {
    //   this.$router.push({ path: '/crm/moreadd' })
    // },
    addtags () {
      if (this.selected.length === 0) {
        this.$messageTips(this, 'warning', '没有结算单数据，dyd')
        this.$notify({
          title: '警告',
          message: '请选择添加标签客户',
          type: 'warning'
        })
        return false
      }
      this.$refs.addtags.visible = true
    },
    linkDetailPage (id) {
      window.open(window.location.origin + this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + id, '_self')
    },
    linkList () {
      window.open(window.location.origin + this.$ever.crmIndex + '/crm/imandexlist', '_self')
    },
    // checkSelectable (row) {
    //   let rowFlag = false
    //   if (row.mobile) rowFlag = true
    //   return rowFlag
    // },
    handleSelectionChange (val) {
      this.selected = val
      // 给随访传递患者id
      if (val && val[0]) {
        let array = val.map(v => {
          return v.id
        })
        this.patientIds = array.join(',')
      } else {
        this.patientIds = ''
      }
    },
    calling (val) {
      this.$parent.$parent.$parent.callData = { mobile: val.mobile, patientName: val.contact, patientId: val.idenId }
      this.$parent.$parent.$parent.$refs.iphone.visible = true
    },
    exportMember () {
      if (!this.tableData && this.tableData.length <= 0) {
        window.open(api.turl + '客户数据模板.xlsx', '_self')
      }
      this.api.list(this.queryObj).then(rs => {
        let num = this.selected && this.selected.length > 0 ? this.selected.length : rs.data.totalCount
        if (num > 2000) {
          this.$confirm('单次导出最高2000条', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api.exportMember(this.queryObj).then(rs => {
              if (rs.head.errCode === 0) {
                window.open(`${this.$ever.fileUrl2}${rs.data.resultPath}`, '_blank')
              }
            })
          }).catch(() => {
            return false
          })
        } else if (num === 0) {
          window.open(api.turl + 'template.xlsx', '_blank')
        } else {
          this.api.exportMember(this.queryObj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              window.open(`${this.$ever.fileUrl2}${rs.data.resultPath}`, '_blank')
            }
          })
        }
      })
    },
    split (id) {
      this.$confirm('解除关联, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.eapi.unRelate({ id: id }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '解除关联成功')
            this.list(true)
          }
        })
      }).then(() => {
        this.$messageTips(this, 'info', '已取消关联')
      })
    },
    addfollow () {
      this.$refs.addFollow.open()
    }
  },
  components: {
    SendMessage2,
    addTags,
    SourceCascader,
    addFollow
  }
}
</script>
