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
          <el-form-item class="fr">
            <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="RabbitMQ-Send"></ever-export-sql>
            <el-button size="small" type="primary" @click="toNew()">新建</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :url="url"
      fixed-elements="js-main-head js-title"
      show-checkbox
      :params.sync="queryObj"
      @eventChange="eventChange"
      @selection-change="handleSelect"
    >
    </ever-table>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap, { prefix } from '@/util/urls'
  import './index.less'
  const querySchema = [
    {
      comp: 'select',
      name: 'code',
      label: '事件',
      props: {
        filterable: true,
        clearable: true,
        options: [],
      }
    },
    {
      comp: 'select',
      name: 'sendBizDomainCode',
      label: '发送端业务域',
      props: {
        filterable: true,
        clearable: true,
        options: [],
      }
    },
    {
      comp: 'select',
      name: 'exchangeName',
      label: '交换器',
      props: {
        filterable: true,
        clearable: true,
        options: [],
      }
    },
    {
      comp: 'select',
      name: 'routingKey',
      label: 'routingKey',
      props: {
        filterable: true,
        clearable: true,
        options: [],
      }
    },
  ]
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.isDelete = 0
      return {
        columns: [
          {
            prop: 'code',
            label: '事件code',
            width: 280,
          },
          {
            prop: 'name',
            label: '事件名称',
            width: 280,
          },
          {
            prop: 'sendBizCode',
            label: '发送端业务系统code',
            width: 160,
          },
          {
            prop: 'sendBizName',
            label: '发送端业务系统名称',
            width: 160,
          },
          {
            prop: 'sendBizDomainCode',
            label: '发送端业务域code',
            width: 160,
          },
          {
            prop: 'sendBizDomainName',
            label: '发送端业务域名称',
            width: 160,
          },
          {
            prop: 'exchangeName',
            label: '交换器名称',
            width: 340,
          },
          {
            prop: 'routingKey',
            label: 'routingKey',
            width: 340,
          },
          {
            prop: 'delayed',
            label: '是否延迟Exchange',
            width: 160,
            formatter ({value}) {
              return value ? '是' : '--'
            },
          },
          {
            prop: 'bz',
            label: '备注',
            width: 280,
          },
          {
            type: 'btns',
            label: '操作',
            fixed: 'right',
            width: 200,
            btns: [
              'edit',
              'del'
            ]
          }
        ],
        querySchema,
        queryObj,
        url: urlMap.rabbitmqSend.getRabbitmqSends,
        expUrl: prefix.core + urlMap.rabbitmqSend.exportMQSend.url,
        selectArr: [],
      }
    },
    created () {
      // 查询下拉框数据
      request(urlMap.rabbitmqSend.getNodeDroList, {isDelete: 0}).then(res => {
        if (res.head.errCode === 0) {
          this.querySchema.find(item => item.name === 'code').props.options = res.data.map(item => ({id: item.code, name: item.name}))
        }
      })
      request(urlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_BUSINESS']}).then(res => {
        if (res.head.errCode === 0) {
          this.querySchema.find(item => item.name === 'sendBizDomainCode').props.options = res.data.resultList.map(item => ({id: item.code, name: item.name}))
        }
      })
      request(urlMap.rabbitmqSend.getExchangeNameDroList, {isDelete: 0}).then(res => {
        if (res.head.errCode === 0) {
          this.querySchema.find(item => item.name === 'exchangeName').props.options = res.data.map(item => ({id: item.code, name: item.name}))
        }
      })
      request(urlMap.rabbitmqSend.getRoutingkeyDroList, {isDelete: 0}).then(res => {
        if (res.head.errCode === 0) {
          this.querySchema.find(item => item.name === 'routingKey').props.options = res.data.map(item => ({id: item.code, name: item.name}))
        }
      })
    },
    mounted () {
      this.list(false)
    },
    methods: {
      // 多选内容
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
        this.$router.push('/systemset/operation/detail/' + row.id)
      },
      del (row) {
        request(urlMap.rabbitmqSend.updateRabbitmqSend, {id: row.id, isDelete: 1}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
            this.list()
          }
        })
      },
      toNew () {
        this.$router.push('/systemset/operation/detail/')
      },
    },
  }
</script>
<style scoped lang="less">
</style>
