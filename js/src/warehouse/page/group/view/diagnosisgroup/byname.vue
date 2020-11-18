<template>
    <div id="byname_c">
        <el-form :model="temp" :rules="rules" class="temp" ref="temp">
            <el-row :class="num === lgth-1?'nomargin':''" :gutter="10">
                <el-col :span="10">
                    <el-form-item prop="name" :rules="{required: false, message: '必填项', trigger: 'blur'}">
                        <el-input v-model="temp.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                   <el-button type="text" @click="delrow(num)"><i class="iconfont icon-delete"></i></el-button>
                   <el-button type="text" @click="addrow" v-if="num === lgth-1">
                      <i class="iconfont icon-tianjia"></i>
                   </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
  props: ['temp', 'num', 'lgth'],
  data () {
    return {
      rules: {}
    }
  },
  methods: {
    delrow () {
      this.$emit('delrow', this.num)
    },
    addrow () {
      this.$emit('addrow')
    }
  }
}
</script>
<style scoped>
#byname_c .el-row.nomargin{margin-bottom:0px;}
</style>

