/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 15:18:09
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-12 19:29:30
 * 医保管理 -- 医保目录新增
*/
<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        onsubmit="return false;"
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true">
        <template slot="default">
          <el-form-item>
            <el-button @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="handlerUpload">上传</el-button>
            <el-button type="primary" @click="handlerIncrease">新增</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <!--
      :handleResult="handleResult" -->
    <ever-table
      border
      ref="table"
      is-auto-height
      :columns="Columns"
      :url="url"
      :params.sync="queryObj"
      :handleResult="handleResult"
      :handleTotal="handleTotal"
      :is-single-table="true"
      @row-click="handlerRowClick">
    </ever-table>
  </div>
</template>

<script>

import { dirTypes } from '../../enum'
import { objGet } from '@/util/common'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { commonColumns, drugColumns, treatmentColumns, serviceColumns } from './catalogue.schema'
import { specialDetailInfoUpload, copyCenterThreeCatalogeus } from '@/rcm/store/otmdiscomponent/hlj-api.js'
const querySchema = [
  {
    name: 'insuranceOrgId',
    label: '保险公司',
    comp: medicalOrgList
  },
  {
    name: 'dirType',
    label: '目录类别',
    comp: 'ever-select',
    props: {
      clearable: false,
      options: dirTypes
    }
  },
  {
    name: 'dirName',
    label: '项目名称'
  },
  {
    name: 'dirCode',
    label: '项目编码'
  },

]

export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.special = true
    queryObj.dirType = dirTypes[0].id
    return {
      queryObj,
      querySchema,
      Columns: commonColumns,
      url: { url: 'insurance/medicareDir/selectListPage', isStatic: false },
    }
  },
  methods: {
    handlerRowClick ({ row }) {
      this.currentRow = row
    },
    handlerSelectionChange (selection) {
      this.selection = selection
    },
    initParams () {
      return this.selection.map(item => ({
        centerNo: item.dirCode,
        cataType: +item.dirType + 1,
        macId: this.macId
      }))
    },
    handlerUpload () {
      if (!this.currentRow) return this.everWarning('请选择目录上传')
      const { dirType: cataType, dirCode: centerNo } = this.currentRow
      specialDetailInfoUpload({
        list: [{
          centerNo,
          cataType: +cataType + 1,
          macId: this.macId
        }]
      }).then(res => {
        const { data = {} } = res
        if (data) {
          if (data.successList.length) {
            this.everSuccess('上传成功 ')
            this.list()
          } else {
            this.everWarning(`上传失败 `)
          }
        }
      })
    },
    handlerIncrease () {
      if (!this.currentRow) return this.everWarning('请选择目录新增')
      const { dirCode: centerNo } = this.currentRow
      copyCenterThreeCatalogeus({
        // cataType: +cataType + 1,
        centerNo,
        macId: this.macId
      }).then(res => {
        // TODO: 无返回值， 暂无法知道后续操作
        // if (res.data) {
        //   this.everSuccess('新增成功 ')
        //   this.list()
        // }
      })
    },
    list () {
      this.$refs.table.list(true)
    },
    handleTotal (res) {
      return objGet(res, 'data.total', 0)
    },
    handleResult (res) {
      return objGet(res, 'data.list', []).map(item => Object.assign(item, item.info))
    },
    resetColumns (state) {
      const strategy = {
        0: function () {
          return commonColumns.concat(drugColumns)
        },
        1: function () {
          return commonColumns.concat(treatmentColumns)
        },
        2: function () {
          return commonColumns.concat(serviceColumns)
        }
      }
      return strategy[state]()
    }
  },
  watch: {
    'queryObj.dirType': {
      handler (v) {
        this.Columns = this.resetColumns(v)
      },
      deep: true
    }
  }
}
</script>
