<template>
  <el-dialog
    title="医嘱单打印"
    :visible.sync="flag"
    class="dialog-oudepart ui_dialog_02"
    id="indepart"
    width="560px"
    style="margin:0 auto;"
  >
    <span slot="title">
      <strong style="font-size:16px;">医嘱单打印</strong>
    </span>
    <div class="oudepart-body">
      <el-form ref="selectform" :model="selectform" label-width="120px" class="demo-form-inline">
        <el-form-item label="医嘱单类型：" style="margin-bottom:0;">
          <el-radio-group v-model="selectform.termsType">
            <el-radio :label="'1'">长期医嘱</el-radio>
            <el-radio :label="'0'">临时医嘱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打印范围：" style="margin-bottom:0;">
          <el-radio-group v-model="selectform.printRange" class="printRangeRadio">
            <el-radio :label="'1'">全部打印</el-radio>
            <!-- <el-radio :label="'2'">
              <template>
                <el-form label-width="0" :model="selectform.page" :rules="pageFormRules" ref="pageForm">
                  <el-form-item style="float:left;" prop="startPage">
                    从<el-input class="pagenumber" :class="{curchange:selectform.printRange === '2'}" v-model.number="selectform.page.startPage" @focus="selectform.printRange = '2'"></el-input>
                  </el-form-item>
                  <el-form-item style="float:left;" prop="endPage" class="speLeft">
                    ——<el-input class="pagenumber" :class="{curchange:selectform.printRange === '2'}" v-model.number="selectform.page.endPage" @focus="selectform.printRange = '2'"></el-input>行
                  </el-form-item>
                </el-form>
              </template>
            </el-radio>-->
            <el-radio :label="'3'">
              续打
              <!-- <template>
                <el-form label-width="0" :model="selectform.pageNumber" :rules="pageNumberFormRules" ref="pageNumberForm">
                  <el-form-item style="float:left;" prop="startPageNumber">
                    从<el-input class="pagenumber" :class="{curchange:selectform.printRange === '3'}" v-model.number="selectform.pageNumber.startPageNumber" @focus="selectform.printRange = '3'"></el-input>行开始续打
                  </el-form-item>
                </el-form>
              </template>-->
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button  @click="flag=false">取消</el-button>
      <el-button type="primary" @click="afterSelect()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../store/outdepartapi'
