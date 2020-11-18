<template>
  <div id="diagnosisgroup">
    <div class="group_l">
      <div class="title">
        <span>诊断分组</span>
        <el-popover placement="bottom" title width="140" trigger="manual" v-model="visible">
          <el-input
            placeholder="请添加名称"
            v-model="groupN"
            @keyup.native="enterEvent($event)"
            maxlength="20"
          ></el-input>
          <el-button type="text" slot="reference" @click="addGroup">添加分组</el-button>
        </el-popover>
      </div>
      <div>
        <ul v-if="leftData&&leftData.length>0">
          <li
            class="groupLi"
            v-for="item in leftData"
            :key="item.id"
            @click="getDiagnosis(item)"
            :class="{'on':groupId==item.id}"
          >{{item.name}}</li>
        </ul>
        <div v-else class="empty">暂无分组</div>
      </div>
    </div>
    <div class="group_r">
      <div class="title">
        <span>{{programObj && programObj.name? programObj.name:''}}</span>
        <el-popover
          v-if="programObj && programObj.name && groupId!==''"
          placement="bottom"
          title
          width="140"
          trigger="click"
        >
          <el-input
            placeholder="请添加名称"
            v-model="group"
            @keyup.native="enterEvent1($event)"
            maxlength="20"
          ></el-input>
          <el-button type="text" slot="reference" @click="reName">重命名</el-button>
        </el-popover>
        <el-button
          type="text"
          v-if="deptId=='group'&&programObj && programObj.name"
          @click="deleteGroup"
        >删除</el-button>
        <!-- <el-popover
                v-if="deptId!=='group'&&programObj && programObj.name"
                placement="bottom"
                title=""
                width="340"
                trigger="click"
                v-model="visible2">
                  <div class="tips">
                    <p>确认删除分组"{{programObj.name}}"及该分类下所有常用诊断？</p>
                    <p>若选“是”，将删除该分类及该分类下所有常用诊断；</p>
                    <p>若选“否”，将只删除该分类，其下所有诊断将保留在常用诊断中。</p>
                  </div>
                  <div>
                     <el-button size="medium" type="primary">是</el-button>
                     <el-button size="medium">否</el-button>
                     <el-button size="medium" @click="visible2=false">取消</el-button>
                  </div>
                  <el-button type="text" slot="reference" @click="visible2=!visible2">删除</el-button>
        </el-popover>-->
        <el-button
          type="text"
          v-if="deptId!=='group'&& groupId!==''&&programObj && programObj.name"
          @click="openDialog"
        >删除</el-button>
      </div>
      <div class="program">
        <el-select
          v-model="diagnosisId"
          filterable
          clearable
          remote
          placeholder="诊断名称/别名"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in diagnosisData"
            :key="item.id"
            :label="item._name + '-' + item.diseaseCode + '-' +diseaseTypes[item.diseaseType]"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="addDiagnosis">添加诊断</el-button>
        <el-table v-if="false" v-loading="loading" :data="rightData" :border="false" style="width: 100%">
          <el-table-column prop="diseaseType" label="诊断分类">
            <template slot-scope="scope">
              {{diseaseTypeObj[scope.row.diseaseType]}}
            </template>
          </el-table-column>
          <el-table-column prop="diseaseVersion" label="诊断版本">
            <template slot-scope="scope">
              {{scope.row.diseaseVersionName}}
            </template>
          </el-table-column>
          <el-table-column prop="diseaseCode" label="编码" width="200"></el-table-column>
          <el-table-column prop="firstSpell" label="诊断助记码"></el-table-column>
          <el-table-column prop="diseaseName" label="名称">
            <template slot-scope="scope"><span v-show="scope.row.diseaseNameEn">{{scope.row.diseaseNameEn}}  </span>{{scope.row.diseaseName}}</template>
          </el-table-column>
          <el-table-column prop="diseaseAlias" label="别名">
            <template slot-scope="scope">{{scope.row.diseaseAlias?scope.row.diseaseAlias:'--'}}</template>
          </el-table-column>
          <el-table-column prop label="操作" width="100">
            <template slot-scope="scope">
              <!-- 全部分组里面叫删除，其他分组是移出分组 -->
              <el-button
                size="mini"
                type="danger"
                v-if="groupId===''"
                @click="allDelete(scope.row)"
              >删除</el-button>
              <div v-else>
                <!-- 诊断分组管理的移出组 -->
                <el-button
                  size="mini"
                  type="danger"
                  v-if="deptId=='group'"
                  @click="dailyDelete(scope.row)"
                >移出组</el-button>
                <!-- 常用诊断管理的移出组 -->
                <el-button size="mini" type="danger" v-else @click="dailyDelete(scope.row)">移出组</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
