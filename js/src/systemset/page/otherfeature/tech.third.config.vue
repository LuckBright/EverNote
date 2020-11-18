<template>
<div class="layout_inner techthirdconfig">
  <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
    <el-tab-pane label="检验对接" name="801"></el-tab-pane>
    <el-tab-pane label="检查对接" name="800"></el-tab-pane>
    <el-tab-pane label="治疗对接" name="802"></el-tab-pane>
    <el-tab-pane label="手麻对接" name="csa"></el-tab-pane>
  </el-tabs>
  <div class="tip">
    注：列表默认没有数据，表示机构不对接医技或第三方
    <el-buton sizw='mini' type='primate'></el-buton>
  </div> -->
   <el-button type="primary" plain @click='sync("inspectBatchService")'>{{msg["inspectBatchService"]}}</el-button>
   <el-button type="primary" plain @click='sync("syncStaffToThird")'>{{msg["syncStaffToThird"]}}</el-button>
   <el-button type="primary" plain @click='sync("syncDeptToThird")'>{{msg["syncDeptToThird"]}}</el-button>
  <!-- <ever-table
  table-class="flex_layout_scroll"
  :data="list"
  :table-loading="loading"
  :columns="columns"
  :config-option="configOption"
  :border='true'
  @eventChange="eventChange"
  :maxBtnCount='5'
  >
</ever-table> -->
</div>
</template>

<script lang="js">
import api from '@/systemset/store/api.js'
// import {SYSTEMSET_TECHTHIRDCONFIG} from '@/util/table-config.js'
import storage from '@/util/storage.js'
export default {
  name: 'data-import',
  props: [],
  mounted () {
  },
  data () {
    // let columns = [
    //   {
    //     prop: 'name',
    //     label: '机构名称',
    //   },
    //   {
    //     prop: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
    //     type: 'btns',
    //     label: '操作',
    //     btns: [ // 当btns的有效长度超过3时，会出现更多按钮
    //       'del', // edit对应primary的编辑 del对应danger的删除
    //       {
    //         prop: 'inspectBatchService',
    //         label: '同步医嘱项',
    //       },
    //       {
    //         prop: 'collect',
    //         label: '同步医生',
    //       },
    //       {
    //         prop: 'collect',
    //         label: '同步科室',
    //       },
    //     ],
    //   },
    // ]
    return {
      api,
      msg: {
        inspectBatchService: '同步检验医嘱项',
        syncStaffToThird: '同步医生',
        syncDeptToThird: '同步科室'
      }
      // activeName: '801',
      // list: [{name: '尚医智信'}, {name: '尚医智信'}, {name: '尚医智信'}],
      // loading: false,
      // columns,
      // configOption: {
        // id: SYSTEMSET_TECHTHIRDCONFIG
      // }
    }
  },
  methods: {
    async sync(method) {
      let res = await this.api[method]({
        tenantId: storage.getLocalStorage('TENANTID'),
        orgId: storage.getLocalStorage('CLINICID')
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', `${this.msg[method]}成功`, '提示')
      }
    }
    // handleClick() {
    //   this.loading = true
    //   setTimeout(_ => {
    //     this.loading = false
    //   }, 1000)
    // },
    // async eventChange ({ prop, row, col }) {
    //   if (prop === 'del') {
    //   } else if (prop === 'inspectBatchService') {
    //     let res = await this.api.inspectBatchService({
    //       tenantId: '',
    //       orgId: ''
    //     })
    //     console.log(res)
    //   }
    // },
  },
  computed: {

  }
}

</script>

<style scoped lang="scss">
  .techthirdconfig{
    /deep/ .el-tabs__item {
        padding-left: 40px;
        padding-right: 40px!important;
    }
    .tip{
      font-size:14px;
    }
  }
</style>
