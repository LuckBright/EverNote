<template>
    <div class="savedemo">
        <el-row>
            <el-col class="nav" :span="10">
                  <el-menu
                        class="el-menu-style"
                        theme="light" 
                        :router="false"
                        @select="menuSelect">
                    <template v-for="item in docs">
                        <sub-menu :param="item" :key="item.id"></sub-menu>
                    </template>
                </el-menu>
            </el-col>
            <el-col :span="14">
                <el-checkbox v-model="checked" @change="change">修改</el-checkbox>
                {{curNode}}
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { uniqBy, remove } from 'lodash'
import subMenu from './submenu.vue'
import { menuList } from './data.js'
export default {
  components: {
    subMenu
  },
  data () {
    return {
      docs: menuList,
      openeds: [],
      unSaveIds: [],
      checked: false,
      curNode: {},
    }
  },
  methods: {
    getNode (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i]
        }
        if (arr[i].children) {
          var n = this.getNode(arr[i].children, id)
          if (n) {
            return n
          }
        }
      }
    },
    menuSelect (index, indexPath) {
      let tmpArr = index.split('/')

      this.curNode = {
        id: tmpArr[0],
        isSave: tmpArr[1] === 'true'
      }
      this.checked = this.curNode.isSave || false
      console.log(this.curNode, 'curNode')
      console.log(tmpArr, 'index')
      console.log(indexPath, 'indexPath')
      console.log(this.docs, 'docs')
    },
    change (val) {
      if (val) { // val为true表示修改了未保存
        this.unSaveIds.push(this.curNode)
      } else { // 为false需要移除该项
        remove(this.unSaveIds, (item) => {
          return item.id === this.curNode.id
        })
      }
      this.curNode.isSave = val
      this.unSaveIds = uniqBy(this.unSaveIds, 'id')
      let item = this.getNode(this.docs, Number(this.curNode.id))
      this.$set(item, 'isSave', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.savedemo{
    height:500px;
    background:#fff;
}
</style>
