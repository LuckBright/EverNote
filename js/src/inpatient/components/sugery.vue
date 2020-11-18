<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-form v-for="(item, i) in input" :key="i" style="margin-bottom:22px" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-form-item prop="name">
            <el-autocomplete
              select-when-unmatched
              v-model="item.name"
              custom-item="custom-item-li"
              :fetch-suggestions="(name, callback) => {querySurgical(name, callback, i)}"
              placeholder="请输入手术名称"
              @select="(val) => {handleSelect(val, i)}">
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="comment">
            <el-input placeholder="请填写备注" v-model="item.comment" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" align="right">
          <i class="iconfont icon-delete fl" @click="delAllergyItem(i)" v-if="i > 0"></i>
          <i class="iconfont icon-tianjia fl" @click="addItem(i)" v-if="(i + 1) === (input.length)"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from '@/inpatient/store/phr'
  export default {
    props: ['value', 'hasAllergicHis'],
    data () {
      return {
        api,
        input: this.value || [],
        disabled: true,
        rules: {
          name: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    created () {
      if (!this.value) {
        this.addItem()
      }
    },
    methods: {
      addItem () {
        let isValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (isValid) this.input.push({name: '', code: '', comment: ''})
      },
      delAllergyItem (i) {
        this.input.splice(i, 1)
      },
      querySurgical (name, callback, index) {
        if (!name) {
          callback([])
          return false
        }
        this.api.getSurgical(name).then(data => {
          this.loading = false
          if (data && data.length) {
            data.map(item => {
              item.value = item.name
              return item
            })
            callback(data)
          } else {
            callback([])
          }
        })
      },
      handleSelect (val, index) {
        this.input[index].code = val.code
      }
    },
    watch: {
      'value' (val) {
        this.input = val
      },
      'input': {
        handler (val) {
          this.$emit('update:value', val)
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .el-autocomplete{
      width: 100%;
    }
    .iconfont{
      padding: 5px;
      color: #aaa;
      &:nth-child(1){
         margin-left: 10px;
       }
    }
  }
</style>
