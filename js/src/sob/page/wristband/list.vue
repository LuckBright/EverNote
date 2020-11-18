<template>
  <div>
    <ever-bread-crumb name="腕带管理" v-if="!$route.params.type" show-edit-fnt="false"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          :inline="true"
          :is-query="true"
        ></ever-form2>
      </div>
      <div class="main-wrap">
        <el-table v-loading.body="loading" :data="tableData" class="table-height-30" border>
          <el-table-column show-overflow-tooltip prop="wristbandCode" label="腕带编号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="hospitalizedNumber" label="住院号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="providerName" label="科室"></el-table-column>
          <el-table-column show-overflow-tooltip prop="hospitalNum" label="病床号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="linkTypes" label="患者详情">
            <template slot-scope="scope">
              {{scope.row.patientName}}
              <template v-if="scope.row.patientSex">
                /
                <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
              </template>
              <template v-if="scope.row.ageShowText">/ {{scope.row.ageShowText}}</template>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="beHospitalizedTime" label="入院时间">
            <template
              slot-scope="scope"
            >{{scope.row.beHospitalizedTime ? dateFormat(scope.row.beHospitalizedTime) : ''}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="printTime" label="打印时间">
            <template
              slot-scope="scope"
            >{{scope.row.printTime ? dateFormat(scope.row.printTime) : ''}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="腕带状态">
            <template slot-scope="scope">
              <template v-if="scope.row.status === '1'">
                <sys-value type="THC_SOB_WRISTBAND_STATUS" :code="scope.row.status"></sys-value>
                <template v-if="scope.row.spireNumber">{{scope.row.spireNumber}}次</template>
              </template>
              <template v-else>
                <sys-value type="THC_SOB_WRISTBAND_STATUS" :code="scope.row.status"></sys-value>
              </template>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="reprintReason" label="补打原因">
            <template slot-scope="scope">
              {{scope.row.reprintReasonId ? WRISTBAND_REPRINT_REASON[scope.row.reprintReasonId] : ''}}
              <template
                v-if="scope.row.reprintReasonId && scope.row.reprintReason"
              >-</template>
              {{scope.row.reprintReason}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="loseTime" label="失效时间">
            <template
              slot-scope="scope"
            >{{scope.row.loseTime ? dateFormat(scope.row.loseTime) : ''}}</template>
          </el-table-column>
          <el-table-column prop label="操作" align="left" width="180">
            <template slot-scope="scope">
              <!-- <el-button
                  v-if="scope.row.status !== '2'"
                  size="small"
                  type="primary"
              @click="print(scope.row)">打印</el-button>-->
              <ever-confirm
                v-if="scope.row.status !== '2'"
                :msg="'确定将此腕带设置为失效吗？'"
                action="失效"
                @confirm="lose(scope.row)"
              ></ever-confirm>
            </template>
          </el-table-column>
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
    <!-- <dialog-reprint
      ref="printWristband"
      v-if="wristbandConfig && wristbandConfig.length && wristbandData"
      :wristband-data="wristbandData"
      :wristband-config="wristbandConfig"
      @close="initWristbandData"
      @update="updateList"
    ></dialog-reprint> -->
  </div>
</template>
<script>
// dialog.reprint.vue 跟业务方确认没用，注释掉。doprint 相关方法注释掉 （4.11.1 by lvjiangtao）
import list from '@/util/list'
import api from '@/sob/store/wristband'
// import areaApi from '@/sob/store/managementapi'
import { dateFormat } from '@/util/common'
// import { dateFormat, WAN_DAI_DA_YIN } from '@/util/common'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import { WRISTBAND_TYPE, WRISTBAND_REPRINT_REASON } from './common/config'
// import DialogReprint from '@/sob/page/wristband/common/dialog.reprint'
// import { doPrint } from '@/util/print'
// import storage from '@/util/storage.js'
export default {
  data () {
    let querySchema = [
      {
        name: 'providerId',
        label: '开单科室',
        comp: 'ever-subject-select',
        props: {
          clearable: true,
          type: 'select',
          fields: 'id',
          isOrg: true
        },
        span: 12
      },
      // {
      //   name: 'infectedPatchId',
      //   label: '病区',
      //   comp: 'ever-select',
      //   props: {
      //     options: []
      //   }
      // },
      {
        name: 'status',
        label: '腕带状态',
        comp: 'sys-type',
        props: {
          code: 'THC_SOB_WRISTBAND_STATUS',
          useValue: true
        }
      },
      {
        name: 'patientId',
        label: '患者姓名',
        comp: 'ever-patient-select'
      }
    ]
    let typeSchema = [
      {
        name: 'visitType',
        label: '类型',
        comp: 'value-set',
        span: 22,
        props: {
          options: WRISTBAND_TYPE
        }
      }
    ]
    if (!this.$route.params.type) querySchema = typeSchema.concat(querySchema)
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      dateFormat,
      // doPrint,
      querySchema,
      queryObj,
      // pageType: this.$route.params.type,
      // wristbandConfig: [],
      // wristbandData: null,
      WRISTBAND_REPRINT_REASON
    }
  },
  mixins: [list],
  components: {
    // DialogReprint
  },
  async created () {
    // const areaRes = areaApi.list()
    // const area = await areaRes
    // if (area && area.data) {
    //   this.$ever.getFieldFromSchema(this.querySchema, 'infectedPatchId').props.options = area.data
    // }
    this.queryObj.infectedPatchId = localStorage.getItem('spaceId') || ''
    // this.getWristbandConfig(0)
  },
  methods: {
    // updateList () {
    //   this.list()
    // },
    // initWristbandData () {
    //   this.wristbandData = null
    // },
    // async getWristbandConfig (type) {
    //   // const res = await api.getConfig({ isNewborn: type, visitType: 2 })
    //   // if (res && res.data && res.data.length) {
    //   //   if (res.data[0] && res.data[0].content) {
    //   //     this.wristbandConfig = JSON.parse(res.data[0].content)
    //   //   }
    //   // }
    // },
    print (data) {
      singlePrint('ZY_CPOE_CHENG_REN_WAN_DAI', {
        patientId: data.patientId,
        visitType: 2,
        hospitalizedNumber: data.hospitalizedNumber
      })
      // WAN_DAI_DA_YIN({
      //   visitType: 2,
      //   patientId: data.patientId,
      //   hospitalizedNumber: data.hospitalizedNumber
      // }, 'ZY_CPOE_CHENG_REN_WAN_DAI')
      // this.wristbandData = data
      // this.$nextTick(_ => {
      //   this.$refs.printWristband.open()
      // })
    },
    async lose (data) {
      const res = await api.lose({ id: data.id })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '操作成功', '提示')
        this.list()
      } else {
        this.$messageTips(this, 'fail', '操作失败', '提示')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wristband_mgt {
  .layout_inner {
    padding: 10px;
    background: #fff;
    box-shadow: none;
  }
  /deep/ .main-head .el-form.el-form--inline {
    border: none;
  }
}
</style>

