<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-menu class="grey" default-active="0" @select="selectMenu">
          <el-menu-item :index="index + ''" v-for="(item,index) in visitList" :key="item.id">
            <span
              :title="item.visitTime + ' ' +item.visitTenantSubjectName + ' ' + item.outpatientVisitTypeName"
              slot="title"
              class="overtext"
            >{{item.visitTime	 ? $moment(item.visitTime	).format('YYYY-MM-DD') : '--'}} {{item.visitTenantSubjectName}} {{item.outpatientVisitTypeName}}</span>
          </el-menu-item>
          <ever-no-data tipTxt="暂无记录" v-if="visitList.length === 0"></ever-no-data>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="mr5">
          <!-- 医院医嘱先不做 -->
          <!-- <phr-hospital :patient-id="patientId"></phr-hospital> -->
          <phr-clinic  :visit-num="visitNumber" :patient-id="patientId"></phr-clinic>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/workspace/store/component'
import phrHospital from '@/components/phr/hospital'
import phrClinic from '@/components/phr/clinic'

export default {
  props: {
    patientId: {
      type: String
    }
  },
  data () {
    return {
      visitList: [],
      visitNumber: ''
    }
  },
  computed: {},
  async created () {
    this.getAllVisit()
  },
  mounted () {},
  watch: {
    patientId () {
      this.getAllVisit()
    }
  },
  methods: {
    selectMenu (index) {
      this.visitNumber = this.visitList[index].visitSerialNumber
    },
    async getAllVisit () {
      if (!this.patientId) {
        return
      }
      const res = await api.getAllVisit({ patientId: this.patientId })
      this.visitList = Array.isArray(res.data) ? res.data : []
      this.visitNumber =
        this.visitList.length > 0 ? res.data[0].visitSerialNumber : ''
    }
  },
  components: {
    phrHospital,
    phrClinic
  }
}
</script>
<style scoped lang="scss">
.h {
  height: 100%
}
.mb10 {
  margin-bottom: 10px;
}
.mr5 {
  margin: 5px;
}
.grey {
  background-color: #fafafb;
  min-height: 680px;
  /deep/ .el-menu-item {
    height: 32px;
    line-height: 32px;
  }
}
.overtext {
  display: inline-block;
  width: 171px;
}
</style>
