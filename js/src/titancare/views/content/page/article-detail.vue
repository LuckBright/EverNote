<template>
  <div class="mgl">
    <div class="layout_inner container1">
      <p class="topClose">
        <!-- <span @click="close">&lt;&nbsp;&nbsp;返回</span> -->
        <ever-bread-crumb name="返回"></ever-bread-crumb>
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="formclass"
      >
        <el-form-item label="文章标题 :" required>
          <el-input
            v-model="ruleForm.title"
            class="content_title"
            placeholder="请输入文章标题"
            show-word-limit
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章标签 :" class="tag" required>
          <el-tag
            :key="index"
            v-for="(tag,index) in ruleForm.tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            v-show="ruleForm.tag.length<=2"
          >+ 请输入文章标签</el-button>
        </el-form-item>
        <el-form-item label="feed展示样式 :" required>
          <el-radio-group v-model="radio" class="boxwrap">
            <div
              v-for="item in imgArr"
              :key="item.style"
              class="box"
              @click="choosefeed(item)"
              :class="midchoose&&midchoose.style === item.style?'choose':''"
            >
              <el-radio :label="item.style" size="medium">{{item.name}}</el-radio>
              <div>
                <img :src="item.imgsrc" />
              </div>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图 :" v-if="midchoose && maxpicture" required class="uploadpic">
          <el-upload
            :action="action"
            :headers="headers"
            ref="upload"
            class="up"
            :class="{'isShowUpload': fileList.length === maxpicture}"
            :file-list="fileList"
            :on-success="successpic"
            list-type="picture-card"
            :on-remove="handleRemove"
            :limit="maxpicture"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="notice">{{midchoose.text}}</div>
        </el-form-item>
        <el-form-item label="文章内容 :" required>
          <evereditor
            class="editor"
            menu="base"
            :toolbars="toolbars"
            :contextmenu="contextmenu"
            ref="editor"
            v-model="ruleForm.context"
            :options="simpleOpts"
            :editable.sync="editoreditable"
            :is-updated.sync="editorIsUpdated"
          ></evereditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="save('ruleForm')" type="primary">保存</el-button>
          <el-button @click="cancel('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/content/article'
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'
import evereditor from 'evereditor'
import { debounce } from '@/titancare/utils/common'
import singel from '@/titancare/assets/img/singel.jpg'
import none from '@/titancare/assets/img/none.jpg'
import three from '@/titancare/assets/img/three.jpg'
import big from '@/titancare/assets/img/big.jpg'
import { editorBaseOpts } from '@/util/common'

