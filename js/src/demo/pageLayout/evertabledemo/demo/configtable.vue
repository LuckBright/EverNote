<template>
  <ever-table
    :columns="columns"
    :data="tableData"
    border
    :loading="loading"
    :is-drag-table="true"
    table-default-cell-value="xxx"
    :special-cell-config="specialCellConfig"
    :config-option="configOption"
    @eventChange="eventChange"
    @cell-click="cellClickHandler"
    @row-dblclick="rdcHandler"
    :is-record-url-params="false"
    :el-table-attr="elTableAttr"
    :not-select-checkbox="true"
    show-checkbox
  >
    <template slot="operateColumn" slot-scope="scope">
      <el-button @click="doOperate(scope)">操作</el-button>
    </template>
  </ever-table>
</template>

<script>
  import { tableColWidth } from '@/util/table-config'

  const getPadding0 = str => {
    return ('0' + str).slice(-2)
  }
  // 获取num位的随机数
  const getRandomNum = num => {
    return Array(num).fill(0).map(() => Math.floor(Math.random() * 10)).join('')
  }
  // 获取两数之间的随机数，只传一个数表示获取0到该数的随机数
  const getRangeNum = (num1, num2 = 0) => {
    const max = Math.max(num1, num2)
    const min = Math.min(num1, num2)
    return Math.floor(Math.random() * (max - min) + min)
  }
  export default {
    data: function () {
      return {
        elTableAttr: {
          'empty-text': '自定义无数据AAAA',
        },
        columns: [
          {
            prop: 'operateColumn',
            width: 63,
            undraggable: true,
            slot: 'operateColumn',
          },
          {
            prop: 'name',
            label: '姓名',
            width: tableColWidth.name5W90,
            type: 'link',
            undraggable: true, // 该列不可拖拽
            urlFormatter ({ row }) { // 该值可以是函数，也可以是字符串，如果不传该值，则按照默认规则拼接url（即：linkRoot + id）
              // 对于可以简单点击的单元格可以做如下格式化
              return `to/path/:${row.id}`
            },
            afterHtmlFormatter () {
              return `<i class="icon iconfont icon-menzhen-yibao1 ml5"></i>`
            },
          },
          {
            hidden: true,
            prop: 'birthday',
            label: '',
            width: tableColWidth.dateW105,
          },
          {
            prop: 'age',
            label: '年龄',
            width: tableColWidth.name2W54,
            type: 'eventText',
            event: 'detail',
          },
          {
            prop: 'gender',
            label: '性别',
            width: tableColWidth.name2W54,
            customCellSpanClassFormatter ({ value }) {
              return value === 0 ? 'demo-female' : (value === 1 ? 'demo-male' : '')
            },
            formatter: ({ value }) => {
              if (value === 0) {
                return '女'
              } else if (value === 1) {
                return '男'
              }
            },
          },
          {
            prop: 'createTime',
            label: '办理时间',
            width: tableColWidth.datetimeW150,
          },
          {
            prop: 'idCardNum',
            label: '身份证号',
            // beforeHtmlFormatter ({row}) { // 使用静态html渲染
            //   return `<span class="icon iconfont icon-nav-yingxiaoi-shenfe mr5 ${row.gender === 0 ? 'demo-female' : (row.gender === 1 ? 'demo-male' : '')}"></span>`
            // },
            width: tableColWidth.idCardW175,
          },
          {
            prop: 'phoneNum',
            label: '手机号',
            width: tableColWidth.phoneW115,
          },
          {
            prop: 'visitType',
            label: '初/复诊',
            width: tableColWidth.name5W90,
            customCellSpanClassFormatter ({ value }) {
              return value === 1 ? 'danger' : ''
            },
            formatter ({ value }) {
              if (value === 0) {
                return '初诊'
              } else if (value === 1) {
                return '复诊'
              }
            },
          },
          {
            prop: 'amount',
            label: '费用',
            width: tableColWidth.phoneW115,
            align: 'right',
            formatter: ({ value }) => {
              return this.$filters.formatToFinacial(value, 4)
            },
          },
          {
            prop: 'address',
            label: '联系地址',
            defaultCellValue: '',
            sortable: true,
          },
          // {
          //   prop: 'ever-op',
          //   label: '操作',
          //   width: tableColWidth.btn3W170,
          //   type: 'btns',
          //   undraggable: true,
          //   // 使用静态按钮组
          //   // btns: [
          //   //   'del',
          //   //   'edit',
          //   //   {
          //   //     prop: 'share',
          //   //     label: '分享'
          //   //   },
          //   //   {
          //   //     prop: 'collect',
          //   //     label: '收藏'
          //   //   }
          //   // ],
          //   // 使用formatter进行按钮组的自定义
          //   btns: ({ row }) => {
          //     let baseBtns = [
          //       'del',
          //       'edit',
          //       {
          //         prop: 'share',
          //         label: '分享',
          //       },
          //       {
          //         prop: 'collect',
          //         label: '收藏',
          //       },
          //     ]
          //     if (row.visitType === 1) {
          //       baseBtns.splice(1, 1) // 不允许edit
          //     }
          //     if (row.gender === 1) {
          //       // return baseBtns.slice(0, 1) // 只允许删除
          //       baseBtns = [ 'edit' ] // 只允许编辑
          //     }
          //     if (!row.address) {
          //       baseBtns[0] = {
          //         prop: baseBtns[0],
          //         disabled: true, // 状态为禁用
          //       }
          //     }
          //     return baseBtns
          //   },
          // },
        ],
        configOption: {
          // id: DEMO_EVERTABLE_CONFIG,
          isAutoId: true, // 若能确定当前 请求数据的url+地址栏的hash值 的唯一性时使用
        },
        tableData: [],
        loading: false,
        // 特殊单元格的配置，如果要配置多种特殊样式，则可以使用数组
        specialCellConfig: { // 该配置项在此处的意思是，对于visitType一列，当值为1时，将该单元格的td上加上danger的class
          prop: 'visitType',
          value: 1,
          className: 'danger',
        },
      }
    },
    created () {
      const nameArray = [ '张三', '张四', '张五', '张六', '张七', '张八', '张九', '张十', '张十一', '张十二', '张十三', '张十四', '张十五', '张十六', '张十七', '张十八', '张十九' ]
      this.tableData = Array(12).fill(0).map((item, index) => {
        const name = (nameArray.length ? nameArray.splice(Math.floor(Math.random() * nameArray.length), 1)[0] : '迪丽热巴')
        const age = Math.floor(Math.random() * 100)
        const birthday = `${new Date().getFullYear() - age}-${getPadding0(Math.ceil(Math.random() * 12))}-${getPadding0(getRangeNum(29))}`
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 32))
        return {
          id: index,
          name,
          gender: Math.random() > 0.2 ? (Math.random() > 0.5 ? 0 : 1) : undefined,
          age,
          birthday,
          createTime: `${date.getFullYear()}-${getPadding0(date.getMonth() + 1)}-${getPadding0(date.getDate())} ${getPadding0(getRangeNum(24))}:${getPadding0(getRangeNum(60))}`,
          idCardNum: `${getRandomNum(6)}${birthday.replace(/-/g, '')}${getRandomNum(4)}`,
          phoneNum: `1${[ 3, 4, 5, 6, 7, 8 ][Math.floor(Math.random() * 6)]}${getRandomNum(9)}`,
          visitType: Math.random() > 0.5 ? 0 : 1,
          amount: Math.random() > 0.1 ? (Math.random() * 1000000).toFixed(Math.floor(Math.random() * 6)) : '',
          address: Math.random() > 0.5 ? '北京市顺义区空港融慧园32-4尚医智信健康管理有限公司' : '',
        }
      })
      this.tableData = []
    },
    mounted () {
    },
    methods: {
      eventChange ({ prop, row, col }) {
        // 这里只是例子，实际开发时可以使用
        // this[prop] && this[prop](row)
        if (prop === 'edit') {
          console.log('执行编辑操作', col, row)
        } else if (prop === 'del') {
          console.log('执行删除操作', col, row)
        } else if (prop === 'share') {
          console.log('执行分享操作', col, row)
        } else if (prop === 'collect') {
          console.log('执行收藏操作', col, row)
        } else if (prop === 'detail') {
          console.log('执行详情操作', col, row)
        }
      },
      cellClickHandler ({ row, column, cell, event }) {
        console.log(row, column, cell, event)
      },
      rdcHandler ({ row }) {
        console.log(row, 'double click')
      },
      doOperate (scope) {
        console.log(scope, '执行操作')
      },
    },
  }
</script>

<style scoped lang="less">
</style>
