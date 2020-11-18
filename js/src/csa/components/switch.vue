<template>
  <div class="csa_switch_ward"  @click.stop  ref='select'>
    <el-row class="clearfix el-row-frist">
      <el-col :span='8'>
        <span style="float:left">选择科室</span>
      </el-col>
      <el-col :span='16'>
        <el-select  :disabled="!rightSwitch" v-model="providerId" placeholder="请选择科室" class="el-selects" @change='providerChange' filterable clearable>
            <el-option
            v-for="item in providerOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '@/infusion/store/infusion'
  import resident from '@/inpatient/store/resident.js'
  import { objFind } from '@/util/common'
  export default {
    props: {
      rightSwitch: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      '$store.state.currentUser.userId': {
        handler (val) {
          if (!val) return
          this.getWorkClinicAndSection()
        },
        immediate: true
      },
    },
    data () {
      return {
        api,
        providerId: '', // 科室
        providerOptions: [],
        noprovider: false,
        first: true
      }
    },
    mounted () {
      if (localStorage.getItem('csa_value')) {
        let obj = JSON.parse(localStorage.getItem('csa_value'))
        this.providerId = obj.provider && obj.provider.id
        this.providerChange(this.providerId)
      }
    },
    methods: {
      providerChange (val) {
        if (!val) return
        // 检验需要做特殊处理
        if (this.providerId && this.providerOptions.length > 0) { // 科室
          let provider = objFind(this.providerOptions, {id: this.providerId})
          if (!provider) return
          let obj = {
            id: this.providerId,
            name: provider.name
          }
          obj.doctorId = this.$store.state.currentUser.userId
          this.$refs.select.blur()
          this.$nextTick(_ => {
            localStorage.setItem(`${this.$route.matched[0].meta.space}Key`, `${obj.id},${obj.name}`)
            localStorage.setItem('csa_value', JSON.stringify(obj))
            this.$emit('close')
          })
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
            type2CodeList: ['02.04'],
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
          this.$emit('open')
          this.noprovider = true
        } else if (this.providerOptions.length === 1 && this.first) {
          this.providerId = this.providerOptions[0].id
          this.providerChange(this.providerId)
        } else if (this.providerOptions.length > 1 && this.first && !localStorage.getItem('csa_value')) {
          this.$emit('open')
        }
        this.first = false
      },
      async open (type) {
        if (localStorage.getItem('csa_value') && type) {
          if (this.$store.state.currentUser.userId) this.getWorkClinicAndSection()
          let obj = JSON.parse(localStorage.getItem('csa_value'))
          this.providerId = obj.id
        }
      }
    }
}
</script>

<style lang='scss' scoped>
.csa_switch_ward{
  flex:1;
    padding-left: 10px;
    font-size: 14px;
    padding-bottom: 10px;
    padding-top: 15px;
    line-height: 30px;
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-row-frist{
      margin-bottom: 5px;
    }
}
</style>
