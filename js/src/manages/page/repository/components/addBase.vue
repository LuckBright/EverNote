<template>

  <section class="add-base">
     <el-form-item v-if="type === 2" label="诊疗分类" size="small">
       <el-select v-model="form.serviceType" class="service-type-select" placeholder="请选择诊疗类型">
         <el-option label="检查" :value="800"></el-option>
         <el-option label="检验" :value="801"></el-option>
         <el-option label="手术操作" :value="3"></el-option>
       </el-select>
     </el-form-item>
     <el-form-item :label="convertTypeStr + '名称:' " prop="name" :rules="namerules">
        <el-autocomplete size="small"  @select="handleSelect" :fetch-suggestions="querySearch" v-model="form.name" :placeholder=" '请输入' + convertTypeStr + '名称'"></el-autocomplete>
      </el-form-item>
      <el-form-item :label="convertTypeStr + '编码:' " prop="code" :rules="coderules">
        <el-input size="small" disabled v-model="form.code" :placeholder="'请输入' + convertTypeStr + '编码'"></el-input>
      </el-form-item>
      <el-form-item disabled :label="convertTypeStr + '简码:' " prop="pinyinCode" :rules="pinyincoderules">
        <el-input size="small" v-model="form.pinyinCode" :placeholder=" '请输入' + convertTypeStr + '简码'"></el-input>
      </el-form-item>
      <el-form-item label="简要说明:" prop="remark" :rules="remarkrules">
        <el-input size="small" v-model="form.remark" placeholder="请输入简要说明内容"></el-input>
      </el-form-item>
  </section>

</template>

<script lang="js">
  import { request } from '@/util/req'
  import { convertCharToPinyin } from '@/components/pinyin.js'
  export default {
    name: 'add-base',
    props: ['formData', 'nodeType', 'curNode', 'type', 'optionType'],
    watch: {
      formData: {
        immediate: true,
        handler(val) {
          this.form = val // 初始化不限自定义值
        }
      },
      'form.name': function (val, oldVal) {
        this.form.pinyinCode = convertCharToPinyin(val).shoupin.toUpperCase()
      }
    },
    computed: {
      convertTypeStr() {
        return this.optionType.indexOf('proj') <= 0 ? '类别' : '项目'
      }
    },
    mounted() {
      this.$emit('update:formData', this.form)
      this.getCode()
    },
    data () {
      return {
        form: {
          name: '',
          code: '',
          pinyinCode: '',
          remark: ''
        },
        namerules: [{ required: true, message: '必填项', trigger: 'change' }, { max: 20, message: '最多输入20个字符', trigger: 'change' }],
        coderules: [{ required: true, message: '必填项', trigger: 'change' }],
        pinyincoderules: [{ required: true, message: '必填项', trigger: 'change' }],
        remarkrules: [{ max: 20, message: '最多输入20个字符', trigger: 'change' }]
      }
    },
    methods: {
      getCode(type) {
        let cur = this.curNode.data ? this.curNode.data : this.curNode
        let id = (this.optionType === 'createchildren' || this.optionType === 'createproj') ? this.curNode.data.id : this.curNode.data.parentId
        let params = {
          parentId: id,
          type: this.type,
          innerReqList: [{ id: this.curNode.data.id, defaultClassificationId: id, level: this.optionType === 'createclass' ? cur.level : cur.level + 1 }]
        }
        if (this.optionType.indexOf('proj') < 0) {
          request('/platform-extend/classification/getCode', params).then(res => {
            setTimeout(() => {
              this.$set(this.form, 'code', res.data)
            }, 100)
          })
        } else {
          request('/platform-extend/project/getCode', params).then(res => {
            setTimeout(() => {
              this.$set(this.form, 'code', res.data)
            }, 100)
          })
        }
      },
      querySearch(queryString, cb) {
        if (this.type === 2 && !this.form.serviceType) {
          return cb([])
        }
        if (this.form.serviceType === 800 || this.form.serviceType === 801 || this.type === 3) {  // 检查检验
          let params = {
            orgId: localStorage.getItem('TENANTID'),
            serviceClassificationList: [this.curNode.data.value],
            name: queryString
          }
          if (this.curNode.data.systematization === 6) {
            params.serviceClassificationList = [this.form.serviceType]
          }
  
          request('/sob/service/getTenantServiceAndSet', params).then(res => {
            let cbData = res.data.map(item => {
              return {
                value: item.name,
                code: item.code
              }
            })
            cb(cbData)
          })
        } else {
          let params = {
            type: this.type,
            thcCTenantId: localStorage.getItem('TENANTID'),
            thcCOrigId: localStorage.getItem('TENANTID'),
            name: queryString
          }
          if (this.form.serviceType === 3) {
            params.type = this.curNode.data.value
          }
          request('/platform-extend/disease/diseaseOrig/search', params, 'get').then(res => {
            let cbData = res.data.resultList.map(item => {
              return {
                value: item.diseaseName,
                code: item.diseaseCode
              }
            })
            cb(cbData)
          })
        }
      },
      handleSelect(item) {
        this.$emit('standardNumberSelected', item)
      }
    }
}

</script>

<style scoped lang="scss">
  .add-base {
     .service-type-select {
       width: 290px;
     }
     .el-autocomplete {
       width: 290px;
     }
     .el-input {
       width: 290px;
     }
  }
</style>
