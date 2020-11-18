<!-- 搜索框 -->
<template>
  <!-- <div class="hospital-search"> -->
    <el-row class="hospital-search">
      <el-col :span="8">
        <el-autocomplete
          style="width:100%"
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
      </el-col>
      <el-col :span="12" align="left" class="ml10">
        <el-button type="primary" @click="handelDispenSearch">查询</el-button>
      </el-col>
    </el-row>
  <!-- </div> -->
</template>
<script>
import storage from '@/util/storage'
import { debounce } from '@/util/common'
import { passport } from '@/card/store/passportapi'
export default {
  props: ['placeholder', 'router', 'storageKey', 'isAfterInquiry'],
  mixins: [storage],
  data () {
    return {
      searchValue: '',
      searchObj: {}
    }
  },
  methods: {
    isListCode (query) {
      const reg = /^[W|G][0-9a-zA-Z]{17}$/g
      return reg.test(query)
    },
    handleSelect (item) {
      this.searchObj.patient = item
    },
    querySearch (query, cb) {
      query = query && String(query).trim()
      if (query) {
        const listCode = this.isListCode(query)
        if (listCode) {
          this.searchObj = {
            code: query
          }
          return cb([])
        }
        passport.get('patient/searchFuzzy', {
          params: {
            keyword: query,
            offset: 0,
            pagesize: 20
          }
        }).then(result => {
          this.searchObj = {}
          if (result && result.data && result.data.resultList && result.data.resultList.length) {
            let arr = result.data.resultList.map(v => {
              let sex = v.sex === '1' ? '男' : '女'
              let patient = Object.assign({}, v)
              patient = this.convertToRead(patient)
              patient.value = v.name
              patient.displaySex = sex
              return patient
            })
            cb(arr)
          } else {
            this.searchObj = {
              recipeId: query
            }
            cb([])
          }
        })
      } else {
        cb([])
      }
    },
    handelDispenSearch: debounce(function (item) {
      if (this.storageKey) {
        storage.setLocalStorage(this.storageKey, JSON.stringify(this.searchObj))
        this.$router.push(this.router)
      } else {
        this.$emit('searchQuery', this.searchObj)
      }
    }),
    convertToRead (patient) {
      patient.agebirthday = {
        age: patient.age,
        birthday: patient.birthday
      }
      return patient
    }
  }
}
</script>
<style lang="less" scoped>
// div.el-autocomplete-suggestion.my-autocomplete {width: 312px !important;}
.hospital-search /deep/ .my-autocomplete {width: 312px !important;}
p{margin: 0}
.el-input__icon {cursor: pointer;}
.el-col-12{
  width: auto;
}
.el-col-8{
  width: auto;
  margin-right: 0 !important;
  /deep/.el-input--suffix{
    margin-right: 0 !important;
  }
}
</style>
