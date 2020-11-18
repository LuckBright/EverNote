<template>
  <div>
    <div class="box">
      subjectList:
      <hr>
      {{subjectList}}
      <hr>
      <ever-subject-select :disabled="false" v-model="subjectList" fields="orgSubjectCode" type="select"></ever-subject-select>
    </div>
    <div class="box">
      subjectList2:
      <hr>
      <el-button @click="clearSubject">清空科室数据</el-button>
      机构：{{orgId}}；科室：{{subjectList2}}
      <hr>
      选择机构：<ever-org-select v-model="orgId" fields="id" @change="changeOrgId" type="select"></ever-org-select>
      <br>
      选择科室：<ever-subject-select v-model="subjectList2" :params="params" fields="id"></ever-subject-select>
      <br>
      <hr>
      测试在选择框的情况下，输入了关键字之后，光标离开控件后，选择框的下拉选项是否还能正常显示
      <ever-subject-select v-model="subjectList3" fields="id" type="select"></ever-subject-select>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        subjectList: [],
        subjectList2: [],
        orgId: '',
        subjectList3: '',
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      changeOrgId (val) {
        this.subjectList2 = ''
      },
      clearSubject () {
        this.subjectList2 = ''
      }
    },
    computed: {
      params () {
        return {
          type1CodeList: ['01'],
          type2CodeList: ['01.02'],
          orgId: this.orgId,
          everQueryType: 'out',
        }
      }
    }
  }
</script>
