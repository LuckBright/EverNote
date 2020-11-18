<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-row style="margin-bottom: 0">
      <el-col :span="24">
        <el-radio-group v-model="isAllergicHis">
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">否认</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-for="(item, i) in input" :key="i" style="margin-top:22px" v-if="isAllergicHis">
      <el-col :span="6">
        <sys-type
          code="CV05.01.038"
          placeholder="请选择过敏源"
          :filterable="true"
          :disabled="!isAllergicHis"
          v-model="item.allergen">
        </sys-type>
      </el-col>
      <el-col :span="12">
        <el-input placeholder="请填写备注" :disabled="!isAllergicHis" v-model="item.remark" :maxlength="50"></el-input>
      </el-col>
      <el-col :span="4" align="right">
        <i class="iconfont icon-delete fl" @click="delAllergyItem(i)" v-if="i > 0"></i>
        <i class="iconfont icon-tianjia fl" style="margin-left: 10px;" @click="addAllergyItem(i)" v-if="(i + 1) === (input.length) && isAllergicHis"></i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['value', 'hasAllergicHis'],
    data () {
      return {
        input: this.value || [],
        disabled: true
      }
    },
    created () {
      if (!this.value) {
        this.addAllergyItem()
      }
    },
    methods: {
      addAllergyItem () {
        this.input.push({allergen: '', remark: ''})
      },
      delAllergyItem (i) {
        this.input.splice(i, 1)
      }
    },
    watch: {
      'value' (val) {
        this.input = val
      },
      'input': {
        handler (val) {
          this.$emit('update:value', val)
        },
        deep: true
      },
      'hasAllergicHis' (val) {
        this.isAllergicHis = val
        if (!val) {
          this.input = [{allergen: '', remark: ''}]
        }
      }
    },
    computed: {
      isAllergicHis: {
        set (val) {
          this.$emit('update:hasAllergicHis', val)
        },
        get () {
          return this.hasAllergicHis
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .iconfont{
      color: #aaa;
    }
  }
</style>
