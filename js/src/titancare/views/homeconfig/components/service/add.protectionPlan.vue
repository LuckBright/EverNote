<template>
  <AddContent
    title="选择保障计划"
    @sureEdit="addSure"
    @sureClose="addCancel"
  >
    <template slot="icon">
      <i class="el-icon-arrow-left"></i><span>返回</span>
    </template>
    <div class="list-content" v-loading="loadingData">
      <RadioList
        v-model="selectedId"
        :attrs="attrs"
        :list="list"
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        @currentChange="currentChange"
        @search="searchProtectionPlan">
      </RadioList>
    </div>
  </AddContent>
</template>

<script>
  import AddContent from '../base/add.content'
  import RadioList from '../base/radio.list'
  import api from '@/titancare/api/homeconfig/homeconfigapi'

  export default {
    name: 'add.protectionPlan',
    components: {
      AddContent,
      RadioList
    },
    data () {
      return {
        attrs: { id: 'id', label: 'name', icon: 'picture' },
        list: [],
        selectedId: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        words: '',
        loadingData: false
      }
    },
    created () {
      this.searchProtectionPlan()
    },
    methods: {
      addCancel () {
        this.$emit('addCancel')
      },
      addSure () {
        let protectionPlan = this.list.find(item => item.id === this.selectedId)
        if (!protectionPlan) return
        this.$emit('addSure', protectionPlan)
      },
      currentChange (current) {
        this.currentPage = current
        this.searchProtectionPlan()
      },
      searchProtectionPlan (words) {
        this.words = words
        let params = {
          name: this.words,
          categoryId: '06',
          status: 3,
          isGroup: 0,
          offset: (this.currentPage - 1) * this.pageSize,
          pagesize: this.pageSize,
        }
        this.loadingData = true
        api.getTemplateList(params).then(res => {
          this.loadingData = false
          this.list = res.data.resultList
          this.total = res.data.totalCount
        })
      }
    }
  }
</script>

<style scoped>
  .list-content{
    padding: 20px;
  }
</style>
