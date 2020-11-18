<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj1"
        ref="form"
        :schema="querySchema1"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list1()">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table1"
      :columns="currentColumns"
      :url="url"
      :params="params1"
      @update:params="changeParams1"
      :show-checkbox="false"
      :is-auto-height="false"
      :config-option="configOption1"
      :is-record-url-params="true"
      :is-single-table="true"
      height="200"
      :row-class-name="rowClassName"
      @eventChange="eventChange"
      @row-click="rowClick"
      @afterSearch="afterSearch"
    >
    </ever-table>
    <div class="main-head">
      <ever-form2
        v-model="queryObj2"
        ref="form"
        :schema="querySchema2"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list2()">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table2"
      :columns="currentColumns"
      :url="url"
      :params="params2"
      @update:params="changeParams2"
      :show-checkbox="false"
      :is-auto-height="false"
      :config-option="configOption2"
      :is-record-url-params="true"
      :query-key="'s'"
      :is-single-table="true"
      height="200"
      :row-class-name="rowClassName"
      @eventChange="eventChange"
      @row-click="rowClick"
      @afterSearch="afterSearch"
    >
    </ever-table>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'
  import {DEMO_EVERTABLE_REMOTE1, DEMO_EVERTABLE_REMOTE2, tableColWidth} from '@/util/table-config'
  import {GENERATE_UUID as U} from '@/bi/util/reportsetuuid'
  const querySchema1 = [
    {
      name: 'displayName1',
      label: '账号姓名1',
      placeholder: '输入账号姓名1'
    }
  ]
  const querySchema2 = [
    {
      name: 'displayName2',
      label: '账号姓名2',
      placeholder: '输入账号姓名2'
    }
  ]
  export default {
    data: function () {
      const queryObj1 = this.$ever.createObjFromSchema(querySchema1)
      const queryObj2 = this.$ever.createObjFromSchema(querySchema2)
      return {
        url: urlMap.demo.remote,
        allColumns: [
          {
            prop: 'id',
            label: '编号',
            sortable: true,
            width: tableColWidth.w300,
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
          },
          {
            prop: 'name',
            label: '姓名',
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
            label: '出价'
          },
          {
            prop: 'prop1',
            label: '字段1'
          },
          {
            prop: 'prop2',
            label: '字段2'
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
            prop: 'ever-op', // 该列的唯一标示
            type: 'btns',
            label: '操作',
            btns: [
              {
                prop: 'edit',
                label: '编辑2'
              },
              'del'
            ]
          }
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
        configOption1: {
          id: DEMO_EVERTABLE_REMOTE1,
        },
        configOption2: {
          id: DEMO_EVERTABLE_REMOTE2,
        },
        querySchema1,
        queryObj1,
        querySchema2,
        queryObj2,
        params1: {},
        params2: {},
        defaultRowStatus: true, // 是否默认选中第一行
      }
    },
    created () {
      // 根据路由信息将当前行选中
      // 初始化列
      this.changeColumns(true)
    },
    mounted () {
    },
    methods: {
      eventChange ({prop, row, col}) {
      },
      changeColumns (init = false) {
        // 模拟使用场景：当一个页面需要渲染多个表格<实际上只是列不同，数据来源，样式，位置等相同>时，可以使用改变列来实现
        this.currentColumns = [...this.allColumns.slice(1, -1).filter(() => init ? true : (Math.random() > 0.4)), this.allColumns[this.allColumns.length - 1]]
      },
      afterSearch ({result}) {
        console.log('afterSearch:', result)
      },
      rowClassName ({rowIndex}) {
        if (this.defaultRowStatus) {
          if (rowIndex === 0) {
            return 'current-row'
          }
        }
      },
      rowClick () {
        this.defaultRowStatus = false
      },
      list1 (searchFirstPage = true) {
        // 查询条件改变时触发查询
        this.params1 = {
          ...this.queryObj1,
          _uuid: U(), // 当没有条件改变时也触发查询
          searchFirstPage, // 控制是否查询第一页
        }
      },
      // 此方法会在页面初始化时执行
      changeParams1 (params) {
        // 给表单赋值
        this.queryObj1 = {...this.queryObj1, ...params}
        // 此时需要按照url地址栏的页码进行查询 (即不按照第一页去查)
        this.list1(false)
        // 开始侦听queryObj的变化，当queryObj变化时，进行查询
        this.$watch('queryObj1', function () {
          this.list1()
        }, {deep: true})
      },
      list2 (searchFirstPage = true) {
        // 查询条件改变时触发查询
        this.params2 = {
          ...this.queryObj2,
          _uuid: U(), // 当没有条件改变时也触发查询
          searchFirstPage, // 控制是否查询第一页
        }
      },
      // 此方法会在页面初始化时执行
      changeParams2 (params) {
        // 多个表格需要间隔超过400毫秒查询才可以显示
        setTimeout(() => {
          // 给表单赋值
          this.queryObj2 = {...this.queryObj2, ...params}
          // 此时需要按照url地址栏的页码进行查询 (即不按照第一页去查)
          this.list2(false)
          // 开始侦听queryObj的变化，当queryObj变化时，进行查询
          this.$watch('queryObj2', function () {
            this.list2()
          }, {deep: true})
        }, 500)
      },
    },
  }
</script>

