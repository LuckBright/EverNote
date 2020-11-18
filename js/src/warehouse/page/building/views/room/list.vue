<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="true"
        :ext-btn-string="'新建'"
        :ext-class-name="'fr'"
        @extAction="toPage"
      >
        <template slot="default">
          <el-form-item>
          </el-form-item>
        </template>
        <template slot="buildingCode">
          <el-form-item>
            <el-select v-model="queryObj.buildingCode" clearable filterable>
              <el-option v-for="item in buildingList"
                :key="item.buildingCode"
                :value="item.buildingCode"
                :label="item.buildingName"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :params.sync="queryObj"
      :columns="columns"
      is-auto-height
      @eventChange="eventChange"
    ></ever-table>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import '@/warehouse/page/building/assets/index.less'
  import {roomColumns} from '@/warehouse/page/building/views/room/model'

  const querySchema = [
    {
      name: 'roomName',
      label: '房间名称',
    },
    {
      name: 'buildingCode',
      label: '建筑名称',
      comp: 'custom',
    },
    {
      name: 'roomPurposeCode',
      label: '房间用途',
      comp: 'sys-type',
      props: {
        code: 'THC_WH_ROOM_PURPOSE',
        clearable: true,
      }
    },
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.room.pageList,
        columns: roomColumns,
        buildingList: [],
      }
    },
    created () {
      this.searchBuildingList()
    },
    methods: {
      searchBuildingList () {
        request(urlMap.building.pageList).then(res => {
          this.buildingList = res.data.pageList || []
        })
      },
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'building-room-detail', params: {type: 'create', id: '-1'}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.room.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'building-room-detail', params: {id, type: 'edit'}})
      },
    },
  }
</script>
