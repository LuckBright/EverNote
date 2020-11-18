<template>
  <div class="layout_inner">
    <ever-bread-crumb
      :name="objId ? '应用详情' : '新建'"
      path="/financeistall/paychannelconfig/paychannel"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="text">登录支付网关，开通支付渠道，获取支付秘钥</div>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        :rules="rules"
        :api="api"
        @objsaved="afterSave"
      >
        <template slot="privateKeyCopy">
          <el-input
            type="textarea"
            :autosize="{minRows:4,maxRows:6}"
            v-model="queryObj.privateKeyCopy"
            @change="handleKeypress"
          ></el-input>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/paychannelconfig/paychannelapi'
import storage from '@/util/storage'

const schema = [
  {
    label: 'apikey',
    name: 'mchid'
  },
  {
    label: '应用名称',
    name: 'name',
  },
  {
    label: 'appid',
    name: 'appid',
  },
  {
    label: '公钥',
    name: 'publicKey',
    comp: 'textarea',
    props: {
      autosize: {
        minRows: 4,
        maxRows: 6
      }
    }
  },
  {
    label: '私钥',
    name: 'privateKey',
    comp: 'textarea',
    props: {
      autosize: {
        minRows: 4,
        maxRows: 6
      }
    },
    col: {
      style: 'display:none;' // 真正的privateKey隐藏
    }
  },
  {
    label: '私钥',
    name: 'privateKeyCopy', // 代替真正的privateKey,显示***
    comp: 'custom'
  }]
const rules = {
  mchid: [{
    required: true,
    message: '请输入商户ID',
    trigger: 'change'
  }],
  name: [{
    required: true,
    message: '请输入应用名称',
    trigger: 'change'
  }],
  appid: [{
    required: true,
    message: '请输入支付id',
    trigger: 'change'
  }],
  publicKey: [{
    required: true,
    message: '请输入公钥',
    trigger: 'change'
  }],
  privateKey: [{
    required: true,
    message: '请输入私钥',
    trigger: 'change'
  }],
  privateKeyCopy: [{
    required: true,
    message: '请输入私钥',
    trigger: 'change'
  }]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.orgId = storage.getLocalStorage('CLINICID')
    return {
      schema: schema,
      queryObj: queryObj,
      rules: rules,
      objId: this.$route.params.id,
      api
    }
  },
  methods: {
    afterSave () {
      this.$router.push('/financeistall/paychannelconfig/paychannel')
    },
    handleKeypress () {
      this.queryObj.privateKey = this.queryObj.privateKeyCopy
      this.queryObj.privateKeyCopy = this.queryObj.privateKeyCopy.replace(/./g, '*')
    }
  }
}
</script>
<style scoped>
.text {
  margin: 30px 0 30px 120px;
}
</style>
