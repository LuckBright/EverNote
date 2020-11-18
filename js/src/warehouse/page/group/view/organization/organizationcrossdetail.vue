<template>
  <div id="supply">
    <ever-bread-crumb name="返回" path="/manages/organizationscross" showTitle="true" :pathTo="false"></ever-bread-crumb>
    <div class="layout_inner flex outer">
      <div class="main-head">
        <div class="mb10">
          <span v-if="objId" class="f14">当前父节点为 <span class="blue">{{obj.clinicName}} > {{obj.storageRoomName}}</span> ，请设置子节点</span>
          <span v-else-if="parentData.label" class="f14">当前父节点为 <span class="blue">{{parentData.label}}</span> ，请设置子节点</span>
          <span v-else class="f14">请先设置父节点再添加子节点</span>
        </div>
      </div>
      <div class="main-body flex outer">
        <div class="custom-table flex outer">
          <div class="head">
            <el-row>
              <el-col :span="8">
                <div class="grid center">跨机构供应关系</div>
              </el-col>
              <el-col :span="16">
                <div class="grid center">设置</div>
              </el-col>
            </el-row>
          </div>
          <div class="body flex outer">
            <div class="content overflow item outer">
              <div>
                <el-row>
                  <el-col :span="24">
                    <div class="thead">
                      <el-row>
                        <el-col :span="objId || parentData.label ? 8 : 10">
                          <div class="grid">
                            <div v-if="objId"><span v-if="obj.clinicName">{{obj.clinicName}} > {{obj.storageRoomName}}</span></div>
                            <div v-else-if="parentData.label">{{parentData.label}}</div>
                            <div v-else class="center middle-div">
                              <ever-select size="small" v-model="parentData.clinicId" :options="clinicStorageParentData" placeholder="机构名称"></ever-select>
                              <!-- <ever-org-select v-model="parentData.clinicId" fields="id" type="select"></ever-org-select> -->
                              <ever-select size="small" v-model="parentData.storageId" :options="clinicStorageChildData" placeholder="机构库房"></ever-select>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="objId || parentData.label ? 14 : 12">
                          <div class="grid">&nbsp;</div>
                        </el-col>
                        <el-col :span="2">
                          <div class="grid center">
                            <span v-if="objId"><el-button size="small" type="text" @click="handleParentDel(objId)">删除</el-button></span>
                            <span v-else-if="parentData.label"></span>
                            <span v-else><el-button size="small" type="text" :disabled="!parentData.storageId" @click="handleParentAdd">添加</el-button></span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="parentData.label || objId" class="tbody">
                      <el-row v-for="(item, index) in tableData" :key="index">
                        <el-col :span="8">
                          <div class="grid ellipsis">
                          </div>
                        </el-col>
                        <el-col :span="14">
                          <div class="grid">
                            <span>{{item.clinicName}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="grid center">
                            <el-button size="small" type="text" @click="handleChildDel(index)">删除</el-button>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8"><div class="grid"></div></el-col>
                        <el-col :span="14">
                          <div class="grid custom-width">
                            <!-- <ever-select size="small" v-model="childData.clinicId" :options="filterClinicData" placeholder="机构名称"></ever-select> -->
                            <ever-org-select ref="eos" :props="{size: 'small'}" :isOrg="false" v-model="childData.clinicId" type="select"></ever-org-select>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="grid center">
                            <el-button size="small" type="text" :disabled="!childData.clinicId" @click="handleChildAdd(childData.clinicId)">添加</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-foot alg_c">
        <el-button size="small" type="primary" @click="handleSave" :loading="submitLoading">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/common'
import organizationcrossApi from '@/warehouse/page/group/store/organizationcrossapi'
import { request } from '@/util/req'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import storage from '@/util/storage'
export default {
  data () {
    return {
      objId: this.$route.params.id, // 详情id
      obj: {}, // 详情数据
      clinicStorageParentData: [], // 机构关联库房数据 - 机构
      clinicStorageChildData: [], // 机构关联库房数据 - 库房
      tempLabel: '', // 临时保存父级节点名称
      parentData: { // 父级节点选择
        id: '', // 暂时无用
        label: '',
        clinicId: '',
        storageId: ''
      },
      clinicData: [], // 机构数据
      filterClinicData: [], // 过滤之后的机构数据
      childData: { // 子级节点选择
        clinicId: ''
      },
      tableData: [], // 表格数据
      deleteTableData: [], // 删除的数据
      submitLoading: false // loading
    }
  },
  created () {
    if (this.objId) { // 详情
      this.fetchDetail(this.objId)
    } else { // 新建
      this.fetchClinicStorage()
    }
  },
  methods: {
    // 查询机构关联库房数据
    async fetchClinicStorage () {
      const clinicStorageData = await organizationcrossApi.getClinicAndStorageRoomList()
      this.clinicStorageParentData = clinicStorageData.list
    },
    // 查询机构数据
    async fetchClinic () {
      request(orgUrlMap.org.loadWithChildsById, { id: storage.getStorageByClinic('CLINICID') }).then(res => {
        this.clinicData = this.filterClinicData = res.data.pageList
      })
      // const clinicData = await organizationcrossApi.getAllClinicList()
      // this.clinicData = clinicData.list
      // this.filterClinicData = clinicData.list
    },
    // 查询详情
    async fetchDetail (id) {
      await this.fetchClinic()
      this.obj = await organizationcrossApi.getRelationListByRoomId(id)
      this.tableData = [...this.obj.relations]
    },
    // 添加父节点
    handleParentAdd: debounce(function () {
      organizationcrossApi.createParentOutsideSupplyRelation(this.parentData.storageId).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', '父节点添加成功！', '提示')
          this.parentData.id = res.id
          this.parentData.label = this.tempLabel
          this.fetchClinic()
        }
      })
    }),
    // 删除父节点
    handleParentDel: debounce(function (storageRoomId) {
      this.$confirm('删除该节点后，其对应的所有节点会同步被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizationcrossApi.deleteOfStorageRoom(storageRoomId).then(res => {
          if (res && res.flag) {
            this.$messageTips(this, 'success', '父节点删除成功！', '提示')
            this.$router.back()
          }
        })
      }).catch(() => { })
    }),
    // 添加子节点
    handleChildAdd: debounce(function (clinicId) {
      // 校验是否已添加该节点
      const repeat = this.tableData.some(v => {
        return `${v.clinicId}` === clinicId.id
      })
      if (repeat) {
        this.$messageTips(this, 'warning', '当前机构已添加！', '提示')
      } else {
        // const tempArr = this.clinicData.filter(v => {
        //   return v.id === clinicId.id
        // })
        this.tableData.push({
          clinicId: clinicId.id,
          clinicName: clinicId.name,
          storageRoomId: this.parentData.storageId
        })
        this.childData.clinicId = ''
      }
    }),
    // 删除子节点
    handleChildDel: debounce(function (index) {
      const tempArr = this.tableData.splice(index, 1)
      if (tempArr[0].id) this.deleteTableData.push(tempArr[0])
    }),
    // 保存
    handleSave: debounce(function () {
      if (this.submitLoading) return
      if (this.tableData.length || this.deleteTableData.length) {
        this.submitLoading = true
        let addList = []
        let updateList = []
        this.tableData.forEach(v => {
          if (v.id) { // update
            updateList.push(v)
          } else { // add
            addList.push(v)
          }
        })
        // 处理提交参数
        let params = {
          storageRoomId: this.parentData.storageId || this.objId,
          addList,
          updateList,
          deleteList: this.deleteTableData
        }
        organizationcrossApi.updateOutsideSupplyRelation(params).then(res => {
          this.submitLoading = false
          if (res && res.flag) {
            this.$messageTips(this, 'success', '保存成功！', '提示')
            this.$router.back()
          }
        })
      } else {
        return this.$messageTips(this, 'warning', '请添加跨机构供应关系和设置', '提示') // 限制用户没有填写跨机构供应关系就点击完成的
      }
    })
  },
  watch: {
    'parentData.clinicId' (val) { // 机构id
      const tempArr = this.clinicStorageParentData.filter(v => {
        return v.id === val
      })
      // 设置二级节点数据
      if (tempArr[0].storageRoomList && Array.isArray(tempArr[0].storageRoomList)) {
        this.clinicStorageChildData = tempArr[0].storageRoomList
        this.tempLabel = `${tempArr[0].name} > `
      } else {
        this.clinicStorageChildData = []
        this.tempLabel = ''
      }
      this.parentData.storageId = ''
    },
    'parentData.storageId' (val) { // 库房id
      if (val) {
        const tempArr = this.clinicStorageChildData.filter(v => {
          return v.id === val
        })
        this.tempLabel += tempArr[0].name
      }
    },
    tableData: { // 监控已添加的子节点，过滤子节点数据
      handler (val) {
        this.filterClinicData = this.clinicData.filter(v => {
          return val.every(item => {
            return item.clinicId !== v.id
          })
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'index.scss';
  .main-head {
    .blue {
      cursor: auto;
      text-decoration: none;
    }
  }
  .main-body {
    .custom-table {
      border: 1px solid #ccc;
      .head {
        height: 35px;
        line-height: 35px;
        background: #ddd;
        font-weight: bold;
        .center {
          text-align: center;
        }
      }
      .body {
        .empty {
          padding: 0 60px;
          text-align: center;
        }
        .content {
          line-height: 35px;
          .thead {
            height: 36px;
            background: #f0f0f0;
            border-bottom: 1px solid #ccc;
            margin-bottom: -1px;
            border-top: 1px solid #ccc;
            .el-col:first-child .grid {
              border-left: none;
              padding-left: 20%
            }
            .grid {
              margin-left: -1px;
              border-left: 1px solid #ccc;
              .middle-div {
                display: flex;
                .el-select:last-child {
                  margin-left: 20px;
                }
              }
            }
          }
          .tbody {
            .el-col:first-child {
              padding-left: 18%
            }
            .el-col {
              height: 35px;
            }
            .el-row {
              border-top: none;
              border-bottom: 1px solid #ccc
            }
          }
          .el-row {
            border-top: 1px solid #ccc
          }
          .el-row:first-child {
            border-top: none
          }
          .el-col {
            border-left: 1px solid #ccc;
          }
          .el-col:first-child {
            border-left: none;
          }
          .span_width {
            display: inline-block;
            padding: 0 20px;
          }
          .span_width span.title {
            color: #999;
          }
        }
      }
      .grid {
        padding: 0 20px;
      }
      .custom-width {
        width: 300px;
      }
    }
  }
  .main-foot {
    margin-bottom: 0;
    margin-top: 10px;
  }
</style>
