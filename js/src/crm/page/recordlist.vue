<template>
  <div id="messagelist">
    <ever-bread-crumb name="沟通记录" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <el-row class="itemrow" v-for="(item,i) in tableData" :key="i">
        <div>
          <li class="chatcontent">
            <p><span>{{item.content}}</span></p>
            <p class="operator"><span>{{item.doctorName || '--'}}  添加于  {{item.createTime}}     沟通方式：<sys-value type="THC_CC_MEMBER_CHANNEL_COMM" :code="item.type.toString()"></sys-value></span></p>
          </li>
        </div>
      </el-row>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
  </div>
</template>
<script>
  import api from '../store/memberchannelapi'
  import utillist from '../../util/list'
  export default {
    mixins: [utillist],
    data () {
      return {
        api,
        id: this.$route.query.id,
        offset: 0,
        pagesize: 20
      }
    },
    methods: {
      list () {
        this.api.list({channelId: this.id, 'offset': this.offset, 'pagesize': this.pagesize}).then(rs => {
          if (rs.head.errCode === 0) {
            this.tableData = rs.data.resultList
            this.totalCount = rs.data.totalCount
          } else {
            this.tableData = []
            this.totalCount = 0
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .p-content{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
</style>
