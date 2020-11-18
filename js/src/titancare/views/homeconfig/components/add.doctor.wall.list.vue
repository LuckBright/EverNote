<template>
  <AddContent
    style="width: 480px;"
    title="查找医生"
    @sureEdit="selectSure"
    @sureClose="selectCancel"
  >
    <template slot="icon">
      <i class="el-icon-arrow-left"></i><span>返回</span>
    </template>
    <div class="list-content" v-loading="loadingData">
      <RadioList
        v-model="selectedId"
        :attrs="attrs"
        :list="doctorList"
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        circle-icon
        @currentChange="currentChange"
        @search="searchDoctor">
      </RadioList>
    </div>
  </AddContent>
</template>

<script>
import AddContent from './base/add.content'
import RadioList from '../components/base/radio.list'
import api from '@/titancare/api/homeconfig/homeconfigapi'
import avatar from '@img/assets/avatar.png'

export default {
  name: 'add.doctor.wall.list',
  components: {
    AddContent,
    RadioList
  },
  data () {
    return {
      attrs: {
        id: 'id',
        label: 'name',
        icon: 'photo',
        defaultImg: avatar,
        format: this.formatDoctorText
      },
      selectedId: '',
      doctorList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      words: '',
      loadingData: false
    }
  },
  created () {
    this.searchDoctor()
  },
  methods: {
    selectSure () {
      let doctor = this.doctorList.find(item => item.id === this.selectedId)
      if (!doctor) return
      this.$emit('selectSure', doctor)
    },
    selectCancel () {
      this.$emit('selectCancel')
    },
    currentChange (current) {
      this.currentPage = current
      this.searchDoctor()
    },
    searchDoctor (words) {
      this.words = words || ''
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        outStaffGetStaffListByConditionReqDTO: {
          nameList: ['']
        }
      }
      if (this.words) {
        params.outStaffGetStaffListByConditionReqDTO = {
          nameList: [this.words]
        }
      }
      this.loadingData = true
      api.searchDoctors(params).then(res => {
        this.loadingData = false
        this.doctorList = res.data.resultList
        this.total = res.data.totalCount
      })
    },
    formatDoctorText (data) {
      let keshi = ''
      if (data.tsStaffSubjectList && data.tsStaffSubjectList.length > 0) {
        keshi = data.tsStaffSubjectList.map(item => item.orgSubjectName).join('、')
      }
      return `${data.name} ${data.skillsTitle2Name} ${keshi}`
    }
  }
}
</script>

<style scoped>
  .list-content{
    padding: 20px;
  }
</style>
