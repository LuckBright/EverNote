<template>
  <div class="pl10">
    <ever-form2
      onsubmit="return false;"
      v-model="queryObj"
      ref="form"
      :schema="querySchema"
      :inline="true">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="handler">{{queryBtnName}}</el-button>
        </el-form-item>
      </template>
    </ever-form2>
  </div>
</template>

<script>
export default {
  props: {
    queryBtnName: {
      type: String,
      default: '统计'
    },
    querySchema: {
      type: Array,
      default: () => [{
        name: 'year',
        label: '统计年度',
        comp: 'el-date-picker',
        props: {
          type: 'year'
        }
      }]
    },
    queryTips: {
      type: String,
      default: '统计年度'
    }
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(this.querySchema)
    return {
      queryObj,
    }
  },
  methods: {
    handler () {
      if (!this.queryObj.year) {
        return this.everWarning('请选择' + this.queryTips)
      }
      this.$emit('query', this.$moment(this.queryObj.year).format('YYYY'), this.queryObj)
    }
  }
}
</script>

