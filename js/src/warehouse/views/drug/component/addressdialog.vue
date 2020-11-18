<template>
  <div>
    <!-- 默认地址 -->
    <div style="height: 36px;line-height: 36px;">
      <div class="fl" v-if="defaultObj && defaultObj.name">
        <span class="cGray6">收货地址：</span>
        <span class="f_bold">{{defaultObj && defaultObj.name}}</span>
        <span class="ml10">{{`(${defaultObj && defaultObj.mobile})`}}</span>
        <ever-address v-model="defaultObj.address" :convertToFnt="true"></ever-address>
      </div>
      <div class="cGray6" v-if="!defaultObj.name && isShow && !isInvented">请先选择邮寄地址，<el-button type="text" @click="handlerAddress">选择地址</el-button></div>
      <el-button type="text" @click="handlerAddress" class="fl ml20" v-else-if="defaultObj && !defaultObj.edit && isShow && !isInvented">选择地址</el-button>
    </div>
    <!-- 弹窗区域 -->
    <el-dialog title="选择地址" :visible.sync="outerVisible" class="address">
      <div class="scrolly">
        <div class="addressinfo">
          <p>
            <span class="cGray6 ml15">收件人</span>
          </p>
          <div v-for="(item, index) in addressArr" :key="index" class="mt15 mb15 flexinfo" :class="{'bGray': item && item.isShow}" v-on:mouseenter="showAction(index)"  @mouseleave="hideAction(index)" @click="checkAdderss(index)">
            <div class="wid7 cur">
              <span class="ml15 f_bold">{{item && item.name}}</span>
              <span class="ml10">{{`(${item && item.mobile})`}}</span>
              <ever-address v-model="item.address" :convertToFnt="true"></ever-address>
              <!-- <span class="spanB ml10" v-if="item && item.isDefault">默认</span> -->
              <span class="ml10" v-if="item && item.isChecked"><i class="icon iconfont icon-complete cBlue mr5"></i></span>
            </div>
            <div class="wid3 cur" v-show="item && item.isShow && !isShipped">
              <!-- 本期先去掉设为默认功能，金祥不获取会员的默认地址 -->
              <!-- <span v-if="!(item && item.isDefault)" class="cBlue mr15" @click="setDefault(item.id)">设为默认</span> -->
              <span class="cBlue mr15" @click="edit(item)">编辑</span>
              <span class="cRed mr15" v-if="oldDefaultObj.orderId != item.id" @click="deleteRow(item.id)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="neWaddress">
        <span class="cur cBlue newAdd fl" @click="showNewadd">新增地址</span>
        <span class="cur cBlue fl ml15" @click="showSchema = false" v-if="showSchema"><a>(关闭)</a></span>
      </div>
      <div class="mt10 addressinfo" v-if="showSchema">
        <ever-form2
          :schema="schema"
          v-model="obj"
          :api="api"
          :info="true"
          :rules="rules"
          ref="address"
          class="from mt15 mb15 ml15 mr15"
          labelWidth="100px"
          label-position="right">
          <div slot="default"></div>
          <template slot="mobile">
            <el-input
              v-model="obj.mobile"
              placeholder="请输入电话"
              v-on:input="inputTrigger"
            ></el-input>
          </template>
          <el-button type="primary" @click="saveAddress" size="small">保存</el-button>
        </ever-form2>
      </div>
      <div slot="footer" class="dialog-footer mt10">
        <el-button type="primary" @click="save" size="small">确定</el-button>
        <el-button @click="outerVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/crm/store/shippingaddressapi.js'
