<template>
  <div>
    <ever-bread-crumb :name="'客户查重'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div>
      <div class="bg pdt20">
        <h4 class="pdlr20">最优记录</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          class="pd20"
          label-position="right"
        >
          <div slot="default"></div>
          <template slot="idNo">
            <el-input v-if="obj.idNo === '' || obj.idNo === null " v-model="obj.idNo"></el-input>
            <el-input v-else v-model="obj.idNo" :disabled="obj.idNo && obj.idNo.length === 18"></el-input>
          </template>
          <template slot="socialSecurityNo">
            <el-input
              v-if="obj.socialSecurityNo === '' || obj.socialSecurityNo === null "
              v-model="obj.socialSecurityNo"
              type="number"
            ></el-input>
            <el-input
              v-else
              v-model="obj.socialSecurityNo"
              :disabled="obj.socialSecurityNo && obj.socialSecurityNo.length === 18"
              type="number"
            ></el-input>
          </template>
          <template slot="passportNo">
            <el-input
              v-if="obj.passportNo === '' || obj.passportNo === null "
              v-model="obj.passportNo"
            ></el-input>
            <el-input
              v-else
              v-model="obj.passportNo"
              :disabled="obj.passportNo && obj.passportNo.length === 9"
            ></el-input>
          </template>
        </ever-form2>
        <el-row>
          <el-col :span="24">
            <div class="detail-war" v-show="infoDetailShowFlag">
              <ever-form2
                :schema="schema1"
                v-model="obj1"
                :api="api"
                class="pd20"
                label-position="right"
              >
                <div slot="default"></div>
              </ever-form2>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <a
              href="javascript:;"
              class="bottom-btn more"
              :class="infoDetailShowFlag ? 'on' : ''"
              @click="infoDetailShow()"
            >详细信息</a>
          </el-col>
        </el-row>
        <div class="pd20">
          <h4>最优记录</h4>
          <el-row>
            <el-col :span="24">
              <el-table @selection-change="handleSelectionChange" :data="tableData" border>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="最优记录" width="120" align="center">
                  <template slot-scope="scope">
                    <el-radio
                      :label="scope.row.id"
                      v-model="radioed"
                      @change="changeRadio(scope.row)"
                    >&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  label="相似度"
                  width="120"
                  align="center"
                  :cell-style="'background-color:green;'"
                >
                  <template slot-scope="scope">{{scope.row.prisimilarity || '--'}}</template>
                </el-table-column>
                <el-table-column label="姓名" width="140">
                  <template slot-scope="scope">
                    <label
                      v-if="scope.row.member && scope.row.member.labelColor"
                      :style="'font-weight:bold;color:' + scope.row.member.labelColor"
                    >{{scope.row.name}}</label>
                    <label v-else>{{scope.row.name}}</label>
                  </template>
                </el-table-column>
                <el-table-column label="性别" align="center" width="100">
                  <template slot-scope="scope">
                    <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column label="出生日期" align="center" width="120">
                  <template slot-scope="scope">{{scope.row.birthday || '--'}}</template>
                </el-table-column>
                <el-table-column label="年龄" align="center" width="120" prop="ageShowText"></el-table-column>
                <el-table-column label="手机号" align="center" width="120">
                  <template slot-scope="scope">{{scope.row.mobile || '--'}}</template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="身份证号"
                  prop="idNo"
                  align="center"
                  min-width="160"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="社保卡号"
                  prop="socialSecurityNo"
                  align="center"
                  min-width="160"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="护照号"
                  prop="passportNo"
                  align="center"
                  min-width="160"
                ></el-table-column>
                <el-table-column show-overflow-tooltip label="居住地址" align="center" width="180">
                  <template
                    slot-scope="scope"
                  >{{scope.row.address && JSON.parse(scope.row.address).addressDetail || '--'}}</template>
                </el-table-column>
                <el-table-column label="户口地址" align="center" width="180">
                  <template
                    slot-scope="scope"
                  >{{scope.row.householdAddress && JSON.parse(scope.row.householdAddress).householdAddressDetail || '--'}}</template>
                </el-table-column>
                <el-table-column label="国家" align="center" width="180">
                  <template slot-scope="scope">
                    <sys-value type="GBT.2659-2000" :code="scope.row.country"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column label="民族" align="center" width="180">
                  <template slot-scope="scope">
                    <sys-value type="GBT.3304" :code="scope.row.nation"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column label="出生地" align="center" width="180">
                  <template
                    slot-scope="scope"
                  >{{scope.row.birthAddress && JSON.parse(scope.row.birthAddress).householdAddressDetail || '--'}}</template>
                </el-table-column>
                <el-table-column label="身高" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.height || '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="血型" align="center" width="180">
                  <template slot-scope="scope">
                    <sys-value type="CV04.50.005" :code="scope.row.bloodType"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column label="行政职称" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.career || '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="工作单位" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.company || '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="婚姻状况" align="center" width="180">
                  <template slot-scope="scope">
                    <sys-value type="GBT.2261.2" :code="scope.row.marry"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column label="微信号" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.member ? scope.row.member.labelNames : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="微博" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.member ? scope.row.member.labelNames : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="QQ" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.member ? scope.row.member.labelNames : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Email" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.member ? scope.row.member.labelNames : '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="mgl20">
          <el-button type="primary" @click="save">确认关联</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/empiapi'
