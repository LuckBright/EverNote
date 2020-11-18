<template>
  <div id="sourcedetail">
    <ever-bread-crumb :name="!id ? '添加渠道' : '渠道详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner bgfff">
      <div>
        <el-row>
          <el-col :span="24">
            <el-menu mode="horizontal" :default-active="currentPage" router>
              <el-menu-item class="sourcemenu bulec" :index="'/crm/sourcedetail?id=' + this.id">渠道详情</el-menu-item>
              <el-menu-item class="sourcemenu" :index="'/crm/sourcekpi/'">渠道业绩</el-menu-item>
              <el-menu-item class="sourcemenu" @click="linkSourceMember" :index="''">渠道客户</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        <div class="pd20">
          <el-row>
            <el-col :span="22">
              <span class="name bold">基本信息</span>
            </el-col>
            <el-col :span="2" align="right">
              <el-button type="text" @click="linkEdit">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
            </el-col>
          </el-row>
          <ever-form2 :schema="schema" v-model="obj" :api="api" ref="form" label-position="right">
            <div slot="default"></div>
            <template slot="status">
              <sys-value type="THC_CC_MEMBER_CHANNEL_STATUS" :code="String(obj.status)"></sys-value>
            </template>
          </ever-form2>
          <h4>合作情况</h4>
          <div class="el-row">
            <div class="el-col el-col-6">
              <!-- is-required -->
              <div class="el-form-item">
                <label class="el-form-item__label" style="width: 120px;">签合同：</label>
                <div class="el-form-item__content" style="margin-left: 120px;">
                  <label v-if="hasDeal === false">否</label>
                  <label v-else>是</label>
                </div>
              </div>
            </div>
          </div>
          <ever-form2
            :schema="schema2"
            v-model="obj2"
            :api="api"
            ref="form"
            label-position="right"
            v-if="hasDeal"
          >
            <div slot="default"></div>
            <template slot="dealName">
              <div class="avatarWar">
                <span v-if="uploadImgUrl.length === 0">无</span>
                <el-row v-else>
                  <el-col>
                    <div class="avatar" v-for="(item, i) in uploadImgUrl" :key="i">
                      <a :href="$ever.fileUrl2 + item" target="_blank">
                        <img :src="$ever.fileUrl2 + item">
                      </a>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
            <template slot="billCycle">
              <sys-value v-if="obj2.billCycle" type="THC_CC_MEMBER_CHANNEL_BILL_CYCLE" :code="obj2.billCycle"></sys-value>
            </template>
            <template slot="coopTime">
              <label>{{obj.startTime}}-{{obj.endTime}}</label>
            </template>
          </ever-form2>
          <h4>维护人信息</h4>
          <ever-form2 :schema="schema3" v-model="obj3" :api="api" ref="form" label-position="right">
            <div slot="default"></div>
          </ever-form2>
          <div v-if="commList && commList.length > 0">
            <h4>沟通记录</h4>
            <ul v-for="(item, i) in commList" :key="i">
              <li class="chatcontent">
                <p>
                  <span>{{item.content}}</span>
                </p>
                <p class="operator">
                  <span>
                    {{item.doctorName || '--'}} 添加于 {{item.createTime}} 沟通方式：
                    <sys-value type="THC_CC_MEMBER_CHANNEL_COMM" :code="item.type.toString()"></sys-value>
                  </span>
                </p>
              </li>
            </ul>
            <el-row class="center" v-if="commList && commList.length === 5">
              <el-col>
                <el-button class="seeBtn" @click="linkrecord">查看全部</el-button>
              </el-col>
            </el-row>
          </div>
          <h4>添加记录</h4>
          <ever-form2 :schema="schema4" v-model="obj4" :api="api" ref="form" label-position="right">
            <div slot="default"></div>
          </ever-form2>
          <div class="save-div">
            <el-col>
              <el-button type="primary" class="submit-btn" @click="savechat">添加</el-button>
              <el-button type class="cancel-btn" @click="prevBack">取消</el-button>
            </el-col>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/sourceapi'