import mailApi from '@/warehouse/views/drug/api/dispenseapi.js'
import { PAY_STATUS } from '@/util/common'
import { validateMobile } from '@/crm/util/common'
import Bus from '@/util/eventbus.js'
let schema = [
  {
    name: 'name',
    label: '收件人姓名:',
    span: 12
  },
  {
    name: 'mobile',
    label: '联系电话:',
    comp: 'custom',
    span: 12
  },
  {
    name: 'address',
    label: '地址:',
    comp: 'everAddress',
    props: {
      placeholder: '请选择收件地址',
      filterable: true
    },
    span: 24
  }
]
export default {
  props: {
    visitSn: { // 患者一次就诊编号
      type: String,
      default: ''
    },
    sourceId: { // 第一条的处方id
      type: String,
      default: ''
    },
    patientId: { // 患者id
      type: String,
      default: ''
    },
    isInvented: { // 1:虚拟库,0:实体库
      type: Number
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      obj,
      PAY_STATUS,
      outerVisible: false,
      showSchema: false, // schema 显示影藏
      showMore: false,
      showEditbutton: false,
      isShipped: false,
      addressArr: [],
      defaultArr: [],
      defaultObj: {}, // 默认地址 edit === 0 代表warehouse 自己的数据，可以更改收货地址
      rules: {
        name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '收件人电话', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请填写地址', trigger: 'change' }
        ]
      },
      patient: {},
    }
  },
  watch: {
    outerVisible: {
      handler (val) {
        val && this.visitSn && this.getStatus()
        !val && this.cancle()
      }
    },
    visitSn: { // 监听visitSn变化
      handler (v) {
        v && this.getMailAddress()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    Bus.$on('defaultObjEdit', (e) => {
      this.defaultObj.edit = e
    })
  },
  methods: {
    handlerAddress () {
      this.outerVisible = true
    },
    save () { // 修改地址
      let obj = this.addressArr && this.addressArr.find(index => { return index.isChecked === true })
      if (!this.addressArr.length) return this.$messageTips(this, 'warning', '请先添加邮寄地址')
      if (!obj && this.addressArr.length) return this.$messageTips(this, 'warning', '请选择邮寄地址')
      let params = {
        orderId: obj.id,
        visitSn: this.visitSn,
        name: obj.name,
        mobile: obj.mobile,
        address: obj.address,
        comment: obj.comment
      }
      let updateMailAddress = JSON.stringify(obj) === JSON.stringify(this.defaultObj)
      !updateMailAddress && mailApi.mailAddress(params).then(res => { // 更新warehouse收货地址
        if (res) {
          this.busEmintData(res)
          this.showSchema = false
          this.outerVisible = false
        }
      })
    },
    showNewadd () { // 新增收货地址
      this.showSchema = true
      Object.keys(this.obj).forEach(key => {
        this.obj[key] = ''
      })
    },
    saveAddress () { // 保存收货地址
      this.obj.patientId = this.patientId
      this.obj.mobile = this.obj.mobile ? this.obj.mobile.replace(/-/g, '') : ''
      this.obj.source = 3
      let request = api.createOrUpdate
      this.$refs.address.$refs.form.validate(valid => {
        valid && request(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.showSchema = false
            this.$messageTips(this, 'success', '地址保存成功')
            this.getStatus()
          }
        })
      })
    },
    cancle () { // 关闭schema
      this.showSchema = false
      Object.keys(this.obj).forEach(key => {
        this.obj[key] = ''
      })
    },
    setDefault (val) { // 设为默认
      let params = {
        id: val,
        isDefault: 1,
        patientId: this.patientId
      }
      api.setDefault(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.getStatus()
        }
      })
    },
    edit (val) { // 编辑收货地址，默认赋值
      this.showSchema = true
      Object.keys(this.obj).map(key => {
        this.obj[key] = val[key]
      })
      this.obj.id = val.id
    },
    deleteRow (val) { // 删除收货地址
      api.del({ 'id': val }).then(rs => {
        if (rs.head.errCode === 0) {
          this.getStatus()
        }
      })
    },
    inputTrigger () { // 输入电话号码
      this.$set(this.obj, 'mobile', validateMobile(this.obj.mobile))
    },
    showAction (val) {
      this.addressArr[val].isShow = true
    },
    hideAction (val) {
      this.addressArr[val].isShow = false
    },
    getMailAddress () {
      mailApi.getMailAddress({ visitSn: this.visitSn, recipeId: this.sourceId }).then(res => {
        this.busEmintData(res)
      })
    },
    busEmintData (res) {
      if (res) {
        Bus.$emit('defaultObj', res)
        this.defaultObj = res
        this.oldDefaultObj = JSON.parse(JSON.stringify(res))
      }
    },
    getStatus (create) { // 获取地址列表数据
      api.list({ patientId: this.patientId, offset: 0, pagesize: 20 }).then(res => {
        if (res.head.errCode === 0) {
          this.addressArr = res.data.resultList.length > 0 && res.data.resultList.map(item => {
            item.isShow = false
            item.isChecked = false
            return item
          })
          let addressObj = {}
          addressObj = this.addressArr && this.addressArr.find(obj => { return obj.isDefault === 1 })
          if (this.oldDefaultObj.orderId && this.addressArr.length) {
            const index = this.addressArr.findIndex(obj => { return this.oldDefaultObj.orderId === obj.id })
            if (index === -1) this.addressArr.push(this.oldDefaultObj)
          }
          if (!this.addressArr.length && !this.defaultObj.id) this.defaultObj = {}
          if (create) {
            if (addressObj) {
              this.defaultObj = addressObj
            } else {
              this.defaultObj = {}
            }
          }
          if (this.defaultObj && Object.keys(this.defaultObj).length) {
            Bus.$emit('defaultObj', this.defaultObj)
          }
        }
      })
    },
    replaceAddres () {
      this.showMore = true
      this.showEditbutton = false
    },
    checkAdderss (val) { // 选中地址
      if (!this.isShipped) {
        this.addressArr.map((item, index) => {
          item.isChecked = index === val
          return item
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .address /deep/ .el-dialog__header
  {
    padding: 10px 15px 0px 15px;
  }
  .address /deep/ .el-dialog__headerbtn {
    top: 13px;
    right: 15px;
  }
  .from /deep/ .el-form-item {
    margin-top: 10px;
  }
  .from /deep/ .el-form-item__label {
    color: #666666;
  }
  .wid50 {
    width: 50%!important;
  }
  .address /deep/ .el-dialog__body {
    padding: 10px 15px 0px 15px;
  }
  .address /deep/ .el-dialog__footer {
    margin-top:10px;
    padding: 0px 15px 10px 15px;
    border-top: 1px solid #ddd;
  }
  .addressinfo{
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.05);
    border-radius: 4px;
    min-height: 70px;
    background-repeat: repeat-x;
    background-position: bottom;
  }
  .address /deep/ hr {
    margin-bottom: 10px;
    margin-top:10px;
  }
  .wid7{
    width: 70%;
  }
  .wid3{
    width: 30%;
    text-align: right;
  }
  .flexinfo{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height:30px;
  }
  .bGray{
    background-color:#ECF5FF;
  }
  .spanB{
    background: #196fd7;
    border-color: #196fd7;
    color: #fff;
    outline: none;
    border-radius: 2px;
    width:34px;
  }
  .neWaddress {
    height: 30px;
    margin-top: 20px;
  }
  .scrolly {
    max-height:260px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color:#F5F5F5;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.021);
    border-radius: 10px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.055);
    background-color: rgba(85, 85, 85, 0.178);
  }
</style>
