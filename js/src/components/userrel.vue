<template>
  <div>
    <el-form class="relation" ref="relation" :inline="true" :model="row" v-for='(row, index) in contactList' :key="index" :rules="rules">
      <el-row :key='index' :index='index'>
        <el-form-item prop="type" style="width: 90px">
          <sys-type code="GBT.4761" v-model="row.type" :use-value="true"></sys-type>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input  v-model="row.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="name" v-if="row.type!== '1'">
          <el-input  v-model="row.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="btnName">
          <el-button type="text" v-if='index === 0' @click="addrow"><i class="iconfont icon-tianjia"></i></el-button>
          <el-button type="text" v-if='index > 0' @click="delrow(index)"><i class="iconfont icon-delete"></i></el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    props: ['value'],
    data () {
      return {
        rules: {
          type: [
            {required: true, message: '请选择关系', trigger: 'change'}
          ],
          mobile: [
            { required: false, message: '请输入11位手机号码', trigger: 'blur', pattern: /^\d{11}$/ }
          ]
        }
      }
    },
    watch: { // 解决了空状态下dialog再次打开没有输入框问题，如有问题可以删除
      contactList () {
        if (this.contactList.length === 0) {
          this.contactList.push({
            type: '',
            mobile: '',
            name: ''
          })
        }
      }
    },
    created () {
      if (this.contactList.length === 0) {
        this.contactList.push({
          type: '',
          mobile: '',
          name: ''
        })
      }
    },
    methods: {
      addrow () {
        this.contactList.push({
          type: '',
          name: '',
          mobile: '',
          btnName: '联系人'
        })
      },
      delrow (index) {
        this.contactList.splice(index, 1)
      },
      isValid () {
        let validarr = []
        this.$refs.relation.forEach((vform) => {
          vform.validate(valid => {
            if (valid) {
              validarr.push(valid)
            }
          })
        })
        return validarr.length === this.$refs.relation.length
      }
    },
    computed: {
      contactList: {
        set (val) {
          this.$emit('input', val)
        },
        get () {
          return this.value || []
        }
      }
    }
  }
</script>

<style scoped>
  .relation:not(:last-child) {
    margin-bottom: 15px;
  }
</style>
