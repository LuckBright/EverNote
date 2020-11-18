<template>
  <div id="storageJump">
    <div class="jump">
      <h2>请选择库房</h2>
      <el-row class="ever-row-01" type="flex" justify="center">
        <el-col class="boxWidth" v-for="item in storageItem" :key="item.id">
          <el-card class="storageWidth pos_re">
            <div class="iconimg">
              <i class="icon iconfont icon-kufang-XL"></i>
              <div>{{item.name}}</div>
            </div>
            <div class="iconimg2 pulse animate">
              <i class="icon iconfont icon-kufang-XL"></i>
              <div>{{item.name}}</div>
            </div>
            <el-card class="select fadeInUp animate pos_ab">
              <el-button type="primary" style="width: 70%" @click="jump(item.id, item.materialType, item.type)">选 择</el-button>
            </el-card>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import processSeting from '@/warehouse/page/storages/util/process.seting'

export default {
  mixins: [processSeting],
  data () {
    return {
      storageItem: []
    }
  },
  mounted () {
    this.storageItem = JSON.parse(storage.getLocalStorage('STORAGE_ITEM'))
  },
  methods: {
    async jump (id, type, storageType) {
      await this.getStorageroomProcess(id)
      storage.setLocalStorage('STORAGE_ID', id)
      storage.setLocalStorage('STORAGE_ID_VUEX', id)
      storage.setLocalStorage('MATERIAL_TYPE', type)
      storage.setLocalStorage('STORAGE_ROOM_TYPE', storageType)
      setTimeout(_ => {
        if (this.$route.query.jumper) {
          this.$router.push(this.$route.query.jumper)
          return
        }
        this.$router.push('/storages/home?storageId=' + id)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#storageJump { height: 100%}
.ever-row-01 {
  height: calc(100vh - 200px);
  overflow-y: auto
}
.ever-row-01 .el-col { margin: 20px 10px;}
.iconfont { font-size: 48px; color: #1c7bef}
.storageWidth { height: 150px; padding: 15px 0}
.select { padding: 10px 0; width: calc(100% - 2px); display: none; bottom: -1px; right: 0; top: 125px}
.boxWidth { height: 180px;}
  i {padding: 20px; display: inline-block;}
.boxWidth:hover .select, .boxWidth:hover .iconimg2 { display: block}
.boxWidth:hover .iconimg, .iconimg2 { display: none}
.animate {animation-duration: .5s; -webkit-animation-duration: .5s}
.jump { max-width: 1280px; margin: 0 auto; text-align: center;}
  h2 { color: #000; padding: 30px 0 10px}
</style>
