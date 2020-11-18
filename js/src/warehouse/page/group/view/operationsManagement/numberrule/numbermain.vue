<template>
  <div class="work">
    <div class="left">
      <numberleft
        @addnew="addnew"
        @chooseone="chooseone"
        @chooseparams="chooseparams"
        :refresh="refresh"
      ></numberleft>
    </div>
    <div class="right">
      <numberright
        ref="workright"
        :onfirst="onfirst"
        :onchoose="onchoose"
        :choosewhatparams="chooseallparams"
        :currentStatus="currentStatus"
        @success="success"
      ></numberright>
    </div>
  </div>
</template>
<script>
import numberleft from './numberleft.vue'
import numberright from './numberright.vue'
export default {
  data () {
    return {
      onfirst: true,
      onchoose: {},
      chooseallparams: '',
      refresh: 1,
      currentStatus: ''
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.workright.edit === false) {
      this.$confirm('当前编辑信息未保存，请选择您想要进行的操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        this.$bus.$emit('nav:preventhirdtActiveChange', true)
      })
    } else {
      next()
    }
  },
  methods: {
    addnew (v, status) {
      this.onfirst = v
      this.currentStatus = status
    },
    chooseone (v) {
      let timeobj = {
        nowtime: new Date().getTime()
      }
      this.currentStatus = v.currentStatus
      this.onchoose = Object.assign({}, v, timeobj)
    },
    chooseparams (v) {
      this.chooseallparams = v
    },
    success () {
      this.refresh++
    }

  },
  components: {
    numberleft,
    numberright
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
