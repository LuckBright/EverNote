<template>
  <div class="homePage">
    <!-- demo textviews 富文本详情查看 -->
    <!-- <textviews id="c1375f72-b2a9-11e9-af37-0242ac110020" type="2"></textviews> -->
    <el-row :gutter="10" class="mb10">
      <el-col :span="12">
        <output-storage  :key="storageId"></output-storage>
      </el-col>
      <el-col :span="12">
        <worktoday-storage :key="storageId"></worktoday-storage>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
      <el-col :span="12">
        <enter-storage :key="storageId"></enter-storage>
      </el-col>
      <el-col :span="12">
        <task-storage :key="storageId"></task-storage>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <validity-storage :key="storageId"></validity-storage>
      </el-col>
      <el-col :span="12">
        <stock-storage :key="storageId"></stock-storage>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import getstorage from '@/warehouse/page/storages/util/getstorage'
// import api from '@/warehouse/page/storages/store/enterapi'
import outputStorage from './home/home-output.vue'
import enterStorage from './home/home-enter.vue'
import worktodayStorage from './home/home-worktoday.vue'
import taskStorage from './home/home-task.vue'
import validityStorage from './home/home-validity.vue'
import stockStorage from './home/home-stock.vue'
import Textviews from '@/components/textviews.js'
export default {
  mixins: [getstorage],
  data () {
    return {
    }
  },
  async created () {
    this.listParams.storageId = this.storageId
  },
  components: {
    outputStorage,
    enterStorage,
    worktodayStorage,
    validityStorage,
    stockStorage,
    taskStorage,
    Textviews
  }
}
</script>
