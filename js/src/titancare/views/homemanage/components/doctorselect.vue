
<template>
  <el-row>
    <el-col>
      <el-autocomplete
        class="mr10 w inner-pl30"
        v-model="select"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <template slot-scope="{ item }">
          <el-row>
            <el-col :span="12">
              <label>{{item.name}}</label>
            </el-col>
          </el-row>
        </template>
      </el-autocomplete>
<!--      <el-button type="primary" @click="handleCancel" v-show="!isBtnHide">取消</el-button>-->
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['placeholder', 'value', 'isBtnHide', 'api', 'statusFlag', 'graphic'],
  data () {
    return {
      select: '',
      loading: false
    }
  },
  created () { },
  methods: {
    handleCancel () {
      this.$emit('cancel', true)
    },
    querySearchAsync (queryString, cb) {
      if (!queryString) {
        // eslint-disable-next-line standard/no-callback-literal
        cb([])
        return
      }
      let params = {
        offset: 0,
        pageSize: 20,
        pagesize: 20,
        outStaffGetStaffListByConditionReqDTO: {
          nameList: [queryString]
        }
      }
      if (this.$route.query.tab === 'online') {
        params.configType = 2
      }
      let apiType = this.graphic ? this.api.itemSearchDoctor : this.api.searchDoctor
      apiType(params).then(res => {
        if (res && res.data && res.data.resultList) {
          cb(res.data.resultList)
        } else {
          let listArr = []
          cb(listArr)
        }
      })
    },
    handleSelect (item) {
      this.$emit('itemObj', item)
    }
  },
  watch: {
    'statusFlag' (val) {
      if (!val) {
        this.select = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
  .inner-pl30 /deep/ .el-input .el-input__inner {
    padding-left: 30px;
  }
</style>
