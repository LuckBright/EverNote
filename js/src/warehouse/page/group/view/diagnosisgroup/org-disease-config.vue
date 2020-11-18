<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item class="fr">
            <span v-if="tsOrganizationDTOList.length" class="danger">机构层级已修改，请点击按钮进行保存</span>
            <el-button v-if="tsOrganizationDTOList.length" type="primary" @click="updateStruct" title="若对机构层级进行了拖拽，请点击该按钮保存，否则不生效">保存机构结构</el-button>
<!--            如果存在机构，则不允许新建 【新建只适用于建第一个机构】-->
<!--            <el-button v-if="!treeProps.props.data.length" type="primary" @click="toPage('create', {_id: '-1'})">新建</el-button>-->
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <tree-table :tree-props="treeProps" :header-columns="headerColumns">
      <template slot-scope="{node, data}">
        <div>{{node.label}}</div>
        <div class="content-col-version1">{{getOrgVersion(1, data.code)}}</div>
        <div class="content-col-version2">{{getOrgVersion(2, data.code)}}</div>
        <div class="content-col-version3">{{getOrgVersion(3, data.code)}}</div>
        <div class="content-col-op">
          <el-button type="primary" @click="setConfig(data)">诊断配置</el-button>
        </div>
      </template>
    </tree-table>
    <el-dialog :visible.sync="showConfig"  v-if="showConfig" title="诊断配置" class="ui_dialog_02 spe" destroy-on-close>
      <disease-config  @close="closeConfig()" @refresh="refresh" :orgInfo="currentOrgInfo"></disease-config>
    </el-dialog>
  </div>
</template>
<script>
  import diseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/disease-config-base'
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, getUpdatedStruct, getSearchId, isManages} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'

  const querySchema = []
  export default {
    components: {TreeTable, diseaseConfig},
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const me = this
      return {
        diseaseVersionOption: [],
        currentOrgInfo: null,
        showConfig: false,
        querySchema,
        queryObj,
        tsOrganizationDTOList: [],
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: false,
            expandOnClickNode: false,
            'allow-drag' (node) {
              return node.data.parentCode !== '0'
            },
            'allow-drop' (draggingNode, dropNode, type) {
              return !(dropNode.data.parentCode === '0' && type !== 'inner')
            },
          },
          on: {
            'node-drop' (draggingNode, dropNode, dropType) {
              me.tsOrganizationDTOList = getUpdatedStruct(me.tsOrganizationDTOList, draggingNode, dropNode, dropType, 'parentCode')
              me.$messageTips(me, 'success', '拖拽完成，请点击"保存机构结构"使其生效！')
            }
          },
        },
        headerColumns: [
          {
            label: '机构名称',
          },
          {
            width: '250px',
            label: '中医版本',
          },
          {
            width: '250px',
            label: '西医版本',
          },
          {
            width: '250px',
            label: '手术版本',
          },
          {
            width: '150px', // 调整宽度时需要将css中对应的宽度调整一下
            label: '操作',
          },
        ],
        allDiseaseVersion: []
      }
    },
    created () {
      // 查询所有机构数据
      this.init()
    },
    methods: {
      init () {
        this.getTypes()
        this.getllDiseaseVersion()
        this.search()
      },
      refresh () {
        this.getllDiseaseVersion()
      },
      async getTypes () {
        let res2 = await request({
          url: '/thc-platform-core/valueSetItem/getValueSetItems/',
          isStatic: false
        }, {'setCode': 'THC_DISEASE'}, 'post')
        if (res2.head.errCode === 0) {
          this.diseaseVersionOption = res2.data
        }
      },
      async getllDiseaseVersion () {
        let res = await request({
          url: 'platform-extend/disease/diseaseVersionConfig/allDiseaseVersion/',
          isStatic: false
        }, {}, 'post')
        if (res.head.errCode === 0) {
          this.allDiseaseVersion = res.data.resultList
        }
      },
      getOrgVersion (type, orgId) {
        let tempVersion = this.allDiseaseVersion.find((item, index) => {
          return item.orgId === orgId && (item.diseaseType + '' === type + '')
        })
        if (tempVersion) {
          return tempVersion.diseaseVersionName
        } else {
          return '--'
        }
      },
      formateVersionName (code) {
        let resVersion = this.diseaseVersionOption.find((item) => {
          return item.code === code
        })
        return resVersion.name
      },
      closeConfig () {
        this.showConfig = false
      },
      setConfig (data) {
        this.currentOrgInfo = data
        this.showConfig = true
      },
      toPage (type, data) {
        if (type === 'dept') {
          this.$router.push({name: 'org-dept', params: {orgId: data._id}})
        } else if (type === 'subject') {
          this.$router.push({name: 'org-subject-manage', params: {orgId: data._id}})
        } else if (type === 'webh') {
          this.$router.push({name: 'org-org-webh', params: {orgId: data._id}})
        } else if (type === 'sign') {
          this.$router.push({name: 'org-org-sign', params: {orgId: data._id}})
        } else {
          this.$router.push({name: 'org-org-detail', params: {orgId: data._id, type}})
        }
      },
      search () {
        request(urlMap.org.loadWithChildsById, {id: getSearchId()}).then(res => {
          this.treeProps.props.data = convertListToTree(changeToTreeList(res.data.pageList))
        })
      },
      del ({_id}) {
        request(urlMap.org.delete, {id: _id}).then(res => {
          if (res.head.errCode === 0) {
            this.search()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      updateStruct () {
        if (!this.tsOrganizationDTOList.length) {
          this.$messageTips(this, 'error', '请拖拽后执行此操作！')
          return
        }
        request(urlMap.org.updateParentCodeRelationByIds, {tsOrganizationDTOList: this.tsOrganizationDTOList}).then(res => {
          if (res.head.errCode === 0) {
            this.tsOrganizationDTOList = []
            this.search()
            this.$messageTips(this, 'success', '执行成功！')
          }
        })
      },
      isManages () {
        return isManages()
      }
    },
  }
</script>
<style lang="less" scoped>
  .content-col-version1 {
    width: 100px;
    right: 878px;
  }
  .content-col-version2 {
    width: 100px;
    right: 600px;
  }
  .content-col-version3 {
    width: 100px;
    right: 338px;
  }
  .content-col-op{
    width: 150px;
  }
</style>
