<template>
  <div>
    <el-form ref="form" class="switchlist" :label-width="labelWitdh">
      <el-form-item :label="item.label" v-for="(item, index) in schemaList" :key="index">
        <span v-if="item.comp && item.comp === 'custom'">
          <slot :name="item.slotName"></slot>
        </span>
        <el-switch
          v-else
          v-model="obj[item.name]"
          :disabled="item.disabled"
          :active-text="item.activeText"
          :active-value="item.activeValue"
          :inactive-value="item.inactiveValue"
          :inactive-text="item.inactiveText">
        </el-switch>
        <slot :name="item.slot"></slot>
        <div v-if="item.note">
          <span class="color66" v-html="item.note"></span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    schemaList: {
      type: Array,
      default: () => ([])
    },
    value: [Object, String],
    labelWitdh: {
      type: String,
      default: '200px'
    }
  },
  data () {
    return {
      obj: this.value
    }
  },
  watch: {
    value: {
      handler (v) {
        this.obj = v
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.switchlist{
  /deep/ .el-form-item__label{
    font-weight: bold;
  }
  /deep/ .el-form-item__content{
    line-height: 30px;
  }
  .color66{
    color: #666;
    line-height: 20px;
  }
}
</style>
