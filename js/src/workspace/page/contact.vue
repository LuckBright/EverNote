<template>
  <div style="overflow:hidden;padding-right:10px" class="contacts">
    <el-row :gutter="10" v-for="(item, i) in value" :key="i" style="margin-bottom:10px">
      <el-col :span="5" class="relation">
        <sys-type
          code="GBT.4761"
          placeholder="选择关系"
          :filterable="true"
          useValue="true"
          v-model="item.type">
        </sys-type>
      </el-col>
      <el-col :span="6" class="mobile">
        <el-input placeholder="请输入联系方式" v-model="item.mobile" :maxlength="11"></el-input>
      </el-col>
      <el-col :span="4" v-if="Number(item.type) !== 1">
        <el-input placeholder="姓名" v-model="item.name"></el-input>
      </el-col>
      <el-col :span="6" align="right" class="addwar">
        <i class="iconfont icon-delete fl" @click="delContacts(i)" v-if="value.length !== 1"></i>
        <i class="iconfont icon-tianjia fl" style="margin-left: 10px;" @click="addContacts(i)" v-if="(i + 1) === (value.length)">联系人</i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data () {
      return {
      }
    },
    created () {
      if (!this.value) {
        this.addContacts()
      }
    },
    methods: {
      addContacts () {
        this.value.push({type: '', mobile: '', name: ''})
      },
      delContacts (i) {
        this.value.splice(i, 1)
      }
    },
    watch: {
      'value': {
        handler (val) {
          this.$emit('update:value', val)
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  .contacts .addwar{height: 36px;line-height: 36px;}
  .contacts .addwar .icon-tianjia{font-size: 14px;color: #1C7BEF;}
  .contacts .mobile{margin-left: -11px;}
  .contacts .mobile .el-input__inner{border-radius: 0 4px 4px 0;}
  .contacts .relation .el-input__inner{border-radius: 4px 0 0 4px;}
</style>
