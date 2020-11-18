const schema = [
  {
    name: 'invoiceNo',
    label: '发票号码',
    span: 8
  },
  {
    name: 'invoiceAmount',
    label: '发票金额',
    span: 8
  },
  {
    name: 'operation',
    comp: 'custom',
    labelWidth: '20px',
    span: 8
  },
  {
    name: 'url',
    label: '上传发票',
    comp: 'everUpload1',
    props: {
      limit: 1,
      type: 'doc',
      uploadTxt: '选择文件',
      tipsFlag: true,
      accept: 'jpg、png',
      maxSize: 2,
      appendToBody: true
    },
    slots: [
      {
        name: 'tip',
        template: '<span class="f12 ml10 cGray">支持jpg、png格式，图片大小不超过2M</span>'
      }
    ],
    span: 24
  }
]

export default schema
