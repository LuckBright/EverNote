<template>
  <div class="use">
    <div class="le" v-if="isManage">
      <ever-org-select ref="eos" v-model="resObj.applyOrgIds" type="tree" multiple></ever-org-select>
    </div>
    <div class="center" v-if="isManage">
      <div class="arrTop">
        <div class="arrow"></div>
      </div>
      <div class="fnt">交集生效　如无交集则无效</div>
      <div class="arrBottom">
        <div class="arrow"></div>
      </div>
    </div>
    <div :class="[isManage ? '' : 'fixri', 'ri']">
      <ever-subject-select ref="ess" v-model="resObj.applyDeptIds" type="tree" multiple></ever-subject-select>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    'value': [Array, String, Object],
    'clinicId': [String],
    'isBloc': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resObj: {
        applyOrgIds: [],
        applyDeptIds: [],
      },
      isManage: this.$route.matched[0].meta.manage
    }
  },
  created () {

  },
  watch: {
    'resObj': {
      handler: function (val) {
        this.$emit('input', val)
      },
      deep: true
    },
    'value': {
      handler: function (val) {
        if (val) {
          this.resObj = val
        }
      },
      deep: true,
    },
  },
  methods: {
    // this.$emit('tackThisToBackend', res)
  },
  components: {
  }
}
</script>
<style scoped>
.arrTop,
.arrBottom {
  position: absolute;
}
.arrTop {
  top: 0;
  left: 0;
}
.arrBottom {
  bottom: 0;
  left: 0;
}
.arrow {
  width: 30px;
  height: 34px;
  background: #fff url('../../assets/pic001.png') no-repeat left top;
  background-size: 100% 100%;
}
.arrBottom .arrow {
  background: #fff url('../../assets/pic002.png') no-repeat left top;
  background-size: 100% 100%;
}
.use {
  display: flex;
  flex-direction: row;
}
.use .le {
  flex: 1;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #788ca1;
  border-right: none;
  background: #f9f9f9;
}
.use .center {
  width: 30px;
  position: relative;
}
.use .center .fnt {
  writing-mode: tb-rl;
  padding: 0 6px 0 4px;
  line-height: 20px;
  text-align: center;
  font-size: 16px;
  letter-spacing: 5px;
  background: #788ca1;
  height: 400px;
  color: #fff;
}
.use .ri {
  flex: 1;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #788ca1;
  border-left: none;
  background: #f9f9f9;
}
.use /deep/ .el-tree {
  background: #f9f9f9;
}
.use .ri.fixri {
  border-left: 1px solid #788ca1;
}
.use /deep/ .el-checkbox:last-of-type {
  margin-right: 8px;
}
</style>
