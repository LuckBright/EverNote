<template>
  <div class="tablewrap">
    <div class="flex_col_1_auto">
      <div class="inner">
        <div class="header">
          <div class="hospital">
            <span>{{clinicName}}</span>
          </div>
          <table cellpadding="0" cellspacing="0" class="wrap line">
            <thead>
              <tr>
                <th :style="{minWidth: width + 'px', maxWidth: width + 'px'}">
                  <div>护士</div>
                </th>
                <th
                  :style="{minWidth: width + 'px', maxWidth: width + 'px'}"
                  v-for="item, i in arrangeweek"
                  :key="i"
                  :class="{blue: item.date === $moment().format('YYYY-MM-DD')}"
                >
                  <div>
                    <label>{{item.weekDate}}</label>
                    <em v-if="item.date === $moment().format('YYYY-MM-DD')">今</em>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(value, index) in tabledata.searchByAssistantAssistantResponseList"
                :key="index"
              >
                <td>{{value.staffName}}</td>
                <td
                  v-for="(item, index) in arrangeweek"
                  :key="`table_body_${index}`"
                  @click="clicktable(value,item)"
                >
                  <template v-if="value.searchByAssistantDateResponseList[item.date]">
                    <p
                      v-for="(detail,t) in value.searchByAssistantDateResponseList[item.date].arrangeList"
                      :key="`p_${t}`"
                    >
                      {{detail.timeTrunkName}}/
                      <template
                        v-for="(last,i) in detail.relationList"
                      >{{last.name}}/</template>
                      {{detail.arrangeUseName}}
                    </p>
                  </template>
                  <p v-else></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import nurseapi from '@/arrange/store/nurseapi'
export default {
  props: ['arrangeweek', 'tabledata', 'clinicName'],
  data () {
    return {
      nurseapi,
      width: 160,
      getval: ''
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    clicktable (value, item) {
      if (value.searchByAssistantDateResponseList[item.date] && value.searchByAssistantDateResponseList[item.date].arrangeList) {
        let ids = []
        value.searchByAssistantDateResponseList[item.date].arrangeList.map(item => {
          ids.push(item.id)
        })
        this.nurseapi.getNurseResourceArrange({ ids: ids })
          .then(rs => {
            if (rs.head.errCode || !rs.data || !rs.data.arrangeList || rs.data.arrangeList.length === 0) {
              return false
            }
            this.getval = rs.data.arrangeList
            let obj = {
              val: value,
              getval: rs.data.arrangeList,
              hasval: 1,
              baseinfo: {
                resourceId: value.staffId,
                resourceName: value.staffName,
                date: item.date
              }
            }
            this.$emit('showpup', obj)
          })
      } else {
        let obj = {
          baseinfo: {
            resourceId: value.staffId,
            resourceName: value.staffName,
            date: item.date
          },
          hasval: 0
        }
        this.$emit('showpup', obj)
      }
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
}
.tablewrap {
  background: #eee;
}
table.wrap {
  font-size: 14px;
}
table {
  width: 100%;
}
.hospital {
  width: 99.92%;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #ddd;
}
.hospital span {
  margin-left: 20px;
}

table.line {
  border: 1px solid #ddd;
  border-bottom: none;
}
table.wrap thead tr th {
  padding: 8px 30px 8px 10px;
  min-height: 50px;
  font-size: 16px;
  font-weight: normal;
  border-left: 1px solid #ddd;
  background: #eee;
  position: relative;
}
table.wrap thead tr th.blue {
  color: #1c7bef;
}
table.wrap thead tr th em {
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  background: #1c7bef;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  font-style: normal;
  border-radius: 1px;
}
table.wrap thead tr th:first-child {
  padding: 15px 10px;
}
table.wrap thead tr th:last-child {
  border-right: 1px solid #ddd;
}
table.wrap tbody tr td {
  width: 12.3%;
  padding: 15px 30px 15px 10px;
  background: #fff;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  min-height: 50px;
  position: relative;
}
table.wrap tbody tr td:last-child {
  border-right: 1px solid #ddd;
}
table.wrap tbody tr td:first-child {
  border-left: none;
  text-align: center;
  line-height: 1.2;
  padding: 15px 10px;
}
table.wrap tbody tr:last-child td {
  border-bottom: none;
}
table.wrap tbody tr td .add {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: 30px;
  text-align: center;
  background: #eee;
  display: none;
  cursor: pointer;
  z-index: 999;
}
table.wrap tbody tr td .add i.iconfont {
  position: absolute;
  left: 50%;
  margin-left: -8px;
  top: 50%;
  margin-top: -8px;
  color: #1c7bef;
}
table.wrap tbody tr td:hover .add {
  display: block;
}
table.wrap tbody tr td .mask {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}
.tablewrap .body {
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid #ddd;
  max-height: calc(75vh - 130px);
}
.inner {
  width: 100%;
  display: table;
}
table.wrap tbody tr td:first-child {
  border-left: 1px solid #ddd;
}
table.wrap tbody tr.before td:first-child {
  border-left: none;
}

table.wrap tbody tr td {
  text-align: center;
  padding: 15px 10px;
  min-height: 50px;
}

table.wrap tbody tr td.week {
  text-align: left;
}

table.wrap tbody tr.after td:first-child {
  border-bottom: none;
}
</style>
