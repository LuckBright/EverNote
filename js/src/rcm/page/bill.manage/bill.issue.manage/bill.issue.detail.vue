<template>
  <div class="layout_inner" v-loading="loading">
    <ever-bread-crumb
      :name="'票据发放'"
      path="/financial/billissuelist"
      isQuery="true"
      show-edit-fnt="false"
      :have-return="true"
    ></ever-bread-crumb>
    <el-row>
      <el-col :span="12">
        <div style="padding-right:20px;text-align:right;margin-bottom:15px;">当前最大票据号： {{maxCode}}</div>
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          :rules="rules"
          labelWidth="100px"
          ref="form"
          class="issue-form"
          label-position="right"
        >
          <template slot="billType">
            <el-select v-model="queryObj.billType" @change="billTypeChange" placeholder="票据类型" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="defineId">
            <el-select v-model="queryObj.defineId" @change="defineIdChange" placeholder="票据名称" clearable>
              <el-option
                v-for="item in billOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
          <template slot="default">
            <div></div>
          </template>
        </ever-form2>
      </el-col>
    </el-row>
    <el-row class="billContainer" v-if="isManual">
      <el-col :span="12">
        <template>
          <el-col :span="22">
            <template v-for="(item,index) of customBillNumArr">
              <el-row :key="index" class="billRow">
                <el-col :span="18">
                  <el-col :span="12" class="customBIllArea">
                    <div class="text">起始票号：</div>
                    <div class="billInput">
                      <el-input v-model="item.startCode" @blur="computedCount(index)"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="12" class="customBIllArea">
                    <div class="text">~  终止票号：</div>
                    <div class="billInput">
                      <el-input v-model="item.endCode" @blur="computedCount(index)"></el-input>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="addNewRow">
                    <i class="iconfont icon-tianjia"></i>
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    v-if="checkIfShow(item,index)"
                    @click="deleteRow(index)"
                  >
                    <i class="iconfont icon-delete"></i>
                  </el-button>
                  <span style="margin-left:10px;">{{`${item.count}张`}}</span>
                </el-col>
              </el-row>
            </template>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="addInventory" style="margin-top: 5px;">完成</el-button>
          </el-col>
        </template>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div style="text-align: right;margin-top: 20px;">
          <el-button type="primary" @click="grantBill">发放</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/rcm/store/bill.manage/bill.issue.api'
