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
    <el-dialog
      title="关联人员"
      :visible.sync="dialog"
      :close-on-click-modal="false"
    >
      <ever-staff-select v-model="staffList" multiple fields="id" :params="staffParams"></ever-staff-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddStaff()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import '@/warehouse/page/building/assets/index.less'
  import {sickAreaColumns} from '@/warehouse/page/building/views/sickarea/model'
  import storage from '@/util/storage'

  const querySchema = [
    {
      name: 'sickAreaName',
      label: '病区名称',
    }
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.sickArea.pageList,
        columns: sickAreaColumns,
        staffList: [],
        staffParams: {
          orgId: storage.getStorageByClinic('CLINICID'),
          typeCode: 'NURSE',
        },
        sickArea: {},
        dialog: false,
      }
    },
    created () {
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'building-sickArea-detail', params: {type: 'create', id: '-1'}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.sickArea.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'building-sickArea-detail', params: {id, type: 'edit'}})
      },
      addStaff (row) {
        this.sickArea = row
        this.dialog = true
        // 查询已经关联了
        request(urlMap.sickArea.getById, {id: row.id}).then(res => {
          if (res.head.errCode === 0) {
            this.originList = res.data.tsStaffIdList || []
            this.staffList = (res.data.tsStaffIdList || []).slice(0)
          }
        })
      },
      submitAddStaff () {
        request(urlMap.sickArea.relationStaffList, {
          id: this.sickArea.id,
          sickAreaCode: this.sickArea.sickAreaCode,
          sickAreaName: this.sickArea.sickAreaName,
          tsStaffIdList: this.getDiff(this.originList, this.staffList), // 取 新值中有，老值中没有 的值
          removeTsStaffIdList: this.getDiff(this.staffList, this.originList), // 取 老值中有，新值中没有 的值
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '关联成功')
          }
          this.dialog = false
        })
      },
      // 找出after中有，before中没有的值
      getDiff (before, after) {
        return after.filter(aItem => !before.some(item => item === aItem))
      }
    },
  }
</script>
