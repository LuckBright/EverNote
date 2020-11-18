<template>
  <div v-loading="loading">
    <ever-form-model
      ref="form"
      v-model="value"
      :schema="schema"
      :label-width="labelWidth || '150px'"
      :label-position="labelPosition || 'top'"
      :rules="rules"
      @addInput="addInput"
      @searchCard="searchCard"
      @selectuser="selectUser"
      @stopUser="stopUser"
      @startUser="startUser "
      @countNum="countNum"
      @deleteuser="deleteUser"
      @addinputitem="addInputItem"
      @delinputitem="delInputItem">
      <slot></slot>
      <el-form-item v-if="!noSubmit">
        <el-button type="primary" :disabled="submitDisabled" @click="submitForm('form')" v-if="!objId">{{btnName?btnName[0]:'创建'}}</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="submitForm('form')" v-if="objId">{{btnName?btnName[1]:'保存'}}</el-button>
        <el-button @click="resetForm('form')" v-if="!objId">重置</el-button>
      </el-form-item>
    </ever-form-model>
  </div>
</template>
<script>
  export default {
    props: ['schema', 'value', 'api', 'labelPosition', 'labelWidth', 'span', 'rules', 'btnName', 'noSubmit'],
    data () {
      return {
        objId: this.value.id || (this.$route.params.id === '-1' ? null : this.$route.params.id),
        submitDisabled: false,
        loading: false
      }
    },
    methods: {
      submitForm: function () {
        this.submitDisabled = true
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            this.api.createOrUpdate(this.value).then(result => {
              this.loading = false
              this.submitDisabled = false
              this.$emit('objsaved', result)
            }, _ => {
              this.loading = false
              this.submitDisabled = false
            })
          } else {
            this.submitDisabled = false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].$refs.form.resetFields()
      },
      getDetail: function () {
        this.api.getById(this.objId).then(result => {
          if (result && result.id) {
            Object.assign(this.value, result)
          }
        })
      },
      addInput (data) {
        this.$emit('addInput', data)
      },
      searchCard (data) {
        this.$emit('searchCard', data)
      },
      stopUser (index, rows, name) {
        this.$emit('stopUser', index, name)
      },
      startUser (index, rows, name) {
        this.$emit('startUser', index, name)
      },
      countNum (data) {
        this.$emit('countNum', data)
      },
      selectUser (name) {
        this.$emit('selectuser', name)
      },
      deleteUser (index, name) {
        this.$emit('deleteuser', index, name)
      },
      addInputItem (i) {
        this.$emit('addinputitem', i)
      },
      delInputItem (i) {
        this.$emit('delinputitem', i)
      }
    },
    created: function () {
      if (this.objId) {
        this.getDetail()
      }
    },
    watch: {
      '$route': function () {
        if (this.objId) {
          this.getDetail()
        }
      }
    }
  }
</script>
