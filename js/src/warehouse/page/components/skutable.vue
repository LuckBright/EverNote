<template>
<span>
    <span v-if="data.type == GLOBAL_ATTR[1].id || data.type == GLOBAL_ATTR[0].id || data.checkCode" :class="{'is-required': data.isMust}">
      <el-input
        :type="data.type == GLOBAL_ATTR[1].id ? 'textarea' : 'text'"
        v-model="text"
        :disabled="objId && data.globalFlag && text ? true : false"
        :placeholder="data.label"
      ></el-input>
    </span>
    <span v-else-if="data.type == GLOBAL_ATTR[2].id || data.type == GLOBAL_ATTR[3].id" :class="{'is-required': data.isMust}">
      <el-select
        v-model="text"
        filterable
        :default-first-option="true"
        :multiple="data.type == GLOBAL_ATTR[3].id ? true : false"
        placeholder="请选择"
        style="width:100%"
        :disabled="objId && data.globalFlag && text ? true : false"
      >
        <el-option v-for="item in data.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </span>
    <span v-else-if="data.type == GLOBAL_ATTR[4].id" :class="{'is-required': data.isMust}">
      <el-input
        type="number"
        v-model="text"
        :disabled="objId && data.globalFlag && text ? true : false"
        :placeholder="data.label"
      ></el-input>
    </span>
    <span v-else-if="data.type == GLOBAL_ATTR[5].id && !data.checkCode" :class="{'is-required': data.isMust}">
      <sys-remote-select
        :apiUrl="data.apiUrl"
        v-model="text"
        style="width:100%"
        :disabled="objId && data.globalFlag && text ? true : false"
      ></sys-remote-select>
    </span>
    <span v-else-if="data.type == GLOBAL_ATTR[6].id" :class="{'is-required': data.isMust}">
      <date-picker
        v-model="text"
        :disabled="objId && data.globalFlag && text ? true : false"
        type="date"
        outformat="yyyy-MM-dd"
      ></date-picker>
    </span>
    <span v-else-if="data.type == GLOBAL_ATTR[10].id" :class="{'is-required': data.isMust}">
      <ever-address
        :disabled="objId && data.globalFlag && text ? true : false"
        v-model="text"
        :showDetialAddr="true"
      ></ever-address>
    </span>
  </span>
</template>
<script>
import { GLOBAL_ATTR, CHECK_CODE } from '@/util/common.js'
export default {
  props: ['data', 'value', 'objId', 'certainly'],
  data () {
    return {
      GLOBAL_ATTR,
      CHECK_CODE,
      text: this.value
    }
  },
  watch: {
    'value': function () {
      this.text = this.value
    },
    'text': function () {
      this.$emit('input', this.text)
      this.$emit('change', this.text)
    }
  },
  methods: {
    getParamsKey (key) {
      return key
    },
  }
}
</script>
<style scoped>
.star {
  position: relative;
}
/* .star::before {
  content: "*";
  color: red;
  position: absolute;
  top: 8px;
  left: -10px;
} */
</style>
