/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-28 10:43:57
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-29 11:49:34
 * 舍入规则 + 提示信息
 */
<template>
  <div>
    <ever-form2
      class="el-form_width reset-form_content"
      v-model="obj"
      ref="form"
      label-width="70px"
      label-position="left"
      :schema="schema"
      :rules="rules">
      <template slot="ace">
        <ever-select v-model="obj.ace" :options="aceList" width="200px"></ever-select>
        {{obj.ace | formateValueToFnt({list: aceList, showKey: 'desc'})}}
      </template>
      <!-- 保存按钮可以不写，用form默认的。 下面的实现方式是自定义保存按钮。 slot="default" 会替换表单默认的保存与重置按钮-->
      <template slot="default">
        <el-col></el-col>
      </template>
    </ever-form2>
    <div class="l_h" v-html="formateValueToFntLocal(activeName, {list: PRICE_BASE, showKey: 'tips'})">
      <!-- <span class="cGray">注：</span>按维度调价：<span class="font red">{{activeName | formateValueToFnt({list: PRICE_BASE, showKey: 'title'})}}</span>的调整比例，如：注射费基础价格10元，加急调整比例为10%，那么加急价格：10+10*10%=11元 -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ModuleName, Tabs as PRICE_BASE } from './enum'

const schema = [
  {
    name: 'ace',
    comp: 'custom',
    label: '舍入规则',
    props: {
      options: [],
      clearable: false
    }
  },
]
export default {
  props: {
    tips: String
  },
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      PRICE_BASE,
      schema,
      rules: {
        'ace': [{ required: true, message: '请选择舍入规则', trigger: 'change' }],
      }
    }
  },
  computed: {
    ...mapState(ModuleName, {
      activeName: state => state.activeName,
      aceList: state => state.aceList.map(item => ({
        id: item.name,
        name: item.title,
        desc: item.desc
      })),
    })
  },
  methods: {
    formateValueToFntLocal (...args) {
      return this.$filters.formateValueToFnt(...args)
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-form_content {
  /deep/ .el-form-item__content {
    position: absolute!important;
    left: 0;
  }
}
.l_h {
  line-height: 24px;
}
</style>
