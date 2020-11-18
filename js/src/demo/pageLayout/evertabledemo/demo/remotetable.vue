<template>
  <div>
    <ever-table
      ref="remoteTableRef"
      :columns="currentColumns"
      :url="url"
      :show-checkbox="true"
      checkboxFixed
      border
      :height="300"
      @eventChange="eventChange"
      :is-remember-selected-row="true"
      :selected-id-key="'selectedId'"
      :config-option="configOption"
      :is-record-url-params="true"
      :handle-result="handleResult"
    >
<!--      以下展示了如何在操作列为slot的情况下仍然需要config的需求-->
      <template slot="opCol">
        <el-table-column label="操作" width="400">
          <template slot="header" slot-scope="scope">
            操作
            <span @click="openConfigDialog" class="icon iconfont icon-biaoge-shezhi ever-table-config"></span>
          </template>
          <template slot-scope="scope">
            <el-button type="primary">这是非常复杂的slot组件</el-button>
            <el-button type="danger">但是该表格需要配置</el-button>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <div class="mt10">
      <el-button @click="changeColumns">改变要显示的列</el-button>
    </div>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'
  import {DEMO_EVERTABLE_REMOTE} from '@/util/table-config'

  export default {
    data: function () {
      return {
        url: urlMap.demo.remote,
        allColumns: [
          {
            prop: 'id',
            label: '编号',
            sortable: true,
            filters: [
              {
                text: 'id1',
                value: '1'
              },
              {
                text: 'id2',
                value: '2'
              },
              {
                text: 'id3',
                value: '3'
              },
              {
                text: 'id4',
                value: '4'
              },
            ],
            width: 400,
            type: 'link',
            linkRoot: '/demo/layout/evertabledemo/fixedheadertable'
          },
          {
            prop: 'name',
            label: '姓名',
            width: 300,
            showOverflowTooltip: true,
            filters: [
              {
                text: 'id1',
                value: '1'
              },
              {
                text: 'id2',
                value: '2'
              },
              {
                text: 'id3',
                value: '3'
              },
              {
                text: 'id4',
                value: '4'
              },
            ]
          },
          {
            prop: 'gender',
            label: '性别',
            width: 300,
            formatter ({value}) {
              if (value === 1) {
                return '男'
              } else if (value === 2) {
                return '女'
              }
            }
          },
          {
            prop: 'price',
            label: '出价',
            width: 300,
          },
          {
            prop: 'prop1',
            label: '字段1',
            width: 300,
          },
          {
            prop: 'customField',
            label: '自定义的补充字段',
            width: 300,
          },
          {
            prop: 'prop3',
            label: '字段3'
          },
          {
            prop: 'prop4',
            label: '字段4'
          },
          {
            // prop: 'ever-op', // 最好加上一个prop
            slotName: 'opCol',
            // isOperate: true, // 如果slot表示的是操作列，则必须加上isOperate为true，若slotName = opCol，表示该列是操作列 则该属性可以忽略
          }
          // {
          //   prop: 'ever-op', // 该列的唯一标示
          //   type: 'btns',
          //   label: '操作',
          //   btns: [
          //     {
          //       prop: 'edit',
          //       label: '编辑2'
          //     },
          //     'del'
          //   ]
          // }
        ],
        currentColumns: [],
        idFilters: [
          {
            text: 'id1',
            value: '1'
          },
          {
            text: 'id2',
            value: '2'
          },
          {
            text: 'id3',
            value: '3'
          },
          {
            text: 'id4',
            value: '4'
          },
        ],
        configOption: {
          id: DEMO_EVERTABLE_REMOTE,
        },
        // defaultRowStatus: true, // 【行记录】第一步：定义默认行状态标记为true
      }
    },
    created () {
      // 根据路由信息将当前行选中
      this.changeColumns(true)
    },
    mounted () {
      // 改变参数就能触发查询，触发查询还有另外一种方式，调用ever-table的list方法 入参表示是否从第一页还是查询
      this.$refs.remoteTableRef.list(true)
    },
    methods: {
      eventChange ({prop, row, col}) {
        // 这里只是例子，实际开发时可以使用
        // this[prop] && this[prop](row)
        console.log(prop, row, col)
      },
      changeColumns (init = false) {
        // 模拟使用场景：当一个页面需要渲染多个表格<实际上只是列不同，数据来源，样式，位置等相同>时，可以使用改变列来实现
        this.currentColumns = [...this.allColumns.slice(0, -1).filter(() => init ? true : (Math.random() > 0.4)), this.allColumns[this.allColumns.length - 1]]
      },
      openConfigDialog () {
        this.$refs.remoteTableRef.openConfigDialog()
      },
      handleResult (res) {
        return res.data.map(item => ({...item, customField: item.price}))
      }
    }
  }
</script>

