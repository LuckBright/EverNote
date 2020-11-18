<template>
  <div class="quill-box">
    <!-- 图片上传组件辅助-->
    <div class="quill-text">
      <p>商品详情效果预览</p>
      <div class='ql-editor' v-html="textInfo"></div>
    </div>
    <div class="quill">
      <!--富文本编辑器组件-->
      <el-row>
        <quill-editor
          class="ql-editor"
          v-model="detailContent"
          ref="myQuillEditor"
          :options="editorOption"
          @change="onEditorChange($event)"
        >
        </quill-editor>
      </el-row>
    </div>
    <el-dialog
      class="group-img"
      title="我的图片"
      :visible.sync="pictureDialog"
      width="80%"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <picture-group
        v-if="pictureDialog"
        ref="pictureRef"
        @choose="chooseBtn"
        :isMany="true"
        @close="closeDialogBtn"
      ></picture-group>
    </el-dialog>
  </div>
</template>
<script>
  // 工具栏配置
  const toolbarOptions = [
    [ 'bold', 'italic', 'underline', 'strike' ], // 加粗，斜体，下划线，删除线
    [ 'blockquote', 'code-block' ], // 引用，代码块

    [ { header: 1 }, { header: 2 } ], // 标题，键值对的形式；1、2表示字体大小
    [ { list: 'ordered' }, { list: 'bullet' } ], // 列表
    [ { script: 'sub' }, { script: 'super' } ], // 上下标
    [ { indent: '-1' }, { indent: '+1' } ], // 缩进
    [ { direction: 'rtl' } ], // 文本方向
    [ { size: [ 'small', 'large', 'huge' ] } ], // 字体大小
    [ { header: [ 1, 2, 3, 4, 5, 6 ] } ], // 几级标题

    [ { color: [] }, { background: [] } ], // 字体颜色，字体背景颜色
    [ { font: [] } ], // 字体
    // [{ align: [] }], // 对齐方式
    [ 'clean' ], // 清除字体样式
    [ 'image' ], // 上传图片、上传视频, "video"
  ]
  import pictureGroup from '@/titanmall/components/picture.group'

  export default {
    components: { pictureGroup },
    data () {
      return {
        header: { token: localStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
        detailContent: '', // 富文本内容
        editorOption: {
          placeholder: '',
          theme: 'snow', // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions, // 工具栏
              handlers: {
                image: value => {
                  if (value) {
                    // document.querySelector(".avatar-uploader input").click();
                    this.pictureDialog = true
                  } else {
                    this.quill.format('image', false)
                  }
                },
              },
            },
          },
        },
        textInfo: '',
        timer: '',
        pictureDialog: false,
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    methods: {
      // 添加图片返回结果
      chooseBtn (info) {
        info.forEach(item => {
          this.uploadSuccess(item)
          this.pictureDialog = false
        })
      },

      // 关闭弹框
      closeDialogBtn () {
        this.pictureDialog = false
      },

      uploadSuccess (url) {
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        let quill = this.$refs.myQuillEditor.quill
        // 如果上传成功
        //   // 获取光标所在位置
        let length = this.$refs.myQuillEditor.quill.selection.savedRange.index
        //   // 插入图片  res.info为服务器返回的图片地址

        url = url.includes('http') ? url : this.imgCdn + url
        quill.insertEmbed(length, 'image', url)
        //   // 调整光标到最后
        quill.setSelection(length + 1)
      },
      onEditorChange (ever) {
        let quill = this.$refs.myQuillEditor.quill
        quill.once('selection-change', function (range, oldRange, source) {
          if (range) {
            if (range.length === 0) {
              // console.log("User cursor is on", range.index);
            } else {
              // var text = quill.getText(range.index, range.length);
              // console.log("User has highlighted", text);
            }
          } else {
            // console.log("Cursor not in the editor");
          }
        })
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.textInfo = this.detailContent.replace(
            /<img/g,
            '<img style=\'max-width: 100%\'',
          )
        }, 1000)
      },
    },
  }
</script>
<style lang="less" scoped>
  .quill-box {
    display: flex;
    justify-content: space-around;
    margin: 20px 0 60px;
    padding: 20px 0;
    min-height: 100px;

    .quill-text {
      width: 40%;

      p {
        background: #e5e5e5;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
      }

      div {
        background: #f9f9f9;
        min-height: 100px;
        padding: 20px;
      }

      .img-wd {
        width: 100px;
      }
    }

    .quill {
      width: 40%;
      background: #fff;

      .avatar-uploader {
        display: none;
      }
    }
  }
</style>
