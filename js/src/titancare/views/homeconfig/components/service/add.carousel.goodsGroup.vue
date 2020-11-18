<template>
  <AddContent
      title="商品分组"
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
          :list="goodsGroupList"
          :pageSize="pageSize"
          :total="total"
          :current="currentPage"
          @currentChange="currentChange"
          @search="searchGoodsGroup">
      </RadioList>
    </div>
  </AddContent>
</template>

<script>
import AddContent from '../base/add.content'
import RadioList from '../base/radio.list'
import api from '@/titancare/api/homeconfig/homeconfigapi'

export default {
  name: 'add.carousel.goodsGroup',
  components: {
    AddContent,
    RadioList
  },
  data () {
    return {
      attrs: { id: 'id', label: 'name' },
      goodsGroupList: [],
      selectedId: '',
      loadingData: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      words: ''
    }
  },
  created () {
    this.searchGoodsGroup()
  },
  methods: {
    addCancel () {
      this.$emit('addCancel')
    },
    addSure () {
      let goodsGroup = this.goodsGroupList.find(item => item.id === this.selectedId)
      if (!goodsGroup) return
      this.$emit('addSure', goodsGroup)
    },
    currentChange (current) {
      this.currentPage = current
      this.searchGoodsGroup()
    },
    searchGoodsGroup (words) {
      this.words = words
      let params = {
        name: this.words,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }

      this.loadingData = true
      api.getListBySpuGroup(params).then(res => {
        this.loadingData = false
        this.goodsGroupList = res.data.resultList
        this.total = res.data.totalCount
      })
    }
  }
}
</script>

<style scoped>
  .list-content{
    padding: 20px;
    min-height: 50px;
  }
</style>
