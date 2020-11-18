<template>
  <div class="layout_inner">
    <div class="main-head">
      <el-button type="primary" class="fr" @click="addData">新建</el-button>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      row-key="id"
      :columns="allColumns"
      :params.sync="params"
      :url="url"
      @del="del"
      @edit="edit">
    </ever-table>
    <dialog-add :is-show.sync="showAdd" :team-id="currentData.row.id" @success="list"></dialog-add>
  </div>
</template>

<script>
import api from '@/titancare/api/team/teamapi'
import dialogAdd from './doctor-team-add.vue'
import urlMap from '@/titancare/utils/urls'

export default {
  data () {
    return {
      api,
      showAdd: false,
      url: urlMap.team.search,
      allColumns: [
        {
          prop: 'name',
          label: '专家团队名称',
        },
        {
          prop: 'leaderName',
          label: '带头人',
        },
        {
          prop: 'imName',
          label: '聊天成员',
        },
        {
          prop: 'doctorName',
          label: '医生团队',
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '350',
          btns: ({ row }) => {
            let baseBtns = [
              'edit',
              'del'
            ]
            return baseBtns
          }
        }
      ],
      currentData: {
        row: {
          id: ''
        }
      },
      params: {}
    }
  },
  created () {
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    eventChange ({ prop, row, col }) {
      this[prop] && this[prop](row)
    },
    addData () {
      this.currentData.row = {}
      this.showAdd = true
    },
    edit (row) {
      this.currentData = row
      this.showAdd = true
    },
    del (row) {
      this.api.deleteTeam({ id: row.row.id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.list()
        }
      })
    }
  },
  components: {
    dialogAdd
  }
}
</script>