import stockApi from '@/rcm/store/bill.manage/bill.stock.api'
let schema = [
  {
    name: 'billType',
    label: '票据类型',
    comp: 'custom'
  },
  {
    name: 'defineId',
    label: '票据名称',
    comp: 'custom'
  },
  {
    name: 'useableNumber',
    label: '可分配库存',
    props: {
      disabled: true
    }
  },
  {
    name: 'd',
    label: '申领单位',
    comp: 'everSubjectSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
  },
  {
    name: 'applyUserId',
    label: '申领人',
    comp: 'ever-staff-select',
    props: {
      fields: 'id'
    }
  },
  {
    name: 'hopeProvideQty',
    label: '发放数量'
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let validata = (rule, value, callback) => {
      if (!/^([0-9]){1,3}$/.test(value)) {
        callback(new Error('请输入小于1000的正整数！'))
      } else {
        callback()
      }
    }
    let rules = {
      billType: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      defineId: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      applyUserId: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      hopeProvideQty: [
        { validator: validata, trigger: ['blur', 'change'] }
      ]
    }
    return {
      api,
      stockApi,
      queryObj,
      schema,
      rules,
      loading: false,
      startCode: 0,
      customBillTpl: {
        startCode: '',
        endCode: '',
        count: 0
      },
      typeOptions: [
        {label: '挂号发票', value: 1},
        {label: '门诊发票', value: 2},
        {label: '住院发票', value: 3}
      ],
      maxCode: '',
      billOptions: [],
      isManual: true,
      customBillNumArr: [],
      reg: /^([0-9]){1,}$/
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    grantBill () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {
            defineId: this.queryObj.defineId,
            useableQty: this.queryObj.useableNumber,
            hopeProvideQty: this.queryObj.hopeProvideQty,
            applyUserId: this.queryObj.applyUserId,
          }
          api.quickProvide(params).then(rs => {
            console.log(rs)
            if (rs.head && rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '发放成功')
              this.$router.go(-1)
            }
            this.loading = false
          }, rj => {
            this.loading = false
          })
        }
      })
    },
    addInventory () {
      if (!this.initManualData()) return
      if (!this.queryObj.defineId) {
        this.$messageTips(this, 'error', '请选择票据')
        return
      }
      this.loading = true
      let params = {
        defineId: this.queryObj.defineId,
        startEndCodeList: this.customBillNumArr
      }
      api.quickManualInStore(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '添加成功')
          this.getBillInfo(this.queryObj.defineId)
        }
        this.loading = false
      }, rj => {
        this.loading = false
      })
    },
    initManualData () {
      let arr = []
      let allCount = 0
      let regType = false
      this.customBillNumArr.forEach(item => {
        let num = []
        allCount += item.count
        num.push(item.startCode)
        num.push(item.endCode)
        arr.push(num)
        if (!this.reg.test(item.startCode) || !this.reg.test(item.endCode)) {
          regType = true
        }
      })
      if (regType) {
        this.$messageTips(this, 'error', '票号应为大于0的正整数')
        return false
      }
      if (!allCount) {
        this.$messageTips(this, 'error', '票号不能为空')
        return false
      }
      let repeat = false
      let arr2 = arr.sort((a, b) => { return a[0] - b[0] })
      for (let i = 0; i < arr2.length - 1; i++) {
        let curVal = arr[i][1] || arr[i][0]
        let nextVal = arr[i + 1][0]
        if (!(curVal < nextVal)) {
          repeat = true
        }
      }
      if (repeat) {
        this.$messageTips(this, 'error', '票号不能重复')
        return false
      }
      return true
    },
    addNewRow () {
      this.customBillNumArr.push(JSON.parse(JSON.stringify(this.customBillTpl)))
    },
    deleteRow (index) {
      if (this.customBillNumArr.length > 1) {
        this.customBillNumArr.splice(index, 1)
      } else {
        // 要求点击最后一行的减号时，清空当前行数据，减号消失，加号留着
        this.customBillNumArr.length = 0
        this.addNewRow()
      }
    },
    checkIfShow (row, index) {
      return index > 0 || row.startCode !== '' || row.endCode !== ''
    },
    computedCount (index) {
      let item = this.customBillNumArr[index]
      if (!Number(item.endCode) || !Number(item.startCode)) {
        item.count = 0
        return
      }
      if (item.endCode === '' && item.startCode === '') {
        item.count = 0
      } else if (item.endCode && item.startCode) {
        if (item.endCode === item.startCode) {
          item.count = 1
        } else if (Number(item.startCode) > Number(item.endCode)) {
          item.count = 0
        } else {
          item.count = item.endCode - item.startCode + 1
        }
      } else {
        item.count = 1
      }
    },
    billTypeChange (id) {
      this.billOptions = []
      this.queryObj.defineId = ''
      if (!id) {
        this.isManual = false
      }
      let params = {
        page: 1,
        pagesize: 500,
        billType: id
      }
      stockApi.listStock(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.billOptions = rs.data.list
        }
      })
    },
    getBillInfo (id) {
      api.selectCountMaxCode({defineId: id}).then(rs => {
        if (rs.head.errCode === 0) {
          this.queryObj.useableNumber = rs.data.totalCount
          this.maxCode = rs.data.maxBillCode
        }
      })
    },
    defineIdChange (id) {
      if (id) {
        let info = this.billOptions.find(item => { return item.id === id })
        this.isManual = !info.isAutoGenerate
        this.getBillInfo(id)
      } else {
        this.queryObj.useableNumber = ''
        this.maxCode = ''
        this.isManual = false
      }
    }
  },
  created () {
    this.addNewRow()
  },
  watch: {
    // data: {
    //   handler: function (val, oldval) {

    //   },
    //   immediate: true
    // }
  }
}
</script>
<style lang="less" scoped>
.billContainer {
  margin-top: 20px;
}
.billRow {
  margin: 5px 0;
}
.customBIllArea {
  padding: 0 10px;
  display: flex;
}
.customBIllArea .text {
  width: 100px;
  text-align: right;
  line-height: 36px;
}
.customBIllArea .billInput {
  flex: 1;
}
.issue-form /deep/ .el-select {
  width: 100%;
}
</style>