<!--        <ever-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="currentPage"-->
<!--          :totalCount="totalCount"-->
<!--        ></ever-pagination>-->
        <ever-table
          :loading="loading"
          ref="table"
          is-auto-height
          :config-option="{isAutoId: true}"
          class=""
          row-key="id"
          :show-index="false"
          :columns="columns"
          :data="rightData"
          :maxBtnCount="6">
          <template slot-scope="scope" slot="diseaseType">
            {{diseaseTypeObj[scope.row.diseaseType]}}
          </template>
          <template slot-scope="scope" slot="diseaseVersionCode">
            {{diseaseVersionObj[scope.row.diseaseVersionCode]}}
          </template>
          <template slot-scope="scope" slot="diseaseName">
            <span v-show="scope.row.diseaseNameEn">{{scope.row.diseaseNameEn}}  </span>{{scope.row.diseaseName}}
          </template>
          <template slot-scope="scope" slot="diseaseAlias">{{scope.row.diseaseAlias?scope.row.diseaseAlias:'--'}}</template>
          <template
            slot-scope="scope"
            slot="groupList"
          >{{scope.row.groupList?scope.row.groupList.map(v => v.name).join(','):'--'}}</template>
          <template slot-scope="scope" slot="op">
            <!-- 全部分组里面叫删除，其他分组是移出分组 -->
            <el-button
              size="mini"
              type="danger"
              v-if="groupId===''"
              @click="allDelete(scope.row)"
            >删除</el-button>
            <div v-else>
              <!-- 诊断分组管理的移出组 -->
              <el-button
                size="mini"
                type="danger"
                v-if="deptId=='group'"
                @click="dailyDelete(scope.row)"
              >移出组</el-button>
              <!-- 常用诊断管理的移出组 -->
              <el-button size="mini" type="danger" v-else @click="dailyDelete(scope.row)">移出组</el-button>
            </div>
          </template>
        </ever-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :totalCount="totalCount"
        ></ever-pagination>
      </div>
    </div>
    <deleteGroup
      ref="deleteGroup"
      :programObj="programObj"
      :deptId="deptId"
      @clickBtn="clickRelaod"
      @cancelBtn="cancelRelaod"
    ></deleteGroup>
  </div>
