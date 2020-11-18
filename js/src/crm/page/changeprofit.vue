<template>
  <div id="changeprofit">
    <ever-bread-crumb :name="'变更业绩'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <div>
          <div class="el-row">
            <div class="el-col el-col-6">
              <div class="el-form-item is-required">
                <label class="el-form-item__label" style="width: 120px;">变更类型：</label>
                <div class="el-form-item__content" style="margin-left: 120px;">
                  <el-select v-model="changetype" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <ever-form2
            v-if="isOther"
            :schema="schema"
            v-model="obj"
            :rules="rules"
            :api="api"
            ref="form"
            label-position="right">
            <div slot="default"></div>
            <template slot="distribution">
                <el-form :model="obj.form" class="relation" ref='subList'>
                  <el-row v-for='(temp, index) in obj.form.subList' :key='index' :index='index' style="padding-bottom:20px;">
                    <el-col :span='4'>
                       <el-form-item :prop="'subList.' + index + '.channelId'" :rules="{required: true, message: '请选择渠道名称', trigger: 'change', type: 'number'}">
                          <el-select v-model="temp.channelId" placeholder="渠道名称">
                              <el-option
                                v-for="item in relationTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                          </el-select>
                       </el-form-item>
                    </el-col>
                    <el-col :span='6' style="margin-left:10px;">
                        <el-form-item :prop="'subList.' + index + '.money'"
                         :rules="[{required: true, message: '请输入分配金额', trigger: 'blur'}]">
                            <el-input  v-model="temp.money" placeholder="请输入分配金额" type="number" :max="obj.payedFee"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='1' style="margin-left:10px;">
                      <el-form-item>
                      <el-button type="text" v-if='index === 0' @click="addrow"><i class="iconfont icon-tianjia"></i></el-button>
                      <el-button type="text" v-if='index > 0' @click="delrow(index)"><i class="iconfont icon-delete"></i></el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
            </template>
          </ever-form2>
          <ever-form2
            v-if="!isOther"
            :schema="schema2"
            v-model="obj2"
            :rules="rules"
            :api="api"
            ref="form"
            label-position="right">
            <template slot="amount">
              <ever-price :placeholder="'请输入金额'" :append="'元'" v-model="obj2.amount"></ever-price>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <div class="save-div">
            <el-col class="mgb20">
              <el-button type="primary" class="submit-btn" @click="submitsub"> 提交审批</el-button>
              <el-button type="" class="cancel-btn" @click="prevBack"> 取消</el-button>
            </el-col>
          </div>
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
      comp: 'el-input',
      props: {
        type: 'textarea',
        placeholder: '理由'
      },
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
      comp: 'custom',
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
      comp: 'el-input',
      props: {
        type: 'textarea',
        placeholder: '理由'
      },
      span: 12,
      label: '理由：'
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      obj.form = {
        subList: [
          {
            channelId: '',
            money: ''
          }
        ]
      }
      return {
        schema,
        schema2,
        api: api,
        channelapi,
        id: this.$route.query.id,
        obj: obj,
        obj2,
        isOther: false,
        sourcePop: false,
        sourceName: '',
        source: '',
        channelId: '',
        settleId: '',
        amount: '',
        subList: [],
        relationTypes: [],
        options: [
          {
            id: '0',
            name: '分配给其他渠道'
          },
          {
            id: '1',
            name: '变更自己的业绩'
          }
        ],
        changetype: '1',
        rules: {
          amount: [
            {required: true, message: '请输入金额', trigger: 'click', type: 'number'}
          ]
        }
      }
    },
    watch: {
      'changetype' (val) {
        if (val === '0') {
          this.isOther = true
        } else {
          this.isOther = false
        }
      }
    },
    created () {
      this.getById()
      this.getsource()
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      getById () {
        this.api.getById({id: this.id}).then(rs => {
          this.obj.achievement = '渠道名称：' + rs.data.channelName
          this.obj2.achievement = '渠道名称：' + rs.data.channelName
          this.obj.payedFee = rs.data.payedFee
          this.obj2.payedFee = rs.data.payedFee
          this.obj.profit = rs.data.profit
          this.obj2.profit = rs.data.profit
          this.channelId = rs.data.channelId
          this.settleId = rs.data.id
        })
      },
      getsource () {
        this.api.list().then(rs => {
          this.relationTypes = rs.data.resultList
        })
      },
      submitsub () {
        let subObj = {}
        let subList = []
        let channelObj = {}
        if (this.changetype === '1') {
          this.obj2.channelId = this.channelId
          this.obj2.settleId = this.settleId
          this.obj2.type = parseInt(this.changetype)
          subObj['money'] = this.obj2.amount
          subObj['channelId'] = this.channelId
          subList.push(subObj)
          this.obj2.subList = subList
          channelObj = this.obj2
        } else {
          this.obj.type = parseInt(this.changetype)
          this.obj.channelId = this.channelId
          this.obj.settleId = this.settleId
          this.obj.subList = this.obj.form.subList
          delete this.obj.form
          channelObj = this.obj
        }
        this.$refs.form.$refs.form.validate(valid => {
          valid && this.channelapi.profitcreate(channelObj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
              this.$router.push({name: 'sourcekpi', path: 'sourcekpi'})
            }
          })
        })
      },
      addrow () {
        if (this.obj.form.subList.length < 5) {
          this.obj.form.subList.push({
            channelId: '',
            money: ''
          })
        }
      },
      delrow (index) {
        this.obj.form.subList.splice(index, 1)
      }
    }
  }
</script>
<style scoped>
  .save-div{padding-bottom:20px;margin-left:20px;}
  .mgb20{margin-bottom:20px;}
</style>
