<template>
  <div class="switch-ward">
    <el-row class="clearfix el-row-frist">
      <el-col :span='24'>
        <el-select v-model="providerId" placeholder="请选择登录科室" class="el-selects" @change='providerChange' filterable clearable>
            <el-option
            v-for="item in providerOptions"
            :key="item.sectionRecordId"
            :label="item.name"
            :value="item.sectionRecordId">
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
  import storage from '@/util/storage'
  export default {
    props: ['space'],
    watch: {
      '$store.state.currentUser.userId': {
        handler (val) {
          if (!val) return
          this.getWorkClinicAndSection(val)
        },
        immediate: true
      }
    },
    data () {
      return {
        api,
        providerId: '', // 科室
        providerOptions: [],
        sesstionKey: ''
      }
    },
    mounted () {
      this.sesstionKey = `${this.space}Key`
      this.open()
    },
    methods: {
      providerChange (val, flash) {
        if (!val) return
        let obj = {
          id: this.providerId,
          name: '',
          doctorId: this.$store.state.currentUser.userId
        }
        this.providerOptions.forEach(element => {
          if (element.sectionRecordId === this.providerId) {
            obj.name = element.name
          }
        })
        storage.setLocalStorage(this.sesstionKey, `${obj.id},${obj.name},${obj.doctorId}`)
        this.$emit('close', flash)
      },
      async getWorkClinicAndSection (staffId) { // 获取科室
        let res = await this.api.getStaffListHasOrgHasSubjectByCondition({
          outStaffGetStaffListByConditionReqDTO: {
            idList: [staffId],
          },
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            type2CodeList: ['01.02', '01.03']// 门诊
          },
          outOrgGetOrgListByConditionReqDTO: {
            idList: [this.$store.state.currentUser.organizationId + ''],
          }
        })
        let arr = []
        if (res.data && res.data.resultList) {
          let list = res.data.resultList || []
          list = list[0] || {}
          list = list.tsStaffOrganizationList || []
          list = list[0] || {}
          list = list.tsStaffSubjectList || []
          arr = list
        }
        arr.forEach(ele => {
          ele.sectionRecordId = ele.id
          ele.name = ele.tenantSubjectName
        })
        if (this.$route.query.from === 'kanban') { // 看板过来的患者要给他加上带过来的这个科室
          let str = storage.getLocalStorage(this.sesstionKey)
          let arr = str ? str.split(',') : []
          let push = true
          if (this.$store.state.currentUser.userId === arr[2]) {
            arr.forEach(element => {
              if (arr[0] === element.sectionRecordId) {
                push = false
              }
            })
          }
          if (push) {
            arr.push({
              name: arr[1],
              sectionRecordId: arr[0]
            })
          }
        }
        this.providerOptions = arr
        if (arr.length === 1) {
          this.providerId = arr[0].sectionRecordId
          this.providerChange(arr[0].sectionRecordId, true)
        } else if (!this.providerId) {
          this.$emit('open')
        }
      },
      async open () {
        let str = storage.getLocalStorage(this.sesstionKey)
        if (str) this.providerId = str.split(',')[0]
      },
      fromKanBan () {
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
    line-height: 63px;
    padding:10px 0px 10px 5px;
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-row-frist{
      margin-bottom: 5px;
    }
    /deep/ .el-select{
      width: 100%;
    }
}
</style>
