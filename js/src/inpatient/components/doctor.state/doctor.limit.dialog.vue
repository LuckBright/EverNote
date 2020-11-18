<template>
  <el-dialog
    title="处方权提示"
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
      <div>您无<span v-if="limitMedicine.length">相应的</span>处方权，无法开立医嘱！</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="close">
        我知道了
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {specialClassify} from './index'
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
