<template>
  <div class="bottle_paper">
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true">
            <template slot="termTypes">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <div slot="default" class="el-form-item">
              <el-button type="primary" @click="queryList" style="padding: 8px 12px;margin-right:10px;">查询</el-button>
              <el-checkbox v-model="allSelect" @change="allSelectChange" :disabled="!showTableData.length">全选</el-checkbox>
            </div>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <!-- <el-button size="small" type="primary" @click="printEvent" :disabled="!selectList.length">打印</el-button> -->
          <el-dropdown @command="print">
            <el-button size="small" type="primary" :disabled="!showTableData.length">
              打印<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="print-dropdown">
              <el-dropdown-item command="page" :disabled="!selectData.length">打印选中项目</el-dropdown-item>
              <el-dropdown-item command="all">打印全部项目</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <el-row class="main-wrap ever-row-01">
        <el-checkbox-group v-model="selectList" v-if="showTableData.length">
          <el-col v-for="option in Object.keys(fuziData)" :key="option">
            <el-checkbox :label="fuziData[option]" :class="{'isChecked': selectIds.includes(fuziData[option][0].id)}">
              <template>
                <p class="patientInfo">
                  <span class="bed">{{fuziData[option][0].bedName}}</span>
                  <span class="name">{{fuziData[option][0].patientName}}</span>
                  <span class="time">{{fuziData[option][0].planTime}}</span></p>
                <ul class="serviceList">
                  <li class="serviceItem" v-for="(service, index) in fuziData[option]" :key="index">
                    <el-tooltip effect="light">
                      <span slot="content">{{service.adviceJson.doctorAdviceName}}</span>
                      <span class="name">{{service.adviceJson.doctorAdviceName}}</span>
                    </el-tooltip>
                    <span class="spec">{{service.measure}}{{service.adviceJson.measureUnitName}}</span>
                  </li>
                </ul>
                <p class="otherInfo">
                  <span class="employ">用法：{{fuziData[option][0].adviceJson.employName}}</span>
                  <span class="employ" v-if="fuziData[option][0].adviceJson"><sys-value type="THC_CPOE_DropRate" v-if="fuziData[option][0].adviceJson.dropSpeed" :code="fuziData[option][0].adviceJson.dropSpeed"></sys-value></span>
                  <span class="useFreq">{{fuziData[option][0].adviceJson.useFreqName}}</span>
                </p>
              </template>
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
        <ever-no-data tipTxt="暂无数据" v-else></ever-no-data>
      </el-row>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="queryObj.page"
          :pagesize="queryObj.pagesize"
        ></ever-pagination>
      </el-row>
      <!-- 患者列表监听 -->
      <inpatient-refresh
        ref="inpatientRefresh"
        :query="this.$route.query"
        :checks="['bedId', 'areaId', 'providerId']"
        @refresh="refresh"
      ></inpatient-refresh>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import api from '@/inpatient/store/advice/execute.print'