</template>
<script>
import api from '@/sob/store/commondiagnosisapi'
import groupdiagnosisapi from '@/warehouse/store/groupdiagnosisapi'
import deleteGroup from '@/sob/components/dialog-deletegroup'
import {request} from '@/util/req'
export default {
  props: ['groupName', 'deptId'],
  data () {
    return {
      url: { url: '/platform-extend/disease/diseaseOrig/searchOnTenant', isStatic: false },
      diseaseTypes: { 1: '中医', 2: '西医', 3: '手术' },
      api,
      groupdiagnosisapi,
      loading: false,
      groupN: '',
      group: '',
      visible: false,
      visible1: false,
      visible2: false,
      diagnosisData: [],
      leftData: [{ id: '', name: '全部' }],
      rightData: [],
      groupId: 1,
      totalCount: 0,
      offset: 0,
      pagesize: 20,
      programObj: {},
      diagnosisId: '',
      options: [],
      params: {
        relateId: null,
        rangeCode: null
      },
      currentPage: 1,
      diseaseTypeOption: [],
      diseaseVersionOption: [],
      diseaseTypeObj: [],
      diseaseVersionObj: [],
      columns: [
        {
          prop: 'diseaseType',
          label: '诊断分类',
          slot: 'diseaseType',
          width: 120,
        },
        {
          prop: 'diagnosticCategory',
          label: '诊断类别',
          width: 120,
        },
        {
          prop: 'diseaseVersionCode',
          label: '诊断版本',
          slot: 'diseaseVersionCode',
          width: 300,
        },
        {
          prop: 'diseaseCode',
          label: '诊断编号',
          width: 120,
        },
        {
          prop: 'firstSpell',
          label: '诊断助记码',
          width: 200,
        },
        {
          prop: 'diseaseName',
          label: '诊断名称',
          slot: 'diseaseName',
          width: 300,
        },
        {
          prop: 'diagnosticCodeColumn',
          label: '诊断编码识别列',
          width: 120,
        },
        {
          prop: 'diseaseAlias',
          label: '诊断别名',
          slot: 'diseaseAlias',
          width: 120,
        },
        {
          prop: 'groupList',
          label: '诊断分组',
          slot: 'groupList',
          width: 120,
        },
        {
          prop: 'op',
          label: '操作',
          slot: 'op',
          required: true,
          fixed: 'right'

        },
        {
          prop: 'chapterCode',
          label: '章代码',
          hidden: true
        },
        {
          prop: 'chapterCodeRange',
          label: '章代码范围',
          hidden: true
        },
        {
          prop: 'chapterName',
          label: '章名称',
          hidden: true
        },
        {
          prop: 'sectionCode',
          label: '节代码',
          hidden: true
        },
        {
          prop: 'sectionCodeRange',
          label: '节代码范围',
          hidden: true
        },
        {
          prop: 'sectionName',
          label: '节名称',
          hidden: true
        },
        {
          prop: 'categoryCode',
          label: '类目代码',
          hidden: true
        },
        {
          prop: 'categoryName',
          label: '类目名称',
          hidden: true
        },
        {
          prop: 'subheadingCode',
          label: '亚目代码',
          hidden: true
        },
        {
          prop: 'subheadingName',
          label: '亚目名称',
          hidden: true
        },
        {
          prop: 'detailCode',
          label: '细目代码',
          hidden: true
        },
        {
          prop: 'detailName',
          label: '细目名称',
          hidden: true
        },
        {
          prop: 'mainCode',
          label: '主要编码',
          hidden: true
        },
        {
          prop: 'mainCodingSigns',
          label: '主要编码标志',
          hidden: true
        },
        {
          prop: 'additionalCoding',
          label: '附加编码',
          hidden: true
        },
        {
          prop: 'validFlag',
          label: '有效标志',
          hidden: true
        },
        {
          prop: 'workInjuryUseSign',
          label: '工伤使用标志',
          hidden: true
        },
        {
          prop: 'birthSign',
          label: '生育使用标志',
          hidden: true
        }
      ],
    }
  },
  created () {
    if (this.deptId === 'group') { // 集团
      this.params.rangeCode = 3
      this.params.relateId = null
      this.params.orgId = this.$store.state.currentUser.organizationId
      this.getGroup(this.params)
    }
    this.getTypes()
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    getTypes () {
      request({ url: '/thc-platform-core/valueSetItem/getValueSetItems/', isStatic: false }, { 'setCode': 'THC_DISEASE_TYPE' }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.diseaseTypeOption = res.data
          this.diseaseTypeObj = this.getArrObj(res.data)
        }
      })
      request({ url: '/thc-platform-core/valueSetItem/getValueSetItems/', isStatic: false }, { 'setCode': 'THC_DISEASE' }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.diseaseVersionOption = res.data
          this.diseaseVersionObj = this.getArrObj(res.data)
        }
      })
    },
    getArrObj (data) {
      let tempadata = {}
      data.forEach((item, index) => {
        tempadata[item.code] = item.name
      })
      return tempadata
    },
    clickRelaod () {
      this.getGroup(this.params)
    },
    cancelRelaod () {
      this.getGroup(this.params)
    },
    openDialog () {
      this.$refs.deleteGroup.open()
    },
    getGroup (params) { // 集团分组
      params.orgId = this.$store.state.currentUser.organizationId
      this.groupdiagnosisapi.getGroup(params).then(rs => {
        // 给楠楠加的flage
        let _linannanflag = false
        if (this.$route.path.includes('warehouse/commondiagnosis') || this.$route.path.includes('workspace/commondiagnosis')) {
          _linannanflag = true
        }
        if (rs && rs.data && rs.data[0]) {
          this.leftData = rs.data
          if (_linannanflag) { // 默认全部
            this.leftData.unshift({ id: '', name: '全部' })
            this.programObj = rs.data[0]
            this.groupId = ''
            let params = {
              offset: 0,
              pagesize: 20,
              diseaseGroupId: this.groupId,
              rangeCode: this.params.rangeCode,
              relateId: this.params.relateId
            }
            this.getById(params)
          } else {                  // 默认显示第一项
            this.programObj = rs.data[0]
            this.groupId = rs.data[0].id
            let params = {
              offset: 0,
              pagesize: 20,
              diseaseGroupId: this.groupId,
              rangeCode: this.params.rangeCode,
              relateId: this.params.relateId
            }
            this.getById(params)
          }
        } else {
          if (_linannanflag) {
            this.leftData = [{ id: '', name: '全部' }]
            this.programObj = { id: '', name: '全部' }
            this.groupId = ''
            let params = {
              offset: 0,
              pagesize: 20,
              diseaseGroupId: '',
              rangeCode: this.params.rangeCode,
              relateId: this.params.relateId
            }
            this.getById(params)
          } else {
            this.leftData = []
            this.rightData = []
            this.programObj = {}
          }
        }
      })
    },
    updateName (params) {
      this.groupdiagnosisapi.updateName(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '成功',
          message: '重命名成功',
          duration: 3000
        })
        this.getGroup(this.params)
        this.group = ''
        this.visible = false
      })
    },
    createGroup (params) {
      params.orgId = this.$store.state.currentUser.organizationId
      this.groupdiagnosisapi.createGroup(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '成功',
          message: '新建分组成功',
          duration: 3000
        })
        this.getGroup(this.params)
        this.$emit('reloadGroup', 1)
        this.groupN = ''
        this.visible = false
      })
    },
    addGroup (v) {
      this.visible = !this.visible
    },
    enterEvent (v) { // 创建分组
      if (v.keyCode === 13) {
        if (!this.groupN) {
          return
        }
        let params = {
          name: this.groupN
        }
        if (this.deptId === 'group') { // 集团创建分组
          params.rangeCode = 3
          params.relateId = null
        } else if (this.deptId === 'person') { // 个人
          params.rangeCode = 1
          params.relateId = null
        } else {
          params.rangeCode = 2
          params.relateId = this.deptId
        }
        this.createGroup(params)
        this.visible = !this.visible
      }
    },
    reName () {
      this.visible1 = !this.visible1
    },
    enterEvent1 (v) { // 重命名分组
      if (v.keyCode === 13) {
        if (!this.group) {
          return
        }
        let params = {
          name: this.group,
          id: this.programObj.id || ''
        }
        this.updateName(params)
        this.visible1 = !this.visible1
      }
    },
    getDiagnosis (val) {
      this.programObj = val
      this.groupId = val.id
      let params = {
        offset: 0,
        pagesize: 20,
        diseaseGroupId: this.groupId,
        relateId: this.params.relateId,
        rangeCode: this.params.rangeCode
      }
      this.getById(params)
    },
    addDiagnosis () {
      if (!this.diagnosisId) {
        return
      }
      let diseaseType = this.diagnosisData.find((item) => {
        return item.id === this.diagnosisId
      }).diseaseType
      let params = {
        diseaseOrigId: this.diagnosisId,
        diseaseGroupId: this.groupId,
        diseaseType: diseaseType,
        orgId: this.$store.state.currentUser.organizationId
      }
      Object.assign(params, this.params)
      this.groupdiagnosisapi.addDiagnosis(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '添加成功',
            duration: 3000
          })
          let params1 = {
            offset: this.offset,
            pagesize: this.pagesize,
            diseaseGroupId: this.groupId,
            rangeCode: this.params.rangeCode,
            relateId: this.params.relateId
          }
          this.getById(params1)
          this.diagnosisId = ''
        }
      })
    },
    allDelete (val) {
      this.groupdiagnosisapi.deleteAll({ rangeCode: this.params.rangeCode, relateId: this.params.relateId, diseaseOrigId: val.id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '移出组成功',
            duration: 3000
          })
          let params = {
            offset: this.offset,
            pagesize: this.pagesize,
            diseaseGroupId: this.groupId,
            rangeCode: this.params.rangeCode,
            relateId: this.params.relateId
          }
          this.getById(params)
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          })
        }
      })
    },
    handleDelete (val) {
      this.groupdiagnosisapi.deleteDiagnosis({ id: val.id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '移出组成功',
            duration: 3000
          })
          let params = {
            offset: this.offset,
            pagesize: this.pagesize,
            diseaseGroupId: this.groupId,
            rangeCode: this.params.rangeCode,
            relateId: this.params.relateId
          }
          this.getById(params)
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          })
        }
      })
    },
    dailyDelete (val) {
      this.groupdiagnosisapi.removeDisease({ diseaseOrigId: val.id, diseaseGroupId: this.groupId }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '移出组成功',
            duration: 3000
          })
          let params = {
            offset: this.offset,
            pagesize: this.pagesize,
            diseaseGroupId: this.groupId,
            rangeCode: this.params.rangeCode,
            relateId: this.params.relateId
          }
          this.getById(params)
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          })
        }
      })
    },
    deleteGroup () {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(v => {
        if (v !== 'confirm') {
          this.$message({
            message: '已经取消删除!'
          })
          return
        }
        return this.groupdiagnosisapi.deleteGroup({ id: this.programObj.id })
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGroup(this.params)
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          })
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        diseaseGroupId: this.groupId,
        relateId: this.params.relateId,
        rangeCode: this.params.rangeCode,
        orgId: this.$store.state.currentUser.organizationId
      }
      this.getById(params)
    },
    handleCurrentChange (val) {
      this.offset = (val - 1) * this.pagesize
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        diseaseGroupId: this.groupId,
        rangeCode: this.params.rangeCode,
        relateId: this.params.relateId,
        orgId: this.$store.state.currentUser.organizationId
      }
      this.getById(params)
    },
    remoteMethod (query) {
      if (!query) {
        this.diagnosisData = []
        return
      } else {
        let params = {
          offset: 0,
          pagesize: 50,
          disease: query,
          diseaseTypeList: [1, 2]
        }
        this.searchOnTenant(params)
      }
    },
    searchOnTenant (params) { // 集团下拉suggest
      params.orgId = this.$store.state.currentUser.organizationId
      this.api.searchOnTenant(params).then(rs => {
        if (rs && rs.data && rs.data.resultList) {
          rs.data.resultList.forEach(item => {
            item._name = item.diseaseNameEn ? item.diseaseNameEn : ''
            item._name = item._name + ' ' + item.diseaseName
          })
          this.diagnosisData = rs.data.resultList
        }
      })
    },
    searchByRange (params) { // 个人和科室的suggest(暂时弃用)
      this.api.searchByRange(params).then(rs => {
        if (rs && rs.data && rs.data.resultList) {
          this.diagnosisData = rs.data.resultList
        }
      })
    },
    getById (params) {
      params.orgId = this.$store.state.currentUser.organizationId
      this.api.getById(params).then(rs => {
        if (rs && rs.data) {
          this.rightData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.rightData = []
          this.totalCount = 0
        }
      })
    }
  },
  watch: {
    deptId (val) {
      if (val) {
        if (val === 'group') { // 集团
          this.params.rangeCode = 3
          this.params.relateId = null
        } else if (val === 'person') { // 个人
          this.params.rangeCode = 1
          this.params.relateId = null
        } else {                       // 科室
          this.params.rangeCode = 2
          this.params.relateId = val
        }
        if (this.params.rangeCode && this.params.relateId !== '0') {
          this.getGroup(this.params)
        }
      }
    }
  },
  components: {
    deleteGroup
  }
}
</script>
<style lang='scss' scoped>
#diagnosisgroup {
  min-height: 700px;
  background: #ffffff;
  padding-bottom: 10px;
}
#diagnosisgroup .group_l,
#diagnosisgroup .group_r {
  min-height: 700px;
}
#diagnosisgroup .group_l {
  width: 198px;
  background: #ffffff;
  float: left;
  border-right: 1px solid #cccccc;
}
#diagnosisgroup .group_l .title {
  clear: both;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #cccccc;
  background-image: linear-gradient(-180deg, #ffffff 0%, #f4f4f4 100%);
}
#diagnosisgroup .group_l .title > span:nth-child(1) {
  font-size: 14px;
  color: #000;
  text-align: center;
  font-weight: 700;
  float: left;
  margin-left: 10px;
}
#diagnosisgroup .group_l .title span:nth-child(2) {
  float: right;
  margin-right: 10px;
}
#diagnosisgroup .group_l .title > .el-button span {
  font-size: 12px !important;
  color: #1c7bef;
}
#diagnosisgroup .group_l ul {
  margin: 0;
  padding: 0;
}
#diagnosisgroup .group_l ul li {
  padding: 0 15px 0 10px;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  font-size: 14px;
  color: #000;
}
#diagnosisgroup .group_l ul li.on {
  background: #1c7bef;
  color: #ffffff;
}
#diagnosisgroup .group_r {
  margin-left: 200px;
  background: #ffffff;
  margin-right: 15px;
}
#diagnosisgroup .group_r .title {
  height: 36px;
  line-height: 36px;
  margin-left: 15px;
}
#diagnosisgroup .group_r .title > span:nth-child(1) {
  font-size: 14px;
  color: #000;
  text-align: center;
  font-weight: 700;
  float: left;
  margin-right: 15px;
}
.el-main .el-button--text {
  font-size: 12px !important;
  color: #1c7bef;
  text-align: center;
}
#diagnosisgroup .program {
  margin-left: 15px;
  margin-top: 6px;
}
#diagnosisgroup .empty {
  text-align: center;
  font-size: 14px;
  color: #000;
  margin: 6px 0;
}
#diagnosisgroup .groupLi {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

