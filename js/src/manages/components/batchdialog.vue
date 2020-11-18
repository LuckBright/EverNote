<template>
    <el-dialog
      class="dialog"
      title="批量设置"
      :visible.sync="dialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div style="max-height: 600px; overflow-y: auto">
        <div class="mb10 f14" v-if="title">{{title}}</div>
        <div class="bor_1 rows_style">
          <el-row class="bor_bom_1" v-for="item in schema" :key="item.label">
            <el-col :span="10">
              <el-checkbox v-model="item.checked">批量修改<span v-html="item.label"></span></el-checkbox>
            </el-col>
            <!-- line => 是否新行展示（默认一行展示） -->
            <template v-if="item.checked">
              <el-col :span="14" v-if="!item.line">
                <slot v-if="item.slot" :name="item.slot"></slot>
                <div v-else>
                  <!-- copywriting => 自定义文案内容（默认加上了lable值） -->
                  <span v-if="item.copywriting">{{item.label}}{{item.copywriting}}</span>
                  <span v-else>{{item.label}}全部修改为</span>
                  <el-switch
                    class="ml10"
                    v-model="obj[item.name]"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="obj[item.name] ? '启用' : '停用'">
                  </el-switch>
                </div>
              </el-col>
              <el-col :span="24" v-else>
                <slot :name="item.slot"></slot>
              </el-col>
            </template>
          </el-row>
        </div>
        <p class="cOrange" v-if="tipMsg">提示：{{tipMsg}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">批量修改</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: {
    tipMsg: { // 底部提示信息内容
      type: String,
      default: ''
    },
    title: { // 物资名称或者科室名称 需要在业务里面处理成字符串形式
      type: String,
      default: ''
    },
    schema: { // 生成弹窗内容的数组
      type: Array,
      default: () => []
    },
    obj: { // 最后返回去的对象，所有的批量设置都在里面
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    },
    formRules: {
      type: Object,
      default: () => ({})
    },
  },
  methods: {
    save () {
      if (this.isChange) return this.$messageTips(this, 'warning', '请选择需要批量修改的信息')
      this.schema.forEach(item => {
        if (!item.checked) delete this.obj[item.name] // 没有选中修改项，删除该选项
      })
      if (this.formRules.submitFromRules && !this.formRules.submitFromRules()) return false
      this.$emit('update.obj', this.obj)
      this.$emit('save')
      this.dialogVisible = false
    },
  },
  watch: {
    dialogVisible (val) {
      if (val) {
        // 每次重新打开弹窗初始化选中项的值（默认都不选） ====> js动态类型真强大 ===== 初次schema中不存在响应式checked属性，通过set设置checked实现响应式
        this.schema.forEach((item, index) => { this.$set(this.schema[index], 'checked', false) })
        // 每次重新打开弹窗初始化Obj值
        Object.keys(this.obj).forEach(key => {
          this.obj[key] = ''
          if (key === 'statue' || key === 'status') this.obj[key] = 1 // 批量修改，默认给的状态是“启用” （物资 => status; 科室、人员 => statue）
        })
        // 提供其他数据类型的初始值
        this.$emit('initData')
        this.$emit('update.obj', this.obj)
      }
    }
  },
  computed: {
    isChange () { // schema => checked 都为假时，标示着本次点击没有操作，或者无效操作
      return this.schema.every(item => !item.checked)
    },
    dialogVisible: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  }
}
</script>
<style lang="less" scoped>
.rows_style {
  .el-row {
    padding: 0 10px;
    .el-col {
      line-height: 30px;
      padding: 2px 0;
    }
  }
}
.bor_1 {border-bottom: none}
.el-checkbox { font-weight: normal}
</style>
