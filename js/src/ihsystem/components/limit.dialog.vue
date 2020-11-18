<template>
  <el-dialog
    title="特殊药品提示"
    class="limit-dialog"
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="waring-wrap">
      <ul>
        <li class="limit-medicine" v-for="item in limitMedicine" :key="item.id">
          【<span class="medicine-name">{{item.name}}</span>】<span>为</span>【<span class="medicine-type">{{getTypeName(item.type)}}</span>】
        </li>
      </ul>
      <div>无法开立此类医嘱，请重新选择！</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="close">
        我知道了
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
const specialClassify = {
  '01.03': { icon: 'icon-mayao', name: '麻醉药品' },  // 麻醉药品
  '01.01': { icon: 'icon-jing1', name: '一类精神药品' },  // 一类精神药品
  '01.05': { icon: 'icon-duxing', name: '医疗用毒性药品' },  // 医疗用毒性药品
  '01.06': { icon: 'icon-fangshe', name: '放射性药品' },  // 放射性药品
  '01.04': { icon: 'icon-jiedu', name: '戒毒药品' },  // 戒毒药品
  '01.02': { icon: 'icon-jing', name: '二类精神药品' },  // 二类精神药品
  '1': { icon: 'icon-gaowei', name: '高危药' },  // 高危药
  '02.02': { icon: 'icon-xianzhixing', name: '限制使用级抗菌药物' },  // 限制使用级抗菌药物
  '02.01': { icon: 'icon-teshu', name: '特殊使用级抗菌药物' },  // 特殊使用级抗菌药物
  '02.03': { icon: 'icon-feixianzhixing', name: '非限制使用级抗菌药物' }  // 非限制使用级抗菌药物
}
export default {
  props: {
    limitShow: {
      type: Boolean,
      default: false
    },
    limitMedicine: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      specialClassify
    }
  },
  methods: {
    close () {
      this.$emit('update:limitShow', false)
    },
    getTypeName (type) {
      let name = this.specialClassify[type] ? (this.specialClassify[type].name || '未知类型药品') : '未知类型药品'
      return name
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.limitShow
      },
      set: function (val) {
        this.$emit('update:limitShow', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    text-align: center
  }
  .waring-wrap {
    border: 1px solid #ee4433;
    border-radius: 4px;
    background: rgba(238, 68, 51, 0.12);
    box-shadow: none;
    color: #ee4433;
    margin-bottom: 20px;
    line-height: 22px;
    position: relative;
    padding: 15px;
    ul {
      padding: 0;
      margin: 0;
      li {
        line-height: 33px;
      }
    }
  }
</style>
