<template>
  <div id="consultlist" class="layout_inner">
    <el-row>
      <el-col :span="20">
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list(true)">
          <template slot="name">
            <el-autocomplete class="input-new-tag" v-model="queryObj.name" ref="saveTagInput" size="small" :fetch-suggestions="querySearch" :select-when-unmatched='true' @select="handleSelect">
            </el-autocomplete>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="4" style="text-align:right;">
        <el-button type="primary" @click="createTag">创建标签</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-if="visible" @selection-change="handleSelectionChange" :data="tableData" border class="el-td-border" highlight-current-row>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="名称" width="140">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit && scope.row.status == 0" v-model.trim="scope.row.name" maxlength="20"></el-input>
              <label v-if="scope.row.status == 1" class="indisable">{{scope.row.name +'(已禁用)' || '--'}}</label>
              <label v-if="!scope.row.isEdit && scope.row.status == 0">{{scope.row.name || '--'}}</label>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="140">
            <template slot-scope="scope">
              <label v-if="scope.row.typeId == 1">自由标签</label>
              <label v-else>行为标签</label>
            </template>
          </el-table-column>
          <el-table-column label="关联数量" align="center" width="100">
            <template slot-scope="scope">
              <a v-if="scope.row.status == 1">{{'--'}}</a>
              <a v-else @click="linkmember(scope.row)">{{scope.row.memberNum || '--'}}</a>
            </template>
          </el-table-column>
          <!-- <el-table-column label="是否常用" align="center" width="160">
            <template slot-scope="scope" v-if="scope.row.typeId === 1">
              <div v-if="scope.row.isEdit && scope.row.status === 0">
                <el-radio-group v-model="scope.row.highFrequency">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </div>
              <div v-if="scope.row.status === 1" class="discolor">
                <sys-value type="THC_CC_LABEL_FREQUENT" :code="scope.row.highFrequency"></sys-value>
              </div>
              <div v-if="!scope.row.isEdit && scope.row.status === 0">
                <sys-value type="THC_CC_LABEL_FREQUENT" :code="scope.row.highFrequency"></sys-value>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column show-overflow-tooltip label="颜色" align="center" min-width="120">
            <template slot-scope="scope">
              <el-row v-if="scope.row.typeId == 1">
                <div v-if="scope.row.status == 1" class="discolor"  align="center">
                  <span v-if="scope.row.color">
                    <div :style="'width:22px;height:10px;background-color:' + scope.row.color "></div>
                  </span>
                  <span v-else>--</span>
                </div>
                <div v-if="scope.row.status != 1 && scope.row.highFrequency == 0">
                  <div v-if="scope.row.isEdit">
                    <el-select v-model="scope.row.color" placeholder="请选择">
                      <el-option v-for="item in colorArr" :key="item.value" :label="item.label" :value="item.value">
                        <span style="float: left">
                          <div :style="'width:22px;height:10px;margin-top: 12px;background-color:' + item.value "></div>
                        </span>
                        <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </div>
                  <div v-else align="center">
                    <span v-if="scope.row.color">
                      <div :style="'width:22px;height:10px;background-color:' + scope.row.color "></div>
                    </span>
                    <span v-else>--</span>
                  </div>
                </div>
                <span v-else>--</span>
              </el-row>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="颜色优先级" align="center" min-width="120">
            <template slot-scope="scope">
              <el-row v-if="scope.row.typeId == 1">
                <div v-if="scope.row.status != 1 && scope.row.highFrequency == 0">
                  <div v-if="scope.row.isEdit">
                    <el-select v-model="scope.row.priority" placeholder="请选择">
                      <el-option v-for="item in priorityArr" :key="item.value" :label="item.label || 0" :value="item.label || 0"></el-option>
                    </el-select>
                  </div>
                  <div v-else align="center">
                    <span v-if="(scope.row.priority || scope.row.priority == 0) && scope.row.highFrequency == 0">{{scope.row.priority}}</span>
                    <span v-else>--</span>
                  </div>
                </div>
                <div v-else align="center">
                  <span v-if="(scope.row.priority || scope.row.priority == 0) && scope.row.highFrequency == 0">{{scope.row.priority}}</span>
                  <span v-else>--</span>
                </div>
              </el-row>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="创建者" align="center" min-width="120">
            <template slot-scope="scope">
              {{scope.row.creatorName || '--'}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="160">
            <template slot-scope="scope">
              {{scope.row.createTime || '--'}}
            </template>
          </el-table-column>
          <el-table-column label="修改者" align="center" width="180">
            <template slot-scope="scope">
              {{scope.row.operatorName || '--'}}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" width="180">
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <div v-if="!scope.row.isEdit">
                <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
              </div>
              <div v-if="scope.row.status == 0 && scope.row.isEdit">
                <el-button type="warning" size="small" @click="disabledTags(scope.row)">禁用</el-button>
                <el-button type="success" size="small" @click="saveTags(scope.row)">保存</el-button>
              </div>
              <div v-if="scope.row.status == 1 && scope.row.isEdit">
                <el-button type="warning" size="small" @click="recoverTags(scope.row)">恢复</el-button>
                <el-button type="success" size="small" @click="saveTags(scope.row)">保存</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-col>
    </el-row>
    <dialog-tag ref="tags" @update="() => this.list()"></dialog-tag>
  </div>
</template>
<script>
import api from '@/crm/store/tagapi'
import utillist from '@/util/list'
import dialogTag from './dialog.addtag.vue'
import { colorArr, priorityArr } from './tag.config.js'
let querySchema = [
  // {
  //   name: 'highFrequency',
  //   label: '是否常用',
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_CC_LABEL_FREQUENT',
  //     useValue: true,
  //     placeholder: '全部'
  //   },
  //   style: {
  //     width: '120px',
  //     display: 'block'
  //   }
  // },
  {
    name: 'name',
    label: '标签',
    comp: 'custom'
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      noStoreQuery: true,
      selected: [],
      initUpdateVal: '',
      restaurants: [],
      timeout: null,
      colorArr,
      priorityArr,
      cvalue: '',
      priorityValue: ''
    }
  },
  created () {},
  methods: {
    edit (val) {
      this.cvalue = val.color
      this.priorityValue = val.priority
      this.initUpdateVal = val.name
      val.isEdit = true
    },
    createTag () {
      this.$refs.tags.open()
    },
    saveTags (val) {
      if (!val.name.trim()) return this.$messageTips(this, 'warning', '名称不能为空')
      this.api
        .validModify({
          name: val.name,
          id: val.id,
          color: val.color,
          priority: val.priority,
          status: val.status,
          typeId: val.typeId
        })
        .then(rs => {
          if (rs.data.flag === 0) {
            this.$confirm(
              this.initUpdateVal +
                '标签已关联' +
                rs.data.valid.memberNum +
                '个会员，是否要合并到' +
                val.name +
                '标签',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.modify(val)
            })
          } else if (rs.data.flag === 1) {
            this.$confirm(
              '此颜色或者优先级已被 "' +
                rs.data.valid +
                '" 标签使用，是否要换成该标签？换成该标签后，原标签的颜色和颜色优先级将置为空。',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.modify(val)
            })
          } else if (rs.data.flag === 2) {
            this.modify(val)
          }
        })
    },
    modify (val) {
      this.api
        .modify({
          id: val.id,
          name: val.name,
          highFrequency: val.highFrequency,
          color: val.color ? val.color : '',
          priority: val.priority || val.priority === 0 ? val.priority : '',
          status: val.status,
          typeId: val.typeId
        })
        .then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.tableDataline(val)
          }
        })
    },
    linkmember (obj) {
      if (obj.memberNum) {
        this.$router.push({
          path: 'member',
          query: { q: JSON.stringify({ labelIds: [obj.id], labelIdName: [{ name: obj.name, id: obj.id }] }) }
        })
      }
    },
    disabledTags (val) {
      this.$confirm('您确定要禁用此标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.updateStatus({ id: val.id, status: 1 }).then(rs => {
          this.tableDataline(val)
        })
      })
    },
    recoverTags (val) {
      this.$confirm('您确定要启用此标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.updateStatus({ id: val.id, status: 0 }).then(rs => {
          this.tableDataline(val)
        })
      })
    },
    handleSelectionChange (val) {
      this.selected = val.filter(item => {
        item.mobile = item.contactMobile
        return item.patientId !== null
      })
    },
    tableDataline (val) {
      this.tableData.forEach((item, index) => {
        if (item.id === val.id) {
          item.isEdit = false
          this.query(this.queryObj)
        }
      })
    },
    querySearch (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      cb(results)
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect (item) {},
    getList () {
      this.api.list({ status: 0 }).then(rs => {
        this.restaurants = rs.data.resultList
      })
      // this.api.list({ highFrequency: 0, status: 0 }).then(rs => {
      //   this.restaurants = rs.data.resultList
      // })
    }
  },
  mounted () {
    this.getList()
  },
  components: {
    dialogTag
  }
}
</script>
<style scoped>
#consultlist .title .el-col {
  height: 36px;
  line-height: 36px;
}
#consultlist .title .el-col strong {
  font-size: 18px;
}
#consultlist .title .el-col span {
  font-size: 12px;
}
#consultlist .tab {
  vertical-align: top;
}
#consultlist .tab .el-button {
  margin: 0;
  border-radius: 0;
  width: 25%;
}
.indisable {
  text-decoration: line-through;
  color: #999999;
}
.discolor {
  color: #999999;
}
</style>
