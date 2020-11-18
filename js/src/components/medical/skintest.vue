<template>
  <div v-if="input && input.length" class="ever_comp_wrap">
    <template>
      <el-form
        v-for="(item, i) in input"
        class="el-form--child-comp"
        :key="i"
        :rules="!disabled ? rules : {}"
        :model="item"
        :show-message="false"
        :size="size || 'small'"
        :disabled="disabled"
        :validate-on-rule-change="false"
        ref="form"
      >
        <el-row :gutter="5">
          <el-col :span="7">
            <el-form-item prop="materialId">
              <el-autocomplete
                select-when-unmatched
                v-model.trim="item.materialName"
                custom-item="custom-item-li"
                :disabled="disabled"
                :fetch-suggestions="(name, callback) => {querySearchAsync(name, callback, i)}"
                @select="(val) => selectHandler(val, i)"
                placeholder="皮试药物"
                style="width: 100%"
              >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="result">
              <sys-type code="CT01.00.026" v-model="item.result" :filtercodes="['1', '2']" placeholder="皮试结果" style="width:100%"></sys-type>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="date">
              <el-date-picker
                v-model="item.date"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="皮试时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="handle_btn">
            <i class="iconfont icon-delete" @click="del(i)" v-if="input.length > 1"></i>
            <i
              class="iconfont icon-tianjia"
              style="margin-left: 5px;"
              @click="add(i)"
              v-if="(input.length - 1) === i"
            ></i>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </div>
</template>

<script>
import api from '@/crm/store/skintestapi.js'
import {getSysValueName} from '@/util/common'
export default {
  props: {
    value: {
      required: true,
      default: []
    },
    size: String,
    disabled: Boolean
  },
  data () {
    let checkEqual = (rule, value, callback) => {
      if (!value) {
        callback()
        return false
      }
      if (this.input && this.input.length) {
        let obj = this.input.filter((val, index) => {
          if (value && val.materialId) {
            let isRepeat = this.input.filter((sitem, sindex) => {
              return index !== sindex && sitem.materialId && val.materialId && sitem.materialId === val.materialId && sitem.result === val.result && sitem.date === val.date
            })
            return isRepeat && isRepeat.length
          }
        })
        if (obj.length > 1) {
          callback(new Error('存在重复项！'))
          return false
        }
      }

      callback()
    }
    let emptyObj = {
      materialName: '',
      materialId: '',
      result: '',
      date: this.$moment().format('YYYY-MM-DD HH:mm')
    }
    return {
      rules: {
        materialId: [
          { required: true, message: '必填项', trigger: 'change,blur' },
          {validator: checkEqual, trigger: 'change'}
        ],
        result: [{ required: true, message: '必填项', trigger: 'change' }],
        date: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      input: this.value && this.value.length ? this.value : [Object.assign({}, JSON.parse(JSON.stringify(emptyObj)))],
      emptyObj
    }
  },
  methods: {
    add () {
      if (this.disabled) return
      let isValid = true
      this.$refs.form.forEach(item => {
        item.validate(valid => {
          if (!valid) {
            isValid = false
          }
        })
      })
      if (isValid) {
        let obj = Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))
        obj.date = this.$moment().format('YYYY-MM-DD HH:mm')
        this.input.push(obj)
      }
    },
    del (i) {
      this.input.splice(i, 1)
    },
    async getStringVal () {
      if (this.input && this.input.length) {
        return this.input
          .map(async v => {
            let resultName = await getSysValueName('CT01.00.026', v.result)
            let str = ''
            str += `药物：${v.materialName}，`
            str += `结果：${resultName}，`
            str += `时间：${v.date}`
            return str
          })
          .join(',')
      }
      return ''
    },
    querySearchAsync (name, callback, index) {
      this.input[index].materialName = name
      api.getSkinTestDrug({
        skinTestMark: 1,
        splitFlag: 0,
        name: name
      }).then(rs => {
        this.loading = false
        let list = []
        if (rs && rs.data && rs.data.length) {
          rs.data.map(item => {
            list.push({
              id: item.materialskuid,
              name: item.byName
            })
          })
        }
        callback(list)
      })
    },
    selectHandler (val, index) {
      this.$set(this.input[index], 'materialName', val.name)
      this.$set(this.input[index], 'materialId', val.id)
    }
  },
  watch: {
    value: {
      handler (val) {
        if (typeof val === 'string') {
          let obj = Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))
          obj.date = this.$moment().format('YYYY-MM-DD HH:mm')
          val = [obj]
        }
        if (!val || !val.length) {
          let obj = Object.assign({}, JSON.parse(JSON.stringify(this.emptyObj)))
          obj.date = this.$moment().format('YYYY-MM-DD HH:mm')
          this.input = [obj]
        } else {
          this.input = val
        }
      },
      deep: true
    },
    input: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_comp_wrap {
  overflow: hidden;
  padding-right: 10px;
  /deep/ .el-date-editor.el-input{
    width: 100% !important;
  }
  .el-form {
    margin-bottom: 5px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  .handle_btn {
    line-height: 32px;
    white-space: nowrap;
    .iconfont {
      font-size: 14px;
      padding: 5px;
      color: #333;
      &.icon-delete {
        color: #aaa;
      }
      &.icon-tianjia {
        color: #1c7bef;
      }
    }
  }
  .el-col {
    &:nth-last-child(2) {
      padding-right: 5px !important;
    }
  }
}
</style>
