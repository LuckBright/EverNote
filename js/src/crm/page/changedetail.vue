<template>
  <div id="changeprofit">
    <ever-bread-crumb :name="'业绩详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <div>
          <div class="el-row">
            <div class="el-col el-col-6">
              <div class="el-form-item">
                <label class="el-form-item__label" style="width: 120px;">变更类型：</label>
                <div class="el-form-item__content" style="margin-left: 120px;">
                  <label v-if="this.type === 1">变更自己的业绩</label>
                  <label v-else>分配给其他渠道</label>
                </div>
              </div>
            </div>
          </div>
          <ever-form2
            v-if="this.type === 0"
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="right">
            <div slot="default"></div>
            <template slot="distribution">
              <div class="el-form-item" v-for="(item, i) in subList" :key="i">
                <div class="el-form-item__content">
                  <label for="payedFee" class="el-form-item__label">渠道名称：{{item.opOrigName}}</label>
                  <label for="payedFee" class="el-form-item__label" style="margin-left:40px;">分配业绩：{{item.money}} 元</label>
                  <label for="payedFee" class="el-form-item__label" style="margin-left:40px;">维护人：{{item.opDoctorName || '- -'}}</label>
                </div>
              </div>
            </template>
          </ever-form2>
          <ever-form2
            v-if="this.type === 1"
            :schema="schema2"
            v-model="obj2"
            :api="api"
            ref="form"
            label-position="right">
            <div slot="default"></div>
          </ever-form2>
      </div>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/sourceapi'
  import channelapi from '../store/memberchannelapi'
  import form from '../../util/form'
  let schema = [
    {
      name: 'achievement',
      comp: 'readonlyitem',
      label: '业绩原归属方：',
      span: 6
    },
    {
      name: 'payedFee',
      label: '收费金额：',
      comp: 'readonlyitem',
      span: 6
    },
    {
      name: 'profit',
      label: '业绩：',
      comp: 'readonlyitem',
      span: 6
    },
    {
      comp: 'div',
      style: {
        height: '50px'
      },
      span: 6
    },
    {
      name: 'distribution',
      span: 24,
      label: '分配给：',
      comp: 'custom'
    },
    {
      name: 'content',
      comp: 'readonlyitem',
      span: 12,
      label: '理由：'
    }
  ]
  let schema2 = [
    {
      name: 'achievement',
      comp: 'readonlyitem',
      label: '原业绩：',
      span: 6
    },
    {
      name: 'payedFee',
      label: '收费金额：',
      comp: 'readonlyitem',
      span: 6
    },
    {
      name: 'profit',
      label: '业绩：',
      comp: 'readonlyitem',
      span: 6
    },
    {
      comp: 'div',
      style: {
        height: '50px'
      },
      span: 6
    },
    {
      name: 'amount',
      comp: 'readonlyitem',
      span: 6,
      label: '变更为：'
    },
    {
      comp: 'div',
      style: {
        height: '50px'
      },
      span: 12
    },
    {
      name: 'content',
      comp: 'readonlyitem',
      span: 12,
      label: '理由：'
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      return {
        schema,
        schema2,
        api: api,
        channelapi,
        id: this.$route.query.id,
        obj: obj,
        obj2,
        sourcePop: false,
        sourceName: '',
        source: '',
        channelId: '',
        settleId: '',
        type: '',
        amount: '',
        subList: []
      }
    },
    watch: {
    },
    created () {
      this.getById()
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      getById () {
        this.api.getById({id: this.id}).then(rs => {
          this.type = rs.data.mod.type
          this.channelId = rs.data.channelId
          this.settleId = rs.data.id
          this.subList = rs.data.mod.subList
          this.obj.content = rs.data.mod.content
          this.obj.payedFee = rs.data.payedFee + ' 元'
          this.obj.achievement = '渠道名称：' + rs.data.channelName
          this.obj.profit = rs.data.profit + ' 元'
          this.obj2.achievement = '渠道名称：' + rs.data.channelName
          this.obj2.payedFee = rs.data.payedFee + ' 元'
          this.obj2.profit = rs.data.profit + ' 元'
          this.obj2.amount = rs.data.mod.amount + ' 元'
          this.obj2.content = rs.data.mod.content
        })
      }
    }
  }
</script>
