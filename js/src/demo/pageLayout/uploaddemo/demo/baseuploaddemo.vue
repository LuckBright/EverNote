<template>
  <div>
    <p>表单内上传的两种写法</p>
    <ever-form2
      :schema="schema"
      v-model="obj"
      ref="form"
      :inline="true"
      :is-query="true"
    >
      <template slot="upload1">
        <ever-upload1 type="doc" :limit="1" :tipsFlag="true">
          <span slot="tip">
            fdsljksdfsfas
          </span>
        </ever-upload1>
      </template>
    </ever-form2>
    <hr>
    fileUrl:{{fileUrl}}
    <hr>单图片上传
    <doc-download @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="导出盘点报告"></doc-download>
  </div>
</template>

<script>
import everUpload from '@/components/ever-upload'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import userAvator from '@/components/user/avatar'

let schema = [
  {
    name: 'validDateStart',
    label: '生效日期自',
    comp: 'date-picker',
    span: 6,
    props: {
      outformat: 'yyyy-MM-dd',
      // placeholder: '大爷的，传了也不好使'
    }
  },
  {
    name: 'marginTop',
    label: '上边距',
    span: 8,
    props: {
      placeholder: '上边距(输入值必须大于等于0.5)',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米111</span>'
      }
    ]
  },
  {
    name: 'upload',
    label: '上传发票：',
    comp: 'ever-upload1',
    props: {
      type: 'doc',
      limit: 1,
      tipsFlag: true,
    },
    slots: [
      {
        name: 'tip',
        template: '<span class="cRed">ssss</span>'
      }
    ]
  },
  {
    name: 'upload1',
    label: '上传发票：',
    comp: 'custom',
  }
]

export default {
  components: { everUpload, userAvator },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      fileUrl: '',
      avatarPic: '',
      uploadKey: U(),
      uploadList: [],
      imageUrl: '',
      uploadAttrs1: {
        'on-success' (res) {
          this.imageUrl = res.data.fileUrl
          console.log(res, this)
        },
        'show-file-list': false,
        'list-type': 'picture-card',
        'on-preview' (res) {
        },
        'on-remove' (res) {
        }
      },
      uploadAttrs2: {},
      uploadAttrs3: {},
      uploadAttrs: {
        'on-success' (res) {
          console.log(res, this)
        },
        'on-preview' (file) {
          console.log('on-preview', file, this)
        },
        'on-remove' (file) {
          console.log('on-remove', file, this)
        },
        'before-remove' (file) {
          console.log('before-remove', file, this)
        },
        'on-exceed' (files, fileList) {
          console.log('on-exceed', files, this)
        },
        // 'file-list': [
        //   {
        //     name: 'food.jpeg',
        //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   },
        //   {
        //     name: 'food2.jpeg',
        //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   },
        // ],
        'show-file-list': false,
      },
    }
  },
  created () {
    this.uploadList = [
      {
        name: '509a7cab863eb25cbf551a21b1834a5f',
        url: 'http://img.demoxht.everjiankang.com.cn/509a7cab863eb25cbf551a21b1834a5f',
      },
    ]
  },
  methods: {
    downFile () {
      // 想尽一切办法拿到下载的url 例如：/file/6,a771eb351a
      let fileurl = this.$ever.filePath + 'JdiGvTTD0Lga8KY96I6'
      this.$refs.childMethods.downfile(fileurl)
    },
    exportStatus (val) {
      console.log(val, 22)
    },
    uploadSuccess: function (file) {
      console.log('file--->', file)
    },
    fileList: function (fileList) {
      this.fileUrl = fileList
      console.log('file arr---->', this.fileUrl)
    },
    changeUploadAttr () {
      this.uploadAttrs['file-list'] = [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ]
      this.uploadKey = U()
    },
    triggerUpload () {
      const btn = this.$refs.upload.$refs.upload.$el.querySelector('button')
      btn.click()
    },
  },
}
</script>
