<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="序列号生成器"></ever-export-sql>
            <el-button
              @click="toNew"
              type="primary"
            >新建</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :url="url"
      show-checkbox
      fixed-elements="js-main-head js-title"
      :params.sync="queryObj"
      @selection-change="handleSelect"
      @eventChange="eventChange"
    >
    </ever-table>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap, { prefix } from '@/systemset/urls'
  import './index.less'
  import {tableColWidth} from '@/util/table-config'
  import {dateStyleList} from '@/systemset/page/system/model'
  import {listDestValue} from '@/util/common'
  const querySchema = [
    {
      name: 'code',
      label: '唯一标识',
      props: {
        clearable: true,
      }
    },
    {
      name: 'businessCode',
      label: '业务编码',
      props: {
        clearable: true,
      }
    },
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        columns: [
          {
            prop: 'code',
            label: '唯一标识',
            width: tableColWidth.name7W120,
          },
          {
            prop: 'bizName',
            label: '业务模块',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'bizDomainName',
            label: '业务域',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'currentDate',
            label: '当前日期',
            width: tableColWidth.name7W120,
          },
          {
            prop: 'currentNumber',
            label: '当前自增数',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'currentSequence',
            label: '当前序列号',
            minWidth: tableColWidth.name8W180,
          },
          {
            prop: 'businessCode',
            label: '业务编码',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'dateStyle',
            label: '日期格式',
            width: tableColWidth.name8W180,
            formatter ({value}) {
              return listDestValue(dateStyleList, value, 'value', 'label')
            },
          },
          {
            prop: 'sequenceBit',
            label: '自增位数',
            width: tableColWidth.name7W120,
          },
          {
            prop: 'attr1',
            label: '扩展属性',
            width: tableColWidth.name5W90,
          },
          {
            type: 'btns',
            label: '操作',
            fixed: 'right',
            width: tableColWidth.btn2W110,
            btns: [
              'edit',
              'del'
            ]
          }
        ],
        querySchema,
        queryObj,
        url: urlMap.sequenceRule.getSequenceRules,
        expUrl: prefix.core + urlMap.sequenceRule.exportSequenceRule.url,
        selectArr: [],
      }
    },
    methods: {
      // 多选，获取选中的列，已被导出使用
      handleSelect (data) {
        let tmpArr = []
        data.forEach(item => {
          tmpArr.push(item.id)
        })
        this.selectArr = tmpArr
      },
      list (searchFirstPage = true) {
        this.$refs.table.list(searchFirstPage)
      },
      resetForm () {
        this.$refs.form.resetForm()
        this.list()
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      edit (row) {
        this.$router.push('sequenceRule/detail/edit/' + row.id)
      },
      del (row) {
        request(urlMap.sequenceRule.deleteSequenceRule, {id: row.id, isDelete: 1}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
            this.list()
          }
        })
      },
      toNew () {
        this.$router.push('sequenceRule/detail/create')
      },
    },
  }
</script>
