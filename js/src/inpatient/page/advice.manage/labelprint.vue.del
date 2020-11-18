<template>
  <div class="advice_label_print">
    <div class="layout_inner">
      <div class="main-head">
        <el-row>
          <el-col :span="24">
            <ever-form2
              :schema="querySchema"
              v-model="queryObj"
              :inline="true"
              :is-query="true"
              @query="queryList"
              :gutter="10"
              labelWidth="0"
              class="labelprintForm"
            >
              <template slot="patientId">
                <patient-select-filter
                  v-model="queryObj.patientId"
                  :patient-name="$route.query.patientName"
                ></patient-select-filter>
              </template>
              <template slot="default">
                <el-button
                  @click="queryList"
                  icon="el-icon-search"
                  style="margin-left:10px;margin-top:2px;"
                >查询</el-button>
                <el-button @click="reset" style="margin-top:2px;">重置</el-button>
              </template>
            </ever-form2>
          </el-col>
        </el-row>
        <el-row class="btn-box">
          <el-col :span="5" :offset="19" class="alg_r">
            <template v-if="queryObj.adviceType !== '10003'">
              <ever-confirm
                type="default"
                size="small"
                msg="你确定要拆分当前项目吗？"
                action="分管"
                @confirm="splitTube"
                :disabled="isActiveSplit"
              ></ever-confirm>
              <ever-confirm
                type="default"
                size="small"
                msg="你确定要合并当前项目吗？"
                action="合管"
                @confirm="mergeTube"
                :disabled="isActiveMerge"
              ></ever-confirm>
            </template>
            <el-button :disabled="!selectIds.length" @click="labelPrint">打印标签</el-button>
            <el-button :disabled="!selectIds.length" type="primary" @click="confirmCollect">采集确认</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-wrap">
        <el-table
          v-loading.body="loading"
          :data="tableDataList"
          style="width: 100%"
          class="no-vertical-border"
          :span-method="arraySpanMethod"
          @selection-change="handleSelectionChange"
          :key="keyRandom"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="80" label="床号">
            <template slot-scope="scope">
              <template v-if="scope.row.hospitalizedBedName">{{scope.row.hospitalizedBedName}}</template>
            </template>
          </el-table-column>
          <el-table-column label="患者信息">
            <template slot-scope="scope">
              {{scope.row.patientName}}
              <template>
                <template v-if="scope.row.sex">
                  /
                  <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
                </template>
                <template v-if="scope.row.age">/ {{scope.row.age}}岁</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="标本类型" v-if="queryObj.adviceType !== '10003'">
            <template slot-scope="scope">
              <sys-value type="THC_SOB_SPECIMEN_TYPE" :code="scope.row.specimenType"></sys-value>
            </template>
          </el-table-column>
          <el-table-column width="260" label="检验项目">
            <template slot-scope="scope">
              <template v-if="scope.row.commonList && scope.row.commonList.length">
                <el-table
                  class="el-table-child no-border"
                  :data="scope.row.commonList"
                  style="width: 100%;margin: 0;"
                  :show-header="false"
                >
                  <el-table-column width="260" prop="serviceName">
                    <template slot-scope="scopes">
                      <span>{{scopes.row.serviceName}}</span>
                      <span v-if="Number(scopes.row.isEmergency)">
                        <i class="txt_icon">急</i>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="startTime"></el-table-column>
                  <el-table-column prop="checkGuidance"></el-table-column>
                </el-table>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="开始时间"></el-table-column>
          <el-table-column label="检验指导"></el-table-column>
          <el-table-column width="180" prop="barcode" label="标本号"></el-table-column>
          <el-table-column width="140" label="采集时间">
            <template slot-scope="scope">
              <span>{{scope.row.gatherDateTime ? $moment(scope.row.gatherDateTime).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gather" label="采集人"></el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/inpatient/store/advice/labelprint'
// import residentapi from '@/inpatient/store/resident'
import registerapi from '@/rcm/store/hospitalization/register'
import list from '@/util/list'
import storage from '@/util/storage'
import patientSelectFilter from '@/inpatient/page/advice.manage/patient.select.filter'
import { ageShow, frPrint } from '@/util/common'
import { findIndex } from 'lodash'

export default {
  mixins: [list],
  data () {
    let querySchema = [
      // {
      //   name: 'areaId',
      //   label: '',
      //   comp: 'sys-select',
      //   span: 3,
      //   props: {
      //     options: [],
      //     placeholder: '病区'
      //   }
      // },
      {
        name: 'adviceType', // 单选 - adviceType | 多选 - adviceTypes 后端做了处理
        label: '',
        comp: 'sys-select',
        style: {
          width: '100px'
        },
        props: {
          clearable: false,
          placeholder: '医嘱类型',
          options: [
            {
              id: 801,
              name: '检验类'
            },
            {
              id: 10001,
              name: '备血类'
            },
            {
              id: 10003,
              name: '病理类'
            }
          ]
        }
      },
      {
        name: 'hospitalizedBedId',
        label: '床号',
        comp: 'sys-select',
        style: {
          width: '100px'
        },
        props: {
          options: [],
          placeholder: '床号'
        }
      },
      {
        name: 'specimenType',
        label: '标本类型',
        comp: 'sys-type',
        props: {
          placeholder: '标本类型',
          code: 'THC_SOB_SPECIMEN_TYPE'
        }
      },
      {
        name: 'gather',
        label: '是否采集',
        comp: 'sys-select',
        style: {
          width: '100px'
        },
        props: {
          placeholder: '是否采集',
          options: [
            {
              id: 1,
              name: '已采集'
            },
            {
              id: 0,
              name: '未采集'
            }
          ]
        }
      },
      // {
      //   name: 'patientId',
      //   label: '',
      //   span: 3,
      //   comp: 'ever-patient-select'
      // },
      {
        name: 'patientId',
        label: '患者',
        span: 3,
        comp: 'custom'
      },
      {
        name: 'startDate',
        label: '开始时间',
        comp: 'el-date-picker',
        span: 3,
        props: {
          placeholder: '开始时间',
          type: 'date',
          valueFormat: 'yyyy-MM-dd'
        }
      },
      {
        name: 'gatherDate',
        label: '采集时间',
        comp: 'el-date-picker',
        span: 3,
        props: {
          placeholder: '采集时间',
          type: 'date',
          valueFormat: 'yyyy-MM-dd'
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.gather = '0'
    queryObj.startDate = this.$moment(new Date()).format('YYYY-MM-DD')
    queryObj.areaId = this.spaceId
    queryObj.adviceType = '801'
    return {
      api,
      // residentapi,
      registerapi,
      ageShow,
      querySchema,
      queryObj,
      selectIds: [],
      printArray: [],
      tableDataList: [],
      keyRandom: 0
    }
  },
  computed: {
    isActiveMerge () {
      let state = false
      if (this.selectIds.length < 2) {
        return true
      }
      let patientId = this.selectIds[0].commonList[0].patientId
      let specimenType = this.selectIds[0].commonList[0].specimenType
      this.selectIds.forEach(item => {
        item.commonList.forEach(obj => {
          if (patientId !== obj.patientId || specimenType !== obj.specimenType) {
            state = true
          }
        })
      })
      return state || !this.checkTubeOperate()
    },
    isActiveSplit () {
      let state = true
      if (this.selectIds.length === 0) {
        return true
      }
      this.selectIds.forEach(item => {
        if (item.commonList && item.commonList.length > 1) {
          state = false
        }
      })
      return state || !this.checkTubeOperate()
    },
    spaceId () {
      return storage.getSessionStorage('spaceId')
    }
  },
  components: {
    patientSelectFilter
  },
  created () {
    this.queryList()
    this.getAdmitBedSelect()
    // this.getSpaceRecordVoListForService()
    // this.$ever.getFieldFromSchema(this.querySchema, 'hospitalizedBedId').props.disabled = true
    // 判断某一个打印机打印完成，启动下一个打印任务
    var _this = this
    window.addEventListener('message', function (e) {
      if (e.data === 'printdone' && _this.printArray.length) {
        _this.printRecipe()
      }
    }, false)
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.queryObj.adviceType === '10003') {
        if (columnIndex === 3) {
          return [1, 3]
        } else if (columnIndex === 4 || columnIndex === 5) {
          return [0, 0]
        }
      } else {
        if (columnIndex === 4) {
          return [1, 3]
        } else if (columnIndex === 5 || columnIndex === 6) {
          return [0, 0]
        }
      }
    },
    // 获取病区列表
    // async getSpaceRecordVoListForService () {
    //   const res = await residentapi.getSpaceRecordVoListForService()
    //   if (res && res.head && res.head.errCode === 0 && res.data && res.data.length) {
    //     this.$ever.getFieldFromSchema(this.querySchema, 'areaId').props.options = res.data
    //   }
    // },
    // 获取床号列表
    async getAdmitBedSelect () {
      let params = {
        relationType: '201',
        relationId: this.spaceId
      }
      const res = await registerapi.getAdmitBedSelect(params)
      if (res && res.head && res.head.errCode === 0 && res.data && res.data.resultList && res.data.resultList.length) {
        // this.$ever.getFieldFromSchema(this.querySchema, 'hospitalizedBedId').props.disabled = false
        let list = []
        res.data.resultList.forEach(item => {
          list.push({
            id: item.id,
            name: item.bedNum
          })
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'hospitalizedBedId').props.options = list
      }
    },
    reset () {
      this.queryObj = Object.assign({}, this.queryObj, {
        // areaId: this.spaceId,
        bedNo: '',
        collectTime: '',
        isCollect: '',
        patientId: '',
        specimenType: '',
        startDate: ''
      })
      this.list(true)
    },
    queryList () {
      // 医嘱类型 检验 - 801 | 备血 - 10001 | 病理 - 10003
      let adviceType = this.queryObj.adviceType
      if (adviceType === '10003') {
        this.queryObj.specimenType = ''
      }
      this.queryObj.areaId = this.spaceId
      this.queryObj.isGather = !this.queryObj.gather ? '' : Number(this.queryObj.gather)
      // 手术室护士只看麻醉医生的医嘱，产房护士只看产房医生的医嘱，住院护士可看所有场景的医嘱
      if (this.$route.path.split('/')[1] === 'csa') {
        this.queryObj.subVisitTypeList = [303]
        this.queryObj.areaId = storage.getSessionStorage('csaSpaceId')
      } else if (this.$route.path.split('/')[1] === 'birth_nurse') {
        this.queryObj.subVisitTypeList = [304, 305]
      } else {
        // this.queryObj.subVisitTypeList = [301, 302]
      }
      if (this.$route.path.indexOf('birth') > -1) {
        this.queryObj.areaId = storage.getSessionStorage('birthSpaceId')
      }
      this.list(true)
    },
    async labelPrint () {
      if (!this.selectIds || !this.selectIds.length) {
        return this.$messageTips(this, 'warning', '请选择要操作的检验项', '提示')
      }
      let list = []
      let updateId = []
      this.selectIds.forEach(item => {
        let ids = []
        item.commonList.forEach(value => {
          ids.push(value.id)
          if (item.isPrint !== 1) {
            updateId.push({ id: value.id })
          }
        })
        list.push({ id: ids.join("','") })
      })
      if (updateId.length) {
        const res = await api.updatePrint(updateId)
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功', '提示')
          this.list()
        }
      }
      if (list.length) {
        list.forEach(item => {
          this.printArray.push({
            code: 'BING_AN_TIAO_MA_DA_YIN',
            params: {
              id: item.id,
              doctorId: this.$store.state.currentUser.userId
            },
            printParams: {
              preview: false,
              settings: {
                portrait: false,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0
              }
            }
          })
        })
        this.printRecipe()
      }
    },
    printRecipe () {
      let toPrint = this.printArray.shift()
      if (toPrint) {
        frPrint(toPrint.code, toPrint.params, toPrint.printParams)
      }
    },
    async confirmCollect () {
      if (!this.selectIds || !this.selectIds.length) {
        return this.$messageTips(this, 'warning', '请选择要操作的检验项', '提示')
      }
      let flag = false
      let temp = []
      this.selectIds.forEach(item => {
        if (item.isPrint === 1) {
          flag = true
        }
      })
      if (!flag) {
        return this.$messageTips(this, 'warning', '您勾选了未打印标签的检验项,请先打印标签', '提示')
      } else {
        this.selectIds.forEach(item => {
          if (item.isGather !== 1) {
            item.commonList.forEach(value => {
              temp.push({ id: value.id })
            })
          }
        })
        if (!temp.length) {
          return this.$messageTips(this, 'warning', '已完成采集,请勿重复操作', '提示')
        }
      }
      const res = await api.confirmCollect(temp)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '操作成功', '提示')
        this.list()
      }
    },
    handleSelectionChange (val) {
      this.selectIds = []
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item)
        })
      }
    },
    // 检测是否能合管和分管
    checkTubeOperate () {
      let valide = true
      this.selectIds.forEach(item => {
        item.commonList && item.commonList.forEach(obj => {
          if (obj.isGather || obj.isPrint) {
            valide = false
          }
        })
      })
      return valide
    },
    getTubeData () {
      let visitIds = []
      this.selectIds.forEach(item => {
        item.commonList.forEach(obj => {
          visitIds.push(obj.id)
        })
      })
      return visitIds
    },
    // 分管
    splitTube () {
      if (this.checkTubeOperate()) {
        const doctorAdviceIds = this.getTubeData()
        api.tubeOperate({
          doctorAdviceIds,
          mergeFlag: false
        }).then(res => {
          this.$messageTips(this, 'success', '操作成功', '提示')
          this.list()
        })
      } else {
        this.$messageTips(this, 'warning', '已采集或者已打印的项目不能拆分', '提示')
      }
    },
    // 合管
    mergeTube () {
      if (this.checkTubeOperate()) {
        const doctorAdviceIds = this.getTubeData()
        api.tubeOperate({
          doctorAdviceIds,
          mergeFlag: true
        }).then(res => {
          this.$messageTips(this, 'success', '操作成功', '提示')
          this.list()
        })
      } else {
        this.$messageTips(this, 'warning', '已采集或者已打印的项目不能合并', '提示')
      }
    }
  },
  watch: {
    // 'queryObj.areaId' (val) {
    //   if (val) {
    //     this.getAdmitBedSelect()
    //   } else {
    //     this.$ever.getFieldFromSchema(this.querySchema, 'hospitalizedBedId').props.disabled = true
    //     this.queryObj.hospitalizedBedId = ''
    //   }
    // }
    'spaceId' (val) {
      if (val) {
        this.getAdmitBedSelect()
      }
    },
    tableData (val) {
      this.tableDataList = []
      val.forEach(value => {
        if (value[0]) {
          value[0].commonList = JSON.parse(JSON.stringify(value))
          this.tableDataList.push(value[0])
        }
      })
    },
    'queryObj.patientId' (val) {
      this.queryList()
    },
    'queryObj.adviceType' (val) {
      const specimenType = {
        name: 'specimenType',
        label: '标本类型',
        comp: 'sys-type',
        props: {
          placeholder: '标本类型',
          code: 'THC_SOB_SPECIMEN_TYPE'
        }
      }
      let arrIndex = findIndex(this.querySchema, (item) => item.name === 'specimenType')
      if (val === '10003' && arrIndex !== -1) {
        this.querySchema.splice(arrIndex, 1)
        this.keyRandom = Math.random()
      } else if (arrIndex === -1) {
        this.querySchema.splice(2, 0, specimenType)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .btn-box {
  margin-top: 20px;
}
.advice_label_print {
  flex: 1;
}
.layout_inner {
  padding: 10px;
  overflow: hidden;
}
.main-head {
  margin-bottom: 0;
  /deep/ .el-date-editor {
    width: 100% !important;
  }
  .labelprintForm {
    /deep/ .btn-box {
      margin-top: 20px;
    }
    /deep/ .el-form-item:nth-child(2) {
      .el-form-item__content {
        width: 100px;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form-item__label,
      .el-form-item__content {
        height: 30px;
        line-height: 30px;
      }
      .el-input__inner,
      .el-input__prefix,
      .el-input__suffix {
        height: 30px;
        line-height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  /deep/.el-button {
    padding: 5px 10px;
    font-size: 12px;
  }
  .alg_r {
    line-height: 30px;
  }
}
/deep/.el-form {
  border-bottom: none !important;
  margin-bottom: 0 !important;
}
.main-wrap {
  .el-table-child {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    /deep/.el-table__body {
      width: 100% !important;
    }
    /deep/ .el-table__row {
      td {
        border-right: none !important;
        border-bottom: none !important;
        padding: 0 !important;
        &:first-child {
          .cell {
            padding-left: 0;
          }
        }
      }
      &:last-child {
        td {
          border-bottom: none !important;
        }
      }
    }
  }
  > /deep/ .el-table {
    border-right: 1px solid #ccc !important;
    /deep/ td {
      padding: 4px 0 !important;
    }
  }
}
</style>
