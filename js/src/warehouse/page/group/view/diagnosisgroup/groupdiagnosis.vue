<template>
  <div class="layout_inner df fdc oh h100">
    <!-- 集团诊断管理 -->
    <div class="main-head">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :schema="schema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="list(true)"
          >
            <template slot="diseaseCodeCategory">
              <el-select v-model="queryObj.diseaseCodeCategory"  clearable placeholder="请选择">
                <el-option v-for="item in codeData" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
            <template slot="diseaseType">
              <el-select v-model="queryObj.diseaseType" @change="diseaseTypeChange" @clear="diseaseTypeChange"  clearable placeholder="请选择诊断分类">
                <template v-for="item in diseaseTypeOption">
                  <el-option
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </template>
              </el-select>
            </template>
            <template slot="diseaseVersion">
              <el-select v-model="queryObj.diseaseVersionCode" clearable placeholder="请选择诊断版本">
                <template  v-for="item in (diseaseVersionOptionCom || [])">
                  <el-option
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </template>
              </el-select>
            </template>
            <template slot="diseaseClass">
              <el-select v-model="queryObj.diagnosticCategory" clearable placeholder="请选择诊断类别">
                <template  v-for="item in (diseaseClassOptionCom || [])">
                  <el-option
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </template>
              </el-select>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button v-if="$route.path.indexOf('warehouse/groupdiagnosis') > -1" type="primary" @click="createDiagnosisShow">新建诊断</el-button>
          <el-button v-if="$route.path.indexOf('warehouse/groupdiagnosis') > -1" type="primary" @click="createGroup">快速创建分组</el-button>
        </el-col>
      </el-row>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      :config-option="{ id: 'GROUP_DIAGNOSIS' }"
      row-key="id"
      :show-index="false"
      :columns="columns"
      :url="url"
      :params.sync="queryObj"
      :maxBtnCount="6">
      <template slot-scope="scope" slot="diseaseType">
        {{diseaseTypeObj[scope.row.diseaseType]}}
      </template>
      <template slot-scope="scope" slot="diseaseVersionCode">
        {{diseaseVersionObj[scope.row.diseaseVersionCode]}}
      </template>
      <template slot-scope="scope" slot="diagnosticCategory">
        {{diseaseClassObj[scope.row.diagnosticCategory]}}
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
        <el-button
          type="primary"
          size="small"
          @click="editDiagnosis(scope.row, scope.$index)"
        >编辑</el-button>
        <el-button
          type="danger"
          v-if="scope.row.diseaseCodeCategory&&scope.row.diseaseCodeCategory=='集团诊断'"
          size="small"
          @click="deleteDiagnosis(scope.row)"
        >删除</el-button>
      </template>
    </ever-table>
    <editDiagnosis ref="editDiagnosis" :content="content" @clickBtn="reload" :diseaseTypeOption="diseaseTypeOption" :diseaseVersionOption="diseaseVersionOption"></editDiagnosis>
    <el-dialog width="60%" :visible.sync="createDiagnosis" v-if="createDiagnosis" title="新建诊断" class="ui_dialog_02 spe" destroy-on-close>
      <template>
        <createDiagnosis ref="createDiagnosis" @close="createDiagnosis = false" @clickBtn="reload" :diseaseClassOption="diseaseClassOption" :diseaseTypeOption="diseaseTypeOption" :diseaseVersionOption="diseaseVersionOption" :updObj="updObj"></createDiagnosis>
      </template>
    </el-dialog>
    <createGroup ref="createGroup" @reloadGroup="reloadGroup"></createGroup>
  </div>
</template>
<script>
// import list from '@/util/list'
import editDiagnosis from './dialog-edit'
import createGroup from './dialog-creategroup'
import createDiagnosis from './dialog-creatediagnosis'
import api from '@/warehouse/store/groupdiagnosisapi'
import {request} from '@/util/req'
import storage from '@/util/storage'

