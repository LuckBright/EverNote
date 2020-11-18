<template>
  <div class="ever_allergichis_wrap" v-ever-bind-enter style="padding-right:10px">
    <el-form v-for="(item, i) in input" :key="i" style="margin-bottom:22px" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item prop="serviceType">
            <sys-type v-model="item.serviceType" code="THC_WH_OBJECT_SUB_TYPE" :cache="true"></sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="service">
            <service-select v-model="item.service" :type="String(item.serviceType)" value-key="id" belongType="1"></service-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn" v-if="!only">
          <i class="iconfont icon-delete" @click="delItem(i)" v-if="input.length > 1"></i>
          <i class="iconfont icon-tianjia" @click="addItem(i)" v-if="(i + 1) === (input.length)"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['value', 'type', 'only'],
  data () {
    let defValue = { service: '', serviceType: '' }
    let rules = {
      service: [
        { required: true, message: '必填项', trigger: 'change' },
        { validator: (rule, val, callback) => {
          if (!val) {
            callback()
            return false
          }
          let arr = this.value.filter(v => {
            return v.service && v.service.id === val.id
          })
          if (arr.length > 1) {
            callback(new Error('该医嘱已存在'))
            return false
          }
          callback()
        },
          trigger: 'change' }
      ],
      serviceType: [
        { required: true, message: '必填项', trigger: 'change' }
      ]
    }
    return {
      defValue,
      disabled: true,
      input: this.value || [JSON.parse(JSON.stringify(defValue))],
      rules
    }
  },
  methods: {
    validate () {
      let allValid = true
      this.$refs.form.forEach(item => {
        item.validate(valid => {
          if (!valid) {
            allValid = false
          }
        })
      })
      return allValid
    },
    addItem () {
      let isValid = true
      isValid = this.validate()
      if (isValid) this.input.push(JSON.parse(JSON.stringify(this.defValue)))
    },
    delItem (i) {
      this.input.splice(i, 1)
      this.input.forEach(item => {
        item.service.echo = undefined
      })
    }
  },
  watch: {
    value (val) {
      if (val && val.length) {
        this.input = val
      } else {
        this.input = [JSON.parse(JSON.stringify(this.defValue))]
      }
      this.input.forEach(item => {
        item.serviceType = String(item.serviceType)
      })
    },
    input: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    },
    type (val) {
      this.input = [JSON.parse(JSON.stringify(this.defValue))]
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_allergichis_wrap {
  .handle_btn {
    white-space: nowrap;
    .iconfont {
      padding: 5px;
      color: #aaa;
      &:nth-child(1) {
        margin-left: 10px;
      }
    }
  }
}
</style>
