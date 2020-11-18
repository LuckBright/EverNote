<template>
  <div class="work">
    <div class="left">
      <workleft @addnew="addnew" @chooseone="chooseone" :refresh="updatenow"></workleft>
    </div>
    <div class="right">
      <workright :onfirst="onfirst" :onchoose="onchoose" @update="update" ref="right"></workright>
    </div>
  </div>
</template>

<script>
import workleft from './workleft.vue'
import workright from './workright.vue'
import choose from '@/warehouse/page/components/choose.vue'
export default {
  data () {
    return {
      onfirst: true,
      onchoose: {},
      updatenow: ''
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.right.edit === false) {
      this.$confirm('当前编辑信息未保存，请选择您想要进行的操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        this.$bus.$emit('nav:preventhirdtActiveChange')
      })
    } else {
      next()
    }
  },
  methods: {
    addnew (v) {
      this.onfirst = v
    },
    chooseone (v) {
      this.onchoose = v
    },
    update (v) {
      this.updatenow = v
    }
  },
  components: {
    choose,
    workleft,
    workright
  }
}
</script>
<style scoped>
.work {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  overflow: auto;
}
.left {
  width: 480px;
}
.right {
  flex-grow: 1;
}
</style>
