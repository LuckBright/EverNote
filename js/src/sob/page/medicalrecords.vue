<template>
 <div id='medicalrecords'>
    <!-- <ever-bread-crumb name="住院病历文书" path="/warehouse/medicalrecords"> -->
    </ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <el-row>
            <el-col :span="4" style='margin-bottom:20px;color:#999999;font-size:14px;'>
                <span>请勾选需要在住院病历处显示的内容</span>
            </el-col>
        </el-row>
        <el-row>
           <el-col v-for='(temp, key) in obj' :key='key' style='margin-bottom:20px;'>
             <span>{{temp.index}}、{{temp.name}}</span>
             <div style="margin: 15px 0;"></div>
             <template v-if='key !=="200"'>
               <el-checkbox-group style='margin-left:20px;' v-model="result[key]" @change="handleCheckedCitiesChange">
                 <el-checkbox v-for='(item, index) in temp.children' :label="item.code" :key="index" disabled :class="{'on': item.status===1}">
                   {{item.name}}
                 </el-checkbox>
               </el-checkbox-group>
             </template>
             <template v-else>
               <div class='special_div' v-for='(every, index) in temp.children' :key='index' style='display:inline-block;'>
                 <el-checkbox-group  style='margin-left:20px;' v-model="every.code === '201' ? result[key][index][every.code] : result[key]" @change="handleCheckedCitiesChange">
                   <template v-if="every.code === '201'">
                     <el-checkbox v-for='(item, index) in every.children' :label="item.code" :key="index" disabled :class="{'on': item.status===1}">
                       {{item.name}}
                     </el-checkbox>
                   </template>
                   <template v-else>
                     <el-checkbox :label="every.code" :key="index" disabled :class="{'on': every.status===1}">
                       {{every.name}}
                     </el-checkbox>
                   </template>
                 </el-checkbox-group>
               </div>
             </template>
          </el-col>
        </el-row>
      </div>

    <!-- <el-button type="primary" @click='save()'>保存</el-button> -->
    </div>
 </div>
</template>
<script>

import api from '../store/medicalrecords'
import storage from '../../util/storage'
import {DOC_MENU as obj} from '@/inpatient/components/doc.menu'

export default {
  data () {
    return {
      api,
      obj,
      storage,
      checkAll: true,
      isIndeterminate: true,
      result: {
        100: [ '101', '102', '104' ],
        200: [{ '201': [ '1', '2' ] }, '202', '204', '205'],
        300: [ '301', '302' ],
        400: ['402', '401', '406']
      }
    }
  },
  methods: {
    save () {
      this.api.saveRecord(JSON.stringify(this.result)).then(res => {
        if (res.head.errCode === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
      })
    },
    getByOrgId (id) {
      this.api.getByOrgId(id).then(res => {
        this.result = JSON.parse(res.data[0]['content'])
      })
    },
    handleCheckAllChange (event) {
      // this.checkedCities = event.target.checked ? cityOptions : []
      // this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      // let checkedCount = value.length
      // this.checkAll = checkedCount === this.records.length
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.records.length
    }
  },
  watch: {
  }
}
</script>
<style scoped>
#medicalrecords label{display: inline-block; margin-bottom: 20px; width: 20%;}
#medicalrecords .el-checkbox+.el-checkbox{margin-left:0;}
#medicalrecords .on .el-checkbox__input.is-disabled+.el-checkbox__label{color:black;}
#medicalrecords .special_div:nth-child(4){color:red;width:19.7%;}
#medicalrecords .special_div:nth-child(5){color:red;width:19.7%;}
#medicalrecords .special_div:nth-child(6){color:red;width:19.7%;}
#medicalrecords .special_div:nth-child(7){color:red;width:19.7%;}
</style>

