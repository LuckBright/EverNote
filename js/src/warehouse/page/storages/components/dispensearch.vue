<!-- 搜索框 -->
<template>
  <div class="hospital-search">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-input
          v-if="isSearchUser"
          popper-class="my-autocomplete"
          v-model="searchValue"
          :placeholder="placeholder"
          @keyup.enter.native="handelDispenSearch">
        </el-input>
        <el-autocomplete
          v-else
          popper-class="my-autocomplete"
          v-model="searchValue"
          :fetch-suggestions="querySearch"
          :placeholder="placeholder"
          :trigger-on-focus="false"
          :clearable="true"
          @keyup.enter.native="handelDispenSearch"
          @select="handleSelect">
          <template slot-scope="scope">
            <p class="option-field">
              {{ scope.item.name }}（<sys-value type="GBT.2261.1" :code="scope.item.sex"></sys-value>）{{ scope.item.birthday | formatDateByExp('YYYY-MM-DD') }}
            </p>
          </template>
        </el-autocomplete>
        <!-- 时间查询有问题，暂时去掉 -->
        <!-- <date-picker v-model="startDate" :autoWidth="true" :clearable="true" outformat='yyyy-MM-dd HH:mm:ss' placeholder='开始时间'></date-picker><span class="mr10">~</span><date-picker v-model="endDate" :autoWidth="true" :clearable="true" outformat='yyyy-MM-dd HH:mm:ss' placeholder='结束时间'></date-picker> -->
        <el-button type="primary" @click="handelDispenSearch">查询</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import storage from '@/util/storage'
import { passport } from '@/card/store/passportapi'
import { date2Timestamp, debounce } from '@/util/common'
export default {
  props: ['placeholder', 'router', 'storageKey', 'isAfterInquiry', 'isSearchUser'],
  mixins: [storage],
  data () {
    return {
      restaurants: [],
      searchObj: {
        startDate: '',
        endDate: '',
        searchValue: '',
        searchSelect: ''
      },
      searchValue: '',
      startDate: '',
      endDate: ''
    }
  },
  methods: {
    handelDispenSearch: debounce(function () {
      if (!this.searchValue) return this.$messageTips(this, 'warning', '请先输入' + this.placeholder || '内容')
      Object.assign(this.searchObj, { startDate: this.startDate, endDate: this.endDate, searchValue: this.searchValue.trim() })
      if (this.storageKey) {
        storage.setLocalStorage(this.storageKey, JSON.stringify(this.searchObj))
        this.$router.push(this.router)
      } else {
        this.$emit('searchQuery', this.searchObj)
      }
    }),
    handleIconClick () {
      this.searchValue = ''
    },
    handleSelect (item) {
      Object.assign(this.searchObj, { startDate: this.startDate, endDate: this.endDate, searchValue: this.searchValue.trim(), searchSelect: item.id })
      // this.handelDispenSearch()
    },
    querySearch (query, cb) {
      query = query && String(query).trim()
      if (query) {
        passport.get('patient/searchFuzzy', {
          params: {
            keyword: query,
            offset: 0,
            pagesize: 20
          }
        }).then(result => {
          if (result && result.data && result.data.resultList) {
            let arr = result.data.resultList.map(v => {
              let sex = v.sex === '1' ? '男' : '女'
              let patient = Object.assign({}, v)
              patient = this.convertToRead(patient)
              patient.value = v.name
              patient.displaySex = sex
              return patient
            })
            cb(arr)
          }
        })
      } else {
        cb([])
      }
    },
    convertToRead (patient) {
      patient.agebirthday = {
        age: patient.age,
        birthday: patient.birthday
      }
      return patient
    },
    _dateEmpty (date) {
      this.$nextTick(() => { this[date] = '' })
    }
  },
  watch: {
    'startDate' (date) {
      if (date) {
        if (!this.searchValue) {
          this._dateEmpty('startDate')
          return this.$messageTips(this, 'warning', '请选择患者或输入单号')
        }
      }
    },
    'endDate' (date) {
      if (date) {
        if (!this.searchValue) {
          this._dateEmpty('endDate')
          return this.$messageTips(this, 'warning', '请选择患者或输入单号')
        }
        if (!this.startDate) {
          this._dateEmpty('endDate')
          return this.$messageTips(this, 'warning', '请先选择开始时间')
        }
        if (date2Timestamp(this.startDate) > date2Timestamp(date)) {
          this._dateEmpty('endDate')
          return this.$messageTips(this, 'warning', '结束时间不能在开始时间前，请重新选择')
        }
      }
    },
    'isAfterInquiry' (flag) {
      if (flag) {
        this.$nextTick(() => {
          this.startDate = ''
          this.endDate = ''
          this.searchValue = ''
          this.searchObj = { startDate: '', endDate: '', searchValue: '', searchSelect: '' }
        })
        this.$emit('seachAfterInquiry', true)
      }
    }
  }
}
</script>
<style lang="less" scoped>
div.el-autocomplete-suggestion.my-autocomplete {width: 312px !important;}
p{margin: 0}
.el-input__icon {cursor: pointer;}
</style>
