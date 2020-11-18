<template>
  <div id="switch_ward">
     <el-select v-model="value" :placeholder="`请选择${text}`" class="el-selects" @change='change'>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
  </div>
</template>
<script>
import storage from '@/util/storage.js'
import api from '@/inpatient/store/resident.js'
export default {
  props: ['space', 'text'],
  data () {
    return {
      options: [],
      value: '',
      sesstionKey: '',
      open: false
    }
  },
  mounted () {
    this.sesstionKey = `${this.space}Key`
  },
  watch: {
    '$store.state.currentUser.userId': {
      handler (val) {
        if (!val) return
        this.opens(val)
      },
      immediate: true
    }
  },
  methods: {
    async opens () {
      let arr = []
      if (this.space === 'inpatient') {
        let res = await api.getSickAreaListByCondition({
          staffIdList: [this.$store.state.currentUser.userId]
        })
        res.data.forEach(element => { // 接口没有提供根据机构id查询的选项
          if (String(element.orgId) === String(this.$store.state.currentUser.organizationId)) {
            arr.push(element)
          }
        })
        arr.forEach(ele => {
          ele.name = ele.sickAreaName
        })
      } else if (this.space === 'resident') {
        let res = await api.getStaffListHasOrgHasSubjectByCondition({
          outStaffGetStaffListByConditionReqDTO: {
            idList: [this.$store.state.currentUser.userId],
          },
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            orgIdList: [this.$store.state.currentUser.organizationId + ''],
            type2CodeList: ['01.01'], // 门诊
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
      }
      this.options = arr
      if (this.$route.query.from === 'medicalReview') {
        this.$bus.$emit('hospital_dialogVisible_close', '-1')
        return
      }
      // ${this.$ever.hospitalIndex}/inpatient/advice/review?tabIndex=0&from=msg&areaId=v6QM7QPyI3zixLCAg7w

      if (this.$route.query.from === 'msg' && this.$route.query.areaId && !this.$route.query.providerId && !this.open) {
        this.open = true
        this.change(this.$route.query.areaId)
        // this.$bus.$emit('hospital_dialogVisible_close', '-1')
        return
      }
      // ${this.$ever.hospitalIndex}/resident/patientmgt/open?patientId=gaHTBsyuw6dImSx8XTK&patientName=再动我急眼了&hospitalizedNumber=IP20190000000457&providerId=5000.A3.01&providerName=普外科&areaId=v6QM7QPyI3zixLCAg7w&bedId=zZM463FabEkSduhUlwk&bedName=3333333&doctorId=c4a2b5ea1f1e400bb1e3472d28581039&from=msg
      // &providerId=5000.A3.01&providerName=普外科&areaId=v6QM7QPyI3zixLCAg7w&bedId=zZM463FabEkSduhUlwk&bedName=3333333&doctorId=c4a2b5ea1f1e400bb1e3472d28581039
      // &from=msg
      if (this.$route.query.from === 'msg' && this.$route.query.providerId && !this.open) {
        this.open = true
        this.change(this.$route.query.providerId)
        // this.$bus.$emit('hospital_dialogVisible_close', '-1')
        return
      }
      if (this.options.length === 1 && !storage.getLocalStorage(this.sesstionKey)) {
        this.change(this.options[0].id)
      } else if (!storage.getLocalStorage(this.sesstionKey)) {
        this.$bus.$emit('hospital_dialogVisible_open')
      } else {
        let str = storage.getLocalStorage(this.sesstionKey)
        this.value = str.split(',')[0]
        this.$bus.$emit('hospital_dialogVisible_close', this.value)
      }
    },
    setStore (val) {

    },
    change (value) {
      if (this.$route.query.from === 'medicalReview') {
        this.$bus.$emit('hospital_dialogVisible_close', '-1')
        return
      }
      let name = '--'
      this.options.forEach(ele => {
        if (value === ele.id)name = ele.name
      })
      if (this.$route.query.from === 'msg' && name === '--') {
        this.$bus.$emit('hospital_dialogVisible_open')
        return
      }
      storage.setLocalStorage(this.sesstionKey, `${value},${name}`)
      this.$emit('close', value)
      this.$bus.$emit('hospital_dialogVisible_close', value)
    },
    init () {
      let str = storage.getLocalStorage(this.sesstionKey)
      if (str) {
        this.value = str.split(',')[0]
        this.opens()
      }
    }
  },
  computed: {

  },
  components: {

  }
}
</script>

<style lang='scss'>
#switch_ward{
    float: left;
    width: 200px;
    padding-left: 10px;
  .el-selects{
  }
}
</style>
