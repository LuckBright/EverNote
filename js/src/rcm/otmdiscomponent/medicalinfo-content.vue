<template>
  <el-dialog
    title="医保读卡信息"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :width="insuranceOrgId == jljhCode?'90%':'70%'"
    v-loading="loading"
  >
    <!-- 长春医保 -->
    <jlccyb v-if="insuranceOrgId == jlccybCode" :medicalObj="medicalObj"></jlccyb>
    <!-- 吉林省保 -->
    <jlssb v-else-if="insuranceOrgId == jlssbCode" :medicalObj="medicalObj"></jlssb>
    <!-- 黑龙江医保 -->
    <hljyb v-else-if="insuranceOrgId == hljybCode" :medicalObj="medicalObj" :scence="scence"></hljyb>
    <!-- 吉林省蛟河医保 -->
    <jljhyb v-else-if="insuranceOrgId == jljhCode" :medicalObj="medicalObj"></jljhyb>
    <!-- 三亚世侨医保 -->
    <sysqzyy
      v-else-if="insuranceOrgId == sysqzyyCode"
      :medicalObj.sync="medicalObj"
      @selectedPersonInfo="selectedPersonInfo"
    ></sysqzyy>
    <!-- 山东乐陵 -->
    <sdllyb
      ref="sdllyb"
      v-else-if="insuranceOrgId == sdllCode"
      :medicalObj.sync="medicalObj"
      :confirmDisabled.sync="confirmDisabled"
    ></sdllyb>
    <!-- 标准省保组件 -->
    <!-- 组件底部 -->
    <div class="dialogfoot">
      <el-checkbox v-if="insuranceOrgId == jljhCode" v-model="medicalObj.medicalPayCopy">使用个人账户支付</el-checkbox>
      <el-button type="primary" @click="confirmInfoFn" :disabled="confirmDisabled">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import storage from '@/util/storage'
