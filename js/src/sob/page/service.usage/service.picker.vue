<template>
  <div class="ever_allergichis_wrap" v-ever-bind-enter style="padding-right:10px" v-if="input.length">
    <el-form v-for="(item, i) in input" :key="i" style="margin-bottom:15px" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item prop="serviceType">
            <sys-type v-model="item.serviceType" code="THC_WH_OBJECT_SUB_TYPE" :cache="true" :disabled="typeof only === 'string'"></sys-type>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="service">
            <service-query
              v-if="item.serviceType"
              v-model="item.service"
              :types="item.serviceType && item.serviceType.split(',') || []"
            ></service-query>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="count">
            <sys-text v-model.number="item.count" type="number" :append="(item.service && item.service.unitName)" :field="{min: 1, step: 1}"></sys-text>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delItem(i)" v-if="input.length > 1"></i>
          <i class="iconfont icon-tianjia" @click="addItem(i)" v-if="(i + 1) === (input.length)"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import serviceQuery from '@/sob/page/service.surcharge/service.query.vue'

  export default {
    components: { serviceQuery },
    props: ['value', 'type', 'only', 'isSet'],
    data () {
      // 是否开具相同中西药验证
      let checkEqual = (rule, value, callback) => {
        if (!value) {
          callback()
          return false
        }
        let obj = this.input.filter(v => {
          return (v && v.service && v.service.id) === (value && value.id)
        })
        if (obj.length > 1) {
          callback(new Error('此物品已存在'))
          return false
        }
        callback()
      }
      let defValue = {service: '', serviceType: this.only, count: ''}
      return {
        defValue,
        disabled: true,
        isValid: '',
        input: [],
        rules: {
          service: [
            { required: true, message: '必填项', trigger: 'change', type: 'object' },
            { validator: checkEqual, trigger: 'change', type: 'object' }
          ],
          count: [
            { required: true, message: '必填项', trigger: 'change' }
          ]
        }
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
      }
    },
    watch: {
      value (val) {
        if (val && val.length) {
          this.input = val
        } else {
          this.input = [JSON.parse(JSON.stringify(this.defValue))]
        }
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
  .ever_allergichis_wrap{
    .handle_btn{
      white-space: nowrap;
      .iconfont{
        padding: 5px;
        color: #aaa;
        &:nth-child(1){
          margin-left: 10px;
         }
      }
    }
    .marks {
      margin: 0;
      color: #f56c6c;
      font-size: 12px;
      line-height: 18px;
    }
  }
</style>
