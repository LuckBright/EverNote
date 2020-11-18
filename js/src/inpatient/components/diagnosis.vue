<template>
  <div v-if="value" class="ever_diagnosis_wrap">
    <el-form v-for="(item, i) in value" :key="i" :rules="rules" :model="item" ref="form" style="margin-bottom:22px">
      <el-row :gutter="10">
        <el-col :span="rowSpan[0]">
          <el-form-item prop="diseaseName">
            <el-autocomplete
              select-when-unmatched
              v-model.trim="item.diseaseName"
              custom-item="custom-item-li"
              :fetch-suggestions="(name, callback) => {querySearchAsync(name, callback, i)}"
              placeholder="请输入诊断内容"
              @select="(val) => {handleSelect(val, i)}">
              <el-select v-model="item.position" filterable placeholder="部位" slot="append" v-if="item.positionData && item.positionData.length > 0" style="width: 100px;">
                <el-option
                  v-for="opt in item.positionData"
                  :key="opt.id"
                  :label="opt.position"
                  :value="opt.position">
                </el-option>
              </el-select>
            </el-autocomplete>
          </el-form-item>
          <div class="tips_txt">{{item.diseaseCode}}</div>
        </el-col>
        <el-col :span="rowSpan[1]" v-if="!only">
          <el-form-item prop="comment">
            <el-input placeholder="添加备注" v-model="item.comment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="rowSpan[2]" v-if="check && !only">
          <el-form-item prop="diagnoseType">
            <el-checkbox v-model="item.diagnoseType" :true-label="2" :false-label="1">待查</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="check ? rowSpan[3] : rowSpan[2]" class="handle_btn" v-if="!only">
          <i class="iconfont icon-delete fl" v-if="value.length > 1" @click="delItem(i)"></i>
          <i class="iconfont icon-tianjia fl" v-if="(value.length - 1) === i" @click="addItem"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from '@/workspace/store/medicalapi'
  import Vue from 'vue'
  Vue.component('custom-item-li', {
    functional: true,
    render: function (h, ctx) {
      let item = ctx.props.item
      return h('li', ctx.data, [
        h('span', { attrs: { class: 'name' } }, [item.value]),
        h('label', { attrs: { class: 'code' } }, [item.diseaseCode])
      ])
    },
    props: {
      item: { type: Object, required: true }
    }
  })
  export default {
    props: ['value', 'type', 'check', 'only'],
    data () {
      let rowSpan = this.check ? [12, 6, 4, 2] : [14, 8, 2]
      if (this.only) rowSpan = [22]
      return {
        api,
        loading: false,
        manulist: [],
        diseaseId: null,
        positionData: [],
        currentDisease: {},
        rules: {
          diseaseType: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number'}
          ],
          diseaseName: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        },
        rowSpan
      }
    },
    created () {
      if (this.value && !this.value.length) {
        this.addItem()
      } else {
        this.setPositionData()
      }
    },
    methods: {
      addItem () {
        let emptyObj = {
          diseaseType: parseInt(this.type),
          diseaseName: '',
          diseaseOrigId: '',
          diagnoseType: 1,
          comment: '',
          position: '',
          diagnoseList: [],
          positionData: []
        }
        let isValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (isValid) this.value.push(Object.assign({}, emptyObj))
        this.setPositionData()
      },
      delItem (i) {
        this.value.splice(i, 1)
      },
      remoteMethod (name, index) {
        if (!name) {
          this.manulist = []
        } else {
          this.loading = true
          api.searchDiagnose({
            type: this.value[index].diseaseType || 2,
            origId: this.$store.state.currentUser.organizationId,
            name: name
          }).then(res => {
            this.loading = false
            this.manulist = res.data.resultList
            this.value[index].diseaseOrigId = this.getDiseaseOrigId({value: name})
          })
        }
      },
      querySearchAsync (name, callback, index) {
        this.api.searchDiagnose({
          type: this.value[index].diseaseType || 2,
          origId: this.$store.state.currentUser.organizationId,
          name: name
        }).then(rs => {
          this.loading = false
          rs.data.resultList.forEach(item => {
            item.value = item.diseaseName
          })
          this.diagnoseList = rs.data.resultList
          this.value[index].diseaseOrigId = this.getDiseaseOrigId({value: name})
          callback(rs.data.resultList)
        })
      },
      validate (callback) {
        let allValid = true
        this.$refs['resultsForm'].forEach(item => {
          item.validate((valid) => {
            if (!valid) {
              allValid = false
            }
          })
        })
        callback(allValid)
      },
      handleSelect (val, index) {
        let params = {}
        params.visitNumber = this.$route.query.visitSn
        params.scene = 1
        params.apply = {sn: '100-01', facts: []}
        params.apply.facts.push({
          diseaseStatus: val.status,
          diseaseName: val.diseaseName,
          diseaseCode: val.diseaseCode
        })
        this.currentDisease[index] = val
        this.value[index].position = ''
        this.value[index].diseaseCode = val.diseaseCode
        this.value[index].diseaseOrigId = val.id || this.getDiseaseOrigId(val)
        this.getPosition(this.value[index].diseaseOrigId).then(data => {
          if (data && data.length > 0) {
            // this.value[index].positionData = data
            this.$set(this.value[index], 'positionData', data)
          } else {
            // this.value[index].positionData = []
            this.$set(this.value[index], 'positionData', [])
          }
        })
      },
      getDiseaseOrigId (val) {
        let ids = this.manulist.filter(item => {
          return item.value === val.value
        })
        return ids.length > 0 ? ids[0].id : null
      },
      getPosition (id) {
        return api.getPosition({diseaseId: id}).then(rs => {
          return rs && rs.data[0] ? rs.data : []
        })
      },
      setPositionData () {
        this.value.forEach(item => {
          if (item.diseaseOrigId) {
            this.getPosition(item.diseaseOrigId).then(data => {
              this.$set(item, 'positionData', data)
              // item.positionData = data
            })
          }
        })
      },
      changeDiseaseType (val, index) {
        if (val === 1) { return false }
        return this.currentDisease[index] && this.handleSelect(this.currentDisease[index], index)
      }
    },
    watch: {
      'value' (val) {
        if (!val.length) {
          this.addItem()
        } else {
          this.setPositionData()
        }
      },
      'check' () {
        this.rowSpan = this.check ? [12, 6, 4, 2] : [14, 8, 2]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ever_diagnosis_wrap{
    overflow: hidden;
    .el-form{
      margin-bottom: 10px;
      .tips_txt{
        line-height: 20px;
        font-size: 12px;
        color: #999;
        padding: 0 10px;
      }
      .el-col{
        &:nth-last-child(2) {
          padding-right: 15px !important;
         }
      }
      &:last-child{ margin-bottom: 0;}
    }
    .handle_btn{
      white-space: nowrap;
      .iconfont{
        padding: 5px;
        color: #aaa;
      }
    }

    .el-autocomplete{
      width: 100%;
      /deep/ .el-input-group__append{
        /deep/ .el-input__inner{
          color:#666;
          border-color: transparent !important;
        }
      }
    }
  }
</style>
