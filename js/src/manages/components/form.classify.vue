<!-- 多分类需要选择的情况使用该组件
<form-classify
              :classifyId.sync="classifyId"
              placeholder="请选择人员分类"
              :systemType="systemTypeObject.id"></form-classify>
 -->
<template>
  <el-row class="pr50">
    <el-col :span="12">
      <el-form ref="systemtypeform" :label-width="labelWidth + 'px'" size="small">
        <el-form-item :label="labelText">
          <classify-cascader
            width="300px"
            :systemType="systemType"
            :placeholder="placeholder"
            :data.sync="classifyId"
            :useObject="useObject"
            :multiple="multiple"
          ></classify-cascader>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
import ClassifyCascader from '@/warehouse/page/components/classifycascader'
export default {
  props: {
    systemType: Number, // 业务类型如：人员、物资等
    labelWidth: {
      type: Number,
      default: 180
    },
    labelText: {
      type: String,
      default: '分类'
    },
    useObject: Boolean,
    multiple: Boolean,
    value: String,
    placeholder: String
  },
  data () {
    return {
      classifyId: '',
      classifyObject: null
    }
  },
  watch: {
    classifyId (v) {
      this.$emit('update:classifyId', v.id || v)
      if (v instanceof Object) {
        this.$emit('update:classifyObject', v)
      }
    }
  },
  components: {
    ClassifyCascader
  }
}
</script>
