<template>
  <el-dialog
    title="新建分类"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="closeEvent">
    <ever-form2 
    :schema="schema"
    v-model="obj"
    :api="api"
    :rules="rules"
    ref="addclassify"
    label-position="left">
    <div slot="default"></div>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '@/crm/store/healthy/followapi'
  let schema = [
    {
      name: 'name',
      label: '分类名称',
      props: {
        maxlength: 20
      }
    }
  ]
  export default {
    props: ['visible', 'id'],
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      return {
        obj,
        api,
        schema,
        dialogVisible: false,
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'visible': {
        handler: function (val) {
          this.dialogVisible = val
          if (!this.id) {
            this.obj.name = ''
            this.obj.id = ''
          }
        },
        deep: true
      },
      'id': {
        handler: function (val) {
          val && this.getCategorydetail(val)
        }
      }
    },
    methods: {
      closeEvent () {
        this.obj.name = this.obj.id ? this.obj.name : ''
        this.$emit('close', false)
      },
      save () {
        this.$refs.addclassify.$refs.form.validate(valid => {
          if (valid) {
            api.addClassify(this.obj).then(rs => {
              if (rs.head.errCode === 0) {
                this.$messageTips(this, 'success', '操作成功')
                this.$emit('update')
              }
            })
          }
        })
      },
      getCategorydetail (id) {
        api.getCategorydetail({'id': id}).then(rs => {
          if (rs.head.errCode === 0) {
            this.obj.id = rs.data.id
            this.obj.name = rs.data.name
          }
        })
      }
    }
  }
</script>
