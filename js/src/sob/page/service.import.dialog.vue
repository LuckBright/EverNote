<template>
  <div id="serviceImport">
    <el-dialog
      title="选择同步的类型"
      :visible.sync="flag"
      class="ui_dialog_02">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span=24
        :api="api"
        :rules="rules"
        ref="form"
        label-position="right"
        :nosubmit="true">
        <template slot="type1">
          <el-radio-group
            v-model="obj.type1"
            placeholder="请选择类型">
            <el-radio
              v-for="item in options"
              :key="item.id"
              :label="item.value">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </template>
      </ever-form2>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onDialogClose"><i class="iconfont icon-quxiao"></i>取消</el-button>
        <el-button type="primary" @click="postData"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import api from '../store/serviceimportapi'
  import form from '@/util/form'

  var schema = [
    {
      name: 'type1',
      label: '选择分类',
      comp: 'custom'
    },
    {
      name: 'file1',
      label: '上传文件',
      comp: 'uploadFile',
      props: {
        uploadApiType: 'ucloud',
        maxNum: 1
      }
    }
  ]

  export default {
    mixins: [form],
    props: ['visible'],
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      obj.file1 = ''
      obj.type1 = 2
      return {
        schema,
        obj,
        api,
        options: [
          {
            value: 2,
            name: '诊疗类'
          }
        ],
        rules: {
          type1: [
            { required: true, message: '必选项', trigger: 'change', type: 'number' }
          ]
        },
        flag: false,
        fileList: []
      }
    },
    beforecreated () {
      this.api = api
    },
    methods: {
      uploadSuccess (res) {
        this.obj.uploadFile = res.url
      },
      onDialogClose () {
        this.flag = false
      },
      postData () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            var params = {
              fileUrl: this.obj.file1[0].response.url
            }
            api.postData(params).then(res => {
              if (res.head.errCode === 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                })
                this.onDialogClose()
              }
            })
          }
        })
      }
    },
    watch: {
      'visible' (val) {
        this.flag = val
      },
      'flag' (val) {
        this.$emit('update:visible', val)
      },
      'obj.type1' (val) {
        if (val === 2) {

        } else {

        }
      }
    }
  }
</script>
