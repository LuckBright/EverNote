<template>
  <el-container class="page_layout_full_hidden" v-loading="loading">
    <div class="page_layout_full_hidden bg_col_04 padd50" style="overflow-y: auto">
      <h3>个性设置</h3>
      <div class="lineHigh paddl90 f14">以下设置会关联到登录的账号，登录不同的账号会有不同的设置项</div>
      <ever-form2
        class="ml20"
        :schema="schema"
        labelWidth="140px"
        v-if="!loading"
        v-model="obj">
        <!-- 提示语note -->
        <div slot="powerTrueNote" class="cGray lineHigh f14 note" v-if="powerTrue.length"><i class="iconfont icon-tixing1 mr5 cOrange"></i>当前账号有操作权限的库房才能被选择</div>
        <div slot="powerFlaseNote" class="cGray lineHigh f14 note mt20" v-if="powerFlase.length"><i class="iconfont icon-tixing1 mr5 cOrange"></i>以下库房没有操作权限，如需选择，请先设置操作权限</div>
        <template slot="default">
          <el-button class="mleft50 mt20" @click="submitSelect" type="primary">保存</el-button>
        </template>
      </ever-form2>
    </div>
  </el-container>
</template>

<script>
import getStorage from '@/warehouse/page/storages/util/getstorage'
import staffStorageroomApi from '@/warehouse/views/drug/api/staff.storageroomapi.js'
import processSeting from '@/warehouse/page/storages/util/process.seting.js'
const schema = [
  {
    name: 'powerTrueNote',
    label: '任务来源',
    comp: 'custom',
  },
  {
    name: 'powerTrue',
    label: '',
    comp: 'checkbox',
    props: {
      options: []
    }
  },
  {
    name: 'powerFlaseNote',
    label: '',
    comp: 'custom',
  },
  {
    name: 'powerFlase',
    label: '',
    comp: 'checkbox',
    props: {
      options: []
    }
  },
]
export default {
  mixins: [getStorage, processSeting],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      powerTrue: [],
      powerFlase: [],
      oldSelectPowerArr: [],
      loading: false
    }
  },
  created () {
    this.getStaffStorageroomList()
  },
  methods: {
    getStaffStorageroomList () {
      this.loading = true
      staffStorageroomApi.getStorageRoomList({isInvented: 0}).then(res => {
        if (res && res.length) {
          let powerTrueSelect = []
          let powerTrue = []
          let powerFlase = []
          let objPowerFlase = []
          res.forEach(item => {
            // 处理取回数据  有staffId代表有操作权限的库房
            if (item.staffId) {
              powerTrue.push({ value: item.storageRoomName, label: item.id, disabled: false })
              // selected  0 代表已经选择的库房
              if (item.selected === 0) {
                powerTrueSelect.push(item.nodeId)
                objPowerFlase.push(item.id)
              }
            } else {
              powerFlase.push({ value: item.storageRoomName, label: item.nodeId, disabled: true })
            }
          })
          this.$ever.getFieldFromSchema(this.schema, 'powerTrue').props.options = powerTrue
          this.$ever.getFieldFromSchema(this.schema, 'powerFlase').props.options = powerFlase
          this.powerTrue = powerTrue
          this.powerFlase = powerFlase
          this.obj.powerTrue = JSON.parse(JSON.stringify(objPowerFlase))
          this.oldSelectPowerArr = objPowerFlase
          this.$store.commit('setMoreStorageroomList', powerTrueSelect)
        }
        this.$nextTick(_ => {
          this.loading = false
        })
      })
    },
    submitSelect () {
      if (!this.obj.powerTrue.length) return this.everWarning('请先选择可以操作的库房')
      if (JSON.stringify(this.obj.powerTrue) === JSON.stringify(this.oldSelectPowerArr)) return this.everWarning('数据没有修改')
      let params = []
      this.obj.powerTrue.slice(0).forEach(item => {
        if (!this.oldSelectPowerArr.includes(item)) {
          params.push({id: item, selected: 0})
        }
      })
      this.oldSelectPowerArr.slice(0).forEach(item => {
        if (!this.obj.powerTrue.includes(item)) {
          params.push({id: item, selected: 1})
        }
      })
      staffStorageroomApi.updateStaffRoles(params).then(res => {
        if (res) {
          this.everSuccess('保存成功')
          this.getSameProcessConfigurationId({
            storageRoomId: this.storageId,
            processId: this.$store.state.processConfig.thisStorageroomProcessConfig.processId
          })
          this.getStaffStorageroomList()
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.padd50{
  padding: 50px;
  /deep/ .el-form-item__label {
    font-weight: bold;
  }
  /deep/ .el-form-item__content{
    padding-left: 20px;
  }
  .mleft50{
    margin-left: 160px;
    padding: 8px 30px;
  }
  /deep/ .el-checkbox{
    width: 200px;
    line-height: 30px;
  }
}
.paddl90{
  padding-left: 90px;
  padding-bottom: 20px;
}
</style>
