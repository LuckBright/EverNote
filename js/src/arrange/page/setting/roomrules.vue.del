<template>
    <div id="roomrules" class="table_border_all">
      <div class="flex_column_1_hidden layout_inner">
        <el-row class="search-audit">
          <el-col :span="20">
            <el-form :model="queryObj" size="small" :inline="true" label-width="10" label-position="right">
              <el-form-item>
                <el-select v-model="template" placeholder="请选择模版" value-key="id">
                  <el-option v-for="item in templateList" :key="item.id" :value="item" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectOrgan" placeholder="请选择机构" value-key="organId">
                  <el-option v-for="item in template.templetOrgList" :key="item.organId" :value="item" :label="item.organName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <dept-cascader v-model="selectDept" :organ-id="queryObj.organId" :template-type="template.timeTrunkType"></dept-cascader>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="reload" icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="flex_col_1_hidden main-wrap">
          <el-table
            height="100%"
            :data="tableData"
            v-loading="loading"
            border
            class="table-height-30"
            style="width: 100%">
            <el-table-column
              prop="resourceName"
              label="房间名称"
              width="">
            </el-table-column>
            <el-table-column
              prop="useName"
              label="房间用途"
              width="">
            </el-table-column>
            <el-table-column
              prop="roomCode"
              label="房间编码">
            </el-table-column>
            <el-table-column
              prop="useName"
              label="分诊方式">
              <template slot-scope="scope">
                {{scope.row.triageType===1?'人工分诊':'无分诊'}}
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="triageType"
              label="分诊规则">
            </el-table-column> -->
            <el-table-column
              align="center"
              label="操作"
              width="160">
              <template slot-scope="scope">
                <span><add-clinic-code @reload="reload" :resourceId="scope.row.resourceId" :roomObj="scope.row"></add-clinic-code></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<script>
  import api from '@/arrange/store/roomrulesapi'
  import tempapi from '@/arrange/store/templateapi'
  import panelapi from '@/sob/store/service.panel'
  import sourceapi from '@/arrange/store/sourceapi'
  import list from '@/util/list'
  import roomtips from './dialog-roomtips'
  import deptCascader from '@/arrange/page/scheduling/deptcascader'
  import addTempTrunk from '@/arrange/page/setting/addtemptrunk'
  import resource from '@/arrange/page/scheduling/resource.vue'
  import addClinicCode from '@/arrange/page/setting/addcliniccode.vue'
  import storage from '@/util/storage'
  export default {
    mixins: [list],
    data () {
      return {
        api,
        tempapi,
        panelapi,
        sourceapi,
        templateList: [],
        tableData: [],
        loading: false,
        queryObj: {
          resourceType: 'SPACE_CONSULTING_ROOM',
          arrangeDate: '',
          templetId: '',
          orgId: '',
          deptId: '',
          offset: 0,
          pageSize: 20
        },
        offset: 0,
        pageSize: 20,
        template: '',
        selectOrgan: '',
        selectDept: '',
        totalCount: 0,
        deptParams: {
          relationType: 401,
          relationId: storage.getLocalStorage('USERID')
        }
      }
    },
    created () {
      this.queryObj.resourceType = 'SPACE_CONSULTING_ROOM'
      this.queryObj.requestSwitch = true
      this.getDptinfo(this.deptParams)
      this.getTemplateList()
    },
    watch: {
      template: {
        handler (val) {
          if (val.templetOrgList && val.templetOrgList[0]) {
            this.selectOrgan = val.templetOrgList[0]
          }
          this.queryObj.templetId = val.id
        },
        deep: true
      },
      selectOrgan: {
        handler (val) {
          this.queryObj.organId = val.organId
        },
        deep: true
      },
      selectDept: {
        handler (val) {
          if (val && val.id) {
            this.queryObj.deptId = val.id
          } else {
            this.queryObj.deptId = ''
          }
        },
        deep: true
      },
      queryObj: {
        handler (val) {
          if (val.templetId && val.organId && val.resourceType) {
            this.list()
          }
        },
        deep: true
      }
    },
    methods: {
      getTemplateList () {
        this.tempapi.list().then(rs => {
          if (rs.head.errCode) {
            return false
          }
          if (rs && rs.data[0]) {
            this.templateList = rs.data
            this.template = rs.data[0]
            this.selectOrgan = this.template.templetOrgList[0]
          }
        })
      },
      reload () {
        this.list()
      },
       // 获取当前登录用户科室信息
      getDptinfo (params) {
        this.panelapi.getLocalSectionVoBySearch(params).then(rs => {
          if (rs && rs[0]) {
            this.queryObj.requestSwitch = false
            this.selectDept = rs[0]
          } else {
            this.queryObj.requestSwitch = true
          }
        })
      }
    },
    components: {
      deptCascader,
      resource,
      addTempTrunk,
      roomtips,
      addClinicCode
    }
}
</script>
<style scoped>
.table_border_all{background: #ffffff;}
</style>
