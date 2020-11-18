<template>
  <div>
    <ever-bread-crumb class="js-bread-crumb" name="查看详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head js-main-head">
        <ever-form2
          v-model="queryObj"
          ref="form"
          :schema="querySchema"
          :rules="rules"
          label-width="150px"
        >
          <template slot="sendBizCode">
            <el-col>
              <el-form-item>
                <el-select
                  v-model="queryObj.sendBizCode"
                  class="w"
                  clearable filterable placeholder="请选择">
                  <el-option
                    v-for="item in sendBizList"
                    :key="item.code"
                    :label="item.name + '(' + item.code + ')'"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <template slot="sendBizDomainCode">
            <el-col>
              <el-form-item>
                <el-select
                  v-model="queryObj.sendBizDomainCode"
                  class="w"
                  clearable filterable placeholder="请选择">
                  <el-option
                    v-for="item in sendBizDomainList"
                    :key="item.code"
                    :label="item.name + '(' + item.code + ')'"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <template slot="delayed">
            <el-col>
              <el-form-item>
                <el-switch v-model="queryObj.delayed" :disabled="pagePattern === pattern.EDIT">
                </el-switch>
                <span v-if="pagePattern === pattern.EDIT" class="danger ml10">此属性不支持修改，创建后MQ的交换机已经生成，需要修改则删除后重新创建</span>
              </el-form-item>
            </el-col>
          </template>
          <template slot="default">
            <el-col>
              <el-form-item>
                <el-button size="small" type="primary" @click="save()">保存</el-button>
                <el-button v-if="pagePattern === pattern.EDIT" size="small" @click="toNew">新增队列</el-button>
                <el-button size="small" @click="back">返回</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </div>
      <div class="alg_r">
        <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="RbbitMQ-Receive"></ever-export-sql>
      </div>
      <ever-table
        v-if="pagePattern === pattern.EDIT"
        ref="table"
        :columns="columns"
        :url="url"
        show-checkbox
        fixed-elements="js-main-head js-title"
        :params="params"
        :before-list="beforeList"
        @eventChange="eventChange"
        @selection-change="handleSelect"
      >
      </ever-table>
    </div>
  </div>
