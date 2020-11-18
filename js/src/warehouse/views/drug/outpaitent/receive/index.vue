<!-- 门诊 收方发药 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <el-container class="page_layout_full_hidden">
      <el-main class="page_layout_full_hidden main">
        <el-container class="flex_column_full_hidden station_layout_wrap">
          <el-row class="bWhite ptb15 radius" type="flex" justify="center" align="middle">
            <el-col :span="11" :offset="6">
              <search-old class="no-margin-table" :is-show-query="true" ref="searchInput" @query="fetchList"></search-old>
            </el-col>
            <el-col :span="6" :offset="1">
              <!-- <span v-if="dispenseObj">处方单：2 / 3</span> -->
            </el-col>
          </el-row>
          <!-- 查询条件头组件 -->
          <el-main class="page_layout_full_hidden main mt10">
            <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
              <template v-if="dispenseObj || auditObj">
                <el-main class="flex_scroll main">
                    <!-- 患者头组件 -->
                  <patient-header :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
                  <!-- 查询条件头组件 -->
                  <check-group
                    :show-common-component="!!dispenseObj"
                    :process-config="processConfig"
                    :page-type="pageType"
                    :prescription-prams="prescriptionPrams"
                    :report-data="reportData"
                    @change="handlerChange">
                  </check-group>
                  <audit-page
                    v-if="auditObj"
                    @notify-receive="notifyReceiveHandler"
                    :page-type="1"
                    :notCurrentMark="true"
                    :audit-data="auditObj"></audit-page>
                  <template v-for="(lists, key) in dispenseObj">
                    <div class="radius mt10" :key="key" v-if="lists.length && refreshThePage">
                      <stateful :status="key"></stateful>
                      <template v-for="(data, index) in lists">
                        <medicine-list
                          ref="medicineList"
                          @delete-abnormally="abnormallyDeleteHandler"
                          @selection-change="selectionChangeHandler"
                          @save-after="saveAfterHandler"
                          @operator-func="operatorBtnFunc"
                          @update-all-column="notifyReceiveHandler"
                          :contain-obj="containObj"
                          :key="index"
                          :page-type="pageType"
                          :show-checkbox="operateMode == 1"
                          :operate-mode="operateMode"
                          :parent-index="index"
                          :meta-data="data"
                          :meta-data-list="lists"
                          :storage-room-list="storageRoomList"
                          :table-data="data.taskDtoList"
                          :selectable="medicineSelectable"
                          :table-config-id="STORAGE_MEDICINE_CONFIG"
                          :columns="medicineColumns"></medicine-list>
                      </template>
                    </div>
                  </template>
                  <template>
                  </template>
                </el-main>
              </template>
              <template v-if="!dispenseObj && isSearch">
                <ever-no-data :tip-txt="noDataTip"></ever-no-data>
              </template>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AuditPage from '../audit/index'
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import { debounce1 } from '@/util/common'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import MethodsMixin from '@/warehouse/views/drug/mixin/methods.mixin.js'
import searchOld from '@/warehouse/views/drug/component/search.old.vue'
export default {
  mixins: [MethodsMixin],
  components: {
    AuditPage,
    searchOld
  },
  data () {
    return {
      STORAGE_MEDICINE_CONFIG,
      pageType: 2, // 收方发药
      oldQueryObj: {},
      codeArray: [],
      auditObj: null, // 待审核任务   examineFlag:1 \ 驳回任务   examineFlag:0
      oldauditObj: null,
      adviceExecuteCode: [],
      isSearch: false,
      reportData: {},
      routePatientId: ''
    }
  },
  created () {
    this.initPageDefaultData()
    this.$nextTick(_ => {
      this.$refs.searchInput.$el[0].focus()
    })
    // this.routePatientId = this.$route.query.patientId || ''
    // if (this.routePatientId) this.fetchList({ patientId: this.routePatientId }, true)
  },
  methods: {
    notifyReceiveHandler () {
       // 一种类型的表格改变列的配置了，相同类型的表格都要同步配置
      this.refreshThePage = false
      this.loading = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.refreshThePage = true
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
      }, 300)
      this.fetchList()
    },
    fetchList: debounce1(function (queryObj, isPatient) {
      let F5 = false
      if (!queryObj) {
        F5 = true
        if (!this.oldQueryObj) return false
        if (this.oldQueryObj.patientId) {
          this.queryObj = JSON.parse(JSON.stringify(this.oldQueryObj))
        } else {
          this.oldQueryObj.searchCodes = this.codeArray
          this.queryObj = JSON.parse(JSON.stringify(this.oldQueryObj))
        }
      } else {
        F5 = false
        queryObj && (this.queryObj = Object.assign({}, queryObj))
        if (this.queryObj && !this.queryObj.patientId && !this.queryObj.searchCode) {
          this.isSearch = false
          return false
        }
        if (this.oldQueryObj && this.oldQueryObj.patientId && this.queryObj.patientId === this.oldQueryObj.patientId) return false
        if (!isPatient && (this.codeArray.includes(queryObj.searchCode) || this.adviceExecuteCode.includes(queryObj.searchCode))) {
          return this.$messageTips(this, 'warning', '该处方单或执行单已存在')
        }
      }
      const { id: processConfigurationId } = this.$store.state.processConfig.thisStorageroomProcessConfig
      const params = Object.assign({ processConfigurationId, type: 1, scene: 1, status: [2, 3], actualStorageRoomId: this.storageId }, this.queryObj)
      params.searchCodes = params.searchCodes ? params.searchCodes : [params.searchCode]
      delete params.searchCode
      if (params.patientId) delete params.searchCodes
      // get data 根据条件查询发药列表-区分自备/邮寄/自取
      this.prescriptionPrams = params
      dispenseApi.getGroupSearch(params).then(res => {
        if (res) {
          if (isPatient || (params.searchCodes && params.searchCodes.length > 1)) this.initPageDefaultData()
          this.handlerReceiveList(res, queryObj, F5)
        } else {
          if (!this.codeArray.length || isPatient) {
            this.isSearch = true
            this.initPageDefaultData()
          }
        }
        this.oldQueryObj = JSON.parse(JSON.stringify(params))
      })
    }),
    setSearchData (data, newData, PN, F5) {
      this.handlerSetPageData(false, JSON.parse(JSON.stringify(data)))
      // 先获取完当前患者数据后，再提取审核数据
      this.pickAuditData(newData, F5)
      this.dispenseObj = JSON.parse(JSON.stringify(this.wrapper(newData, 2)))
      this.handlerSetPageData(PN)
    },
    handlerReceiveList (data, query, F5) {
      let newData = JSON.parse(JSON.stringify(data))
      let PN = this.obtainPatientIdVisitSn(newData)
      if (!this.patientId || !this.visitNumber || F5) {
        this.setSearchData(data, newData, PN, F5)
      } else {
        if (this.visitNumber) {
          if (this.visitNumber === PN.visitNumber) {
            this.handlerSetPageData(false, JSON.parse(JSON.stringify(data)))
            this.pickAuditData(newData, F5)
            Object.keys(newData).forEach(item => {
              if (!newData[item] || !newData[item].length) {
                delete newData[item]
                return false
              }
              if (this.dispenseObj[item] && newData[item].length) {
                if (this.operateMode === 1) {
                  // 明细展示
                  let child = newData[item][0]
                  // 取出本机构的数据
                  let conatArr = this.dispenseObj[item].find(datas => child.isOwnerOrg === datas.isOwnerOrg)
                  if (conatArr) {
                    // 从机构里面取出 本库房的数据
                    if (child.actualStorageRoomId === conatArr.actualStorageRoomId) {
                      conatArr.taskDtoList = conatArr.taskDtoList.concat(child.taskDtoList)
                    } else {
                      this.dispenseObj[item].push(child)
                    }
                  } else {
                    this.dispenseObj[item].push(child)
                  }
                  newData = JSON.parse(JSON.stringify(this.dispenseObj))
                } else {
                  // 处方展示
                  newData[item] = newData[item].concat(this.dispenseObj[item])
                }
              }
            })
            if (Object.keys(newData).length) {
              this.dispenseObj = JSON.parse(JSON.stringify(this.wrapper(Object.assign({}, this.dispenseObj, newData), 2)))
              this.handlerSetPageData(PN)
            }
          } else {
            this.$confirm('当前扫描单据和之前的单据不是同一次门诊，是否需要切换到该处方对应的门诊', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.initPageDefaultData(true)
              this.setSearchData(data, newData, PN, F5)
            })
          }
        } else {
          this.setSearchData(data, newData, PN, F5)
        }
      }
    },
    // 提取待审核或者驳回数据
    pickAuditData (newData, F5) {
      // 每次计算都初始化审核数据
      if (F5) {
        this.oldauditObj = null
        this.auditObj = null
      }
      Object.keys(newData).forEach(key => {
        const _examine = [0, 1]
        const _val = {}
        newData[key] = newData[key].filter(item => {
          if (item.taskDtoList.some(dto => _examine.includes(dto.examineFlag))) {
            item.taskDtoList = item.taskDtoList.filter((dto, index) => {
              if (_examine.includes(dto.examineFlag)) {
                const initTask = Object.assign({}, item, { taskDtoList: [] })
                const task = item.taskDtoList[index]
                const { orderCode } = task
                // 审核数据都是以处方整单维度处理
                switch (dto.examineFlag) {
                  case 0:
                    this.setDtoList(_val, '1', initTask, task, orderCode)
                    // _val[1] ? _val[1].push(task) : _val[1] = [task]
                    break
                  case 1:
                    this.setDtoList(_val, '0', initTask, task, orderCode)
                    // _val[0] ? _val[0].push(task) : _val[0] = [task]
                    break
                }
              } else {
                return dto
              }
            })
          }
          return item.taskDtoList.length
        })
        if (Object.keys(_val).length) {
          if (!this.oldauditObj) {
            this.oldauditObj = Object.assign({}, _val)
          } else {
            Object.keys(_val).forEach(oldKey => {
              if (this.oldauditObj[oldKey]) {
                this.oldauditObj[oldKey] = this.oldauditObj[oldKey].concat(_val[oldKey])
              } else {
                this.oldauditObj[oldKey] = _val[oldKey]
              }
            })
          }
        }
        let newOldauditobj = JSON.parse(JSON.stringify(this.oldauditObj))
        if (newOldauditobj && newOldauditobj['1'] && newOldauditobj['1'].length && newOldauditobj['0'] && newOldauditobj['0'].length) {
          newOldauditobj['1'] = newOldauditobj['1'].filter(thisItem => {
            let thisChildSourceCode = thisItem.taskDtoList[0].orderCode
            const index = newOldauditobj['0'].findIndex(item => item.taskDtoList[0].orderCode === thisChildSourceCode)
            if (~index) {
              newOldauditobj['0'][index].taskDtoList = newOldauditobj['0'][index].taskDtoList.concat(thisItem.taskDtoList).sort((objA, objB) => {
                const { mainFlag, lastMain } = objA
                const mainFlagB = objB.mainFlag
                const lastMainB = objB.lastMain
                if (mainFlag > mainFlagB) {
                  return 1
                } else if (mainFlag < mainFlagB || lastMain < lastMainB) {
                  return -1
                } else {
                  return 0
                }
              })
            } else {
              return thisItem
            }
          })
        }
        this.auditObj = newOldauditobj
      })
    },
    setDtoList (obj, key, init, task, code) {
      init.taskDtoList[0] = (task)
      if (!obj[key]) {
        obj[key] = [init]
      } else {
        const index = obj[key].findIndex(item => item.taskDtoList[0].orderCode === code)
        if (~index) {
          obj[key][index].taskDtoList.push(task)
        } else {
          obj[key].push(init)
        }
      }
    },
    handlerSetPageData (PN, data) {
      if (PN) {
        this.patientId = PN.patientId
        this.visitNumber = PN.visitNumber
      }
      data && Object.keys(data).forEach(item => {
        data[item].forEach(child => {
          child.taskDtoList.forEach(lastData => {
            if (lastData.orderCode && !this.codeArray.includes(lastData.orderCode)) this.codeArray.push(lastData.orderCode)
            // if (lastData.adviceExecuteCode && !this.adviceExecuteCode.includes(lastData.adviceExecuteCode)) this.adviceExecuteCode.push(lastData.adviceExecuteCode)
          })
        })
      })
    },
    // 获取最新的 patientId visitNumber
    obtainPatientIdVisitSn (data) {
      let obj = {
        patientId: '',
        visitNumber: ''
      }
      Object.keys(data).some(item => {
        const { patientId, visitSn: visitNumber } = data[item][0].taskDtoList[0]
        obj.patientId = patientId
        obj.visitNumber = visitNumber
        return true
      })
      this.reportData = obj
      return obj
    },
    // 查询返回没有数据 初始化数据
    initPageDefaultData (isAll) {
      if (!isAll) {
        this.oldQueryObj = null
      }
      this.patientId = ''
      this.visitNumber = ''
      this.codeArray = []
      this.adviceExecuteCode = []
      this.dispenseObj = null
      this.auditObj = null
      this.oldauditObj = null
      this.routePatientId = ''
    }
  }
}
</script>
