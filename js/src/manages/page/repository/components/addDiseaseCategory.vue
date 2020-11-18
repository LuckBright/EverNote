<template>

  <section class="add-disease-category">
    <b>分类信息（由于多学科交叉疾病科隶属多个分类）</b>
      <el-form-item label="所属分类:" prop="classOrAlias">
        <!-- <el-row v-for="item in form.classList" :key="item.pinyinCode">
          <el-col :span="24"> -->
            <el-input  v-model="form.defaultClassificationId" placeholder="自动将默认分类回显"></el-input>
            <el-button type="" @click="addClass">添加</el-button>
          <!-- </el-col>
        </el-row> -->
      </el-form-item>
      <el-form-item v-for="(item, index) in form.classList" :key="index" label="所属分类:" prop="classOrAlias">
        <el-input  v-model="item.pinyinCode" placeholder="请选择分类"></el-input>
        <el-button type="" @click="addClass">添加</el-button>
        <el-button type="" @click="removeClass(index)">移除</el-button>
      </el-form-item>
      <b>标准编码 （该疾病对应的国际或国家标准编码）</b>
      <el-form-item label="西医疾病编码:" prop="class">
        <el-input v-model="form.westCode" placeholder="自动将默认分类回显"></el-input>
      </el-form-item>
      <el-form-item label="中医疾病编码:" prop="class">
        <el-input v-model="form.chineseCode" placeholder="自动将默认分类回显"></el-input>
      </el-form-item>
  </section>

</template>

<script lang="js">
  import addCategory from '@/manages/page/repository/components/addCategory.vue'
  export default {
    name: 'add-disease-category',
    props: ['formData', 'nodeType', 'curNode', 'type'],
    components: {
      addCategory
    },
    mounted () {
    },
    data () {
      return {
        form: {
          classList: [
            {
              classOrAlias: '',
              pinyinCode: ''
            }
          ]
        }
      }
    },
    watch: {
      formData: {
        immediate: true,
        handler(val) {
          this.form = val
        }
      }
    },
    methods: {
      removeClass(delIndex) {
        this.form.classList.splice(delIndex, 1)
      },
      addClass() {
        if (!this.form.classList) this.form.classList = []
        this.form.classList.push({classOrAlias: '', pinyinCode: ''})
      }
    },
    computed: {

    }
}

</script>

<style scoped lang="scss">
  .add-disease-category {
    b {
      padding-bottom: 16px;
      b::after{
        content:"";
        width:5px;
        height:60px;
        position:absolute;
        top:0;
        left:0;
        background:deeppink;
       }
    }

  }
</style>
