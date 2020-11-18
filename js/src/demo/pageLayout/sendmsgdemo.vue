<template>
  <div class="layout_inner">
    <p>发短信组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">send-message2</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      :span-method="arraySpanMethod"
      border
    ></ever-table><hr>

    <el-button type="primary" @click="sendmsg">发短信</el-button> <el-button type="primary" @click="sendmsg1">发短信（多人）</el-button>
    <hr />
    <P>发送给单人，以content内容为准，发送给多人，以payload里面的内容为准，用户不能修改模板里的字段 </p>
    params:{{params}}
    <hr />
    <send-message2 ref="sendmessage" :data="params"></send-message2>
    params1:{{params1}}
    <hr />
    <send-message2 ref="sendmessage1" :data="params1"></send-message2>
  </div>
</template>
<script>
import sendMessage2 from '@/crm/page/sendmessage2'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

let params = {
  msgType: 110, // 想要发动短信所属的大分类 必传
  deptId: '9101.A50', // 默认科室，不传需要下拉选择 非必传
  // templateId: '10044', // 短信模板id 不传则需要下拉选择 不传
  content: 'FFFFFF***ck{itemname}', // 发送内容 不传
  ccMobiles: '', // 抄送人手机号 分号隔开'18618453594;18618453594;18618453594', 不传显示为空 非必传
  receivers: [
    {
      id: '1111',  // patientId 必传
      name: '测试1',  // patientName 必传
      mobile: '13241497979',  // 手机号 必传 业务方决定用哪个手机号
      payload: {  // 短信内容数据，非必传
        content: '充值卡',
        patientName: '测试一下下',
        cardSubType: '类型',
        cardType: '头一个了下',
        validityStart: '2018-05-05',
        validityEnd: '2019-06-06',
      }
    },
  ],
}

let params1 = {
  msgType: 110, // 想要发动短信所属的大分类 必传
  deptId: '9101.A50', // 默认科室，不传需要下拉选择 非必传
  // templateId: '10044', // 短信模板id 不传则需要下拉选择 不传
  // content: 'FFFFFF***ck{itemname}', // 发送内容 不传
  // ccMobiles: '', // 抄送人手机号 分号隔开'18618453594;18618453594;18618453594', 不传显示为空 非必传
  receivers: [
    {
      id: '1111',  // patientId 必传
      name: '测试1',  // patientName 必传
      mobile: '13241497979',  // 手机号 必传 业务方决定用哪个手机号
      payload: {  // 短信内容数据，非必传
        content: '充值卡',
        patientName: '测试一下下',
        cardSubType: '类型',
        cardType: '头一个了下',
        validityStart: '2018-05-05',
        validityEnd: '2019-06-06',
      }
    },
    {
      id: '22222',
      name: '测试二1',
      mobile: '13800000000',
      payload: {
        patientName: '测试32下下',
        content: '充值卡2',
        cardSubType: '类型',
        cardType: '头2个了下',
        validityStart: '2018-052-05',
        validityEnd: '2019-06-063',
      }
    },
    {
      id: '33333',
      name: '测试二2',
      mobile: '13800000001',
      payload: {
        patientName: '测试11132下下',
        cardSubType: '类型',
        cardType: '头2个了下',
        validityStart: '2018-052-05',
        validityEnd: '2019-06-063',
      }
    },
  ],
}

export default {
  data () {
    return {
      params,
      params1,
      sendVisible: true,
      columns: [
        {
          prop: 'param',
          label: '参数/属性/事件',
          width: '180',
        },
        {
          prop: 'param1',
          label: '子参数/属性/事件',
          width: '180',
        },
        {
          prop: 'param2',
          label: '子参数/属性/事件',
          width: '180',
        },
        {
          prop: 'description',
          label: '说明',
          afterHtmlFormatter: ({ row }) => {
            if (row.param === 'formatter') {
              return `<span class="demo-female">注意此结果不能包含html标签</span>`
            }
          }
        },
        {
          prop: 'type',
          label: '类型',
          width: '200',
        },
        {
          prop: 'required',
          label: '必填',
          width: '100',
          customCellSpanClassFormatter: ({ value }) => value ? 'demo-female' : '',
          formatter: ({ value }) => value ? '是' : ''
        },
        {
          prop: 'default',
          label: '默认值',
          width: '200',
        }
      ],
      tableData: [
        {
          id: U(),
          param: 'data',
          param1: '',
          param2: '',
          description: '短信相关数据',
          type: 'Object',
          required: true,
          default: '',
          key: 'top'
        },
        {
          id: U(),
          param: '',
          param1: 'msgType',
          param2: '',
          description: '短信相关数据-短信类型（营销111，库房108等）',
          type: 'Integer',
          required: true,
          default: '',
          key: 'data'
        },
        {
          id: U(),
          param: '',
          param1: 'deptId',
          param2: '',
          description: '短信相关数据-科室id（UUID）',
          type: 'String',
          required: false,
          default: '',
          key: 'data'
        },
        {
          id: U(),
          param: '',
          param1: 'ccMobiles',
          param2: '',
          description: '短信相关数据-抄送人手机号',
          type: 'String',
          required: false,
          default: '',
          key: 'data'
        },
        {
          id: U(),
          param: '',
          param1: 'receivers',
          param2: '',
          description: '短信相关数据-发送短信的数据结构',
          type: 'String',
          required: false,
          default: '',
          key: 'data'
        },
        {
          id: U(),
          param: '',
          param1: '',
          param2: 'id',
          description: '短信相关数据-发送短信的数据结构-患者id',
          type: 'String',
          required: true,
          default: '',
          key: 'receivers'
        },
        {
          id: U(),
          param: '',
          param1: '',
          param2: 'name',
          description: '短信相关数据-发送短信的数据结构-患者姓名',
          type: 'String',
          required: true,
          default: '',
          key: 'receivers'
        },
        {
          id: U(),
          param: '',
          param1: '',
          param2: 'mobile',
          description: '短信相关数据-发送短信的数据结构-患者手机号（业务方自己定）',
          type: 'String',
          required: true,
          default: '',
          key: 'receivers'
        },
        {
          id: U(),
          param: '',
          param1: '',
          param2: 'payload',
          description: '短信相关数据-发送短信的数据结构-模板需要的结构化的数据',
          type: 'Object',
          required: false,
          default: '',
          key: 'receivers'
        },
      ]
    }
  },
  created () { },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   console.log(rowIndex)
      //   if (rowIndex === 0) {
      //     return {
      //       rowspan: 4,
      //       colspan: 1
      //     }
      //   } else if (rowIndex === 4) {
      //     return {
      //       rowspan: 5,
      //       colspan: 1
      //     }
      //   }
      // }
    },
    sendmsg () {
      this.$refs.sendmessage.sendVisible = true
    },
    sendmsg1 () {
      this.$refs.sendmessage1.sendVisible = true
    }
  },
  components: {
    sendMessage2
  }
}
</script>