import userbaseapi from '@/workspace/store/userbaseapi'
import jlccyb from '@/rcm/otmdiscomponent/medicalcardinfo/jlccyb-medicalcard.vue'
import jlssb from '@/rcm/otmdiscomponent/medicalcardinfo/jlssb-medicalcard.vue'
import hljyb from '@/rcm/otmdiscomponent/medicalcardinfo/hlj-medicalcard.vue'
import jljhyb from '@/rcm/otmdiscomponent/medicalcardinfo/jljh-medicalcard.vue'
import sysqzyy from '@/rcm/otmdiscomponent/medicalcardinfo/sysqzyy-medicalcard.vue'
import sdllyb from '@/rcm/otmdiscomponent/medicalcardinfo/sdllyb-medicalcard.vue'
import { jlccybCode, jlssbCode, hljybCode, jljhCode, sysqzyyCode, sdllCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { getPersonInfo } from '@/rcm/store/otmdiscomponent/jlsb-api.js'
import { hljGetPersonInfoMz, hljGetPersonInfoGh } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { getPersonInfo as jljhybGetPersonInfo } from '@/rcm/store/otmdiscomponent/jljh-api.js'
// 三亚世侨
import { getPersonInfo as sysqzyyGetPersonInfo } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import { getIdNo } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
export default {
  props: {
    'dialogmedicalinfovisible': {
      type: Boolean,
      default: false
    },
    'insuranceOrgId': {
      type: String,
      default: ''
    },
    'macId': {
      type: [String],
      default: ''
    },
    'dzsbkewm': {
      type: [String],
      default: ''
    },
    'password': {
      type: [String],
      default: ''
    },
    'scence': {
      type: Number,
      default: 1
    },
    'hasCard': {
      type: Boolean,
      default: true
    },
    cardTypeInfo: {
      type: Object,
      default () {
        return {type: 0}
      }
    }
  },
  data () {
    return {
      jlccybCode,
      jlssbCode,
      hljybCode,
      jljhCode,
      sysqzyyCode,
      sdllCode,
      orgList,
      medicalObj: {},
      loading: false,
      confirmDisabled: true,
      // 三亚世侨是多选，要额外开出一个数据存储
      sysqzyyPersonInfo: {}
    }
  },
  methods: {
    // 不同医保机构转发不同方法，
    // 通过this.orgList[this.insuranceOrgId]来区分不同医保机构
    // 通过operation走不同业务接口
    commonOperate (operation) {
      let method = this[this.orgList[this.insuranceOrgId].code + operation]
      let args = Array.prototype.slice.call(arguments, 1)
      if (typeof method === 'function') {
        method.call(this, ...args)
      }
    },
    // 吉林长春市医保读卡方法
    async jlccybReadCard () {
      if (this.checkRequireParams()) {
        this.loading = true
        try {
          let params = {
            clinicId: storage.getLocalStorage('CLINICID'), // 当前机构id
            userName: this.$store.state.currentUser.name,
            flowNum: '123456',
            macId: this.macId,
            insuranceOrgId: this.insuranceOrgId
          }
          let data = await userbaseapi.autoReadIcCardInfo(params)
          if (data.head && data.head.errCode === 9999) {
            this.$notify({
              title: '警告',
              message: '请连接医保卡读卡器设备并启动读卡识别程序',
              type: 'warning'
            })
            this.loading = false
            this.v = false
          }
          if (data.head && data.head.errCode === 0) {
            if (data.data && !data.data.cardno) { // 少嵌套了一层
              this.$messageTips(this, 'error', '未读取到卡片信息，请稍后再试！')
              this.loading = false
              this.v = false
            } else {
              this.medicalObj = data.data
              this.loading = false
              this.confirmDisabled = false // 只有读到了数据才把确认按钮打开
            }
          }
        } catch (err) {
          this.$notify({
            title: '错误',
            message: `发生了错误，原因是：${err}`,
            type: 'warning'
          })
          this.loading = false
          this.v = false
        }
      }
    },
    // 省保读卡接口
    async jlssbReadCard () {
      if (this.checkRequireParams()) {
        this.loading = true
        try {
          let params = {
            clinicId: storage.getLocalStorage('CLINICID'), // 当前机构id
            userName: this.$store.state.currentUser.name,
            flowNum: '123456',
            macId: this.macId,
            insuranceOrgId: this.insuranceOrgId
          }
          let data = await getPersonInfo(params)
          if (data.head && data.head.errCode === 9999) {
            this.$notify({
              title: '警告',
              message: '请连接医保卡读卡器设备并启动读卡识别程序',
              type: 'warning'
            })
            this.loading = false
            this.v = false
          }
          if (data.head && data.head.errCode === 0) {
            let obj = data.data && data.data.infos && data.data.infos[0]
            if (!obj || (obj && !obj.cardno)) { // 少嵌套了一层
              this.$messageTips(this, 'error', '未读取到卡片信息，请稍后再试！')
              this.loading = false
              this.v = false
            } else {
              this.medicalObj = obj
              this.loading = false
              this.confirmDisabled = false // 只有读到了数据才把确认按钮打开
            }
          }
        } catch (err) {
          this.$notify({
            title: '错误',
            message: `发生了错误，原因是：${err}`,
            type: 'warning'
          })
          this.loading = false
          this.v = false
        }
      }
    },
    // 黑龙江医保读卡接口
    hljybReadCard () {
      if (this.checkRequireParams()) {
        this.loading = true
        let params = {
          medicareCardPassword: this.password,
          insuranceOrgId: this.insuranceOrgId,
          macId: this.macId,
          dzsbkewm: this.dzsbkewm,
          readType: this.cardTypeInfo.type
        }
        this.hljGetPersonInfo(params).then(res => {
          this.medicalObj = res.data
          /* 黑龙江额外参数的处理 */
          this.medicalObj.idno = this.medicalObj.idCard
          this.medicalObj.personno = this.medicalObj.personalNo
          this.medicalObj.personname = this.medicalObj.name
          this.medicalObj.password = this.password
          /* 黑龙江额外参数的处理 */
          this.loading = false
          this.confirmDisabled = false
        }, err => {
          console.log('err', err)
          this.$messageTips(this, 'error', '读卡失败，请稍后再试！')
          this.loading = false
          this.v = false
        }).catch((err) => {
          console.log('err', err)
          this.loading = false
        })
      }
    },
    // 吉林蛟河医保读卡接口
    jljhybReadCard () {
      if (this.checkRequireParams()) {
        this.loading = true
        let params = {
          insuranceOrgId: this.insuranceOrgId,
          macId: this.macId
        }
        jljhybGetPersonInfo(params).then(res => {
          let result = res.data && res.data.infos && res.data.infos[0]
          let nation = result.nationSys = result.nation + ''
          if (nation.startsWith('0')) {
            result.nationSys = Number(nation.substring(1))
          }
          // 是否使用个人账户支付，默认赋值使用
          result.medicalPayCopy = true
          this.medicalObj = result
          this.loading = false
          this.confirmDisabled = false
        }, err => {
          console.log('err', err)
          this.$messageTips(this, 'error', '读卡失败，请稍后再试！')
          this.loading = false
          this.v = false
        }).catch((err) => {
          console.log('err', err)
          this.loading = false
        })
      }
    },
    // 三亚世侨
    sysqzyyReadCard () {
      if (this.checkRequireParams()) {
        // 有卡直接读卡
        if (this.hasCard) {
          this.loading = true
          let params = {
            insuranceOrgId: this.insuranceOrgId,
            macId: this.macId
          }
          sysqzyyGetPersonInfo(params).then(res => {
            let result = res.data && res.data.data
            // 一些参数的映射
            result = result.map(item => {
              item.personname = item.name
              item.personno = item.personNo
              item.idno = item.idNo
              return item
            })
            this.medicalObj = result
            this.sysqzyyPersonInfo = result[0]
            this.loading = false
            this.confirmDisabled = false
          }, err => {
            console.log('err', err)
            this.$messageTips(this, 'error', '读卡失败，请稍后再试！')
            this.loading = false
            this.v = false
          }).catch((err) => {
            console.log('err', err)
            this.loading = false
          })
        } else {
          // 无卡，让用户手动输入查询
        }
      }
    },
    // 三亚世侨多人员选择
    selectedPersonInfo (val) {
      this.sysqzyyPersonInfo = val
      this.confirmDisabled = !val
    },
    // 山东乐陵
    sdllybReadCard () {
      if (this.checkRequireParams()) {
        // 调用硬件接口，将返回的身份证信息传给查询字段
        getIdNo().then(res => {
          this.medicalObj.basicInfo = res.data
          this.$refs.sdllyb.putIdCode()
        }).catch((err) => {
          console.log('err', err)
        })
      }
    },
    // 确认按钮
    async confirmInfoFn () {
      // 山东乐陵检查必要参数，可能以后其他医保也有类似需求
      let checkResult = await this.checkRequiredParams()
      if (!checkResult) {
        return false
      }
      let emitObj
      if (this.insuranceOrgId === sysqzyyCode) {
        // 三亚世侨是多个患者，要选择
        emitObj = { ...this.sysqzyyPersonInfo, insuranceOrgId: this.insuranceOrgId, macId: this.macId }
      } else if (this.insuranceOrgId === jljhCode) {
        // 加了一个是否默认使用个人账户支付的标识
        emitObj = { ...this.medicalObj, insuranceOrgId: this.insuranceOrgId, macId: this.macId, ...{ medicalPay: +!this.medicalObj.medicalPayCopy } }
      } else {
        emitObj = { ...this.medicalObj, insuranceOrgId: this.insuranceOrgId, macId: this.macId }
      }
      this.$emit('getMedDetails', emitObj)
      this.v = false
    },
    // 检查必须具备的参数
    checkRequireParams () {
      if (!this.macId) {
        this.$messageTips(this, 'error', '未获取到macId，请刷新页面重新获取mac地址后，再来获取')
        this.v = false
        return false
      }
      if (!this.insuranceOrgId) {
        this.$messageTips(this, 'error', '请传入医保机构ID，再进行读卡操作')
        this.v = false
        return false
      }
      return true
    },
    // 校验医保组件里的必填参数
    async checkRequiredParams () {
      if (this.insuranceOrgId === sdllCode) {
        const result = await this.$refs.sdllyb.checkRequiredParams()
        return result
      }
      return true
    }
  },
  created () {
    this.commonOperate('ReadCard')
  },
  computed: {
    v: {
      get () {
        return this.dialogmedicalinfovisible
      },
      set (val) {
        this.$emit('update:dialogmedicalinfovisible', val)
      }
    },
    hljGetPersonInfo: {
      get () {
        // scence 0挂号，1门诊
        switch (this.scence) {
          case 0:
            return hljGetPersonInfoGh
          case 1:
            return hljGetPersonInfoMz
          default:
            return hljGetPersonInfoMz
        }
      }
    }
  },
  components: {
    jlccyb,
    jlssb,
    hljyb,
    jljhyb,
    sysqzyy,
    sdllyb
  }
}
</script>
<style scoped>
.conbox {
  font-size: 14px;
  line-height: 22px;
}
.conbox .tableClass {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
}
.conbox .tableClass td {
  border: 1px solid #ddd;
  width: 16.67%;
}
.conbox .tableClass td.label {
  color: #000;
  background-color: #eee;
}
.conbox .tableClass td.content {
  text-align: center;
  color: #000;
}
.dialogfoot {
  margin: 20px 0 20px;
  height: 40px;
  text-align: right;
}
</style>