import autoprintsetapi from '@/sob/store/autoprintsetapi'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    clearInfo: Function
  },
  data () {
    let querySchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'planTime',
        label: '计划时间',
        comp: 'el-date-picker',
        props: {
          type: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          placeholder: ''
        }
      },
      {
        name: 'printStatus',
        label: '',
        comp: 'ever-select',
        props: {
          placeholder: '请选择是否打印',
          options: [{
            id: '0',
            name: '未打印'
          }, {
            id: '1',
            name: '已打印'
          }],
          filterable: true,
          clearable: true,
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termTypes = -1
    queryObj.planTime = this.$moment().format('YYYY-MM-DD')
    return {
      storage,
      api,
      querySchema,
      queryObj,
      tableData: [],
      totalCount: 0,
      selectList: [],
      allSelect: false
    }
  },
  components: {
    inpatientRefresh // 患者列表监听
  },
  created () {
    this.queryObj.pagesize = Number(this.$route.query.pagesize) || 20
    this.queryObj.page = Number(this.$route.query.page) || 1
    this.queryObj.offset = this.queryObj.pagesize * this.queryObj.page
  },
  mounted () {
    // this.queryObj.page = 1
    // this.queryObj.page = Number(this.$route.query.page)
    // this.queryObj.offset = (Number(this.$route.query.page) - 1) * Number(this.$route.query.pagesize)
    this.saveSizeChange()
    this.getDocumentList()
  },
  methods: {
    // tab获取住院护士打印配置
    getDocumentList () {
      let parms = {
        source: 3,
        executeTypeCode: 'PING_TIE'
      }
      this.documentList = []
      autoprintsetapi.getConfigList(parms).then(res => {
        if (res.data.length > 0) {
          this.queryObj.includeAdviceType = res.data[0].includeAdviceType
          this.queryObj.includeUsage = res.data[0].includeUsage
          this.queryObj.code = res.data[0].executeTypeCode
          this.queryList()
        }
      })
    },
    // 分页，获取每页页数
    handleSizeChange (pagesize) {
      this.queryObj.pagesize = pagesize
      this.saveSizeChange()
      this.queryList()
    },
    // 分页，获取当前页码
    handleCurrentChange (page) {
      this.queryObj.page = page
      this.saveSizeChange()
      this.queryList()
    },
    // 保存分页信息到route
    saveSizeChange () {
      this.selectList = []
      this.queryObj.offset = (this.queryObj.page - 1) * this.queryObj.pagesize
      let obj = {
        page: this.queryObj.page,
        pagesize: this.queryObj.pagesize,
        offset: this.queryObj.offset
      }
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...Object.assign({}, this.baseInfo, obj)
        }
      })
    },
    // 获取查询参数
    getParams () {
      if (this.queryObj.termTypes > -1) {
        this.queryObj.termType = String(this.queryObj.termTypes)
      } else if (this.queryObj.termType) {
        delete this.queryObj.termType
      }
      this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
      this.queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      this.queryObj.patientId = this.baseInfo.patientId // 医嘱id
      this.queryObj.patientName = this.baseInfo.patientName
      return Object.assign({}, this.queryObj)
    },
    // 查询列表
    queryList () {
      this.getParams()
      this.selectList = []
      this.queryEvent()
    },
    async queryEvent () {
      let res = await api.queryBottlePaperList(this.queryObj)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
        this.totalCount = res.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    allSelectChange (val) {
      if (val) {
        this.selectList = []
        Object.keys(this.fuziData).forEach(item => {
          this.selectList.push(this.fuziData[item])
        })
      } else {
        this.selectList = []
      }
    },
    async getAllDataIds () {
      let params = this.getParams()
      params.isAll = 1
      let res = await api.queryBottlePaperList(params)
      if (res && res.list && res.list.length) {
        return res.list
      }
      return []
    },
    async print (type) {
      if (type === 'page') {
        this.printEvent()
      }
      if (type === 'all') {
        let executeIdList = await this.getAllDataIds()
        mutiplePrint([{
          code: 'ZY_CPOE_PING_TIE',
          params: {
            executeIdList: executeIdList,
          },
          printParams: {
            cb: () => {
              api.addExecutePrintRecord({
                executeIdList: executeIdList,
                code: 'PING_TIE'
              })
            }
          }
        }])
      }
    },
    // 打印
    printEvent () {
      let arr = []
      let executeIdList = []
      this.selectData.forEach(item => {
        item.forEach(v => {
          executeIdList.push(v.id)
        })
      })
      if (!executeIdList.length) {
        return
      }
      arr = [{
        code: 'ZY_CPOE_PING_TIE',
        params: {
          executeIdList: executeIdList
        },
        printParams: {
          cb: () => {
            api.addExecutePrintRecord({
              executeIdList: executeIdList,
              code: 'PING_TIE'
            })
          }
        }
      }]
      mutiplePrint(arr)
    },
    // 患者状态发生变化
    refresh (key, patient, list) {
      if (key === 'storage') {
        this.$router.push({query: {
          areaId: storage.getLocalStorage('inpatientKey').split(',')[0]
        }})
        this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
        this.clearInfo && this.clearInfo()
        return
      }
      if (!patient && this.inpatientNumber !== list.length) {
        this.$router.push({query: {
          areaId: this.$route.query.areaId
        }})
        this.clearInfo && this.clearInfo()
        this.inpatientNumber = list.length
        this.queryList()
        return
      }
      this.inpatientNumber = list.length
    }
  },
  computed: {
    showTableData () {
      let data = []
      this.tableData.forEach(item => {
        item.mainGroupIdFlag = item.mainGroupId + '_' + item.planTime
        data.push(item)
        if (item.subExecutePrintDtoList && item.subExecutePrintDtoList.length) {
          item.subExecutePrintDtoList.forEach(v => {
            v.mainGroupIdFlag = v.mainGroupId + '_' + v.planTime
            data.push(v)
          })
        }
      })
      return data
    },
    fuziData () {
      let obj = {}
      this.showTableData.forEach(v => {
        if (obj[v.mainGroupIdFlag]) {
          obj[v.mainGroupIdFlag].push(v)
        } else {
          obj[v.mainGroupIdFlag] = [v]
        }
      })
      return obj
    },
    selectIds () {
      let ids = []
      // this.selectData.forEach(v => {
      //   ids.push(v.id)
      // })
      this.selectData.forEach(item => {
        return item.forEach(v => ids.push(v.id))
      })
      return ids
    },
    selectData () {
      let list = []
      this.selectList.forEach(item => {
        // list = list.concat(item)
        list.push(item)
      })
      return list
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        this.queryList()
      },
      deep: true
    },
    'baseInfo': {
      handler (val) {
        this.queryObj.page = 1
        this.saveSizeChange()
        this.queryList()
      },
      deep: true
    },
    selectList (val) {
      if (val.length && val.length === Object.keys(this.fuziData).length) {
        this.allSelect = true
      } else {
        this.allSelect = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottle_paper {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      margin-top: 12px;
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-form-item {
          margin: 0 10px 2px 0;
        }
      }
      .alg_r {
        line-height: 30px;
      }
    }
    .main-wrap {
      overflow: auto;
      margin: 15px 0 0 0;
      /deep/ .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        .el-col {
          padding-left: 0;
          margin-bottom: 10px;
        }
        .isChecked {
          border-color: #1c7bef !important;
        }
        /deep/ .el-checkbox {
          width: 100%;
          margin-right: 0;
          height: 168px;
          border: 1px solid #ddd;
          background: #fcfcfc;
          box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
          border-radius: 4px;
          overflow: hidden;
          transition: .3s;
          &:hover {
            border-color: #1c7bef;
          }
          .el-checkbox__input {
            vertical-align: top;
            position: absolute;
            left: 10px;
            top: 11px;
          }
          .el-checkbox__label {
            color: #000;
            width: 100%;
            height: 100%;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              margin: 0;
              line-height: 35px;
              overflow: hidden;
              span {
                float: left;
              }
            }
            .patientInfo {
              font-size: 16px;
              background: #E8F3FF;
              padding: 0 10px;
              .bed {
                text-indent: 25px;
                margin-right: 10px;
              }
              .time {
                float: right;
              }
            }
            .serviceList {
              flex: 1;
              margin: 0;
              padding-left: 10px;
              overflow: auto;
              .serviceItem {
                line-height: 26px;
                overflow: hidden;
                span {
                  float: left;
                }
                .name {
                  max-width: 70%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .spec {
                  float: right;
                  margin-right: 10%;
                }
              }
            }
            .otherInfo {
              border-top: 1px solid #ddd;
              .employ {
                text-indent: 10px;
                margin-right: 10px;
              }
            }
          }
        }
      }
      .com_no_data {
        margin: 180px auto 0;
      }
    }
  }
}
.print-dropdown {
  /deep/ .el-dropdown-menu__item.is-disabled {
    color: #aaa;
    cursor: not-allowed;
  }
}
</style>
