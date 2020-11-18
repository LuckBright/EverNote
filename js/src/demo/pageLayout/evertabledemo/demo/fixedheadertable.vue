<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list()">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params="params"
      @update:params="changeParams"
      :show-checkbox="false"
      :is-auto-height="true"
      :config-option="configOption"
      :is-record-url-params="true"
      :row-class-name="rowClassName"
      :is-single-table="true"
      :max-btn-count="Infinity"
      use-load-more
      @eventChange="eventChange"
      @row-click="rowClick"
      @afterSearch="afterSearch"
    >
    </ever-table>
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <span slot="title">
        弹出层中的表格不使用url中的参数
      </span>
      <ever-table
        :url="url"
        :params="dialogParams"
        :columns="allColumns"
        :is-record-url-params="false"
      ></ever-table>
    </el-dialog>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'
  import list from '@/components/evertablesearch'
  import {DEMO_EVERTABLE_REMOTE, tableColWidth} from '@/util/table-config'

  const querySchema = [
    {
      name: 'displayName',
      label: '账号姓名',
      placeholder: '输入账号姓名',
    },
  ]
  export default {
    mixins: [list],
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        url: urlMap.demo.remote2,
        allColumns: [
          {
            prop: 'id',
            label: '编号',
            sortable: true,
            width: tableColWidth.w300,
            hidden: true,
            filters: [
              {
                text: 'id1',
                value: '1',
              },
            ],
          },
          {
            prop: 'name',
            label: '姓名',
            showOverflowTooltip: true,
            hidden: true,
            filters: [
              {
                text: 'id1',
                value: '1',
              },
            ],
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
            },
          },
          {
            prop: 'price',
            label: '出价',
          },
          {
            prop: 'prop1',
            label: '字段1',
          },
          {
            prop: 'prop2',
            label: '字段2',
          },
          {
            prop: 'prop3',
            label: '字段3',
          },
          {
            prop: 'prop4',
            label: '字段4',
          },
          {
            prop: 'ever-op', // 该列的唯一标示
            type: 'btns',
            label: '操作',
            width: tableColWidth.w400,
            btns: [
              {
                prop: 'edit1',
                label: '上传1',
                upload: true,
                ref: 'upload1',
                uploadAttrs: {
                  'on-success' (res, file) {
                    console.log('上传1成功：', res, file)
                  }
                },
              },
              {
                prop: 'edit1',
                label: '上传2',
                upload: true,
                ref: 'upload2',
                uploadAttrs: {
                  'on-success' (res, file) {
                    console.log('上传2成功：', res, file)
                  }
                }
              },
              {
                prop: 'edit2',
                label: '弹出一个表格',
              },
              {
                prop: 'edit3',
                label: '编辑3',
              },
              {
                prop: 'edit3',
                label: '编辑4',
              },
            ],
          },
        ],
        currentColumns: [],
        idFilters: [
          {
            text: 'id1',
            value: '1',
          },
          {
            text: 'id2',
            value: '2',
          },
          {
            text: 'id3',
            value: '3',
          },
          {
            text: 'id4',
            value: '4',
          },
        ],
        configOption: {
          id: DEMO_EVERTABLE_REMOTE,
        },
        querySchema,
        queryObj,
        params: {},
        defaultRowStatus: true, // 是否默认选中第一行
        dialogVisible: false,
        dialogParams: {id: ''},
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
        this[prop](row)
      },
      edit2 (row) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.dialogParams.id = row.id
        })
      },
      changeColumns (init = false) {
        // 模拟使用场景：当一个页面需要渲染多个表格<实际上只是列不同，数据来源，样式，位置等相同>时，可以使用改变列来实现
        this.currentColumns = [...this.allColumns.slice(0, -1).filter(() => init ? true : (Math.random() > 0.4)), this.allColumns[this.allColumns.length - 1]]
      },
      afterSearch ({result}) {
        console.log('afterSearch:', result)
      },
      rowClassName ({rowIndex}) {
        const cls = 'example-hover-row'
        if (this.defaultRowStatus) {
          if (rowIndex === 0) {
            return 'current-row ' + cls
          }
        }
        return cls
      },
      rowClick () {
        this.defaultRowStatus = false
      },
    },
  }
</script>

<style scoped lang="less">
</style>
