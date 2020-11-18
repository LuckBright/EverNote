<template>
  <div class="switch-ward"  @click.stop>
    <el-row class="clearfix el-row-frist">
      <el-col :span='8'>
        <span style="float:left">选择业务类型</span>
      </el-col>
      <el-col :span='16'>
        <el-radio-group v-model="serviceType">
            <el-radio :label="801">检验</el-radio>
            <el-radio :label="800">检查</el-radio>
            <el-radio :label="802">治疗</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="clearfix el-row-frist">
      <el-col :span='8'>
        <span style="float:left">选择科室</span>
      </el-col>
      <el-col :span='16'>
        <el-select v-model="providerId" placeholder="请选择科室" class="el-selects" @change='providerChange' filterable clearable>
            <el-option
            v-for="item in providerOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="clearfix" v-if="serviceType !== 801">
      <el-col :span='8'>
        <!-- 由诊室变房间 -->
        <span style="float:left">选择房间</span>
      </el-col>
      <el-col :span='16'>
        <el-select v-model="sectionId" placeholder="请选择房间" class="el-selects" filterable clearable>
            <el-option
            v-for="item in sectionOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- <el-row v-if='noprovider'>
        <el-col :span='24'>
            未找到科室，请您到机构设置工作站配置科室
        </el-col>
    </el-row> -->
  </div>
</template>
<script>
  import api from '@/infusion/store/infusion'
  import resident from '@/inpatient/store/resident.js'
  import { objFind } from '@/util/common'
  // import storage from '@/util/storage'
  export default {
    props: [],
    watch: {
      '$store.state.currentUser.userId': {
        handler (val) {
          if (!val) return
          this.getWorkClinicAndSection()
        },
        immediate: true
      },
      'serviceType' (val, old) {
        if (val === old) return
        if (this.first > 0) {
          this.first--
        } else {
          this.providerId = ''
          this.sectionId = ''
          this.sectionOptions = []
        }
        this.getWorkClinicAndSection()
        this.success(val)
      },
      'providerId' (val, old) {
        this.success(val)
      },
      'sectionId' (val, old) {
        this.success(val)
      },
    },
    data () {
      return {
        api,
        serviceType: '', // 业务类型
        providerId: '', // 科室
        sectionId: '', // 诊室
        providerOptions: [],
        sectionOptions: [],
        noprovider: false,
        first: 0,
        serviceTypeObj: {
          // 检查 02.01
          // 检验 02.02
          // 治疗 02.03
          // 手术 02.04
          '801': '02.02',
          '800': '02.01',
          '802': '02.03',
        }
      }
    },
    mounted () {
      if (this.$route.query && this.$route.query.from === 'kanban') {
        if (localStorage.getItem('tech_value')) {
          let obj = JSON.parse(localStorage.getItem('tech_value'))
          if (obj.serviceType !== Number(this.$route.query.serviceType)) {
            localStorage.removeItem('tech_value')
            this.serviceType = Number(this.$route.query.serviceType)
            this.getWorkClinicAndSection()
          }
        } else {
          this.serviceType = Number(this.$route.query.serviceType)
        }
      }
      if (localStorage.getItem('tech_value')) {
        this.first = 2
        let obj = JSON.parse(localStorage.getItem('tech_value'))
        this.serviceType = obj.serviceType
        this.providerId = obj.provider && obj.provider.id
        this.sectionId = obj.section && obj.section.id
        this.providerChange(this.providerId)
      }
    },
    methods: {
      success (val) {
        if (!val || !this.serviceType) return
        // 检验需要做特殊处理
        let obj = {
          serviceType: this.serviceType
        }
        if (this.providerId && this.providerOptions.length > 0) { // 科室
          let provider = objFind(this.providerOptions, {id: this.providerId})
          if (!provider) return
          obj.provider = {
            id: this.providerId,
            name: provider.name
          }
          if (this.serviceType !== 801) { // 非检验需要选择房间
            if (!this.sectionId || !this.sectionOptions.length) return
            let section = objFind(this.sectionOptions, {id: this.sectionId})
            if (!section) return
            obj.section = {
              id: section.id,
              name: section.name
            }
          }
          obj.doctorId = this.$store.state.currentUser.userId
          localStorage.setItem('tech_value', JSON.stringify(obj))
          localStorage.setItem(`${this.$route.matched[0].meta.space}Key`, `${obj.provider.id},${obj.provider.name}`)
          if (this.first > 0) {
            this.first--
          } else {
            this.$emit('close')
          }
        }
      },
      async getWorkClinicAndSection () { // 获取科室
        let arr = []
        let res = await resident.getStaffListHasOrgHasSubjectByCondition({
          outStaffGetStaffListByConditionReqDTO: {
            idList: [this.$store.state.currentUser.userId],
          },
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            orgIdList: [this.$store.state.currentUser.organizationId + ''],
  
            type2CodeList: [this.serviceTypeObj[this.serviceType]], // 门诊
            usePermissionStatus: 'Y',
            status: 'Y'
          },
          outOrgGetOrgListByConditionReqDTO: {
            idList: [this.$store.state.currentUser.organizationId + ''],
          }
        })
        if (res.data && res.data.resultList) {
          let list = res.data.resultList || []
          list = list[0] || {}
          list = list.tsStaffOrganizationList || []
          list = list[0] || {}
          list = list.tsStaffSubjectList || []
          arr = list
        }
        arr.forEach(ele => {
          ele.name = ele.tenantSubjectName
        })
        this.providerOptions = arr
        if (this.providerOptions.length === 0) {
          this.noprovider = true
        }
      },
      async providerChange (tendentRelationId) { // 获取诊室
        if (this.first === 0) {
          this.sectionOptions = []
          this.sectionId = ''
        } else {
          this.first--
        }
        if (!tendentRelationId || this.serviceType === 801) return
        let res = await this.api.getRoomListByParam({
          tenantSubjectIds: [tendentRelationId],
          orgIdList: [this.$store.state.currentUser.organizationId + '']
        })
        if (res.data) {
          this.sectionOptions = res.data
        }
      },
      async open (type) {
        if (localStorage.getItem('tech_value') && type) {
          if (this.$store.state.currentUser.userId && this.providerOptions.length === 0) this.getWorkClinicAndSection()
          this.first = 2
          let obj = JSON.parse(localStorage.getItem('tech_value'))
          if (this.serviceType === obj.serviceType) this.first = 1
          this.serviceType = obj.serviceType
          this.providerId = obj.provider && obj.provider.id
          this.sectionId = obj.section && obj.section.id
          this.providerChange(this.providerId)
        }
      }
    },
    computed: {

    },
    components: {

    }
}
</script>

<style lang='scss' scoped>
.switch-ward{
  flex:1;
    padding-left: 10px;
    font-size: 14px;
    line-height: 30px;
    padding:10px 0px 10px 5px;
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-row-frist{
      margin-bottom: 5px;
    }
}
</style>
