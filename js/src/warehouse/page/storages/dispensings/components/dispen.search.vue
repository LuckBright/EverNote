<!-- 搜索框 -->
<template>
  <!-- <div class="hospital-search"> -->
    <el-row class="hospital-search">
      <el-col :span="18">
        <el-input
          size="small"
          v-if="isSearchUser"
          popper-class="my-autocomplete"
          v-model="searchValue"
          :placeholder="placeholder"
          @keyup.enter.native="handelDispenSearch(false)">
        </el-input>
        <el-autocomplete
          v-else
          style="width:100%"
          popper-class="my-autocomplete"
          v-model="searchValue"
          :fetch-suggestions="querySearch"
          :placeholder="placeholder"
          :trigger-on-focus="false"
          :clearable="true"
          @keyup.enter.native="handelDispenSearch(false)"
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
      <el-col :span="4" align="left" class="ml10">
        <el-button type="primary" @click="handelDispenSearch(false)" size="small">查询</el-button>
      </el-col>
    </el-row>
  <!-- </div> -->
</template>
<script>
import storage from '@/util/storage'
import { debounce } from '@/util/common'
import { passport } from '@/card/store/passportapi'
export default {
  props: ['placeholder', 'router', 'storageKey', 'isAfterInquiry', 'isSearchUser'],
  data () {
    return {
      searchValue: '',
      searchObj: {}
    }
  },
  mounted () {
    if (this.$route.path === '/storages/dispensingopd/opdsearch' && !this.$route.query.patientId) {
      setTimeout(_ => {
        // const val = storage.getLocalStorage('SEARCH_VAL')
        // if (val.recipeId) {
        //   this.searchValue = val.recipeId
        // } else {
        //   this.searchValue = val.code
        // }
        this.searchValue = JSON.parse(storage.getLocalStorage('SEARCH_VAL'))
        setTimeout(_ => {
          storage.removeLocalStorage('SEARCH_VAL')
        }, 10)
        this.searchValue && this.handelDispenSearch(true)
      })
    }
  },
  methods: {
    isListCode (query) {
      const reg = /^[H|R][0-9a-zA-Z]{17}/
      return reg.test(query)
    },
    isRecipe (query) {
      const reg = /^[R][0-9a-zA-Z]{14}/
      return reg.test(query)
    },
    handleSelect (item) {
      this.searchObj.patient = item
    },
    querySearch (query, cb) {
      query = query && String(query).trim()
      if (query) {
        let queryType = 'recipeId' // 处方单号查询  数据查询中使用
        const listCode = this.isListCode(query)
        const recipe = this.isRecipe(query)
        if (listCode) {
          this.searchObj = {
            code: query
          }
          return cb([])
        }
        if (recipe) {
          this.searchObj = {
            recipeId: query,
            queryType
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
              recipeId: query,
              queryType
            }
            cb([])
          }
        })
      } else {
        cb([])
      }
    },
    handelDispenSearch: debounce(function (swit) {
      if (!this.searchValue) return this.$messageTips(this, 'warning', '请先输入' + this.placeholder || '内容')
      const queryType = 'recipeId' // 处方单号查询  数据查询中使用
      const listCode = this.isListCode(this.searchValue)
      if (!this.searchObj.patient) {
        if (listCode) {
          this.searchObj = {
            code: this.searchValue
          }
        } else {
          this.searchObj = {
            recipeId: this.searchValue,
            queryType
          }
        }
      }
      if (this.storageKey) {
        storage.setLocalStorage('SEARCH_VAL', JSON.stringify(this.searchValue))
        const patientId = this.searchObj.patient ? this.searchObj.patient.id : ''
        this.$router.push(this.router + '?patientId=' + patientId)
      } else {
        if (!this.searchValue && !swit) {
          this.searchObj = {}
        }
        this.$emit('searchQuery', this.searchObj)
      }
    }),
    convertToRead (patient) {
      patient.agebirthday = {
        age: patient.age,
        birthday: patient.birthday
      }
      return patient
    },
    changeSearchValue (value) {
      this.searchValue = value
    }
  }
}
</script>
<style lang="less" scoped>
// div.el-autocomplete-suggestion.my-autocomplete {width: 312px !important;}
p{margin: 0}
.el-input__icon {cursor: pointer;}
.el-col-12{
  width: auto;
}
.el-col-18{
  width: auto;
  margin-right: 0 !important;
  /deep/.el-input--suffix{
    margin-right: 0 !important;
  }
}
</style>
