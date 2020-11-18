<!-- 编辑发药任务 -->
<template>
  <ever-form2
    class="custom-form"
    :schema="schema"
    size="mini"
    label-width="80px"
    v-model="obj"
    ref="form">
    <!-- this.dispenseDetail 是否打印药签  库房配置项 -->
    <template slot="drugLable" v-if="dispenseDetail && notChineseMedicine">
      <el-button
        type="primary"
        v-ever-click-once="disabledPrint"
        :disabled="disabledPrint"
        @click="runPrint">补打药签</el-button> <span class="cGray ml10">注：本功能只单独针对一个药品补打药签</span>
    </template>
    <template slot="identification">
      <el-checkbox
        v-model="obj.identification"
        @change="markAbnormalHandler"
        :true-label="1"
        :false-label="0">标记异常</el-checkbox>
      <template>
        <el-container class="select-abnormal page_layout_full_hidden" v-show="obj.identification">
          <el-main class="border-main p0i main page_layout_full_hidden">
            <el-container class="flex_column_full_hidden">
              <el-header height="260px" class="padd10 bor_bom_1 flex_scroll" id="treeBox">
                <common-tree id="commonTree" :api="api" :isSelectAdd="true" @thisSelectData="addSelect" :statusType="1"></common-tree>
              </el-header>
              <el-main class="main">
                <el-container class="page_layout_full_hidden">
                  <el-main class="flex_column_full_hidden">
                    <el-container class="flex_column_full_hidden bg_col_01 padd10">
                      <el-main class="main flex_scroll" id="abnormally">
                          <transition-group name="list" tag="ul" class="ul">
                            <li class="df" v-for="(item, index) in abnormalListData" :key="item.id ">
                              <label class="flex1"><span class="cGary">{{index + 1}}、</span>{{item.contentText}}</label>
                              <i class="iconfont icon-delete blue cur" @click="abnormallyReasonDeleteHandler(item, index)"></i>
                            </li>
                            <li key="999" class="alg_c cGray" v-if="!abnormalListData.length">请选择异常信息或者输入异常信息</li>
                          </transition-group>
                      </el-main>
                      <el-header class="p0 mt5" height="30px">
                        <textarea autofocus maxlength="200" class="textarea" placeholder="请输入异常信息(最大200个字符)" @input="addExceptionCause" v-model="customAbnormal"></textarea>
                      </el-header>
                    </el-container>
                  </el-main>
                </el-container>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </template>
    </template>
    <template slot="default"><span></span></template>
  </ever-form2>
</template>

<script>
import { debounce, objGet, WEST_MEDICINE_TYPE } from '@/util/common'
import api from '@/warehouse/page/prescription.review/util/commentapi.js'
import CommonTree from '@/warehouse/page/prescription.review/components/commontree.vue'
import HospitalParameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import { everprint } from '@/util/print'
import { DRUG_OPTIONS } from '@/warehouse/views/util/constant.js'

