<template>
	<div class="bed">
		<el-row>
			<el-col :span="24" class="show_total">
          <span v-for="item in topBarInfo" :key="item.name">{{item.name}}：{{item.count}}{{item.unit}}；</span>
          <div style="float:right">
            <!-- <el-popover
              placement="bottom"
              width="300"
              popper-class='bedpopper'
              trigger="click">
              <todo-editor
                listDate="2000-00-00"
                :clinic="{'id': $store.state.currentUser.organizationId, 'name':  $store.state.currentUser.organizationName}"
                :pageType="1"
                @updateEditor="updateEditor"
              ></todo-editor>
              <i slot="reference" class="icon iconfont icon-ziyuan"></i>
            </el-popover> -->
            <el-checkbox v-model="showEmpt">显示空床</el-checkbox>
          </div>
			</el-col>
		</el-row>
    <box-list :patients="tableData" @success='success' :space='space' @turn='turn' :CHANGE_PROVIDER_KEY='CHANGE_PROVIDER_KEY'></box-list>
	</div>
</template>
<script>
  import boxList from '@/inpatient/page/boxlist'
  import api from '@/inpatient/store/resident.js'
  import storage from '@/util/storage.js'
  import todoEditor from '@/components/todoeditor/todoeditor'
  import appi from '@/inpatient/components/issued.orders/api.js'
  let str = storage.getLocalStorage(`showEmptBed`)
  let showEmpt = !(str === 'false')
  export default {
    props: ['space'],
    data () {
      return {
        tableData: [],
        api,
        storage,
        form: {
          bed: '',
          patient: '',
          queryMsg: ''
        },
        freeBeds: '',
        totalBeds: '',
        pickObj: {}, // 缓存的已选中的床位信息
        totalCount: 0,
        areaId: '',
        showEmpt,
        topBarInfo: [],
        listDate: '',
        CHANGE_PROVIDER_KEY: 1
      }
    },
    watch: {
      '$route.path': {
        handler (val) {
          let str = storage.getLocalStorage(`showEmptBed`)
          this.showEmpt = !(str === 'false')
        },
        immediate: true
      },
      'showEmpt': {
        handler (val) {
          this.storage.setLocalStorage(`showEmptBed`, val)
          this.getList()
        },
      }
    },
    beforeDestroy () {
      this.$bus.$off('refresh_bedlist', this.refresh)
      this.$bus.$off('storageChange', this.mounte)
    },
    async mounted () {
      this.$bus.$on('refresh_bedlist', this.refresh)
      this.$bus.$on('storageChange', this.mounte)
      let res = await appi.searchCheckConfig({
        code: 'CHANGE_PROVIDER_KEY',
        defaultValue: '0'
      })
      if (res && res.value === '0') {
        this.CHANGE_PROVIDER_KEY = '0'
      } else {
        this.CHANGE_PROVIDER_KEY = '1'
      }
      this.mounte()
    },
    methods: {
      mounte () {
        let str = this.storage.getLocalStorage(`${this.space}Key`)
        if (str) {
          this.areaId = str.split(',')[0]
          this.getList()
          this.getTopBars()
        }
      },
      refresh () {
        this.getList()
        this.getTopBars()
      },
      success () {
        this.getList()
        this.getTopBars()
        this.$bus.$emit('refresh_waiting_list')
      },
      turn (item) {
        this.$emit('turn', item)
      },
      async getList () {
        let result = []
        if (this.showEmpt) {
          result = await this.api.getAllBedList({
            areaId: this.areaId,
          })
        } else {
          result = await this.api.getBedList({
            areaId: this.areaId,
          })
        }
        this.tableData = []
        this.tableData = result.data || []
      },
      async getTopBars () {
        let result = await this.api.getTopBars({
          areaId: this.areaId
        })
        if (result && result.data) {
          this.topBarInfo = result.data
        }
      }
    },
    components: {
      boxList,
      todoEditor
    }
  }
</script>
<style lang="scss">
.bedpopper{
  padding:0;
  .custom_toolbar{
    box-sizing: border-box;
  }
}
.bed{
  flex:1;
  .show_total{
    font-size:14px;
    line-height:40px;
    color: #666;
  }
  .query{
    text-align:left;
    height:50px;
    line-height:40px;
    .query_from{
      float: left;
    }
    .select{
      width:180px;
    }
    .input{
      width:240px;
      font-size: 14px;
    }
    .right_mgt{
      float: right;
    }
    a{
      color:#397FEC;
      font-size:14px;
    }
  }
}
</style>

