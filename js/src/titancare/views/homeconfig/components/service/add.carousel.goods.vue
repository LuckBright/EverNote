<template>
  <AddContent
      title="已上架商品"
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
          :list="goodsList"
          :current="currentPage"
          :page-size="pageSize"
          :total="total"
          @currentChange="currentChange"
          @search="searchGoods">
      </RadioList>
    </div>
  </AddContent>
</template>

<script>
import AddContent from '../base/add.content'
import RadioList from '../base/radio.list'
import api from '@/titancare/api/homeconfig/homeconfigapi'

export default {
  name: 'add.carousel.goods',
  components: {
    AddContent,
    RadioList
  },
  data () {
    return {
      attrs: { id: 'id', label: 'name', icon: 'picture' },
      goodsList: [],
      selectedId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      words: '',
      loadingData: false
    }
  },
  created () {
    this.searchGoods()
  },
  methods: {
    addCancel () {
      this.$emit('addCancel')
    },
    addSure () {
      let goods = this.goodsList.find(item => item.id === this.selectedId)
      if (!goods) return
      this.$emit('addSure', goods)
    },
    currentChange (current) {
      this.currentPage = current
      this.searchGoods()
    },
    searchGoods (words) {
      this.words = words
      let params = {
        searchType: '1', // 表示已上架
        name: this.words,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }

      this.loadingData = true
      api.getSupSearch(params).then(res => {
        this.loadingData = false
        this.goodsList = res.data.resultList
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
