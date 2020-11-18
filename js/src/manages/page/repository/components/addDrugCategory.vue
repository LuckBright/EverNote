<template>

  <section class="add-drug-category">
    <addBase :nodeType="2" :formData.sync="baseInfo"></addBase>
    <b>分类信息（由于多学科交叉疾病科隶属多个分类）</b>
     <el-form :model="diseaseObj" label-width="100px" label-position="right">
      <el-form-item label="所属分类:" prop="class">
        <el-input v-model="diseaseObj.class" placeholder="自动将默认分类回显"></el-input>
      </el-form-item>
      <b>标准编码 （该疾病对应的国际或国家标准编码）</b>
      <el-form-item label="西医疾病编码:" prop="class">
        <el-input v-model="diseaseObj.westCode" placeholder="自动将默认分类回显"></el-input>
      </el-form-item>
      <el-form-item label="中医疾病编码:" prop="class">
        <el-input v-model="diseaseObj.chineseCode" placeholder="自动将默认分类回显"></el-input>
      </el-form-item>
    </el-form>
  </section>

</template>

<script lang="js">
  import addBase from '@/manages/page/repository/components/addBase.vue'
  export default {
    name: 'add-drug-category',
    props: [],
    components: {
      addBase
    },
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}

</script>

<style scoped lang="scss">
  .add-drug-category {

  }
</style>
