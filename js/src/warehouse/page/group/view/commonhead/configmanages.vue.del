<!--<template>-->
<!--  <div class="layout_inner flex_column_full_hidden">-->
<!--    <div class="main-head">-->
<!--      <ever-form2-->
<!--        v-model="queryObj"-->
<!--        ref="form"-->
<!--        :schema="querySchema"-->
<!--        :inline="true"-->
<!--        :is-query="true"-->
<!--      >-->
<!--        <template slot="default">-->
<!--          <el-form-item>-->
<!--&lt;!&ndash;            <el-button type="primary" @click="list">查询</el-button>&ndash;&gt;-->
<!--          </el-form-item>-->
<!--          <el-form-item class="fr">-->
<!--            <el-button type="danger" @click="delSelected">删除</el-button>-->
<!--            <el-button type="primary" @click="toPage">新建</el-button>-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </ever-form2>-->
<!--    </div>-->
<!--    <ever-table-->
<!--      ref="table"-->
<!--      :url="url"-->
<!--      :params.sync="queryObj"-->
<!--      :columns="columns"-->
<!--      is-auto-height-->
<!--      show-checkbox-->
<!--      :is-pagination="false"-->
<!--      :fixed-height="55"-->
<!--      :handle-result="handleResult"-->
<!--      @eventChange="eventChange"-->
<!--    >-->
<!--      <template slot="isOpenHeader">-->
<!--        折叠/展开<el-tooltip class="item" effect="dark" content="打开代表展开，关闭代表折叠" placement="top">-->
<!--          <i class="el-icon-info cBlue ml2"></i>-->
<!--        </el-tooltip>-->
<!--      </template>-->
<!--      <template slot="isOpen" slot-scope="{row}">-->
<!--        <el-switch v-model="row._isOpen" @change="onChange(row)"></el-switch>-->
<!--      </template>-->
<!--    </ever-table>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  import {request} from '@/util/req'-->
<!--  import urlMap from './urls'-->
<!--  import {stationConfigColumns, stationSchema, stationRules} from './model'-->

<!--  const querySchema = [-->
<!--    // {-->
<!--    //   name: 'buildingCode',-->
<!--    //   label: '建筑编号',-->
<!--    // },-->
<!--    // {-->
<!--    //   name: 'buildingName',-->
<!--    //   label: '建筑名称',-->
<!--    // },-->
<!--  ]-->
<!--  export default {-->
<!--    data () {-->
<!--      const queryObj = this.$ever.createObjFromSchema(querySchema)-->
<!--      const form = this.getInitForm()-->
<!--      return {-->
<!--        form,-->
<!--        schema: stationSchema,-->
<!--        rules: stationRules,-->
<!--        createVisible: false,-->
<!--        querySchema,-->
<!--        queryObj,-->
<!--        url: urlMap.thcPageHeadTemplateConfig.getAll,-->
<!--        columns: stationConfigColumns,-->
<!--      }-->
<!--    },-->
<!--    created () {-->
<!--    },-->
<!--    mounted () {-->
<!--      // this.list()-->
<!--    },-->
<!--    methods: {-->
<!--      onChange (row) {-->
<!--        request(urlMap.thcPageHeadTemplateConfig.modifyIsOpen, {-->
<!--          id: row.id,-->
<!--          isOpen: row._isOpen ? 1 : 0-->
<!--        }).then(res => {-->
<!--          if (res.head.errCode === 0) {-->
<!--            this.$messageTips(this, 'success', '操作成功')-->
<!--          }-->
<!--        })-->
<!--      },-->
<!--      handleResult (res) {-->
<!--        return res.data && res.data.map ? res.data.map(item => ({...item, _isOpen: !!item.isOpen})) : []-->
<!--      },-->
<!--      list () {-->
<!--        this.$refs.table.list(true)-->
<!--      },-->
<!--      getInitForm () {-->
<!--        return this.$ever.createObjFromSchema(stationSchema)-->
<!--      },-->
<!--      toPage () {-->
<!--        this.$router.push({name: 'configmanagesdetail', params: {code: '-1'}})-->
<!--      },-->
<!--      eventChange ({prop, row}) {-->
<!--        this[prop] && this[prop](row)-->
<!--      },-->
<!--      delSelected () {-->
<!--        this.$confirm('是否确认删除选中项?', '提示', {-->
<!--          confirmButtonText: '确定',-->
<!--          cancelButtonText: '取消',-->
<!--          type: 'warning'-->
<!--        }).then(() => {-->
<!--          this.doDel(this.$refs.table.multipleSelection.map(item => item.id))-->
<!--        })-->
<!--      },-->
<!--      del ({id}) {-->
<!--        this.doDel([id])-->
<!--      },-->
<!--      doDel (idList) {-->
<!--        request(urlMap.thcPageHeadTemplateConfig.delete, idList).then(res => {-->
<!--          if (res.head.errCode === 0) {-->
<!--            this.list()-->
<!--            this.$messageTips(this, 'success', '删除成功')-->
<!--          }-->
<!--        })-->
<!--      },-->
<!--      edit (row) {-->
<!--        this.$router.push({name: 'configmanagesdetail', params: {code: row.code, id: row.id}})-->
<!--      },-->
<!--    },-->
<!--  }-->
<!--</script>-->
<!--<style lang="less" scoped>-->
<!--  .ml2 {margin-left: 2px}-->
<!--</style>-->
