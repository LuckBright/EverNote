<!--
  添加联系人组件
  demo: <contacts v-model="obj1.contactList"></contacts>
  params：无
  上面从低10-69行v-if=inline在入院登记页面用做一行的，请各位大佬不要改错了
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="obj"
      style="width:100%;"
      v-for="(temp, index) in obj.relation"
      :key="index"
      :index="index"
      size="small"
      :disabled='disabled'
    >
      <el-row v-if="inline" class="Register">
        <div class="relationship" :class="{error:border}">
          <el-form-item
            :prop="'relation.' + index + '.type'"
            :rules="[{required: isRequire, message: '请选择关系', trigger: 'change'}]"
          >
            <sys-type code="GBT.4761" v-model="temp.type" placeholder="关系"></sys-type>
          </el-form-item>
        </div>
        <div class="component" :class="{error:border}">
          <el-form-item
            :prop="'relation.' + index + '.name'"
            :rules="[{required: isRequire, message: '请填写姓名', trigger: 'change'}]">
            <el-input v-model="temp.name" placeholder="姓名" :maxlength="32"></el-input>
          </el-form-item>
        </div>
        <div class="component" :class="{error:border}">
          <el-form-item
            :prop="'relation.' + index + '.mobile'"
            :rules="[{required: isRequire, message: '请输入手机号', trigger: 'blur'},
                    { min: 11, max: 13, message: '请输入11位手机号码', trigger: 'blur' }
                  ]"
          >
            <el-input
              v-model.trim="temp._mobile"
              placeholder="请输入手机号"
              v-on:input="inputTrigger(index)"
            ></el-input>
          </el-form-item>
        </div>
        <div class="component idNo">
          <el-form-item
            :prop="'relation.' + index + '.idNo'"
            :rules="[{required: false, message: '请输入身份证号', trigger: 'blur'},
                    { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码' }]"
          >
            <el-input v-model.trim="temp.idNo" placeholder="身份证号">
              <template slot="suffix" v-if="!disabled">
                <idcard-read @getData="(data) => { autoReadIdCard(data, index) }"></idcard-read>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="component" v-if="othersShowType != 'hidden'">
          <el-form-item
            :prop="'relation.' + index + '.otherType'"
            :rules="[{required: false, trigger: 'change'}]"
          >
            <div class="component">
              <sys-type
                code="CV02.01.101"
                v-model="temp.otherType"
                :use-value="true"
                style="margin-right: 10px"
                :placeholder="'其他证件'"
              ></sys-type>
            </div>
          </el-form-item>
        </div>
        <div class="component" v-if="othersShowType != 'hidden'">
          <el-form-item
            :prop="'relation.' + index + '.otherNo'"
            :rules="[{required: false, trigger: 'change'}]"
          >
            <el-input v-model="temp.otherNo" placeholder="证件号码"></el-input>
          </el-form-item>
        </div>
        <div class="component" style="margin-bottom:0;" v-if="othersShowType != 'hidden'">
          <el-form-item
            :prop="'relation.' + index + '.address'"
            :rules="{required: false, trigger: 'change'}"
          >
            <everAddress v-model="temp.address"></everAddress>
          </el-form-item>
        </div>
        <div class="component">
          <el-form-item prop="btnName">
            <el-button type="text" v-if="index == 0 && add" @click="addrow">
              <i class="iconfont icon-tianjia"></i>
            </el-button>
            <el-button type="text" v-if="index > 0" @click="delrow(index)">
              <i class="iconfont icon-delete"></i>
            </el-button>
          </el-form-item>
        </div>
      </el-row>
      <div v-else class="forHosRegister">
        <el-row class="mb10">
          <el-col :span="3" :class="{error:border}">
            <el-form-item
              :prop="'relation.' + index + '.type'"
              :rules="[{required: isRequire, message: '请选择关系', trigger: 'change'}]"
            >
              <sys-type code="GBT.4761" v-model="temp.type" placeholder="关系"></sys-type>
            </el-form-item>
          </el-col>
          <el-col :span="3" :class="{error:border}" style="margin-left:10px;">
            <el-form-item
              :prop="'relation.' + index + '.name'"
              :rules="[{required: isRequire, message: '请填写姓名', trigger: 'change'}]"
            >
              <el-input v-model="temp.name" placeholder="姓名" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3"></el-col>
          <el-col :span="4" :class="{error:border}" style="margin-left:10px;">
            <el-form-item
              :prop="'relation.' + index + '.mobile'"
              :rules="[
                { required: isRequire, message: '请输入手机号', trigger: 'blur' },
                { min: 10, max: 13, message: '请输入11位手机号码', trigger: 'blur' }
              ]"
            >
              <el-input
                v-model.trim="temp._mobile"
                placeholder="请输入手机号"
                v-on:input="inputTrigger(index)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="padding-left:10px;">
            <el-form-item
              :prop="'relation.' + index + '.idNo'"
              :rules="[
                { required: false, message: '请输入正确的身份证号码', trigger: 'blur'},
                { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码' }]"
            >
              <el-input v-model.trim="temp.idNo" placeholder="身份证号">
                <template slot="suffix" v-if="!disabled">
                  <idcard-read @getData="(data) => { autoReadIdCard(data, index) }"></idcard-read>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            style="margin-left:10px;"
            v-if="!temp.down && othersShowType == 'down'"
          >
            <el-form-item prop="btnName">
              <el-button type="text" @click="down(index,true)" v-if="othersShowType == 'down'">
                <i class="iconfont icon-xia"></i>
              </el-button>
              <el-button type="text" v-if="index == 0 && add" @click="addrow">
                <i class="iconfont icon-tianjia"></i>
              </el-button>
              <el-button type="text" v-if="index > 0" @click="delrow(index)">
                <i class="iconfont icon-delete"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mb10" v-show="temp.down || othersShowType != 'down'">
          <el-col :span="5">
            <el-form-item
              :prop="'relation.' + index + '.otherType'"
              :rules="{required: false, trigger: 'change'}"
            >
              <el-col :span="24">
                <sys-type
                  code="CV02.01.101"
                  v-model="temp.otherType"
                  :use-value="true"
                  style="width: 100%;margin-right: 10px"
                  :placeholder="'其他证件'"
                ></sys-type>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="9" style="margin-left:15px;">
            <el-form-item
              :prop="'relation.' + index + '.otherNo'"
              :rules="{required: false, trigger: 'change'}"
            >
              <el-input v-model="temp.otherNo" placeholder="证件号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="temp.down || othersShowType != 'down'">
          <el-col :span="16">
            <el-form-item
              :prop="'relation.' + index + '.address'"
              :rules="{required: false, trigger: 'change'}"
            >
              <everAddress v-model="temp.address"></everAddress>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left:10px;">
            <el-form-item prop="btnName">
              <el-button type="text" @click="down(index,false)" v-if="othersShowType == 'down'">
                <i class="iconfont icon-shang"></i>
              </el-button>
              <el-button type="text" v-if="index == 0 && add" @click="addrow">
                <i class="iconfont icon-tianjia"></i>
              </el-button>
              <el-button type="text" v-if="index > 0" @click="delrow(index)">
                <i class="iconfont icon-delete"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import { validateMobile } from '@/crm/util/common'
import { MOBILE_PATRN_MEMBER } from '@/util/validate'
import idcardRead from '@/components/readdevice/idcard/idcard'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    inline: { // 是否在一行显示
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    othersShowType: { // 其他证件以及地址显示样式() show--正常显示(默认)  hidden--隐藏(只针对单行模式） down--下拉展开（只针对多行模式）
      type: String,
      default: 'show'
    },
    add: { // 是否可以添加多个
      type: Boolean,
      default: true
    },
    isRequire: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let emptyObj = [
      {
        type: '',
        name: '',
        mobile: '',
        idNo: '',
        otherType: '',
        otherNo: '',
        _mobile: ''
      }
    ]
    let obj = {
      relation: JSON.parse(JSON.stringify(emptyObj))
    }
    return {
      index: 0,
      obj,
      relationTypes: [],
      emptyObj,
      MOBILE_PATRN_MEMBER
    }
  },
  watch: {
    'obj.relation': {
      handler (newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  created () {
    this.setObj()
  },
  methods: {
    down (index, type) {
      this.$set(this.obj.relation[index], 'down', type)
    },
    setObj (val) {
      if (val && val.length > 0) {
        val.map((item) => {
          if (item.mobile && item.mobile.length === 11) {
            item._mobile = item.mobile.substr(0, 3) + '-' + item.mobile.substr(3, 4) + '-' + item.mobile.substr(7)
          }
        })
        this.obj.relation = JSON.parse(JSON.stringify(val))
      } else {
        if (this.value && this.value.length > 0) {
          this.value.map((item) => {
            if (this.othersShowType === 'down') {
              item.down = false
            }
            if (item.mobile && item.mobile.length === 11) {
              item._mobile = item.mobile.substr(0, 3) + '-' + item.mobile.substr(3, 4) + '-' + item.mobile.substr(7)
            }
          })
          this.obj.relation = JSON.parse(JSON.stringify(this.value))
        } else {
          this.obj.relation = JSON.parse(JSON.stringify(this.emptyObj))
        }
      }
    },
    addrow () {
      if (this.obj.relation.length < 5) {
        let obj = {
          type: '',
          name: '',
          mobile: '',
          idNo: '',
          otherType: '',
          otherNo: '',
          _mobile: ''
        }
        if (this.othersShowType === 'down') {
          obj.down = false
        }
        this.obj.relation.push(obj)
      } else {
        this.$notify({
          type: 'warning',
          message: '最多添加5个联系人'
        })
      }
    },
    delrow (index) {
      this.obj.relation.splice(index, 1)
    },
    // 读取身份证信息回显数据。
    autoReadIdCard (data, index) {
      this.obj.relation[index].idNo = data.idCode
      this.obj.relation[index].name = data.name
    },
    inputTrigger (index) {
      const temp = this.obj.relation[index]
      const val = temp._mobile.replace(/-/g, '').substr(0, 11)
      this.$set(this.obj.relation[index], `_mobile`, validateMobile(temp._mobile))
      if (val.length === 11) {
        if (!MOBILE_PATRN_MEMBER.test(val)) {
          temp.mobile = ''
          this.$set(this.obj.relation[index], `_mobile`, '')
        } else {
          temp.mobile = val
          this.$set(this.obj.relation[index], `_mobile`, validateMobile(temp._mobile))
          // mapi.checkMobile({ 'mobile': val }).then(rs => {
          //   if (rs.head.errCode === 0 && rs.data) {
          //     this.$set(this.obj.relation[index], `_mobile`, '')
          //     temp.mobile = ''
          //     this.$messageTips(this, 'warning', '手机号重复')
          //   }
          // })
        }
      }
    }
  },
  components: {
    idcardRead
  }
}
</script>
<style scoped>
.forHosRegister .el-form-item,
.Register .el-form-item {
  margin-bottom: 0;
}
.forHosRegister /deep/ .el-button,
.Register /deep/ .el-button {
  padding: 0;
}
.relation .el-row {
  height: 36px;
  margin-bottom: 22px;
}
.relation .el-row:last-child {
  margin-bottom: 0px;
}
.relationship {
  float: left;
}
.component {
  float: left;
  margin-left: 5px;
}
.forHosRegister .error /deep/ .el-input__inner {
  background: #fef5be;
}
/* 以下为入院登记页面的样式 */
.Register {
  display: flex;
}
.Register .el-row {
  height: 32px;
}
.Register .idNo /deep/ .el-input__inner {
  padding-right: 30px;
}
</style>
