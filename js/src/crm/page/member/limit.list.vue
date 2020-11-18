<template>
  <div class="bg">
    <el-row class="pd">
      <el-col :span="24" align="right">
        <el-button class="cBule" @click="add" type="primarty">添加业务限制</el-button>
      </el-col>
    </el-row>
    <el-row class="pd">
      <el-col>
        <el-table
          :data="tableData"
          border
          class="el-td-border"
          highlight-current-row>
          <el-table-column
            label="添加日期"
            align="center"
            :span="2">
            <template slot-scope="scope">
              {{$moment(scope.row.createTime).format('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column
            label="限制期"
            align="center"
            :span="2">
           <template slot-scope="scope">
             <span v-if="scope.row.timeWay === 1">永久</span>
             <span v-else>{{scope.row.timeNum}}{{timeTypeArr[scope.row.timeType]}}</span>
           </template>
          </el-table-column>
          <el-table-column
            label="结束日期"
            align="center"
            :span="2">
            <template slot-scope="scope">
              <span v-if="scope.row.timeWay === 1">{{'永不失效'}}</span>
              <span v-else>{{scope.row.invalidTime && $moment(scope.row.invalidTime).format('YYYY-MM-DD') || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="受限范围"
            :span="2">
            <template slot-scope="scope">
              <span v-if="scope.row.scopeType === 1">全集团</span>
              <span v-show="scope.row.scopeType === 2">医生：{{scope.row.scopeDoctorNames && scope.row.scopeDoctorNames.map(item => item.name).join()}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="受限业务"
            align="center"
            :span="2">
            <template slot-scope="scope">
              <span class="cBlue" v-show="scope.row.service" @click="showInfo(scope.row.id)">{{scope.row.service.split(',').map(item => serviceType[item]).join()}}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="备注"
            align="center"
            :span="3">
            <template slot-scope="scope">
              {{scope.row.reason || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            :span="1">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">生效中</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            :span="2">
            <template slot-scope="scope" v-if="scope.row.status === 1">
              <el-button type="primary" size="small" @click="editShow(scope.row.id)">修改</el-button>
              <el-button type="danger" size="small" @click="stopped(scope.row.id)">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" 
          :current="current">
        </ever-pagination>
      </el-col>
    </el-row>
    <dialog-restrict
      ref="restrict"
      :visible="showRestrict"
      :title="title"
      @update="update"
      :id="rowId"
      :editHide="true"
      :isreadOnly="isreadOnly"
      :isEdit="isEdit"
      @change="change"
    ></dialog-restrict>
  </div>
</template>
<script>
  import dialogRestrict from '@/crm/page/member/dialog.restrict'
  import list from '@/util/list'
  import api from '@/crm/store/greydenyapi'
  export default {
    props: ['visiable'],
    mixins: [list],
    data () {
      return {
        api,
        rowId: '',
        showRestrict: false,
        tableData: [],
        timeTypeArr: {
          1: '年',
          2: '月',
          5: '天'
        },
        serviceType: {
          '1': '预约',
          '2': '挂号'
        },
        isreadOnly: false,
        isEdit: false,
        patientObj: {},
        title: ''
      }
    },
    watch: {
      'visiable': {
        handler: function (val) {
          if (val === 'three') {
            this.list()
            this.getPatientInfo()
          }
        },
        immediate: true
      }
    },
    methods: {
      list () {
        api.getByPatientId({'patientId': this.$route.params.patientId}).then(rs => {
          this.tableData = rs.data.resultList || []
          this.totalCount = rs.data.totalCount || 0
        })
      },
      async getPatientInfo () {
        await api.searchfuzzy({'keyword': this.$route.params.patientId}).then(rs => {
          this.patientObj = rs.data.resultList[0]
        })
      },
      add () {
        this.showRestrict = true
        this.isEdit = false
        this.isreadOnly = false
        this.rowId = ''
        this.title = '添加用户限制'
        api.searchfuzzy({'keyword': this.$route.params.patientId}).then(rs => {
          this.$children[2].selectPatient(rs.data.resultList[0])
        })
        this.$refs.restrict.open()
      },
      stopped (id) {
        this.$confirm('你确定要停用此用户的业务限制吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.stop({'id': id}).then(rs => {
            if (rs.head.errCode === 0) {
              this.list(true)
            }
          })
        })
      },
      update (val) {
        this.showRestrict = val
        this.list()
      },
      editShow (val) {
        this.showRestrict = true
        this.rowId = val
        this.isEdit = true
        this.title = '修改用户限制'
        this.$refs.restrict.open()
      },
      showInfo (val) {
        this.showRestrict = true
        this.isreadOnly = true
        this.rowId = val
        this.$refs.restrict.open()
      },
      change (val) {
        this.isreadOnly = false
      }
    },
    components: {
      dialogRestrict
    }
  }
</script>
