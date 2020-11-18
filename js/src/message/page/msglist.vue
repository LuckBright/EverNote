<template>
  <div id="messagelist">
    <ever-bread-crumb name="消息中心" show-edit-fnt="false" :have-return="false"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2 :schema="querySchema" ref="form" v-model="queryObj" :inline="true" :is-query="true" @query="list(true)">
        <template slot="times">
          <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
        </template>
      </ever-form2>
      <el-row class="itemrow" v-for="(item, i) in tableData" :key="i" style="cursor: pointer;">
        <div @click="readMsg(item.id, item.status)">
          <el-col :span="20" class="title">
            <p class="p-content">
              <i v-if="item.status === 0"></i>{{item.content}}
              <a @click="handleDayKnot(i)" v-if="item.dayKnot && item.category !== 35" class="report ml20 f16" :href="`${$ever.rcmIndex}${item.dayKnot}`" target="_blank">去处理</a>
              <a @click="handleDayKnot(i)" v-if="item.category === 35" class="report ml20 f16" :href="`${item.extend1}`" target="_blank">去处理</a>
            </p>
          </el-col>
          <el-col :span="4" class="time" align="right">{{item.createTime}} <i class="el-icon-arrow-right"></i></el-col>
        </div>
        <!-- <el-col :span="24" class="tags"><label>服务通知</label></el-col> -->
      </el-row>
      <el-row class="itemrow" v-if="tableData.length === 0">
        <el-col :span="20" class="title">
          <p class="p-content">
            暂无数据
          </p>
        </el-col>
      </el-row>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current">
      </ever-pagination>
    </div>
  </div>
</template>
<script>
  import {MESSAGE_CHANNEL_DAY_KNOT} from '@/util/common'
  import urlMap from '@/msgcenter/store/urls'
  import { request } from '@/util/req'

  let querySchema = [
    {
      name: 'times',
      label: '时间：',
      comp: 'custom',
      span: 4
    }
  ]
  export default {
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.times = []
      queryObj.startTime = ''
      queryObj.endTime = ''
      return {
        // api,
        queryObj,
        querySchema,
        // 判断是否跳转route
        dayKnotFlag: true,
        tableData: [],
        pagesize: 20,
        offset: 0,
        totalCount: 0,
        current: 1
      }
    },
    created () {
      this.list()
    },
    methods: {
      list () {
        let params = {
          pagesize: this.pagesize,
          offset: this.offset
        }
        let tmp = Object.assign(params, this.queryObj)
        request(urlMap.msg.notice.search, tmp, 'get').then(res => {
          if (res.data.resultList && res.data.resultList.length) {
            this.tableData = res.data.resultList
            this.totalCount = res.data.totalCount
          } else {
            this.tableData = []
            this.totalCount = 0
          }
        })
      },
      handleSizeChange (val) {
        this.pagesize = val
        this.current = 1 // 切换size时，自动重置current
        this.offset = (this.current - 1) * this.pagesize
        this.list()
      },
      handleCurrentChange (val) {
        this.current = val
        this.offset = (val - 1) * this.pagesize || 0
        this.list()
      },
      // 日结点击去处理按钮
      handleDayKnot (index) {
        this.dayKnotFlag = false
        this.tableData[index].status = 1
      },
      readMsg (id, status) {
        // 状态为0或者点击去处理时调用
        if (status === 0 || !this.dayKnotFlag) {
          request(urlMap.msg.notice.read, { id: id }, 'get')
        }
        if (this.dayKnotFlag) {
          this.$router.push({path: '../msgcenter/content', query: {id: id}})
        }
        this.dayKnotFlag = true
      }
    },
    watch: {
      'tableData' (arr) {
        if (arr && arr.length) {
          arr.forEach(item => {
            MESSAGE_CHANNEL_DAY_KNOT.forEach(dayKnot => {
              if (item.content) {
                let itemCon = item.content.slice(0, 5)
                if (itemCon === dayKnot.param) {
                  item.dayKnot = dayKnot.dayKnotRoute
                  item.content = item.content.slice(6)
                }
              }
            })
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .p-content{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
  .report{color:#1c7bef !important;}
</style>
