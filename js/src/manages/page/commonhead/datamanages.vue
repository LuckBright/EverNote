<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="false"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="danger" @click="delSelected">删除</el-button>
            <el-button type="primary" @click="toPage">新建</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :params.sync="queryObj"
      :columns="columns"
      is-auto-height
      show-checkbox
      :fixed-height="60"
      :handle-result="handleResult"
      @eventChange="eventChange"
    ></ever-table>
    <el-dialog :visible.sync="createVisible" :title="title">
      <ever-form2
        class="data-manages-config"
        v-if="createVisible"
        v-model="form"
        ref="createForm"
        :schema="schema"
        :rules="rules"
      >
        <template>
          <div></div>
        </template>
        <template slot="showNameIfDataEmpty">
          <div>
            <el-switch v-model="form.showNameIfDataEmpty"></el-switch>
            <span class="ml5 c-aaa">打开代表显示，关闭代表不显示</span>
          </div>
        </template>
      </ever-form2>
      <template slot="footer">
        <el-button type="primary" @click="saveData">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from './urls'
  import {headerConfigColumns, schema, rules} from './model'

  const querySchema = [
    {
      name: 'searchName',
      label: '关键字搜索',
      parentClass: 'search-input-datamanages',
      props: {
        placeholder: '关键字/配置名称/显示名称'
      }
    },
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const form = this.getInitForm()
      return {
        title: '添加数据字典',
        form,
        schema,
        rules,
        createVisible: false,
        querySchema,
        queryObj,
        url: urlMap.thcPageHeadConfig.page,
        columns: headerConfigColumns,
      }
    },
    created () {
    },
    mounted () {
      // this.list()
    },
    watch: {
      'form.type': {
        handler (v) {
          const componentNameItem = this.schema.find(s => s.name === 'componentName')
          if (v === 2) {
            componentNameItem.parentClass = ''
            this.rules.componentName[0].required = true
          } else {
            componentNameItem.parentClass = 'dn'
            this.rules.componentName[0].required = false
          }
          if (this.$refs.form) {
            // this.$refs.form.$refs.form.validateField('componentName')
            this.$refs.form.$refs.form.clearValidate()
          }
        },
        immediate: true,
      }
    },
    methods: {
      handleResult (res) {
        return res.data && res.data.resultList && res.data.resultList.map ? res.data.resultList.map(row => {
          const style = row.style ? JSON.parse(row.style) : {}
          const labelStyle = style.label || ''
          const valueStyle = style.value || ''
          return {
            ...row,
            ...(row.style ? {
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              labelColor: labelStyle ? labelStyle.color : '',
              valueColor: valueStyle ? valueStyle.color : '',
            } : {}),
          }
        }) : []
      },
      list () {
        this.$refs.table.list(true)
      },
      getInitForm () {
        const form = this.$ever.createObjFromSchema(schema)
        form.showNameIfDataEmpty = true
        form.type = 1
        form.status = 1
        form.fontWeight = false
        form.isShowName = false
        form.labelColor = '#999999'
        form.valueColor = '#151515'
        form.backgroundColor = ''
        form.fontSize = '12px'
        form.fontFamily = 'PingFangSC-Regular'
        return form
      },
      toPage () {
        this.form = this.getInitForm()
        this.createVisible = true
        // this.$nextTick(() => {
        //   if (this.$refs.form) {
            // this.schema.find(s => s.name === 'source').props.disabled = false
            // this.schema.find(s => s.name === 'type').props.disabled = false
            // this.schema.find(s => s.name === 'componentName').props.disabled = false
            // this.schema.find(s => s.name === 'paramKey').props.disabled = false
        //   }
        // })
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      delSelected () {
        this.$confirm('是否确认删除选中项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDel(this.$refs.table.multipleSelection.map(item => item.id))
        })
      },
      del ({id}) {
        this.doDel([id])
      },
      doDel (idList) {
        request(urlMap.thcPageHeadConfig.delete, idList).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit (row) {
        this.title = '编辑数据字典'
        this.createVisible = true
        const style = row.style ? JSON.parse(row.style) : {}
        const labelStyle = style.label || ''
        const valueStyle = style.value || ''
        const containerStyle = style.container || ''
        this.form = {
          ...row,
          showNameIfDataEmpty: !!row.showNameIfDataEmpty,
          source: {
            code: row.sourceTypeCode,
            name: row.sourceTypeName,
          },
          backgroundColor: containerStyle.backgroundColor || '',
          isShowName: row.isShowName === 1,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          labelColor: labelStyle ? labelStyle.color : '',
          valueColor: valueStyle ? valueStyle.color : '',
          container: containerStyle ? containerStyle.backgroundColor : '',
        }
        // 不可修改的字段
        // this.schema.find(s => s.name === 'source').props.disabled = true
        // this.schema.find(s => s.name === 'type').props.disabled = true
        // this.schema.find(s => s.name === 'componentName').props.disabled = true
        // this.schema.find(s => s.name === 'paramKey').props.disabled = true
      },
      saveData () {
        this.$refs.createForm.$refs.form.validate(valid => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.form))
            params.showNameIfDataEmpty = params.showNameIfDataEmpty ? 1 : 0
            params.sourceTypeCode = params.source.code
            params.sourceTypeName = params.source.name
            params.isShowName = params.isShowName ? 1 : 0
            params.style = JSON.stringify({
              fontFamily: params.fontFamily,
              fontSize: params.fontSize,
              fontWeight: params.fontWeight,
              label: {
                color: params.labelColor,
              },
              value: {
                color: params.valueColor,
              },
              container: {
                backgroundColor: params.backgroundColor,
              }
            })
            request(urlMap.thcPageHeadConfig[params.id ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.createVisible = false
                this.list()
              }
            })
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .main-head /deep/ .search-input-datamanages /deep/ .el-input {
    width: 200px!important;
  }
  .data-manages-config /deep/ .el-form-item__content {
    height: 33px !important;
  }
  .c-aaa {
    color: #aaa;
  }
</style>
