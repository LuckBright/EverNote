<template>
  <div class="switch-ward">
    <el-row class="clearfix el-row-frist">
      <el-col :span='8'>
        <span style="float:left">选择科室</span>
      </el-col>
      <el-col :span='16'>
        <el-select v-model="providerId" placeholder="请选择科室" class="el-selects" @change='providerChange' filterable clearable>
            <el-option
            v-for="item in providerOptions"
            :key="item.sectionRecordId"
            :label="item.name"
            :value="item.sectionRecordId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
   <el-row class="clearfix">
      <el-col :span='8'>
        <span style="float:left">选择诊室 </span>
      </el-col>
      <el-col :span='16'>
        <el-select v-model="sectionId" placeholder="请选择诊室" class="el-selects" @change='change' filterable clearable>
            <el-option
            v-for="item in sectionOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '@/infusion/store/infusion'
  import storage from '@/util/storage'
  export default {
    props: ['value', 'providerOptions'],
    watch: {
      'value' (val) {
        this.providerId = storage.getSessionStorage(this.sesstionKey).split(',')[0]
        this.providerId = storage.getSessionStorage(this.sesstionKey).split(',')[3]
      }
    },
    data () {
      return {
        api,
        sesstionKey: 'INFUSION_WARD',
        sectionOptions: [],
        providerId: '',
        sectionId: ''
      }
    },
    mounted () {
      if (this.$store.state.workbenchFlag === 'tech') {
        this.sesstionKey = 'TECH_WARD'
      } else if (this.$store.state.workbenchFlag === 'infusion') {
        this.sesstionKey = 'INFUSION_WARD'
      }
    },
    methods: {
      async providerChange (providerId) {
        this.sectionOptions = []
        this.sectionId = ''
        if (!providerId) return
        let res = await this.api.getTreatAreaListBySectionId({providerId})
        this.sectionOptions = res.data
      },
      change (sectionId) {
        let str = this.providerId + ','
        this.providerOptions.forEach(element => {
          if (element.id === this.providerId) {
            str += element.name + ','
          }
        })
        str += sectionId + ','
        this.sectionOptions.forEach(element => {
          if (element.id === sectionId) {
            str += element.name
            storage.setSessionStorage(this.sesstionKey + 'isQueueArea', element.isQueueArea)
          }
        })
        storage.setSessionStorage(this.sesstionKey, str)
        this.$emit('input', str)
      },
      async open () {
        if (storage.getSessionStorage(this.sesstionKey)) {
          this.providerId = storage.getSessionStorage(this.sesstionKey).split(',')[0]
          await this.providerChange(this.providerId)
          this.sectionId = storage.getSessionStorage(this.sesstionKey).split(',')[2]
          this.change(this.sectionId)
        }
      }
    },
    computed: {

    },
    components: {

    }
}
</script>

<style lang='scss' scoped>
.switch-ward{
    padding-left: 10px;
    font-size: 14px;
    line-height: 30px;
    padding:10px 0px 10px 5px;
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-row-frist{
      margin-bottom: 5px;
    }
}
</style>
