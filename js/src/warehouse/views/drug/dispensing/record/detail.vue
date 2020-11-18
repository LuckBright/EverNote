<template>
  <div>
    <ever-bread-crumb class="js-bread-crumb" name="查看详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner" style="overflow: auto; min-height: 100px" v-loading="loading">
      <list-table :listData="listData"
                  :pageType="4"></list-table>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import listTable from '@/warehouse/views/drug/component/dispensing.task.list'
import focusUrl from '@/warehouse/views/drug/api/focusdispenseapi'
export default {
  name: 'detail',
  data () {
    return {
      loading: false,
      listData: []
    }
  },
  components: {
    listTable
  },
  created () {
    this.getList(this.$route.query.id)
  },
  methods: {
    getList (id) {
      this.loading = true
      request(focusUrl.getRecordDetail,
        { id: id },
        'post').then(res => {
          this.loading = false
          if (res.head.errCode === 0) {
            this.listData = [res.data]
          }
        })
    },
  }
}
</script>

