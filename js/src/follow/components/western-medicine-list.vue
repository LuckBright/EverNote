<template>
  <div class="western-add">
    <el-form v-for="(item, i) in westernList" :key="i" :rules="rules" :model="item" ref="form">
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item prop="westernObj">
              <el-select
                v-model="item.westernObj"
                clearable
                filterable
                remote
                value-key="id"
                :reserve-keyword="false"
                placeholder="输入关键词"
                :remote-method="searchWesternMedicine"
                :loading="westernMedicineLoading"
              >
                <el-option
                  v-for="temp in westernOptions"
                  :key="temp.id"
                  :label="temp.name"
                  :value="temp"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              大于等于
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="month">
              <el-input-number v-model="item.month"
              :controls="false"
              controls-position="right"
              :min="0" :max="30">
            </el-input-number>月
            </el-form-item>
          </el-col>
          <el-col :span="3" class="handle_btn">
            <el-form-item>
              <i class="iconfont icon-delete" @click="delAllergyItem(i)" v-if="westernList.length > 1"></i>
              <i class="iconfont icon-tianjia" @click="addItem(i)" v-if="(i + 1) === (westernList.length)"></i>
             </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
import everInputNumber from '@/components/everinputnumber'
export default {
  components: { everInputNumber },
  data () {
    return {
      westernMedicineLoading: false,
      westernList: [{ westernObj: {}, month: '' }],
      rules: {},
      westernOptions: []
    }
  },
  methods: {
     // 远程搜索西药
    searchWesternMedicine: debounce(function (query) {
      if (query !== '') {
        this.westernMedicineLoading = true
        request(urlMap.searchForBrowser, {
          name: query,
          scene: 1, // 【卓正】只有门诊，如果有住院，这里需要再沟通接口
          pagesize: 30,
          offset: 0,
          isAdviceList: [11, 10],
          serviceClassificationList: ['301', '302']
        }).then(res => {
          this.westernMedicineLoading = false
          this.westernOptions = res.data
        })
      }
    }, 200),
    addItem () {
      this.westernList.push({ westernObj: {}, month: '' })
    },
    delAllergyItem (i) {
      this.westernList.splice(i, 1)
    }
  }
}
</script>
<style scoped>
.western-add{max-height:120px;overflow-y:auto;}
.western-add .el-input-number {width:80px;}
.western-add .el-form{margin-bottom: 5px;}
.western-add .el-form .el-row .el-col{margin-right: 5px;}
.western-add .el-form .el-row .el-col .iconfont{color: #aaa;}
/* .wrap .patientForm.el-form .el-form-item__content .western-add{width:100%;} */
.wrap .patientForm.el-form .el-form-item__content .western-add .el-select{width:100%;}
</style>