const schema = [
  {
    name: 'identification',
    label: '异常处理',
    comp: 'custom',
    identification: 1
  },
]
export default {
  mixins: [HospitalParameters],
  props: {
    obj: {},
    pageType: { // 页面：1、任务审核  2、收方发药  3、缺货任务  4、发药记录 5、任务列表
      type: Number,
      default: 1
    },
    currentRow: { // 当前选中行数据
      type: Object,
      default: () => ({})
    },
    isUddPackage: Boolean, // 是否是药包数据
    identification: Number, // 该数据是否异常 => 处方整单情况下（只有处方整单才会展示异常处方）
  },
  computed: {
    notChineseMedicine () {
      return WEST_MEDICINE_TYPE.includes(String(this.currentRow.taskType))
    },
    dispenseDetailValue () { // 补打药签打印选择模板
      const configObj = this.currentProcessConfig.processItemObject
      return objGet(configObj, 'processItemDispenseDetailObject.value', 0)
    }
  },
  data () {
    return {
      schema,
      api,
      disabledPrint: false,
      abnormalEle: null,
      eventHandler: null,
      formInline: {},
      abnormalListData: [], // 异常列表
      customAbnormal: '' // 自定义异常信息
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 处方单异常时点击编辑：初始化异常处理值
    if (this.identification) {
      this.obj.identification = this.identification
      this.$emit('update:isAbnormal', this.identification)
    }
  },
  watch: {
    obj: {
      handler (v) {
        this.$emit('update:obj', v)
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.abnormalListData = []
      this.customAbnormal = ''

      this.schema = this.isUddPackage && this.dispenseDetail && this.dispenseDetailValue && this.notChineseMedicine ? [{
        name: 'drugLable',
        label: '补打药贴',
        comp: 'custom',
        identification: 1
      }].concat(schema) : schema
    },
    runPrint () {
      const { id } = this.currentRow // udd code
      const curentOpt = DRUG_OPTIONS.find(row => row.id === +this.dispenseDetailValue)
      !curentOpt && this.$messageTips(this, '', '没有找到匹配的打印CODE，请检查库房流程配置->单个药签')
      console.log(curentOpt && curentOpt.code, { id }, '补打药签')
      curentOpt && everprint(curentOpt.code, { id })
    },
    addSelect: debounce(function (data, parentAllData) {
      if (!this.abnormalEle) {
        this.abnormalEle = document.querySelector('#abnormally')
      }
      const reason = this.abnormalListData.find(item => item.id === data.id)
      if (reason) return this.$messageTips(this, 'warning', '当前异常原因已经添加，请选择其他原因')
      // 拼接选中数据的父子联系
      let Allstr = parentAllData ? parentAllData.map(item => item.name).join('>') : ''
      this.abnormalListData.push(Object.assign(JSON.parse(JSON.stringify(data)), {contentText: Allstr ? Allstr : data.contentText}))
      // hospital:add-exception-cause：派发添加异常原因事件
      this.addExceptionCause()
      this.scrollTopTo()
    }),
    scrollTopTo () {
      if (this.abnormalEle) {
        this.$nextTick(_ => {
          this.abnormalEle.scrollTop = this.abnormalEle.scrollHeight
        })
      }
    },
    addExceptionCause () {
      // 派发事件 => 添加异常原因
      this.$bus.$emit('hospital:add-exception-cause', this.abnormalListData, this.customAbnormal)
    },
    markAbnormalHandler (isAbnormal) {
      this.$emit('update:isAbnormal', isAbnormal)
    },
    abnormallyReasonDeleteHandler (row, index) {
      // 当前组件内删除已选择的异常原因(右侧)
      this.abnormalListData.splice(index, 1)
      this.addExceptionCause()
    }
  },
  components: {
    CommonTree
  }
}
</script>

<style lang="scss" scoped>
%reset {
  padding: 0;
  margin: 0;
}
.custom-form {
  .select-abnormal {
    .ul {
      @extend %reset;
      li {
        @extend %reset;
        i.iconfont {
          flex: 0 0 20px
        }
      }
    }
    /deep/ .textarea {
      width: 100%;
      height: 30px;
    }
    .minus {
      margin-left: -1px;
    }
    /deep/ .el-table__row {
      td:last-child {
        padding-right: 15px
      }
    }
    .border-main {
      border: 1px solid #ddd;
    }
    height: 390px;
  }
  /deep/ .el-col {
    .el-form-item {
      margin-bottom: 0;
    }
    .custom-item {
      /deep/ .el-form-item__content {
        width: 50%
      }
    }
    border: 1px solid #ddd;
    padding: 5px;
    margin-top: -1px;
  }
  .el-form-item--mini .el-form-item__content, /deep/ .el-checkbox__label {
    line-height: 32px;
    font-weight: normal;
  }
  .list-enter-active, .list-leave-active {
    transition: all .2s;
  }
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