import phrapi from '@/inpatient/store/phr'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
export default {
  props: ['visible', 'userinfo', 'printInfo'],
  data () {
    // var validatePass0 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('必填项'))
    //   } else if (typeof value !== 'number') {
    //     callback(new Error('必须为数字!'))
    //   } else if (this.selectform.page.endPage && this.selectform.page.endPage < this.selectform.page.startPage) {
    //     callback(new Error('开始行数不能大于结束行数'))
    //   } else {
    //     callback()
    //   }
    // }
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('必填项'))
    //   } else if (typeof value !== 'number') {
    //     callback(new Error('必须为数字!'))
    //   } else if (this.selectform.page.startPage && this.selectform.page.endPage < this.selectform.page.startPage) {
    //     callback(new Error('结束行数不能小于开始行数'))
    //   } else {
    //     callback()
    //   }
    // }
    // var validatePass1 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('必填项'))
    //   } else if (typeof value !== 'number') {
    //     callback(new Error('必须为数字!'))
    //   } else if (this.selectform.pageNumber.startPageNumber > this.totalCount) {
    //     callback(new Error('开始行数不能大于总行数'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      api,
      query: this.$route.query,
      flag: false,
      data: {},
      baseInfo: this.$route.query,
      totalCount: 0,
      selectform: {
        termsType: '1',
        printRange: '3'
        // page: {
        //   startPage: '',
        //   endPage: ''
        // },
        // pageNumber: {
        //   startPageNumber: ''
        // }
      }
      // pageFormRules: {
      //   startPage: [{validator: validatePass0}],
      //   endPage: [{validator: validatePass}]
      // },
      // pageNumberFormRules: {
      //   startPageNumber: [{validator: validatePass1}]
      // }
    }
  },
  watch: {
    '$route.query' (val) {
      this.baseInfo = val
    },
    'visible' (val) {
      if (val) {
      }
      this.flag = val
    },
    'selectform.termsType' (val) {
      // this.getTotalCount()
    },
    'selectform.printRange' (val) {
      // this.selectform.page.startPage = ''
      // this.selectform.page.endPage = ''
      // this.selectform.pageNumber.startPageNumber = ''
      // this.$refs['pageForm'].resetFields()
      // this.$refs['pageNumberForm'].resetFields()
    },
    // 'selectform.page' (val) {
    //   this.selectform.printRange = '2'
    // },
    // 'selectform.pageNumber' (val) {
    //   this.selectform.printRange = '3'
    // },
    'flag' (val) {
      this.$emit('update:visible', val)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.selectform.termsType = '1'
      this.selectform.printRange = '3'
      // this.selectform.page.startPage = ''
      // this.selectform.page.endPage = ''
      // this.selectform.pageNumber.startPageNumber = ''
      // this.getTotalCount()
    },
    getTotalCount () {
      let obj = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        doctorType: 1,
        adviceType: [],
        status: '',
        termType: [this.selectform.termsType]
      }
      phrapi.queryHospitalAdviceByHospitalNumber(obj).then(res => {
        if (res && res.length) {
          this.totalCount = res.length
        } else {
          this.totalCount = 0
        }
      })
    },
    close () {
      this.flag = false
    },
    afterSelect () {
      // let isValidate = false
      // if (this.selectform.printRange === '2') {
      // this.$refs['pageForm'].validate((valid) => {
      //   if (valid) {
      //     isValidate = true
      //   } else {
      //     return false
      //   }
      // })
      // } else if (this.selectform.printRange === '3') {
      //   this.$refs['pageNumberForm'].validate((valid) => {
      //     if (valid) {
      //       isValidate = true
      //     } else {
      //       return false
      //     }
      //   })
      // }
      // if (isValidate || this.selectform.printRange !== '2') {
      // let start = this.selectform.page.startPage || this.selectform.pageNumber.startPageNumber
      // let end = ''
      // if (this.selectform.printRange === '2') {
      //   end = this.selectform.page.endPage - start + 1
      // } else if (this.selectform.printRange === '3') {
      //   end = this.totalCount - start + 1
      // }
      let obj = {
        params: {
          hospitalizedNumber: this.printInfo && this.printInfo.hospitalizedNumber || this.query.hospitalizedNumber,
          patientId: this.printInfo && this.printInfo.patientId || this.query.patientId,
          termType: this.selectform.termsType
        },
        printParams: {
          printFrom: this.selectform.printRange === '3',
          preview: this.selectform.printRange === '3'
        }
      }
      if (this.selectform.termsType === '1') {
        obj.code = 'ZY_CPOE_CHANG_QI_YI_ZHU_DAN'
      } else {
        obj.code = 'ZY_CPOE_LIN_SHI_YI_ZHU_DAN'
      }
      singlePrint(obj.code, obj.params, obj.printParams)
      this.flag = false
      // }
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-oudepart {
  /deep/ .el-dialog__footer{
    border-top:none;
  }
  button {
    padding-left: 15px;
    padding-right: 15px;
  }
}
.pagenumber {
  width: 50px;
  margin: 0 10px;
}
.curchange .el-input__inner {
  border: 1px solid #1c7bef !important;
  border-color: #1c7bef !important;
}
.printRangeRadio .el-radio .el-radio__input {
  float: left;
  margin-top: 13px;
}
.printRangeRadio .el-radio .el-radio__label {
  float: left;
}
.printRangeRadio .el-radio .el-radio__label .el-form-item__error {
  left: 23px;
}
.printRangeRadio .el-radio .el-radio__label .speLeft .el-form-item__error {
  left: 38px;
}
</style>

