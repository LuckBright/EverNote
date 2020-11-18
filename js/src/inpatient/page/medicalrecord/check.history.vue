<template>
  <div class="flex_column_full flex_column_full_hidden checkhistory">
    <div class="title">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="query">
      </ever-form2>
    </div>
    <div class="flex_col_1_auto historywrap">
      <el-row class="tablewrap">
        <el-col :span="leftSpan" class="tableCon" :style="{width: !hideTable ? '25%' : 0, marginRight: !hideTable ? '10px' : 0}">
          <el-table
            :data="leftTableData"
            @expand-change="setInfo"
            @header-click="headerClick">
            <el-table-column
              :header-align="columnAlign"
              prop="hospitalizedTime"
              width="100"
              show-overflow-tooltip
              label="入院日期">
              <template slot-scope="scope">
                {{scope.row.hospitalizedTime}}
              </template>
            </el-table-column>
            <el-table-column
              :header-align="columnAlign"
              prop="admissionTenantSubjectName"
              show-overflow-tooltip
              label="入院科室">
            </el-table-column>
            <el-table-column
              type="expand">
              <template slot-scope="props">
                <div class="expand_tree">
                  <el-tree
                    :data="contentData[props.row.visitRecordId]"
                    :props="defaultTreeProps"
                    @node-click="handleNodeClick"></el-tree>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="35"
              prop="openIcon"
              header-align="right">
              <template slot="header">
                <i class="iconfont icon-date_lefe hand"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="middleSpan">
          <div class="expand" @click="hideTable = false">
            <i class="iconfont icon-date_right hand"></i>
          </div>
        </el-col>
        <el-col
          :span="rightSpan"
          class="content">
          <div :class="showBorder ? 'component-content' : ''" v-if="historyItem && Object.keys(historyItem).length">
            <tpl-doc
              v-if="showDoc"
              ref="historyDoc"
              :visit-id="historyItem.visitId"
              :patient-id="patientId"
              :dpt-id="historyItem.dptId"
              :data-id="historyItem.id"
              :schema-id="historyItem.formTemplateId"
              :editable="false"
              :key="historyItem.id"
              doctype="2">
            </tpl-doc>
            <tpl-form
              v-if="showForm"
              ref="historyForm"
              :data-id="historyItem.id"
              :schema-id="historyItem.formTemplateId"
              :allDisabled="true"
              :key="historyItem.id"></tpl-form>
            <div
              v-if="showIndex"
              class="back_btn hand">
              <el-button type="text"
                         @click="back=!back">
                <i class="el-icon-document-checked">正反面</i>
              </el-button>
            </div>
            <medical-index
              v-if="showIndex"
              ref="historyIndex"
              :back="back"
              :patientId="patientId"
              :visitId="historyItem.visitId"
              :dptId="historyItem.dptId"
              :readonly="true"
              :key="historyItem.id"></medical-index>
          </div>
          <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import storage from '@/util/storage'
  import tplDoc from '@/form/components/tpldoc'
  import tplForm from '@/form/components/tplform'
  import medicalIndex from '@/components/medicalindex/index'

  import urlMap from '@/inpatient/urls'
  import { request } from '@/util/req'
  import { dateFormat } from '@/util/common'

  export default {
    name: 'check_history',
    props: {
      patientId: {
        type: String
      },
      visitStatus: {
        type: String,
        default: '9'
      }
    },
    components: {
      tplDoc,
      tplForm,
      medicalIndex
    },
    data () {
      let schema = [
        {
          name: 'comeTime',
          label: '入院日期',
          comp: 'date-picker',
          props: {
            type: 'daterange',
            outformat: 'yyyy-MM-dd',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          }
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        obj,
        leftTableData: [],
        contentData: {},
        defaultTreeProps: {
          children: 'nodes',
          label: 'name'
        },
        binganCode: 'ZHU_YUAN_BING_AN_SHOU_YE',
        historyItem: {},
        curNode: {},
        showDoc: false,
        showForm: false,
        showIndex: false,
        hideTable: false,
        tenantId: storage.getLocalStorage('TENANTID'),
        visitOrgId: storage.getLocalStorage('CLINICID'),
        columnAlign: 'left',
        back: false
      }
    },
    computed: {
      showBorder () {
        return this.showDoc || this.showForm
      },
      defaultQueryObj () {
        return {
          patientId: this.patientId,
          visitStatusCode: this.visitStatus,
          tenantId: this.tenantId,
          visitOrgId: this.visitOrgId,
          visitTypeCode: this.$route.matched[0].meta.type
        }
      },
      leftSpan () {
        return this.hideTable ? 0 : 6
      },
      rightSpan () {
        return this.hideTable ? 23 : 18
      },
      middleSpan () {
        return this.hideTable ? 1 : 0
      }
    },
    watch: {
      showIndex: {
        handler (val) {
          if (val) this.back = false
        }
      }
    },
    created () {
      this.query()
    },
    methods: {
      handleNodeClick (data) {
        if (data.designerId === '2' && data.code !== this.binganCode && data.instance) {
          this.showDoc = true
          this.showForm = false
          this.showIndex = false
        } else if (data.designerId === '1' && data.code !== this.binganCode && data.instance) {
          this.showDoc = false
          this.showForm = true
          this.showIndex = false
        } else if (data.code === this.binganCode && data.visitId) {
          this.showDoc = false
          this.showForm = false
          this.showIndex = true
        } else {
          return
        }

        this.historyItem = Object.assign({}, this.historyItem, data)
      },
      query () {
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.comeTime && queryObj.comeTime.length === 2) {
          queryObj.comeStartTime = dateFormat(this.obj.comeTime[0], false, 'startDay')
          queryObj.comeEndTime = dateFormat(this.obj.comeTime[1], false, 'endDay')
        }
        delete queryObj.comeTime

        this.showDoc = false
        this.showForm = false
        this.showIndex = false
        request(urlMap.quote.history.all, queryObj).then(res => {
          if (res.head.errCode === 0) {
            this.leftTableData = res.data
          }
        })
      },
      setInfo (data, dataArr) {
        if (dataArr.length > 0 && !this.contentData[data.visitRecordId]) {
          this.$set(this.contentData, data.visitRecordId, [])
          let query = {visitNumber: data.visitSerialNumber, type: '1'}
          request(urlMap.quote.history.tree, query).then(res => {
            if (res.head.errCode === 0) {
              this.contentData[data.visitRecordId] = res.data
            }
          })
        }
      },
      headerClick (column) {
        if (column.property === 'openIcon') this.hideTable = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkhistory {
    background: #f5f5f5;
  }
  .title {
    height: 32px;
    padding: 5px 5px;
    border-bottom: 1px solid #dadce0;
    background: #fff;
  }
  .content {
    background: #fff;
    overflow: auto;
    position: relative;
    height: auto;
  }
  .component-content {
    border: 1px solid #dadce0;
    margin: 10px;
  }
  .expand {
    margin-top: 10px;
    width: 29px;
    height: 30px;
    line-height: 30px;
    background: #F0F5FA;
    box-shadow: 3px 0 10px 0 #D9DBE0, inset -1px 0 0 0 #D9DBE0;
    text-align: center;
    border-radius: 2px;
  }
  .hand {
    margin: auto;
    cursor: pointer;
    color: rgba(85,107,133,0.60);
    font-size: 12px;
  }
  .back_btn {
    margin-left: 20px;
    .el-button--text {
      color: #000;
    }
  }
  .historywrap {
    margin-top: 10px;
    .tablewrap {
      display: flex;
      height: 100%;
      overflow: hidden;
      .tableCon {
        background: #F5F8FB;
        box-shadow: 3px 0 10px 0 #D9DBE0;
        overflow: hidden;
        transition: all .3s;
        display: inline-block;
        /deep/ .el-table {
          margin: 0;
          border: none;
          min-width: 300px;
          background-color: transparent;
          &:before {
            height: 0;
          }
          tr {
            background-color: transparent;
            .el-table__expanded-cell {
              background-color: transparent;
            }
            .el-tree {
              background-color: transparent;
              .el-tree-node {
                &.is-current > .el-tree-node__content {
                  background: #E9F2FB;
                  border-radius: 2px;
                  color: #1C7BEF;
                }
                &:not(.is-current) > .el-tree-node__content:hover {
                  background: #1C7BEF;
                  border-radius: 2px;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
  /deep/ el-table__expanded-cell{
    padding:20px 10px;
  }
  .expand_tree{
    overflow:scroll;
    max-height:200px;
    width:214px;
  }
</style>
