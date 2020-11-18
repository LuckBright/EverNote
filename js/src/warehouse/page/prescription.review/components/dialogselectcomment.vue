<template>
  <div>
     <el-dialog
        title="不合理的原因"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        class="ui_dialog_02  dialog_tab">
        <el-row class="mb10 treelist">
          <comm-tree :api="api" :isSelectAdd="true" @thisSelectData="thisTreeSelectData"></comm-tree>
          <!-- <el-col :span="24" class="mr15 mb10">
            <ever-select v-model="selectParent" :options="optionsParent"></ever-select>
          </el-col>
          <el-col :span="24" class="mr15 mb10">
            <ever-select v-if="optionsChilder.length" :span="8" v-model="selectChilder" :options="optionsChilder"></ever-select>
          </el-col>
          <el-col :span="24" class="mb10">
            <ever-select v-if="optionsLast.length" :span="8" v-model="selectLast" :options="optionsLast"></ever-select>
          </el-col>
          <el-col :span="24" class="alg_c">
            <el-button type="primary" @click="addSelect">添加</el-button>
          </el-col> -->
        </el-row>
        <div class="checklist treelist">
          <!-- <el-checkbox-group
            v-model="checkedCities1"
            >
            <el-row v-for="(city, index) in cities" :key="index">
              <el-checkbox :label="city">{{city.contentText}}</el-checkbox>
            </el-row>
          </el-checkbox-group> -->
          <div class="list_li" v-for="(item, index) in selectList" :key="index">
            <el-col :span="20"><span class="cGray">{{index + 1}}、</span>{{item.contentText}}</el-col>
            <el-col :span="4" style="text-align:right"><el-button type="danger" size="small" plain @click="deleSelect(index)">删除</el-button></el-col>
          </div>
          <el-col v-if="!selectList.length" class="nodata" :span="24">还没有选择不合理原因</el-col>
        </div>
        <!-- <div>
          <div class="bordert1">已选择</div>
        </div> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectsuccess">确 定</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script>
import api from '../util/commentapi.js'
import commTree from './commontree.vue'

export default {
  props: ['initCheckList'],
  data () {
    return {
      api,
      selectParent: '',
      selectChilder: '',
      selectLast: '',
      dialogVisible: false,
      checkedCities1: [],
      cities: [],
      selectList: [],
      optionsParent: [],
      optionsChilder: [],
      optionsLast: [],
      thisSelectData: {}
    }
  },
  components: {
    commTree
  },
  methods: {
    thisTreeSelectData (data) {
      this.addSelect(data)
    },
    deleSelect (data) {
      this.selectList.splice(data, 1)
    },
    selectData () {
      let params = {
        level: 1,
        status: 1
      }
      this.api.list(params).then(res => {
        if (res) {
          this.loopData(res)
          this.optionsParent = res
        }
      })
    },
    loopData (data, de) {
      if (de) {
        data.forEach(item => {
          delete item.name
          if (item.subList) this.loopData(item.subList, de)
        })
      } else {
        data.forEach(item => {
          item.name = item.contentText
          if (item.subList) this.loopData(item.subList)
        })
      }
    },
    open (data) {
      this.dialogVisible = true
      this.selectData()
    },
    selectsuccess () {
      this.loopData(this.selectList, 'delete')
      this.$emit('selectcomment', this.selectList)
      this.dialogVisible = false
    },
    addSelect (data) {
      let index = this.selectList.findIndex(item => {
        return item.id === data.id
      })
      if (index > -1) {
        return this.$messageTips(this, 'warning', '当前点评已经选择过了')
      }
      this.selectList.push(data)
    },
    findList (v, el, lastArr) {
      let index = this[el].findIndex(item => {
        return item.id === v
      })
      if (index > -1 && this[el][index].subList) {
        let data = this[el][index].subList
        if (data.length) {
          this[lastArr] = data
        } else {
          if (!this.selectList.includes(this[el][index])) {
            this.thisSelectData = this[el][index]
          } else {
            this.thisSelectData = {}
            this.$messageTips(this, 'warning', '已经存在当前列表中', '提示')
          }
        }
      } else {
        if (!this.cities.includes(this[el][index])) {
          this.thisSelectData = this[el][index]
        } else {
          this.thisSelectData = {}
          this.$messageTips(this, 'warning', '已经存在当前列表中', '提示')
        }
      }
    }
  },
  watch: {
    'selectParent' (v) {
      this.selectChilder = ''
      this.selectLast = ''
      this.optionsChilder = []
      this.optionsLast = []
      this.thisSelectData = {}
      this.findList(v, 'optionsParent', 'optionsChilder')
    },
    'selectChilder' (v) {
      if (v) {
        this.optionsLast = []
        this.thisSelectData = {}
        this.findList(v, 'optionsChilder', 'optionsLast')
      }
    },
    'selectLast' (v) {
      if (v) {
        this.thisSelectData = {}
        this.findList(v, 'optionsLast')
      }
    },
    'checkedCities1' (v) {
      this.selectList = v
    },
    'initCheckList': {
      handler (v) {
        this.cities = JSON.parse(JSON.stringify(v))
        this.checkedCities1 = JSON.parse(JSON.stringify(v))
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.checklist{
  background: #eee;
  padding: 10px 0;
  overflow: hidden;
  .nodata{
    line-height: 80px;
    text-align: center;
    color: #666;
  }
}
.bordert1 {
  border-top:1px solid #ccc;
  padding: 10px 0;
}
.list_li{
  line-height: 24px;
  padding:5px 10px;
  overflow: hidden;
}
.dialog-footer{
  border-top: 1px solid #ccc;
  padding: 10px 20px;
}
.treelist{
  max-height: 200px;
  overflow-y: scroll;
  border:1px solid #ccc;
  margin: 15px;
}
</style>
