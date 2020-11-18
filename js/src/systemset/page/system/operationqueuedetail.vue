<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        label-width="150px"
        :nosubmit="true"
        :rules="rules"
      >
        <template slot="sendBizCode">
          <el-col>
            <el-form-item>
              <el-input size="small" disabled :value="queryObj.sendBizName + '(' + queryObj.sendBizCode + ')'"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="sendBizDomainCode">
          <el-col>
            <el-form-item>
              <el-input size="small" disabled :value="queryObj.sendBizDomainName + '(' + queryObj.sendBizDomainCode + ')'"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="receiveBizCode">
          <el-col>
            <el-form-item>
              <el-select
                v-model="queryObj.receiveBizCode"
                class="w"
                clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in receiveBizList"
                  :key="item.code"
                  :label="item.name + '(' + item.code + ')'"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <template slot="receiveBizDomainCode">
          <el-col>
            <el-form-item>
              <el-select
                v-model="queryObj.receiveBizDomainCode"
                class="w"
                clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in receiveBizDomainList"
                  :key="item.code"
                  :label="item.name + '(' + item.code + ')'"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
    <div class="ml150">
      <el-button size="small" type="primary" @click="save()">保存</el-button>
      <el-button size="small" @click="back()">返回</el-button>
    </div>
  </div>
</template>
<script>
  import {pattern} from '@/follow/util/model'
  import {debounce1 as debounce, listDestValue} from '@/util/common'
  import {request} from '@/util/req'
  import urlMap from '@/util/urls'
  import './index.less'
  const querySchema = [
    {
      name: 'code',
      label: '事件code',
      props: {
        disabled: true,
      },
      span: 12
    },
    {
      name: 'name',
      label: '事件名称',
      props: {
        disabled: true,
      },
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
    //   props: {
    //     disabled: true,
    //   },
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
    //   props: {
    //     disabled: true,
    //   },
    //   span: 12
    // },
    {
      name: 'receiveBizCode',
      label: '接收端业务系统',
      comp: 'custom',
      span: 12
    },
    // {
    //   name: 'receiveBizName',
    //   label: '接收端业务系统名称',
    //   span: 12
    // },
    {
      name: 'receiveBizDomainCode',
      label: '接收端业务域',
      comp: 'custom',
      span: 12
    },
    {
      name: 'queueName',
      label: '队列名称',
      props: {
        disabled: true,
      },
      span: 12
    },
    // {
    //   name: 'receiveBizDomainName',
    //   label: '接收端业务域名称',
    //   span: 12
    // },
    {
      name: 'bz',
      label: '备注',
      span: 12,
    },
  ]
  const rules = {
    receiveBizCode: {required: true},
    // receiveBizName: {required: true},
    receiveBizDomainCode: {required: true},
    // receiveBizDomainName: {required: true},
    bz: {required: true},
  }
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        queryObj,
        routeId: '',
        routeOperationId: '',
        pagePattern: pattern.EDIT,
        pattern,
        rules,
        receiveBizList: [],
        receiveBizDomainList: [],
      }
    },
    created () {
      this.routeId = this.$route.params.id
      this.routeOperationId = this.$route.params.operationId
      if (this.routeId) {
        this.pagePattern = pattern.EDIT
        request(urlMap.rabbitmqReceive.getRabbitmqReceive, {id: this.routeId}).then(res => {
          if (res.head.errCode === 0) {
            this.queryObj = res.data
          }
        })
      } else {
        this.pagePattern = pattern.CREATE
        // 获取事件详情
        request(urlMap.rabbitmqSend.getRabbitmqSend, {id: this.routeOperationId}).then(res => {
          if (res.head.errCode === 0) {
            this.queryObj.code = res.data.code
            this.queryObj.name = res.data.name
            this.queryObj.sendBizCode = res.data.sendBizCode
            this.queryObj.sendBizName = res.data.sendBizName
            this.queryObj.sendBizDomainCode = res.data.sendBizDomainCode
            this.queryObj.sendBizDomainName = res.data.sendBizDomainName
          }
        })
      }
      request(urlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_BUSINESS']}).then(res => {
        if (res.head.errCode === 0) {
          this.receiveBizDomainList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      request(urlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_PROJECT']}).then(res => {
        if (res.head.errCode === 0) {
          this.receiveBizList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      // request(urlMap.nodeInfo.getBizMap).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.receiveBizList = res.data
      //   }
      // })
      // request(urlMap.nodeInfo.getBizDomainMap).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.receiveBizDomainList = res.data
      //   }
      // })
    },
    mounted () {
    },
    watch: {
      'queryObj.receiveBizCode' () {
        this.queryObj.queueName = `queue${this.queryObj.receiveBizCode ? `.${this.queryObj.receiveBizCode}` : ''}${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
      },
      'queryObj.sendBizCode' () {
        this.queryObj.queueName = `queue${this.queryObj.receiveBizCode ? `.${this.queryObj.receiveBizCode}` : ''}${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
      },
      'queryObj.code' () {
        this.queryObj.queueName = `queue${this.queryObj.receiveBizCode ? `.${this.queryObj.receiveBizCode}` : ''}${this.queryObj.sendBizCode ? `.${this.queryObj.sendBizCode}` : ''}${this.queryObj.code ? `.${this.queryObj.code}` : ''}`
      },
    },
    methods: {
      save: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          if (this.pagePattern === pattern.CREATE) {
            request(urlMap.rabbitmqReceive.createRabbitmqReceive, {
              ...this.queryObj,
              receiveBizDomainName: listDestValue(this.receiveBizDomainList, this.queryObj.receiveBizDomainCode, 'code', 'name'),
              receiveBizName: listDestValue(this.receiveBizList, this.queryObj.receiveBizCode, 'code', 'name'),
            }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '创建成功')
                this.back()
              }
            })
          } else if (this.pagePattern === pattern.EDIT) {
            request(urlMap.rabbitmqReceive.updateRabbitmqReceive, {
              ...this.queryObj,
              receiveBizDomainName: listDestValue(this.receiveBizDomainList, this.queryObj.receiveBizDomainCode, 'code', 'name'),
              receiveBizName: listDestValue(this.receiveBizList, this.queryObj.receiveBizCode, 'code', 'name'),
            }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '修改成功')
                this.back()
              }
            })
          }
        })
      }, 200),
      back () {
        this.$router.push('/systemset/operation/detail/' + this.routeOperationId)
      },
    },
  }
</script>
<style scoped lang="less">
  .ml150 {
    margin-left: 150px;
  }
</style>
