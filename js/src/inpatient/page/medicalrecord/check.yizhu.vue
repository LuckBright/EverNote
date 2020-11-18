<template>
  <div class="flex_column_full flex_column_full_hidden">
    <div class="title">
      <ever-form2
        v-model="obj"
        :schema="schema"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="query">
        <template slot="default">
          <el-form-item>
            <el-button
              type="primary"
              @click="query">
              查询
            </el-button>
          </el-form-item>
          <el-form-item class="fenye">
            <el-divider direction="vertical"></el-divider>
            当前第 {{ currentPage }} 页/共 {{ totalPage }} 页
            <span @click="prev" :class="{'disabled': hidePrev}"><i class="iconfont icon-PathCopy"></i></span>
            <span v-for="v in totalPage" :key="v"
                  @click="getCurrent(v)" 
                  :class="{'pageBlue': currentPage === v, 'disabled': currentPage === v}">
                  {{v}}</span>
            <span @click="next" :class="{'disabled': hideNext}"><i class="iconfont icon-next"></i></span>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="flex_col_1_auto">
      <paper-yizhu
        :header-data="patientInfo"
        :table-data="tableData">
      </paper-yizhu>
    </div>
  </div>
</template>

<script>
  import urlMap from '@/inpatient/urls'
  import { request } from '@/util/req'
  import paperYizhu from './paper.yizhu'
  import { dateFormat } from '@/util/common'
  import mixins from '@/inpatient/page/medicalrecord/mixins/info.view.mixins.js'

  export default {
    components: {
      paperYizhu
    },
    mixins: [mixins],
    props: {
      // 患者ID
      patientId: {
        type: String
      },
      // 住院就诊编号
      hospitalizedNumber: {
        type: String
      },
      // 就诊类型
      visitType: {
        type: String,
        default: '3'
      }
    },
    data () {
      let schema = [
        {
          name: 'adviceTermType',
          label: '医嘱类型',
          comp: 'ever-select',
          props: {
            options: [
              {
                id: '1',
                name: '长期医嘱'
              },
              {
                id: '0',
                name: '临时医嘱'
              }
            ]
          }
        },
        {
          name: 'orderDate',
          label: '日期',
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
        patientInfo: {},
        tableData: [],
        allTableData: [],
        pageSize: 20,
        totalPage: 1,
        currentPage: 1
      }
    },
    computed: {
      defaultQueryObj () {
        return {
          patientId: this.patientId,
          hospitalizedNumber: this.hospitalizedNumber,
          visitType: this.visitType
        }
      },
      hidePrev () {
        return this.currentPage === 1
      },
      hideNext () {
        return this.currentPage === this.totalPage
      }
    },
    created () {
      this.query()
    },
    methods: {
      query () {
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.orderDate && queryObj.orderDate.length === 2) {
          queryObj.adviceStartTimeStart = dateFormat(this.obj.orderDate[0], false, 'startDay')
          queryObj.adviceStartTimeEnd = dateFormat(this.obj.orderDate[1], false, 'endDay')
        }
        delete queryObj.orderDate
        if (!queryObj.adviceTermType) {
          delete queryObj.adviceTermType
          this.$set(this.patientInfo, 'doctorAdviceTermCode', '医嘱单')
        } else {
          if (queryObj.adviceTermType === '1') {
            this.$set(this.patientInfo, 'doctorAdviceTermCode', '长期医嘱单')
          } else if (queryObj.adviceTermType === '0') {
            this.$set(this.patientInfo, 'doctorAdviceTermCode', '临时医嘱单')
          }
        }
        request(urlMap.quote.yizhu, queryObj).then(res => {
          if (res.head.errCode === 0) {
            if (!this.patientInfo.name && res.data.length > 0) this.setPatientInfo(res.data[0])
            this.setTableData(res.data)
          }
        })
      },
      setPatientInfo (data) {
        if (data.visit) {
          this.$set(this.patientInfo, 'kebie', data.visit.visitTenantSubjectName)
          this.$set(this.patientInfo, 'bed', data.visit.visitBedName)
          if (data.visit.patientInfo) {
            this.$set(this.patientInfo, 'name', data.visit.patientInfo.patientName)
            this.$set(this.patientInfo, 'age', this.$filters.birthdayComputed(data.visit.patientInfo.birthday))
            this.$set(this.patientInfo, 'sex', this.makeSex(data.visit.patientInfo.genderCode))
          }
        }
        this.$set(this.patientInfo, 'outpatientVisitNumber', this.hospitalizedNumber)
      },
      setTableData (data) {
        // 记录父医嘱
        let parent = []
        // 开始时间 降序排序
        // 医嘱开始时间
        let sortColumn = 'doctorAdviceStartTime'
        let dateToTime = function (str) {
          return (new Date(str.replace(/-/g, '/'))).getTime()
        }
        for (let i = 0; i < data.length; i++) {
          data[i].timeStamp = dateToTime(data[i][sortColumn])
          if (data[i].parentChildAdviceFlag === '1') {
            data[i].contentClass = 'first'
            // 医生签名
            data[i].adviceOrderDoctorSignature = ''
            // 执行时间
            data[i].doctorAdviceExecuteTime = ''
            // 执行人名称
            data[i].doctorAdviceExecutorSignName = ''
            parent.push({ id: data[i].id, doctorAdviceStartTime: data[i][sortColumn], item: data[i] })
          } else if (data[i].parentChildAdviceFlag === '2') {
            data[i].contentClass = 'middle'
            data[i].adviceOrderSignatureTmp = data[i].adviceOrderDoctorSignature
            data[i].adviceExecuteDatetimeTmp = data[i].doctorAdviceExecuteTime
            data[i].adviceExecutorSignatureTmp = data[i].doctorAdviceExecutorSignName
            data[i].adviceOrderDoctorSignature = ''
            data[i].doctorAdviceExecuteTime = ''
            data[i].doctorAdviceExecutorSignName = ''
          }
        }
        data.sort(function (a, b) {
          return b.timeStamp > a.timeStamp ? 1 : -1
        })

        // 将父医嘱放在首位
        parent.forEach(current => {
          let removeIndex = data.findIndex(item => {
            return item.id === current.id
          })
          data.splice(removeIndex, 1)

          let insertIndex = data.findIndex(item => {
            return item[sortColumn] === current[sortColumn]
          })
          data.splice(insertIndex, 0, current.item)
        })

        // 组合回显数据格式
        let currentDay = ''
        let parentAdvice = false
        data.forEach((row, index) => {
          // 拆分开始日期和时间
          let startDateTime = dateFormat(row[sortColumn], 'YYYY-MM-DD HH:mm')
          let startDate = dateFormat(startDateTime, 'YYYY-MM-DD')
          let startTime = dateFormat(startDateTime, 'HH:mm')
          // 日期第一次出现和分页的首行显示日期
          if (currentDay !== startDate || (index + 1) % this.pageSize === 1) {
            // 日期
            data[index].date = startDate
            currentDay = startDate
          }
          // 时间
          data[index].time = startTime
          data[index].doctorAdviceExecuteTime = dateFormat(row.doctorAdviceExecuteTime, 'HH:mm')

          // 父医嘱
          if (row.parentChildAdviceFlag === '1') {
            if (parentAdvice) {
              data[index - 1].adviceOrderDoctorSignature = data[index - 1].adviceOrderSignatureTmp
              data[index - 1].doctorAdviceExecuteTime = dateFormat(data[index - 1].adviceExecuteDatetimeTmp, 'HH:mm')
              data[index - 1].doctorAdviceExecutorSignName = data[index - 1].adviceExecutorSignatureTmp
              data[index - 1].contentClass = ''
              // data[index - 1].contentClass = 'last'
            }
            parentAdvice = true
          } else if (row.parentChildAdviceFlag === '0' && parentAdvice) {
            data[index - 1].adviceOrderDoctorSignature = data[index - 1].adviceOrderSignatureTmp
            data[index - 1].doctorAdviceExecuteTime = dateFormat(data[index - 1].adviceExecuteDatetimeTmp, 'HH:mm')
            data[index - 1].doctorAdviceExecutorSignName = data[index - 1].adviceExecutorSignatureTmp
            data[index - 1].contentClass = 'last'
            parentAdvice = false
          }
        })
        this.allTableData = data
        this.totalPage = Math.ceil(this.allTableData.length / this.pageSize) || 1
        this.currentPage = 1
        this.setPagination()
      },
      prev () {
        if (this.hidePrev) return
        this.currentPage--
        this.setPagination(this.currentPage)
      },
      getCurrent (num) {
        if (this.currentPage === num) return
        this.currentPage = num
        this.setPagination(this.currentPage)
      },
      next () {
        if (this.hideNext) return
        this.currentPage++
        this.setPagination(this.currentPage)
      },
      setPagination (current) {
        if (!current) current = 1
        let start = (current - 1) * this.pageSize
        this.tableData = this.allTableData.slice(start, start + this.pageSize)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    height: 32px;
    padding: 5px;
    border-bottom: 1px solid #dadce0;
    .fenye {
      float: right;
      margin-right: 10px;
      font-size: 12px;
      span {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        margin: 0 1px;
        text-align: center;
        cursor: pointer;
        .iconfont {
          font-size: 12px;
          color: #999;
          cursor: pointer;
        }
      }
      .disabled {
        cursor: not-allowed;
        .iconfont {
          cursor: not-allowed;
        }
      }
      .pageBlue {
        color: #1c7bef;
      }
    }
  }
</style>