</template>
<script>
  import {pattern} from '@/follow/util/model'
  import {debounce1 as debounce, listDestValue} from '@/util/common'
  import {request} from '@/util/req'
  import urlMap, {prefix} from '@/util/urls'
  import './index.less'
  const querySchema = [
    {
      name: 'code',
      label: '事件code',
      span: 12
    },
    {
      name: 'name',
      label: '事件名称',
      span: 12
    },
    {
      name: 'sendBizCode',
      label: '发送端业务系统',
      comp: 'custom',
      span: 12
    },
    // {
    //   name: 'sendBizName',
    //   label: '发送端业务系统名称',
    //   span: 12
    // },
    {
      name: 'sendBizDomainCode',
      label: '发送端业务域',
      comp: 'custom',
      span: 12
    },
    // {
    //   name: 'sendBizDomainName',
    //   label: '发送端业务域名称',
    //   span: 12
    // },
    {
      name: 'exchangeName',
      label: '交换机名称',
      props: {
        disabled: true
      },
      span: 12
    },
    {
      name: 'routingKey',
      label: 'routingKey',
      props: {
        disabled: true
      },
      span: 12
    },
    {
      name: 'jsonData',
      label: '样例报文',
      comp: 'textarea',
      props: {
        autosize: {
          minRows: 8,
          maxRows: 8,
        }
      },
      span: 12,
    },
    {
      name: 'bz',
      label: '备注',
      comp: 'textarea',
      props: {
        autosize: {
          minRows: 8,
          maxRows: 8,
        }
      },
      span: 12,
    },
    {
      name: 'delayed',
      label: '是否延迟Exchange',
      comp: 'custom',
      span: 24,
    },
  ]
  const rules = {
    code: {required: true},
    name: {required: true},
    sendBizCode: {required: true},
    // sendBizName: {required: true},
    sendBizDomainCode: {required: true},
    // sendBizDomainName: {required: true},
    exchangeName: {required: true},
    routingKey: {required: true},
    jsonData: {required: true},
    bz: {required: true},
  }
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.sendBizName = ''
      queryObj.sendBizDomainName = ''
      queryObj.delayed = false
      return {
        columns: [
          {
            prop: 'queueName',
            label: '队列名称',
          },
          {
            prop: 'receiveBizCode',
            label: '接收端业务系统code',
          },
          {
            prop: 'receiveBizName',
            label: '接收端业务系统名称',
          },
          {
            prop: 'receiveBizDomainCode',
            label: '接收端业务域code',
          },
          {
            prop: 'receiveBizDomainName',
            label: '接收端业务域名称',
          },
          {
            prop: 'bz',
            label: '备注',
          },
          {
            type: 'btns',
            label: '操作',
            btns: [
              'edit',
              'del'
            ]
          }
        ],
        querySchema,
        queryObj,
        rules,
        params: {code: '', isDelete: 0},
        routeId: '',
        pagePattern: pattern.EDIT,
        pattern,
        url: urlMap.rabbitmqReceive.getRabbitmqReceives,
        sendBizDomainList: [],
        sendBizList: [],
        selectArr: [],
        expUrl: prefix.core + urlMap.rabbitmqSend.exportMQReceive.url,
      }
    },
    created () {
      request(urlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_BUSINESS']}).then(res => {
        if (res.head.errCode === 0) {
          this.sendBizDomainList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      request(urlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_PROJECT']}).then(res => {
        if (res.head.errCode === 0) {
          this.sendBizList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      this.routeId = this.$route.params.id
      if (this.routeId) {
        this.pagePattern = pattern.EDIT
        this.search()
      } else {
        this.pagePattern = pattern.CREATE
      }
    },
    mounted () {
    },
    watch: {
      'queryObj.sendBizCode' () {
        this.queryObj.exchangeName = `exchange${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
        this.queryObj.routingKey = `routingKey${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
      },
      'queryObj.code' () {
        this.queryObj.exchangeName = `exchange${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
        this.queryObj.routingKey = `routingKey${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
      },
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
      beforeList () {
        return this.params.code
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
        this.$router.push('/systemset/operation/queue/detail/' + this.routeId + '/' + row.id)
      },
      del (row) {
        request(urlMap.rabbitmqReceive.updateRabbitmqReceive, {id: row.id, isDelete: 1}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      toNew () {
        // 新增时需要事件id 查询事件的一些信息在详情中展示
        this.$router.push('/systemset/operation/queue/detail/' + this.routeId)
      },
      search () {
        request(urlMap.rabbitmqSend.getRabbitmqSend, {id: this.routeId}).then(res => {
          if (res.head.errCode === 0) {
            this.queryObj = res.data
            this.queryObj.delayed = res.data.delayed === 1
            this.params.code = this.queryObj.code
          }
        })
      },
      save: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          if (this.pagePattern === pattern.CREATE) {
            request(urlMap.rabbitmqSend.createRabbitmqSend, {
              ...this.queryObj,
              sendBizDomainName: listDestValue(this.sendBizDomainList, this.queryObj.sendBizDomainCode, 'code', 'name'),
              sendBizName: listDestValue(this.sendBizList, this.queryObj.sendBizCode, 'code', 'name'),
              delayed: this.queryObj.delayed ? 1 : 0,
            }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '创建成功')
                this.routeId = res.data
                this.$router.push('/systemset/operation/detail/' + this.routeId)
                this.pagePattern = pattern.EDIT
                this.search()
              }
            })
          } else if (this.pagePattern === pattern.EDIT) {
            request(urlMap.rabbitmqSend.updateRabbitmqSend, {
              ...this.queryObj,
              sendBizDomainName: listDestValue(this.sendBizDomainList, this.queryObj.sendBizDomainCode, 'code', 'name'),
              sendBizName: listDestValue(this.sendBizList, this.queryObj.sendBizCode, 'code', 'name'),
              delayed: this.queryObj.delayed ? 1 : 0,
            }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '修改成功')
              }
            })
          }
        })
      }, 200),
      back () {
        this.$router.push('/systemset/operation')
      },
    },
  }
</script>
<style scoped lang="less">
  .danger {
    color: #ee4433;
  }
</style>