import { ageShow } from '@/util/common'
export default {
  data () {
    let schema = [
      {
        name: 'name',
        label: '姓名',
        props: {
          disabled: true
        },
        span: 8
      },
      {
        name: 'sex',
        label: '性别',
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.1',
          disabled: true,
          useValue: true
        },
        span: 8
      },
      {
        name: 'birthday',
        label: '出生日期',
        comp: 'ever-select',
        props: {
          disabled: true,
          options: []
        },
        span: 8
      },
      {
        name: 'idNo',
        label: '身份证号',
        palcehoder: '请输入',
        comp: 'custom',
        span: 8
      },
      {
        name: 'socialSecurityNo',
        label: '社保卡号',
        comp: 'custom',
        span: 8
      },
      {
        name: 'passportNo',
        label: '护照号',
        comp: 'custom',
        span: 8
      },
      {
        name: 'mobile',
        label: '手机号',
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '40px'
        },
        span: 16
      },
      {
        name: 'address',
        label: '居住地址',
        comp: 'everAddress',
        span: 24
      },
      {
        name: 'householdAddress',
        comp: 'everAddress',
        span: 24,
        label: '户口地址'
      }
    ]
    let schema1 = [
      {
        name: 'country',
        label: '国家',
        comp: 'sys-type',
        props: {
          code: 'GBT.2659-2000'
        },
        span: 8
      },
      {
        name: 'nation',
        label: '民族',
        comp: 'sys-type',
        props: {
          code: 'GBT.3304'
        },
        span: 8
      },
      {
        name: 'marry',
        comp: 'sys-type',
        span: 8,
        props: {
          code: 'GBT.2261.2'
        },
        label: '婚姻状况'
      },
      {
        name: 'career',
        label: '行政职称',
        span: 8
      },
      {
        name: 'company',
        label: '工作单位',
        span: 8
      }
    ]
    let schema2 = [
      {
        name: 'providerId',
        label: '前缀',
        comp: 'el-input',
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      },
      {
        name: 'infectedPatchId',
        label: '应用标识',
        comp: 'ever-select',
        props: {
          options: []
        },
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      },
      {
        name: 'status',
        label: '业务类型',
        comp: 'ever-select',
        props: {
          options: []
        },
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      },
      {
        name: 'status',
        label: '日期',
        comp: 'ever-select',
        props: {
          options: []
        },
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      },
      {
        name: 'status',
        label: '流水号',
        comp: 'ever-select',
        props: {
          options: []
        },
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      },
      {
        name: 'status',
        label: '后缀',
        comp: 'ever-select',
        props: {
          options: []
        },
        span: 8
      },
      {
        comp: 'div',
        style: {
          height: '50px'
        },
        span: 16
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    let obj1 = this.$ever.createObjFromSchema(schema1)
    let obj2 = this.$ever.createObjFromSchema(schema2)
    return {
      api,
      schema,
      schema1,
      schema2,
      obj,
      obj1,
      obj2,
      pagesize: 10,
      radioed: false,
      infoDetailShowFlag: false,
      relationTypes: [],
      tableData: [],
      tempSelect: [],
      relateIds: [],
      ageShow,
      tempIdno: '',
      rules: {
        mobile: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^1[345678]\d{9}$/, message: '请输入正确的手机号码' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let obj = {}
      obj['id'] = this.$route.query.id
      obj['repeatType'] = Number(this.$route.query.type)
      obj['pagesize'] = this.pagesize
      this.api.getReapet(obj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
          this.obj = rs.data[0]
          this.obj1 = rs.data[0]
          this.radioed = rs.data[0].id
        }
      })
    },
    save () {
      this.relateIds = []
      this.tempSelect && this.tempSelect.forEach(rs => {
        this.relateIds.push(rs.id)
      })
      this.obj.relateIds = this.relateIds
      this.api.relate(this.obj).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            type: 'success',
            message: '关联成功'
          })
          this.$router.push({ path: 'repeatmember' })
        }
      })
    },
    infoDetailShow () {
      this.infoDetailShowFlag = !this.infoDetailShowFlag
    },
    handleSelectionChange (val) {
      this.tempSelect = val
    },
    changeRadio (val) {
      this.obj = val
      this.obj1 = val
    }
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
}
.pdlr20 {
  padding: 0px 20px;
}
.mgl20 {
  margin-left: 20px;
  padding-bottom: 20px;
}
.pdt20 {
  padding-top: 20px;
}
</style>
