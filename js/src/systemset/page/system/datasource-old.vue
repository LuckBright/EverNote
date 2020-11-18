<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      border
      :columns="columns"
      :url="url"
      fixed-elements="js-main-head"
      :params.sync="queryObj"
      @eventChange="eventChange"
    >
    </ever-table>
    <el-dialog
      title="值集信息"
      width="80%"
      :visible.sync="dialogVisible"
    >
      <ever-form2
        v-model="dialogQueryObj"
        ref="dialogForm"
        :schema="dialogQuerySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="listDialog">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <ever-table
        ref="dialogTable"
        :columns="dialogColumns"
        :url="dialogUrl"
        :height="350"
        :params.sync="dialogQueryObj"
        :show-index="true"
        :is-auto-height="false"
        :is-record-url-params="false"
        :before-list="beforeList"
      ></ever-table>
    </el-dialog>
  </div>
</template>
<script>
  import urlMap from '../../urls'
  import commonUrlMap from '@/util/urls'
  import './index.less'
  import {tableColWidth} from '@/util/table-config'
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
  const querySchema = [
    {
      name: 'metaSn',
      label: '数据元标识符',
      props: {
        clearable: true,
      }
    },
    {
      name: 'metaName',
      label: '数据元名称',
      props: {
        clearable: true,
      }
    },
    {
      name: 'datasetSn',
      label: '数据集标识符',
      props: {
        clearable: true,
      }
    },
    {
      name: 'datasetName',
      label: '数据集名称',
      props: {
        clearable: true,
      }
    },
    {
      name: 'subtype',
      label: '子集名称',
      props: {
        clearable: true,
      }
    },
    {
      name: 'metaDataValue',
      label: '数据元允许值',
      props: {
        clearable: true,
      }
    },
    {
      name: 'internalSn',
      label: '内部标识符',
      props: {
        clearable: true,
      }
    },
    {
      name: 'valueSetCode',
      label: '值集代码',
      props: {
        clearable: true,
      }
    },
  ]
  const dialogQuerySchema = [
    {
      name: 'name',
      label: '显示名称',
      props: {
        clearable: true,
      }
    },
    {
      name: 'code',
      label: '编码',
      props: {
        clearable: true,
      }
    },
  ]
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
      dialogQueryObj.setCode = ''
      dialogQueryObj.uuid = ''
      return {
        dialogVisible: false,
        columns: [
          {
            prop: 'id',
            label: 'THC系统ID',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'metaSn',
            label: '数据元标识符',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'metaName',
            label: '数据元名称',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'metaDefine',
            label: '定义',
            width: 500,
          },
          {
            prop: 'metaDataType',
            label: '数据类型',
            width: tableColWidth.name4W80,
          },
          {
            prop: 'metaDataFormat',
            label: '表示格式',
            width: tableColWidth.name5W90,
          },
          {
            prop: 'valueSetCode',
            label: '值集代码',
            width: tableColWidth.name8W180,
            defaultCellValue: '',
            type: 'eventText',
            event: 'valueSetDetail',
          },
          {
            prop: 'datasetSn',
            label: '数据集标识符',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'datasetName',
            label: '数据集名称',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'subtype',
            label: '子集名称',
            width: tableColWidth.name7W120,
          },
          {
            prop: 'internalSn',
            label: '内部标识符',
            width: tableColWidth.name8W180,
          },
          {
            prop: 'metaDataValue',
            label: '数据元允许值',
            minWidth: tableColWidth.name6W105,
          },
        ],
        dialogColumns: [
          {
            prop: 'name',
            label: '显示名称',
            minWidth: '300'
          },
          {
            prop: 'nameEn',
            label: '显示英文名称',
            width: '150'
          },
          {
            prop: 'code',
            label: '编码',
            showOverflowTooltip: true,
            width: '200',
          },
          {
            prop: 'refCode',
            label: '引用code',
            showOverflowTooltip: true,
            width: '200',
          },
          {
            prop: 'parentId',
            label: '父id',
            width: '200',
          },
          {
            prop: 'setCode',
            label: '所属编码',
            showOverflowTooltip: true,
            width: '200',
          },
          {
            prop: 'orderNumber',
            label: '排序号',
            width: '200',
          },
          {
            prop: 'isDelete',
            label: '状态',
            width: '100',
            formatter ({value}) {
              return value === 1 ? '禁用' : '启用'
            }
          },
          {
            prop: 'creatorName',
            label: '创建人',
            width: '150',
          },
          {
            prop: 'modifyUserName',
            label: '修改人',
            width: '150'
          },
          {
            prop: 'modifyTime',
            label: '修改时间',
            align: 'center',
            width: tableColWidth.datetimeAllW160,
            formatter: ({ value }) => {
              return this.$filters.formatDateByExp(value)
            }
          },
        ],
        querySchema,
        dialogQuerySchema,
        queryObj,
        dialogQueryObj,
        url: urlMap.dataSet.getDataSets,
        dialogUrl: commonUrlMap.valueSet.getValueSetItems,
      }
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      listDialog () {
        this.$refs.dialogTable.list(true)
      },
      resetForm () {
        this.$refs.form.resetForm()
        this.list()
      },
      eventChange ({prop, row}) {
        // 弹出值集的框
        if (prop === 'valueSetDetail') {
          this.changeValueSetData(row.valueSetCode)
        }
      },
      changeValueSetData (valueSetCode) {
        this.dialogQueryObj.setCode = valueSetCode
        this.dialogQueryObj.uuid = U()
        // eslint-disable-next-line no-return-assign
        setTimeout(() => this.dialogVisible = true)
      },
      beforeList () {
        return this.dialogQueryObj.setCode
      },
    },
  }
</script>
<style scoped lang="less">

</style>
