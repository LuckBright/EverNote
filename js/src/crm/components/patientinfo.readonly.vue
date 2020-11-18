<template>
  <div id="patientreadonly">
    <ever-form2 :schema="schema" v-model="obj" :span="24" label-position="right" label-width="78px">
      <div slot="default"></div>
      <template slot="sex">
        <sys-value type="GBT.2261.1" :code="obj.sex"></sys-value>
      </template>
      <template slot="birthday">
        <el-form-item style="max-height:40px;">
          <span>
            {{obj.birthday || '无'}}
            <i class="icon iconfont icon-bis" v-if="isBirthday"></i>
          </span>
        </el-form-item>
      </template>
      <template slot="country">
        <sys-value type="GBT.2659" :code="obj.country"></sys-value>
      </template>
      <template slot="no">
        <span v-if="obj.visitCards && obj.visitCards.length">{{obj.visitCards[0].no}}</span>
        <span v-else>无</span>
      </template>
      <template slot="nation">
        <sys-value type="GBT.3304" :code="obj.nation"></sys-value>
      </template>
      <template slot="marry">
        <sys-value type="GBT.2261.2" :code="obj.marry"></sys-value>
      </template>
      <template slot="medicalType">
        <sys-value type="THC_CRM_INSURE" :code="obj.medicalType"></sys-value>
      </template>
      <template slot="address">
        <ever-address v-model="obj.address" :convertToFnt="true"></ever-address>
      </template>
    </ever-form2>
    <div class="editbutton">
      <el-button type="text" @click="$emit('changeEdit')" v-if="isShow">编辑</el-button>
    </div>
    <div class="photo">
      <img :src="obj.avatarPic ? $ever.imgurl + obj.avatarPic : previews" />
    </div>
  </div>
</template>
<script>
let schema = [
  {
    name: 'name',
    label: '姓名',
    comp: 'readonlyitem',
    span: 18
  },
  {
    name: 'sex',
    comp: 'custom',
    label: '性别'
  },
  {
    name: 'mobile',
    label: '手机号',
    comp: 'readonlyitem'
  },
  {
    name: 'idNo',
    span: 24,
    label: '身份证',
    comp: 'readonlyitem'
  },
  {
    name: 'birthday',
    comp: 'custom',
    span: 24,
    label: '出生日期'
  },
  {
    name: 'country',
    label: '国籍',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'no',
    label: '卡号',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'nation',
    label: '民族',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'marry',
    label: '婚姻',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'medicalType',
    label: '医保',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'kinship',
    label: '关系',
    span: 24,
    comp: 'readonlyitem'
  },
  {
    name: 'sourceName',
    label: '渠道来源',
    span: 24,
    comp: 'readonlyitem'
  },
  {
    name: 'address',
    comp: 'custom',
    label: '住址',
    span: 24
  }
]
export default {
  props: ['obj', 'isBirthday', 'isShow', 'cityData'],
  data () {
    let obj1 = this.$ever.createObjFromSchema(schema)
    return {
      obj1,
      schema,
      address: '',
      previews: '/static/assets/avtarbg.png'
    }
  },
  watch: {
    'obj': {
      handler: function (val) {
        Object.assign(this.obj1, val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.body .photo {
  width: 70px;
  height: 70px;
  position: absolute;
  right: 0px;
  top: 40px;
  z-index: 999;
}
.body .photo img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.editbutton {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0px;
  top: -3px;
  z-index: 999;
}
.icon-bis {
  color: #f5a623;
  margin-left: 2px;
  position: relative;
  top: -2px;
}
#patientreadonly /deep/ .el-form-item {
  margin-bottom: 0px !important;
}
#patientreadonly /deep/ .el-form-item__label {
  height: 30px;
}
#patientreadonly /deep/ .el-form-item__content {
  line-height: 30px;
}
</style>
