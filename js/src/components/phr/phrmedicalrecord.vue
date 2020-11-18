<template>
    <div class="phr_medical_record">
        <phr-total-search 
            v-model="queryObj"
            emptyable
            search-type="medicalRecord"
        >
        </phr-total-search> 
        <div class="medical_record_wrap">
            <el-row v-if="listData&&listData.length>0">
                <el-col :span="6" style="background: #FAFAFB; border-left:1px solid #ccc; border-right:1px solid #ccc;" class="same_height">
                  <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-for="item in listData" :key="item.name" :name="item.visitRecordId">
                      <template slot="title">
                        <div class="menutitle">
                            <span class="visit_name">{{item.visitTypeName}}</span>&nbsp;&nbsp;<span class="date">{{$moment(item.createTime).format('YYYY-MM-DD')}}</span><br/>
                            <span class="dpt_name">{{item.visitDeptName}} {{item.visitOrgName}}</span>
                        </div>
                      </template>
                      <div>
                        <el-tree :data="item.treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
                <el-col :span="18" class="same_height" style="border-right:1px solid #ccc;" :class="{'visible_border':tabs.length>0}">
                  <el-tabs v-model="curTabValue" type="card" closable @edit="handleTabsEdit" @tab-click="selectedTab">
                    <el-tab-pane
                      :key="item.id"
                      v-for="item in tabs"
                      :label="item.name"
                      :name="item.id"
                    >
                      <medical-record :formObj="formObj" :key="formObj.id"></medical-record>
                    </el-tab-pane>
                  </el-tabs>   
                </el-col>
            </el-row>
            <el-row v-else>
              <everNoData tipTxt="暂无数据"></everNoData>
            </el-row>
        </div>
    </div>
</template>
<script>
import { uniqBy, findIndex } from 'lodash'
import phrTotalSearch from './phr.total.search'
import medicalRecord from './medical.record'
import medicalRecordApi from '@/workspace/store/phrmedicalrecord'
import check from './check.js'
function getCurObj (arr, id) {
  let index = findIndex(arr, function (o) {
    return o.visitRecordId === id
  })
  return arr[index]
}
export default {
  mixins: [check],
  props: {
    patientId: {
      type: String,
      default: ''
    }
  },
  components: {
    phrTotalSearch,
    medicalRecord
  },
  data () {
    return {
      activeNames: [],
      listData: [],
      treeData: [],
      queryObj: {},
      formObj: {},
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      curTabValue: '',
      tabs: []
    }
  },
  methods: {
    handleChange (val) {
      if (val.length === 0) return false
      let curId = val[val.length - 1]
      let curObj = getCurObj(this.listData, curId)
      medicalRecordApi.medicalRecordTree({
        visitInpatientSerialNumber: curObj.visitSerialNumber,
        tenantId: curObj.tenantId
      }).then(res => {
        this.$set(curObj, 'treeData', res)
      })
    },
    selectedTab (curtab) {
      this.formObj = this.arr = this.tabs.filter(item => {
        return item.id === curtab.name
      })[0]
    },
    handleTabsEdit (targetName, action) {
      if (action === 'remove') {
        let tabs = this.tabs
        tabs.forEach((tab, index) => {
          if (tab.id === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              this.curTabValue = nextTab.id
              this.formObj = nextTab
            }
          }
        })
        this.tabs = tabs.filter(tab => tab.id !== targetName)
      }
    },
    handleNodeClick (data) {
      if (data.type === 3) {
        // 点击树形菜单右侧显示对应的病历
        this.tabs.push(data)
        // 去重
        this.tabs = uniqBy(this.tabs, 'id')
        this.curTabValue = data.id
        this.formObj = data
      }
    },
    // 展示就诊记录里面的树形结构
    showMenu (item, index) {
      if (!item.isOpen) {
        this.$set(item, 'isOpen', true)
        medicalRecordApi.medicalRecordTree({
          visitInpatientSerialNumber: item.visitSerialNumber,
          tenantId: item.tenantId
        }).then(res => {
          this.$set(item, 'treeData', res)
        })
      } else {
        this.$set(item, 'isOpen', false)
      }
    }
  },
  watch: {
    queryObj: {
      handler (obj) {
        if (!this.patientId) return false
        this.activeNames = []
        this.tabs = []
        this.obj = Object.assign({
          patientId: this.patientId
        }, obj)
        medicalRecordApi.getDiagnosisRecord(this.obj).then(res => {
          this.listData = res
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.phr_medical_record /deep/.el-tree-node__label:hover{
  color: #1c7bef;
}
.visible_border{
  border-top:1px solid #ccc;
}
.phr_medical_record /deep/.el-collapse-item__header.is-active{
  border-bottom:1px solid #ccc;
}
.phr_medical_record /deep/.el-collapse-item__header{
  background: #F0F5FA;
  // border-left:1px solid #ccc;
  // border-right:1px solid #ccc;
}
.phr_medical_record /deep/.el-collapse-item__content{
  // border-left:1px solid #ccc;
  // border-right:1px solid #ccc;
}
.same_height{
  padding-bottom: 5000px;
  margin-bottom: -5000px;
}
.phr_medical_record /deep/.el-tabs--card>.el-tabs__header .el-tabs__nav{
  border-radius: 0;
  border-top:none;
}
.phr_medical_record /deep/.el-tabs--card>.el-tabs__header .el-tabs__nav:first-child{
  border-left:none;
}
.phr_medical_record /deep/.el-tabs--card>.el-tabs__header{
  margin:0;
  border-bottom:1px solid #ccc;
}
.el-col{
    -border:1px solid #ccc;
    min-height:300px;
}
.menulist ul{
  margin:0;
  padding: 0;
}

.menutitle{
  height:46px;
  padding-left:15px;
  padding-bottom:5px;
  line-height: 23px;
  
}
.menulist .hidden_border{
  margin:-1px 0;
}
.fl{
  float:left;
}
.fr{
  float:right;
}
.arrow{
  line-height: 46px;
  padding-right:15px;
  color:#bbb;
}
.visit_name{
  font-size: 12px;
  color: #1C7BEF;
}
.date{
  font-size: 12px;
  color: #999999;
}
.dpt_name{
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.menulist .menuitem{
  background:#FAFAFB;
  border-bottom:1px solid #DADCE0;
}
.el-tree{
  background:#FAFAFB;
}
.phr_medical_record /deep/.el-tabs__item{
  background:#F0F5FA;
  font-size: 14px;
  color: #666666;
}
.phr_medical_record /deep/.el-tabs__item.is-active{
  color: #000000;
  background: #fff;
}
.phr_medical_record /deep/.el-tabs__item{
  background:#F0F5FA;
  font-size: 14px;
  color: #666666;
  border-bottom: 1px solid #DADCE0;
}
.phr_medical_record /deep/.el-tabs__item.is-active{
  color: #000000;
}

</style>