import channelapi from '../store/memberchannelapi'
import form from '../../util/form'
let schema = [
  {
    name: 'sn',
    label: '渠道ID：',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'name',
    label: '渠道名称：',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'type',
    label: '类型：',
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
    name: 'coopCity',
    span: 6,
    label: '合作城市：',
    comp: 'readonlyitem'
  },
  {
    name: 'address',
    comp: 'readonlyitem',
    span: 6,
    label: '渠道地址：'
  },
  {
    name: 'contactDpt',
    comp: 'readonlyitem',
    span: 6,
    label: '部门：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 6
  },
  {
    name: 'contactName',
    comp: 'readonlyitem',
    span: 6,
    label: '联系人：'
  },
  {
    name: 'contactTitle',
    comp: 'readonlyitem',
    span: 6,
    label: '职位：'
  },
  {
    name: 'contactMobile',
    comp: 'readonlyitem',
    span: 6,
    label: '联系方式1：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 6
  },
  {
    name: 'contactMobile2',
    comp: 'readonlyitem',
    span: 6,
    label: '联系方式2：'
  },
  {
    name: 'contactEmail',
    comp: 'readonlyitem',
    span: 6,
    label: 'Email：'
  },
  {
    name: 'contactWechat',
    comp: 'readonlyitem',
    span: 6,
    label: '微信号：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 6
  },
  {
    name: 'status',
    label: '状态：',
    comp: 'custom',
    span: 6
  }
]
let schema2 = [
  {
    name: 'dealSn',
    comp: 'readonlyitem',
    span: 6,
    label: '合同编号：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 18
  },
  {
    name: 'dealName',
    comp: 'custom',
    span: 24,
    label: '附件：'
  },
  {
    name: 'coopTypeId',
    comp: 'readonlyitem',
    span: 6,
    label: '合作方式：'
  },
  {
    name: 'otherRebate',
    comp: 'readonlyitem',
    span: 18,
    label: '其他返利：'
  },
  {
    name: 'coopHospital',
    comp: 'readonlyitem',
    span: 6,
    label: '合作医院：'
  },
  {
    name: 'rebatePayee',
    comp: 'readonlyitem',
    span: 6,
    label: '收款人：'
  },
  {
    name: 'rebatePayeeAccount',
    comp: 'readonlyitem',
    span: 6,
    label: '收款账号：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 6
  },
  {
    name: 'billCycle',
    comp: 'custom',
    span: 6,
    label: '结算周期：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 18
  },
  {
    name: 'discountInfo',
    comp: 'readonlyitem',
    span: 18,
    label: '优惠信息：'
  },
  {
    name: 'idenMethod',
    comp: 'readonlyitem',
    span: 18,
    label: '识别方式：'
  },
  {
    name: 'payMethod',
    comp: 'readonlyitem',
    span: 18,
    label: '结账方式：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 6
  },
  {
    name: 'coopTime',
    comp: 'custom',
    span: 6,
    label: '合作时间：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 18
  },
  {
    name: 'comment',
    comp: 'readonlyitem',
    span: 18,
    label: '说明：'
  }
]
let schema3 = [
  {
    name: 'opOrigId',
    label: '机构：',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'opDptId',
    label: '部门：',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'opDoctorId',
    label: '维护人：',
    comp: 'readonlyitem',
    span: 6
  }
]
let schema4 = [
  {
    name: 'type',
    label: '沟通方式',
    span: 5,
    comp: 'sys-type',
    props: {
      code: 'THC_CC_MEMBER_CHANNEL_COMM'
    }
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 16
  },
  {
    name: 'content',
    label: '沟通内容',
    span: 16,
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '备注',
      max: 2000,
      rows: 5
    }
  }
]
export default {
  mixins: [form],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let obj2 = this.$ever.createObjFromSchema(schema2)
    let obj3 = this.$ever.createObjFromSchema(schema3)
    let obj4 = this.$ever.createObjFromSchema(schema4)
    return {
      schema,
      schema2,
      schema3,
      schema4,
      api: api,
      channelapi,
      id: this.$route.query.id,
      obj: obj,
      obj2,
      obj3,
      obj4,
      classPop: false,
      isContract: null,
      coopCity: [],
      uploadImgUrl: [],
      commList: [],
      hasDeal: false,
      sourcetype: ''
    }
  },
  watch: {
    'hasDeal' (val) {
      if (val === '0') {
        this.isContract = false
      } else {
        this.isContract = true
      }
    }
  },
  created () {
    this.getById()
    this.currentPage = this.$route.path
  },
  methods: {
    prevBack () {
      window.history.go(-1)
    },
    getById () {
      this.api.request({ id: this.id }).then(rs => {
        if (rs.data) {
          this.obj = Object.assign(this.obj, rs.data)
          if (rs.data.channelType && rs.data.channelType.name) {
            this.obj.type = rs.data.channelType.name
          } else {
            this.obj.type = ''
          }
          if (rs.data.hasDeal) {
            this.uploadImgUrl = rs.data.dealUrl ? rs.data.dealUrl.split('#') : []
            this.obj2.dealUrl = rs.data.dealUrl
            this.obj2.dealSn = rs.data.dealSn
            this.obj2.coopTypeId = rs.data.coopTypeName
            this.obj2.otherRebate = rs.data.otherRebate
            this.obj2.coopHospital = rs.data.coopHospitalNames
            this.obj2.rebatePayee = rs.data.rebatePayee
            this.obj2.rebatePayeeAccount = rs.data.rebatePayeeAccount
            if (rs.data.billCycle) {
              this.obj2.billCycle = rs.data.billCycle
            } else {
              this.obj2.billCycle = ''
            }
            this.obj2.discountInfo = rs.data.discountInfo
            this.obj2.idenMethod = rs.data.idenMethod
            this.obj2.payMethod = rs.data.payMethod
            this.obj2.comment = rs.data.comment
          }
          if (rs.data.commList && rs.data.commList.length > 5) {
            this.commList = rs.data.commList.splice(0, 5)
          } else {
            this.commList = rs.data.commList && rs.data.commList
          }
          this.hasDeal = rs.data.hasDeal
          this.obj3.opOrigId = rs.data.opOrigName
          this.obj3.opDptId = rs.data.opDptName
          this.obj3.opDoctorId = rs.data.opDoctorName
        }
      })
    },
    linkEdit () {
      this.$router.push({ path: 'createsource', query: { id: this.id } })
    },
    linkrecord () {
      this.$router.push({ path: 'recordlist', query: { id: this.id } })
    },
    linkSourceMember () {
      this.$router.push({ path: '/crm/sourcemember/', query: { q: JSON.stringify({ source: [parseInt(this.id)] }) } })
    },
    savechat () {
      this.obj4.channelId = this.id
      this.channelapi.create(this.obj4).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj4.type = ''
          this.obj4.content = ''
          this.getById()
        }
      })
    }
  }
}
</script>
<style scoped>
.bgfff {
  background-color: #fff;
}
.center {
  text-align: center;
}
.seeBtn {
  border-radius: 40px;
}
.avatarWar .avatar {
  height: 140px;
  width: 140px;
  border-radius: 0;
  border: none;
  display: inline-block;
  margin-right: 20px;
}
.avatarWar .avatar img {
  height: 140px;
  width: 140px;
  border: 1px solid #dddddd;
}
.avatarWar .avatar img.bradius {
  border-radius: 50%;
}
.save-div {
  margin-left: 120px;
  height: 40px;
}
.pd20 {
  padding: 20px;
}
.pdt20 {
  padding-top: 20px;
}
.sourcemenu {
  margin: 0px 20px;
  width: 90px;
  text-align: center;
}
.pdl20 {
  padding-left: 20px;
}
.bold {
  font-weight: bold;
}
.chatcontent {
  border-bottom: 0.5px solid #dfe6ec;
}
.operator {
  color: #999;
}
.bulec {
  color: #1c7bef;
}
</style>