export default {
  // mixins: [list],
  data () {
    let schema = [
      // {
      //   name: 'diseaseCodeCategory',
      //   label: '编码分类',
      //   comp: 'custom'
      // },
      {
        name: 'diseaseType',
        label: '诊断分类',
        comp: 'custom'
      },
      {
        name: 'diseaseVersion',
        label: '诊断版本',
        comp: 'custom'
      },
      {
        name: 'diseaseClass',
        label: '诊断类别',
        comp: 'custom'
      },
      // {
      //   name: 'diseaseCode',
      //   label: '编码',
      // },
      {
        name: 'disease',
        label: '诊断名称或编码',
        props: {
          placeholder: '诊断名称/别名/英文名',
        },
      },
      {
        name: 'groupId',
        label: '分组',
        comp: 'ever-select',
        props: {
          filterable: true,
          clearable: true,
          options: []
        }
      },
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      updObj: false,
      tableData: [],
      columns: [
        {
          prop: 'diseaseType',
          label: '诊断分类',
          slot: 'diseaseType'
        },
        {
          prop: 'diagnosticCategory',
          label: '诊断类别',
          slot: 'diagnosticCategory'
        },
        {
          prop: 'diseaseVersionCode',
          label: '诊断版本',
          slot: 'diseaseVersionCode'
        },
        {
          prop: 'diseaseCode',
          label: '诊断编号',
        },
        {
          prop: 'firstSpell',
          label: '诊断助记码',
        },
        {
          prop: 'diseaseName',
          label: '诊断名称',
          slot: 'diseaseName'
        },
        {
          prop: 'diagnosticCodeColumn',
          label: '诊断编码识别列',
        },
        {
          prop: 'diseaseAlias',
          label: '诊断别名',
          slot: 'diseaseAlias'
        },
        {
          prop: 'groupList',
          label: '诊断分组',
          slot: 'groupList'
        },
        {
          prop: 'op',
          label: '操作',
          slot: 'op',
          hidden: !(this.$route.path.indexOf('warehouse/groupdiagnosis') > -1),
          required: !(this.$route.path.indexOf('warehouse/groupdiagnosis') > -1),
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
      url: { url: '/platform-extend/disease/diseaseOrig/searchOnTenant', isStatic: false },
      createDiagnosis: false,
      listApiName: 'list',
      api,
      content: '',
      loading: false,
      queryObj: obj,
      obj,
      schema,
      tabData: [
        { class: 'ICD-10', code: 'G60 804', name: '遗传学', bynameData: [{ name: '综合征' }, { name: '巴利征' }], group: [{ name: '巴合征' }, { name: '巴利征' }] }
      ],
      codeData: [],
      diseaseTypeOption: [],
      diseaseVersionOption: [],
      diseaseTypeObj: [],
      diseaseClassOption: [],
      diseaseClassObj: [],
      diseaseVersionObj: [],
      nowOrgConfigArr: []
    }
  },
  created () {
    if (this.$route.path.indexOf('warehouse/groupdiagnosis') > -1) {
      this.listApiName = 'orglist'
      this.url = { url: '/platform-extend/disease/diseaseOrig/searchOnOrg', isStatic: false }
      this.obj.orgId = this.$store.state.currentUser.organizationId
      this.getGroup()
    } else {
      let tempGroupIdIndex = this.schema.findIndex((item) => {
        return item.name === 'groupId'
      })
      this.url = { url: '/platform-extend/disease/diseaseOrig/searchOnTenant', isStatic: false }
      this.schema.splice(tempGroupIdIndex, 1)
    }
    this.diseaseVersionConfig()
    // this.getCode()
    this.getTypes()
  },
  computed: {
    diseaseVersionOptionCom () {
      return this.diseaseVersionOption.filter((item, index) => {
        if (this.$route.path.indexOf('warehouse/groupdiagnosis') > -1) {
          let tempVerson = this.nowOrgConfigArr.find((nitem) => { return nitem.diseaseVersionCode === item.code })
          return item.parentId === 'THC_DISEASE_TYPE.' + this.queryObj.diseaseType && (tempVerson || item.code.indexOf('-00') !== -1)
        } else {
          return item.parentId === 'THC_DISEASE_TYPE.' + this.queryObj.diseaseType && item.code.indexOf('-00') === -1
        }
      })
    },
    diseaseClassOptionCom () {
      return this.diseaseClassOption.filter((item, index) => {
        return item.parentId === 'THC_DISEASE_TYPE.' + this.queryObj.diseaseType
      })
    }
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    async diseaseVersionConfig () {
      let res = await request({
        url: '/platform-extend/disease/diseaseVersionConfig/getList',
        isStatic: false
      }, {tenantId: JSON.parse(storage.getLocalStorage('TENANTDATA')).tenantId, orgId: this.$store.state.currentUser.organizationId}, 'post')
      if (res.head.errCode === 0) {
        this.nowOrgConfigArr = res.data.resultList
        // this.obj.diseaseTypes.forEach((item, index) => {
        //   let tempVal = res.data.resultList.find((ritem) => {
        //     return ritem.diseaseType + '' === item.code
        //   })
        // })
      }
    },
    diseaseTypeChange () {
      delete this.queryObj.diseaseVersionCode
      delete this.queryObj.diagnosticCategory
    },
    getTypes () {
      request({ url: '/thc-platform-core/valueSetItem/getValueSetItems/', isStatic: false }, { 'setCode': 'THC_DISEASE_TYPE' }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.diseaseTypeOption = res.data
          this.diseaseTypeObj = this.getArrObj(res.data)
          console.info(this.diseaseTypeObj)
        }
      })
      request({ url: '/thc-platform-core/valueSetItem/getValueSetItems/', isStatic: false }, { 'setCode': 'THC_DISEASE_CLASS' }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.diseaseClassOption = res.data
          this.diseaseClassObj = this.getArrObj(res.data)
          console.info(this.diseaseTypeObj)
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
    editDiagnosis (val) {
      this.updObj = val
      this.createDiagnosis = true
    },
    deleteDiagnosis (val) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(v => {
        if (v !== 'confirm') {
          this.$messageTips(this, 'info', '已经取消删除')
          return
        }
        return this.api.deleteDiagnosis({ id: val.id })
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.list(true)
        } else {
          this.$messageTips(this, 'warning', '删除失败')
        }
      })
    },
    reload () {
      this.list(true)
    },
    reloadGroup () {
      this.getGroup()
    },
    createDiagnosisShow () {
      this.updObj = false
      this.createDiagnosis = true
    },
    createGroup (val) {
      this.$refs.createGroup.open()
    },
    getGroup () {
      this.api.getGroup({ rangeCode: 3, orgId: this.$store.state.currentUser.organizationId }).then(rs => {
        if (rs && rs.data) {
          this.$ever.getFieldFromSchema(this.schema, 'groupId').props.options = rs.data
        }
      })
    },
    getCode () {
      this.api.getCode().then(rs => {
        if (rs && rs.data) {
          this.codeData = rs.data
        }
      })
    }
  },
  components: {
    editDiagnosis,
    createGroup,
    createDiagnosis
  }
}
</script>
