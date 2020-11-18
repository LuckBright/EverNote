<template>
  <div>
    <div class="layout_inner">
      <div class="main-option">
        <template v-for="item in buttonArr">
          <el-button
            size="small"
            type="primary"
            @click="setpayparams(item.type)"
            :key="item.type"
          >{{item.name}}</el-button>
        </template>
      </div>
      <el-table v-loading.body="loading" :data="tableData">
        <el-table-column prop="name" label="支付方法" align="center"></el-table-column>
        <el-table-column prop="sort" label="统计分类" align="center">
          <template slot-scope="scope">{{[0, 22].includes(scope.row.value) ? '预收核销' : [13, 104, 106, 5].includes(scope.row.value) ? '优惠金额' : '实收金额'}}</template>
        </el-table-column>
        <!-- <el-table-column prop="refundLevel" label="退费优先级" align="center">
          <template slot-scope="scope">
            <el-input
              type="number"
              v-model="scope.row.refundLevel"
              :disabled="scope.row.value==5||scope.row.value==7||scope.row.value==8"
              :maxlength="max"
            ></el-input>
          </template>
        </el-table-column>-->
        <el-table-column prop="code" label="营销" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.mall" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="门诊" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.opd" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="门诊挂号" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.opdgh" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="住院" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.ip" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="无处方结算" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.nps" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="应收管理" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.sbys" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="超市收银" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.shsy" @change="(row)=>{checkchange(scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button size="small" type="primary" @click="updateBase()">保存</el-button>
      </div>
    </div>
    <el-dialog :title="loginfo.title" :visible.sync="loginfo.dialogVisible" class="ui_dialog_02">
      <div class="patientInfo" v-if="loginfo.dialogVisible">
        <ever-form2
          class="diy-form"
          :schema="querySchemat"
          v-model="addqueryObj"
          :span="24"
          :api="api"
          :info="true"
          :nosubmit="true"
          :rules="rules"
          ref="form"
        >
          <template slot="name">
            <el-input
              v-model="addqueryObj.name"
              placeholder="请输入支付方法名称"
              :disabled="loginfo.disabled"
              :maxlength="20"
            ></el-input>
          </template>
          <template slot="sort">
            <el-select v-model="addqueryObj.sort" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
          <template slot="type">
            <el-checkbox v-model="addqueryObj.mall">营销</el-checkbox>
            <el-checkbox v-model="addqueryObj.opd">门诊</el-checkbox>
            <el-checkbox v-model="addqueryObj.opdgh">门诊挂号</el-checkbox>
            <el-checkbox v-model="addqueryObj.ip">住院</el-checkbox>
            <el-checkbox v-model="addqueryObj.nps">无处方结算</el-checkbox>
          </template>
        </ever-form2>
      </div>
      <div style="float:right">
        <el-button size="small" type="primary" @click="addtype" style="margin-right:10px;">保存</el-button>
        <el-button size="small" @click="loginfo.dialogVisible=false" style="margin-right:10px;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="setDefaultPayMethod.title"
      :visible.sync="setDefaultPayMethod.dialogVisible"
      width="700px"
    >
      <div class="defaultPaymethodDialog">
        <el-row>
          <el-col :span="4" class="label">默认支付方式</el-col>
          <el-col :span="16" class="methodlist">
            <ever-select
              :options="setDefaultPayMethod.payMethod"
              v-model="setDefaultPayMethod.defaultMethod"
            ></ever-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="label">可点击支付方式</el-col>
          <el-col :span="16" class="methodlist">
            <el-checkbox
              v-for="(item,key) in setDefaultPayMethod.payMethod"
              :key="key"
              v-model="item.clearChargeMethod"
            >{{item.name}}</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button size="small" type="primary" @click="saveDefaultPaymethod">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/store/paymentmethodapi.js'
let schemat = [
  {
    name: 'name',
    label: '支付方法',
    comp: 'custom'
  },
  {
    name: 'sort',
    label: '统计分类',
    comp: 'custom'
  },
  {
    name: 'refundLevel',
    label: '退费优先级',
    props: {
      type: 'number',
      maxlength: '2'
    }
  },
  {
    name: 'type',
    label: '类型',
    comp: 'custom'
  }
]
export default {
  data () {
    let addobj = this.$ever.createObjFromSchema(schemat)
    addobj['mall'] = false // 营销
    addobj['opd'] = false // 门诊
    addobj['ip'] = false // 住院
    let rules = {
      sort: [{ required: true, message: '必填项', trigger: 'blur' }],
      name: [{ required: true, message: '必填项', trigger: 'blur' }],
      refundLevel: [{ required: true, message: '必填项', trigger: 'blur' }]
    }
    return {
      querySchemat: schemat,
      addqueryObj: addobj,
      rules,
      loading: false,
      api,
      max: 5,
      tableData: [],
      loginfo: {
        dialogVisible: false,
        id: '',
        title: '新建支付方式',
        disabled: false
      },
      options: [
        { id: '1', name: '实付' },
        { id: '2', name: '减免' },
        { id: '3', name: '应收' }
      ],
      buttonArr: [
        { name: '营销', type: 3 },
        { name: '门诊', type: 1 },
        { name: '门诊挂号', type: 4 },
        { name: '住院', type: 2 },
        { name: '无处方结算', type: 5 },
        { name: '应收管理', type: 6 },
        { name: '超市收银', type: 8 }
      ],
      setDefaultPayMethod: {
        type: '',
        dialogVisible: false,
        title: '',
        payMethod: [],
        defaultMethod: ''
      }
    }
  },
  methods: {
    setpayparams (type) {
      // 切换场景清空数据
      Object.assign(this.setDefaultPayMethod, {
        type: '',
        dialogVisible: false,
        title: '',
        payMethod: [],
        defaultMethod: ''
      })
      let paymethod = this.buttonArr.filter(v => (v.type === type))
      // console.log(paymethod[0], 'sdfafasdf')
      this.setDefaultPayMethod.title = paymethod[0].name
      this.setDefaultPayMethod.type = type
      let params = {
        scene: type
      }
      api.getPaymethodsChecked(params).then(res => {
        // 会员卡支付方式不可选为默认支付方式及蓝色可点击
        this.setDefaultPayMethod.payMethod = res.data.filter(v => (Number(v.value) !== 0))
        // 如果设置过默认支付方式，则赋值填上
        if (res.data.filter(v => (v.defaultChargeMethod === true)).length > 0) {
          this.setDefaultPayMethod.defaultMethod = res.data.filter(v => (v.defaultChargeMethod === true))[0].id
        } else { // 如果没有设置过，则默认设置第一个
          this.setDefaultPayMethod.defaultMethod = res.data[0].id
        }
      })
      this.setDefaultPayMethod.dialogVisible = true
    },
    updateBase () {
      let arr = []
      this.tableData.forEach(item => {
        if (item.value !== 5 && item.value !== 7 && item.value !== 8) {
          arr.push(Number(item.refundLevel))
        }
      })
      let n = new Set(arr)
      if (n.size !== arr.length) {
        this.$notify({
          message: '优先级重复',
          type: 'error'
        })
      } else {
        this.numLen()
      }
    },
    numLen () {
      let minlen = 0
      let maxlen = 0
      this.tableData.forEach(item => {
        if (Number(item.refundLevel) < 1) {
          minlen++
        } else if (Number(item.refundLevel) > 99) {
          maxlen++
        }
      })
      if (!minlen || !maxlen) {
        this.update()
      } else {
        let val = minlen
          ? '退费优先级不能大于99，请修改!'
          : '退费优先级不能小于0，请修改!'

        this.$notify({
          message: val,
          type: 'error'
        })
      }
    },
    update () {
      try {
        api.updateAll(this.tableData).then(result => {
          this.$notify({
            message: '保存成功',
            type: 'success'
          })
        })
      } catch (e) {
        this.$notify({
          message: '保存失败',
          type: 'error'
        })
      }
    },
    createReceivables () {
      this.loginfo.dialogVisible = true
    },
    list (key) {
      this.loading = true
      api.list().then(result => {
        this.loading = false
        result.data.default.forEach(item => {
          item.refundLevel = item.refundLevel ? item.refundLevel : '99'
        })
        this.tableData = result.data.default
      })
    },
    checkchange (row) {
      this.loading = true
      let params = {
        id: row.id,
        ip: row.ip,
        mall: row.mall,
        opd: row.opd,
        sort: row.sort,
        opdgh: row.opdgh,
        nps: row.nps,
        sbys: row.sbys,
        shsy: row.shsy
      }
      api
        .update(params)
        .then(result => {
          this.loading = false
          this.$notify({
            title: '',
            message: '更改成功',
            type: 'success'
          })
        })
        .catch(reject => {
          this.loading = false
          this.$notify({
            title: '',
            message: '更改失败',
            type: 'success'
          })
        })
    },
    addtype () {
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            name: this.addqueryObj.name,
            ip: this.addqueryObj.ip,
            mall: this.addqueryObj.mall,
            opd: this.addqueryObj.opd,
            sort: this.addqueryObj.sort,
            opdgh: this.addqueryObj.opdgh,
            nps: this.addqueryObj.nps,
            refundLevel: this.addqueryObj.refundLevel
          }
          api.create(params).then(result => {
            this.$notify({
              title: '',
              message: '新建成功',
              type: 'success'
            })
            this.loginfo.dialogVisible = false
            this.list()
          })
        }
      })
    },
    saveDefaultPaymethod () {
      if (!this.setDefaultPayMethod.defaultMethod) {
        this.$messageTips(this, 'error', '默认支付不能为空')
        return
      }
      let defaultMethodListChecked = this.setDefaultPayMethod.payMethod.filter(v => (v.clearChargeMethod === true))
      // console.log(defaultMethodListChecked, '没选中吗？')
      let defaultMethodList = []
      for (let item of defaultMethodListChecked) {
        defaultMethodList.push({
          chargeScene: this.setDefaultPayMethod.type,
          chargeMethodId: item.id
        })
      }
      let params = {
        chargeMethodDefault: {
          chargeScene: this.setDefaultPayMethod.type,
          chargeMethodId: this.setDefaultPayMethod.defaultMethod
        },
        chargeMethodClearList: defaultMethodList
      }
      api.saveDefaultPaymethod(params).then(res => {
        this.$messageTips(this, 'success', '默认支付方式保存成功')
        this.setDefaultPayMethod.dialogVisible = false
      })
    }
  },
  watch: {
    'loginfo.dialogVisible': {
      handler (newValue) {
        if (!newValue) {
          this.addqueryObj.sort = ''
          this.addqueryObj.name = ''
          this.addqueryObj.refundLevel = ''
          this.addqueryObj.mall = false
          this.addqueryObj.opd = false
          this.addqueryObj.ip = false
          this.loginfo.disabled = false
          this.loginfo.title = '新建支付方式'
          this.loginfo.id = ''
        }
      },
      immediate: true
    }
  },
  created () {
    this.list(false)
  }
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
.defaultPaymethodDialog {
  padding: 0 20px;
}
.label {
  margin-right: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  line-height: 50px;
  text-align: right;
}
.methodlist {
  margin-left: 12px;
  line-height: 50px;
  text-align: left;
}
.methodlist /deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
</style>

