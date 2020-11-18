<!--
demo: 集成到everform2
{
  name: 'thcClinics',
  label: '大屏适用诊间(thc)',
  comp: 'sysSingleMulti',
  span: 12,
  props: {
    placeholder: '请输入thc诊间名称',
    initOptions: [],
    multiple: true, // 多選
    filterable: true,  // 可輸入过滤内容
    isGroupShow: false, // ？？ 小熊加的不知道控制啥的
    sum: 4  // 最大数量
  }
},
-->
<template>
  <div class="singleormulti">
    <!-- v-if="!multiple" -->
    <el-select  v-model="select" style="width: 100%"
      :placeholder="placeholder || defaultplaceholder"
      :value-key="useObject ? 'id' : 'value'"
      :disabled="disabled"
      filterable
      :clearable="clearable ? false : true"
      ref="systype"
      v-bind="{'multiple': multiple ? true : false}"
      :default-first-option="true"
      @change="change">
    <el-option
      v-for="(option, index) in options"
      :key="option.id + '_' + index"
      :label="option.name"
      :value="useObject ? option : option.id">
    </el-option>
  </el-select>
  <div class="mt10" v-if="!isGroupShow">
    <el-radio-group v-if="!multiple" v-model="select" :disabled="disabled">
      <el-radio :label="option.id" v-for="option in options" :key="option.id">{{option.name}}</el-radio>
      <el-button class="show" plain type="primary" size="mini" v-if="!disabled && totalCount > SUM" @click="status = !status"><i class="iconfont" :class="status ? 'icon-xia' : 'icon-shang'"></i>{{status ? '更多' : '收起'}}</el-button>
    </el-radio-group>
    <el-checkbox-group v-else v-model="select" :disabled="disabled">
      <el-checkbox :label="option.id" v-for="option in options" :key="option.id">{{option.name}}</el-checkbox>
      <el-button class="show" plain type="primary" size="mini" v-if="!disabled && totalCount > SUM" @click="status = !status"><i class="iconfont" :class="status ? 'icon-xia' : 'icon-shang'"></i>{{status ? '更多' : '收起'}}</el-button>
    </el-checkbox-group>
  </div>
</div>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import { objFind, string2Array } from '@/util/common'
// 显示options数量
const SUM = 20
export default {
  /**
   * isGroupShow      是否显示单选多选框且不限制options数量
   * global           全局物资使用
   * @returns {Arrar} 全局需要返回一个数组[1,2,3,4]，其他的返回字符串1,2,3,4
   */
  props: ['code', 'value', 'type', 'disabled', 'placeholder', 'multiple', 'filterable', 'clearable', 'firstDefault', 'initOptions', 'global', 'isGroupShow', 'sum', 'useObject'],
  data () {
    return {
      SUM: this.sum || SUM,
      totalCount: 0,
      options: [],
      cacheOptions: [],
      status: true,
      defaultplaceholder: '请选择'
    }
  },
  async mounted () {
    if (!this.initOptions) {
      this.cacheOptions = await sysvalue.listOnce(this.code).then(result => {
        return result || []
      })
      if (this.cacheOptions && this.firstDefault) {
        this.select = this.cacheOptions[0].id
      }
    } else {
      this.cacheOptions = this.initOptions
    }
    this.setTotalCount(this.cacheOptions.length)
    this.resetOpt()
    // let el = this.$el
    // let compThis = this
    // el.onkeydown = function (e) {
    //   let keyNum = window.event ? e.keyCode : e.which
    //   if (keyNum === 13) {
    //     compThis.$refs.systype.visible = false
    //     compThis.$refs.systype.hoverIndex = -1
    //   }
    // }
  },
  watch: {
    'status' (val) {
      !val ? this.options = this.cacheOptions : this.resetOpt()
    },
    'initOptions': function (val) {
      if (val) {
        this.cacheOptions = val
        this.resetOpt()
        if (!this.isGroupShow) {
          this.setTotalCount(this.cacheOptions.length)
        }
      }
    },
    'code': function () {
      sysvalue.listOnce(this.code).then(result => {
        this.cacheOptions = result
        this.setTotalCount(this.cacheOptions.length)
      })
    }
  },
  computed: {
    select: {
      set (newVal) {
        const val = this.global ? newVal : newVal ? (this.multiple ? newVal.join(',') : newVal) : ''
        this.$emit('input', val)
        this.$emit('change', val)
      },
      get () {
        let arr = this.multiple && this.value ? string2Array(this.value || '') : []
        return this.multiple ? arr : this.value || ''
      }
    }
  },
  methods: {
    setTotalCount (num) {
      this.totalCount = num
    },
    resetOpt () {
      if (!this.isGroupShow && this.totalCount > this.SUM) {
        this.options = []
        for (let i = 0; i < this.SUM; i++) {
          this.options.push(this.cacheOptions[i])
        }
      } else {
        this.options = this.cacheOptions
      }
    },
    change (val) {
      let optionObj
      if (val) optionObj = objFind(this.options, { id: val })
      this.$emit('change', val, this.objName, optionObj)
    }
  }
}
</script>
<style scoped>
.iconfont {font-size: 12px; margin-right: 8px;}
.singleormulti /deep/ .el-button.show.el-button--text { padding-left: 10px;}
.singleormulti /deep/ .el-radio+.el-radio, .singleormulti /deep/ .el-checkbox+.el-checkbox { margin: 5px; margin-left: 0;}
.singleormulti /deep/ .el-radio, .singleormulti /deep/ .el-radio+.el-radio, .singleormulti /deep/ .el-checkbox, .singleormulti /deep/ .el-checkbox+.el-checkbox { margin-right: 20px; min-width: 60px;}
.singleormulti /deep/ .el-checkbox+.el-checkbox { margin-top: 0; margin-bottom: 0;}
</style>
