<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="ui_dialog_02"
    :before-close="closeEvent"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="addclassify"
      label-position="left"
    >
      <div slot="default"></div>
      <template slot="imageUrl">
        <upload-file
          ref="upload"
          @change="uploadChange"
          listType="picture-card"
          :maxNum="1"
          :list="uploadImgUrl"
          :uploadApiType="'ucloud'"
        ></upload-file>
      </template>
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
    name: 'category',
    label: '选择分类',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '选择分类'
    },
    span: 12
  },
  {
    name: 'name',
    label: '图文名称',
    span: 12
  },
  {
    name: 'url',
    label: 'URL'
  },
  {
    name: 'imageUrl',
    label: '列表图片',
    comp: 'custom'
  },
  {
    name: 'comment',
    label: '图文摘要',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 100,
      minRows: 4
    }
  }
]
export default {
  props: ['visible', 'id', 'title'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      api,
      schema,
      uploadImgUrl: [],
      submitImg: [],
      dialogVisible: false,
      rules: {
        category: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入图文名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入URL', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible: {
      handler (val) {
        this.dialogVisible = val
        this.getAllImageText()
        if (!this.id) {
          if (this.$refs.addclassify) {
            this.$refs.addclassify.$refs.form.resetFields()
          }
          this.uploadImgUrl = []
        } else {
          this.getImgById(this.id)
        }
      },
      deep: true
    }
  },
  methods: {
    getAllImageText () {
      api.getAllImageText().then(rs => {
        if (rs.head.errCode === 0) {
          this.$ever.getFieldFromSchema(this.schema, 'category').props.options =
            rs.data
        }
      })
    },
    closeEvent () {
      this.obj.name = ''
      this.$emit('close', false)
    },
    save () {
      this.$refs.addclassify.$refs.form.validate(valid => {
        if (valid) {
          let imgList = []
          this.submitImg.forEach(item => {
            imgList.push(item.upload.name)
          })
          this.obj.imageUrl = imgList.join(',')
          api.createImg(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.$emit('update', rs.data.category)
            }
          })
        }
      })
    },
    uploadChange (fileList) {
      this.submitImg = []
      this.submitImg = fileList
    },
    getImgById (id) {
      api.getImgById({ id: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = rs.data
          this.uploadImgUrl = []
          let fileObj = {
            name: rs.data.imageUrl,
            url: this.$filters.fixImgSrc(rs.data.imageUrl)
          }
          this.uploadImgUrl.push(fileObj)
        }
      })
    }
  }
}
</script>
