<template>
  <div id="commentinfo">
    <ever-bread-crumb :name="'评价详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="right">
            <template slot="status" slot-scope="scope">
              <sys-value type="THC_CC_COMMENT_STATUS" :code="scope.obj.status"></sys-value>
            </template>
            <template slot="patientName" slot-scope="scope">
              <span class="user-name">
                <a class="bg" :href="this.$ever.crmIndex + '/crm/memberinfo/memberbaseinfo/' + scope.obj.patientId">{{scope.obj.patientName}}</a>
                <i class="bg iconfont icon-huiyuan_duanxin" @click="sendMessage"></i>
                <!-- <i class="bg iconfont icon-huiyuan_dianhu" @click="calling(scope.obj, 'patient')"></i> -->
              </span>
            </template>
            <template slot="auditOperatorName" slot-scope="scope">
              <span class="user-name">
                <label>{{scope.obj.auditOperatorName}}</label>
              </span>
            </template>
            <template slot="evaItemMap" slot-scope="scope">
              <div class="el-form-item" style="margin-left:-120px">
                <div class="el-col el-col-8" v-for="(item, i) in evaItemMap" :key="i" style="padding-left: 10px; padding-right: 10px;">
                  <div class="el-form-item ">
                      <label for="updateTime" class="el-form-item__label" style="width: 120px;">{{item.label}}：</label>
                      <div class="el-form-item__content" style="margin-left: 120px;">
                          <label>{{item.value}}星</label>
                      </div>
                  </div>
                </div>
              </div>
            </template>
          </ever-form-model>
          <div class="border-bottom"></div>
          <ever-form2
            :schema="schema2"
            v-model="obj2"
            ref="form2"
            :api="api"
            :rules="rules"
            label-position="right">
            <template slot="default">
                <el-col>
                  <el-form-item>
                    <el-button type="primary" @click="memberSubmit(id)">提交</el-button>
                  </el-form-item>
                </el-col>
              </template>
          </ever-form2>
      </el-card>
      </div>
    </div>
    <send-message ref="sendmessage" :users="users"></send-message>
  </div>
</template>
<script>
  import api from '../store/commentapi'
  import form from '../../util/form'
  import sendMessage from '../page/sendmessage'

  export default {
    mixins: [form],
    data () {
      let schema = [
        {
          name: 'patientId',
          type: 'label',
          span: 6,
          label: '预约编号：'
        },
        {
          name: 'patientName',
          type: 'custom',
          span: 6,
          label: '客户：'
        },
        {
          name: 'auditOperatorName',
          type: 'custom',
          span: 6,
          label: '医生：'
        },
        {
          name: 'dptName',
          type: 'label',
          label: '科室：',
          span: 6
        },
        {
          name: 'content',
          type: 'label',
          label: '评价内容：',
          span: 6
        },
        {
          name: 'evaItemMap',
          type: 'custom',
          span: 18
        },
        {
          name: 'createTime',
          type: 'label',
          label: '评价时间：',
          span: 6
        },
        {
          name: 'status',
          type: 'custom',
          label: '状态：',
          span: 6
        },
        {
          name: 'reason',
          type: 'label',
          label: '理由：',
          span: 6
        },
        {
          name: 'auditOperatorName',
          type: 'label',
          label: '操作者：',
          span: 6
        },
        {
          name: 'updateTime',
          type: 'label',
          label: '操作时间：',
          span: 6
        }
      ]
      let schema2 = [
        {
          name: 'status',
          label: '操作：',
          comp: 'ever-select',
          props: {
            options: [
              {
                id: 1,
                name: '通过'
              },
              {
                id: 2,
                name: '隐藏'
              }
            ]
          },
          span: 8
        },
        {
          name: 'reason',
          label: '理由：',
          placeholder: '客户反应',
          props: {
            type: 'textarea',
            rows: 4,
            max: 2000
          },
          span: 20
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      return {
        schema,
        schema2,
        api: api,
        id: this.$route.query.id,
        obj: obj,
        obj2: obj2,
        ids: [],
        userId: '',
        users: '',
        prostatus: '',
        handnames: [],
        allHandNames: [],
        uploadImgUrl: [],
        submitImg: [],
        evaItemMap: [],
        rules: {
          replyName: [
            {required: true, message: '请选择反馈人', trigger: 'click', type: 'string'}
          ],
          way: [
            {required: true, message: '请反馈方式', trigger: 'click', type: 'number'}
          ],
          patientComment: [
            {required: true, message: '请填写客户反响', trigger: 'change', type: 'string'}
          ],
          content: [
           {required: true, message: '请填写处理结果', trigger: 'change', type: 'string'}
          ]
        }
      }
    },
    created () {
      this.initData()
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      sendMessage () {
        this.$refs.sendmessage.sendVisible = true
      },
      initData () {
        this.evaItemMap = []
        this.api.request({id: this.id}).then(rs => {
          this.obj = Object.assign(this.obj, rs.data)
          rs.data.evaItemMap.forEach(item => {
            const schemaobj = {}
            schemaobj['label'] = item.keyName
            schemaobj['name'] = item.name
            schemaobj['value'] = item.score
            this.evaItemMap.push(schemaobj)
          })
        })
      },
      memberSubmit () {
        this.$confirm('请确定内容不需要修改后再提交?', '提示', {
          confirmButtonText: '继续提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.obj2.id = this.id
          this.api.submit(this.obj2).then(rs => {
            if (rs.head.errCode === 0) this.initData()
          })
        }).catch((e) => {
          this.$messageTips(this, 'info', '已取消提交')
        })
      },
      calling (val, role) {
        if (role === 'patient') {
          this.$parent.$parent.$parent.callData = {mobile: val.patientMobile, patientName: val.patientName, patientId: val.patientId}
        } else {
          this.$parent.$parent.$parent.callData = {mobile: val.doctorMobile, patientName: val.auditOperatorName, patientId: val.patientId}
        }
        this.$parent.$parent.$parent.$refs.iphone.visible = true
      }
    },
    components: {
      sendMessage
    }
  }
</script>
<style scoped>
  #commentinfo .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
  #commentinfo .el-input-group__append .is-disabled{background: rgb(238, 240, 246) !important;color: #bbb !important;}
  #commentinfo .el-dialog__header .el-dialog__title{padding-left: 10px;font-size: 16px;}
  #commentinfo .el-card__header strong.title{border-left: 3px solid #1C7BEF;padding-left: 12px;}
  #commentinfo .border-bottom {border-bottom: 1px solid #d1dbe5;margin-bottom:50px;}
  .avatarWar .avatar{height: 140px;width: 140px;border-radius: 0;border: none;display: inline-block;margin-right: 20px;}
  .avatarWar .avatar img{height: 140px;width: 140px;border: 1px solid #DDDDDD;}
  .avatarWar .avatar img.bradius{border-radius: 50%;}
  .bg{color: #1C7BEF;}
</style>
