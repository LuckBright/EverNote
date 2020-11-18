/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-09 10:04:44
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-11 08:36:21
 * 目录下载 ---- 医保目录管理
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
            <!-- <el-button type="primary" @click="handlerDownload">下载</el-button> -->
            <el-button type="primary" @click="handlerUpdate">更新</el-button>
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
      :handleTotal="handleTotal">
    </ever-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { tableColWidth } from '@/util/table-config'
import { dirTypes } from '../../enum'
const filters = Vue.options.filters
import { objGet } from '@/util/common'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { medicalChargeLevel } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import req from '@/util/req'
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
const Columns = [
  {
    prop: 'dirType',
    label: '目录类别',
    width: tableColWidth.name4W80,
    formatter ({ value }) {
      return filters.formateValueToFnt(value, { list: dirTypes })
    },
  },
  {
    prop: 'dirCode',
    label: '项目编码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'dirName',
    label: '目录名称',
  },
  {
    prop: 'pinyinCode',
    label: '拼音码',
    width: tableColWidth.name4W80
  },
  {
    prop: 'chargeLevel',
    label: '收费等级',
    width: tableColWidth.name4W80,
    formatter ({ value }) {
      return medicalChargeLevel[value]
    }
  },
  {
    prop: 'chargeType',
    label: '收费类别',
    width: tableColWidth.name4W80
  },
  {
    prop: 'sincePayRate',
    label: '自付比例',
    width: tableColWidth.name4W80,
    formatter ({ value }) {
      return value * 100 + '%'
    }
  },
  {
    prop: 'limitUseRange',
    label: '限定使用范围',
    width: tableColWidth.w200
  },
  {
    prop: 'specification',
    label: '规格',
    width: tableColWidth.name4W80
  },
  {
    prop: 'drugForm',
    label: '剂型',
    width: tableColWidth.name4W80
  },
  {
    prop: 'manufacturer',
    label: '生产厂商',
  },
  {
    prop: 'dosageUnit',
    label: '剂量单位',
  },
]
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.special = false
    queryObj.dirType = dirTypes[0].id
    return {
      queryObj,
      querySchema,
      Columns,
      url: { url: 'insurance/medicareDir/selectListPage', isStatic: false },
    }
  },
  methods: {
    handlerDownload () {
      // const list = this.selection.map(item => ({
      //   centerNo: item.dirCode,
      //   cataType: +item.dirType + 1,
      //   macId: this.macId
      // }))
      // specialDetailInfoUpload({
      //   list
      // }).then(res => {
      //   const { data = {} } = res
      //   if (data) {
      //     const success = data.successList.length
      //     const fail = data.failList.length
      //     const selection = this.selection.length
      //     if (data.successList.length === selection) {
      //       this.everSuccess('上次成功 ')
      //     } else {
      //       this.everWarning(`上次成功 ${success} 条,  失败 ${fail} 条`)
      //     }
      //     if (selection !== fail) {
      //       this.list()
      //     }
      //   }
      // })
    },
    handlerUpdate () {
      req.post('/insurance/medicareDir/updateOnline', { macId: this.macId }).then(res => {
        const { data } = res
        if (data > 0) {
          this.everSuccess(`更新数据 ${data} 条`)
          this.list()
        }
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
  }
}
</script>