export default {
  components: {
    evereditor
  },
  data () {
    return {
      storage,
      api,
      contextmenu: false,
      radio: '',
      editoreditable: true, // 编辑器是否可编辑
      editorIsUpdated: true, // 编辑器内容是否更新
      simpleOpts: {
        htmlSync: true,
        // 图片上传配置
        ...editorBaseOpts
      },
      toolbars: ['Undo', 'Redo', 'Table', 'Image', 'Link', 'Bold', 'Italic', 'Strike', 'Underline', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'Align Left', 'Align Center', 'Align Right', 'Align Justify'],
      fileUrl: storage.getLocalStorage('BASEURL'),
      inputVisible: false,
      inputValue: '',
      action: `${diction.api}${prefix.cms}base/fs/multiUpload`,
      fileList: [], // 图片数组
      imgArr: [{ name: '1图', style: 1, imgsrc: singel, text: '建议上传尺寸312*176(16:9)' }, { name: '3图', style: 3, imgsrc: three, text: '建议上传尺寸226*150(3:2)' }, { name: '大图', style: 2, imgsrc: big, text: '建议上传尺寸702*380' }, { name: '无图', style: 0, imgsrc: none, text: '' }],
      maxpicture: 1,
      midchoose: {}, // 选中的feed模式1
      // midchoose: {
      //   name: '1图',
      //   style: 1
      // }, // 选中的feed模式
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      },
      html: '',
      ruleForm: {
        id: (this.$route.query && this.$route.query.id) || '',
        title: '', // 文章标题
        tag: [], // string 文章标签，逗号分隔
        style: 1, // 文章样式：0：无图 1：一图 2：大图 3：3图
        styleImg: [],
        context: '' // 封面url
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        tag: [
          { type: 'array', required: true }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.id) this.getById()
  },
  methods: {
    save: debounce(function () {
      if (!this.ruleForm.title) {
        this.$notify.error({
          message: '请输入文章标题'
        })
        return false
      }
      if (!this.ruleForm.tag) {
        this.$notify.error({
          message: '请输入文章标签'
        })
        return false
      }
      if (!this.midchoose.name) {
        this.$notify.error({
          message: '请选择feed展示样式'
        })
        return false
      }
      if (this.midchoose.style === 1 || this.midchoose.style === 2) {
        if (this.fileList.length === 0) {
          this.$notify.error({
            message: '请上传图片'
          })
          return false
        }
      }
      if (this.midchoose.style === 3) {
        if (this.fileList.length < 3) {
          this.$notify.error({
            message: '请上传3张图片'
          })
          return false
        }
      }
      if (this.$refs.editor.getHtml().length <= 7) {
        this.$notify.error({
          message: '文章内容不能为空'
        })
        return false
      }
      let submitObj = Object.assign({}, this.ruleForm)
      submitObj.context = this.$refs.editor.getHtml()
      submitObj.tag = this.ruleForm.tag.join(',')
      submitObj.style = this.midchoose && this.midchoose.style
      submitObj.styleImg = this.fileList.map(item => {
        if (item.response) {
          return item.response.data.fileId
        } else {
          return item.url.substring(item.url.indexOf('fileId=') + 7)
        }
      })
      let apitype = this.$route.query && this.$route.query.id ? 'update' : 'created'
      this.api[apitype](submitObj).then(rs => {
        if (rs && rs.errCode === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.$router.push({ name: 'article', query: { queryobj: this.$route.query.queryobj } })
          // this.close()
        }
      })
    }),
    getById () {
      this.api.getById(this.$route.query.id).then(rs => {
        if (rs.errCode === 0) {
          // id title
          this.ruleForm = Object.assign({}, rs.data)
          // tag回显
          this.ruleForm.tag = this.ruleForm.tag.split(',')
          // 回显feed选中
          // this.midchoose.style = this.ruleForm.style
          this.midchoose = this.imgArr.filter(item => item.style === this.ruleForm.style)[0]
          this.maxpicture = this.midchoose.style
          this.radio = this.ruleForm.style
          // 回显图片
          this.$nextTick(() => {
            this.fileList = this.ruleForm.styleImg.map(item => {
              return { url: `${this.$ever.fileUrl2}${item}` }
            })
            console.log(this.fileList, ' this.fileList')
          })
          // 回显富文本  直接v-model
        }
      })
    },
    successpic (response, file, fileList) {
      this.fileList = fileList
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    choosefeed (v) {
      if (this.midchoose === v) {
        return
      }
      this.fileList = []
      this.midchoose = v
      this.radio = v.style
      // this.$refs.upload.clearFiles()
      if (v.style === 1 || v.style === 2) {
        this.maxpicture = 1
      } else if (v.style === 3) {
        this.maxpicture = 3
      } else {
        this.maxpicture = 0
      }
    },
    // close () {
    //   this.$router.push({ path: '/content/article', query: { queryobj: this.$route.query.queryobj } })
    // },
    handleClose (tagitem) {
      this.ruleForm.tag.splice(this.ruleForm.tag.indexOf(tagitem), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.ruleForm.tag.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    cancel: debounce(function () {
      this.close()
    })
  }
}
</script>
<style lang='less' scoped>
.editor {
  max-width: 700px;
  float: left;
  /deep/ .ProseMirror {
    max-height: 400px !important;
  }
}
.footer {
  text-align: left;
  .allno {
    margin: 20px;
  }
}
.choose {
  border: 1px solid #1c7bef !important;
  box-shadow: 0 2px 4px 0 rgba(226, 226, 226, 0.5);
  border-radius: 2px;
  border-radius: 2px;
}
.feed {
  div {
    display: inline-block;
    border: none;
    width: 150px;
    height: 90px;
    margin-right: 10px;
    > img {
      width: 150px;
      height: 90px;
    }
    p {
      margin: 0px;
      font-size: 14px;
      line-height: 16px;
      padding: 0px;
      text-align: center;
    }
  }
}
.uploadpic {
  .up {
    display: inline-block;
  }
  .notice {
    display: inline-block;
    color: #999;
    margin: 0px 0px 0px 20px;
  }
}
.isShowUpload {
  margin-top: 10px;
  /deep/ .el-upload.el-upload--picture-card {
    display: none;
  }
}

.layout_inner {
  overflow: auto;
  padding: 20px;
  margin-right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
.container1 {
  height: 100%;
  font-size: 14px;
  line-height: 14px;
  margin-top: none;
  .boxwrap {
    .box {
      background: #ffffff;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 4px 0 rgba(226, 226, 226, 0.5);
      border-radius: 2px;
      border-radius: 2px;
      display: inline-block;
      margin-right: 10px;
      padding: 8px;
      div {
        border-top: 1px solid #dddddd;
        margin-top: 8px;
        img {
          width: 100px;
          height: 32.2px;
          padding-top: 8px;
        }
      }
    }
  }
  .topClose {
    color: #666;
    margin: 10px 0px;
    span {
      cursor: pointer;
    }
    &:hover {
      color: #1c7bef;
    }
  }
  .formclass {
    .content_title {
      width: 520px;
    }
    .tag {
      // .el-tag + .el-tag {
      //   margin-left: 10px;
      // }
      .el-tag {
        margin-right: 10px;
      }
      .button-new-tag {
        // margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
  }
}
</style>
