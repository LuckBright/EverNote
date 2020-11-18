<template>
  <div class="section-wrap">
    <!-- 开单科室 -->
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="开单科室">
            <el-table
              v-if="openTableData[0] || materialSpuId"
              border
              :show-header="false"
              :data="openTableData">
              <el-table-column>
                <template slot-scope="scope">
                  <p class="table-row">
                    <el-row>
                      <el-col :span="22">{{sectionName(sectionOptions, scope.row)}}</el-col>
                      <el-col :span="2"><el-button size="small" type="danger" icon="el-icon-delete" @click="removeData(openTableData, scope.$index)"></el-button></el-col>
                    </el-row>
                  </p>
                </template>
              </el-table-column>
            </el-table>
            <div class="fl">
              <el-button>选择开单科室</el-button>
              <div style="width: 121px; height: 36px; margin-top: -38px">
                <wh-cascader-multi ref="openCascaderMulti" :options="sectionOptions" v-model="openTableData"></wh-cascader-multi>
              </div>
            </div>
            <el-button v-if="openTableData[0] || materialSpuId" type="primary" @click="saveSelection(1, openTableData)">保存开单科室</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行科室">
            <el-table
              border
              v-if="executeTableData[0] || materialSpuId"
              :show-header="false"
              :data="executeTableData">
              <el-table-column>
                <template slot-scope="scope">
                  <p class="table-row">
                    <el-row>
                      <el-col :span="22">{{sectionName(sectionOptions, scope.row)}}</el-col>
                      <el-col :span="2"><el-button size="small" type="danger" icon="el-icon-delete" @click="removeData(executeTableData, scope.$index)"></el-button></el-col>
                    </el-row>
                  </p>
                </template>
              </el-table-column>
            </el-table>
            <div class="fl">
              <el-button>选择执行科室</el-button>
              <div style="width: 121px; height: 36px; margin-top: -38px">
                <wh-cascader-multi ref="executeCascaderMulti" :options="sectionOptions" v-model="executeTableData"></wh-cascader-multi>
              </div>
            </div>
            <el-button v-if="executeTableData[0] || materialSpuId" type="primary" @click="saveSelection(2, executeTableData)">保存执行科室</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import selectInquireList from '@/warehouse/util/selectinquirelist'
import api from '@/warehouse/page/groupmaterial/store/materialdictspuapi'
import { whComFn, SPACE_RELATION_TYPE } from '@/util/common'
export default {
  mixins: [selectInquireList],
  props: ['materialSpuId', 'api'],
  data () {
    return {
      sectionOptions: [], // 科室列表数据
      openTableData: [], // 开单科室
      executeTableData: [] // 执行科室
    }
  },
  created () {
    this.fetchSectionList()
    this.fetchSectionVo(this.materialSpuId)
  },
  methods: {
    // 请求科室数据
    fetchSectionList () {
      this._sentenceSpaceSelect({ relationType: SPACE_RELATION_TYPE[0].id }).then(res => {
        res.map(item => {
          item.label = item.name
          item.value = item.id
          item.children = item.sonLocalSections
          if (item.sonLocalSections) {
            item.disabled = true
            item.sonLocalSections.map(ite => {
              ite.label = ite.name
              ite.value = ite.id
              ite.children = ite.sonLocalSections
            })
          }
        })
        this.sectionOptions = whComFn.sectionMap(res)
      })
    },
    // 请求已经保存的科室数据
    fetchSectionVo (materialSpuId) {
      this.api.getMaterialSectionVo({ materialSpuId }).then(res => {
        // 开单科室
        res.openSection.forEach(v => {
          this.openTableData.push(v.levelRelationIds)
        })
        // 执行科室
        res.exectuteSection.forEach(v => {
          this.executeTableData.push(v.levelRelationIds)
        })
      })
    },
    // 返回科室名称
    sectionName (option, data) {
      let sName = ''
      const index = option.findIndex(item => {
        return item.id === data[0]
      })
      if (index > -1) {
        sName = option[index].name
        if (option[index].sonLocalSections) sName = this.recursionSectionName(sName, option[index].sonLocalSections, data.slice(1))
      }
      return sName
    },
    recursionSectionName (sName, list, value) {
      const index = list.findIndex(item => {
        return item.id === value[0]
      })
      if (index > -1) sName += ' / ' + list[index].name
      if (index > -1 && list[index].sonLocalSections) {
        this.recursionSectionName(sName, list[index].sonLocalSections, value.slice(1))
      }
      return sName
    },
    // 删除数据
    removeData (data, index) {
      data.splice(index, 1)
    },
    // 保存科室
    saveSelection (type, data) {
      const oParam = {
        materialSpuId: this.materialSpuId,
        type
      }
      let params = {
        ...oParam,
        materialSections: []
      }
      data.map(item => {
        params.materialSections.push({
          ...oParam,
          localSectionId: item[item.length - 1]
        })
      })
      api.createMaterialSection(params).then(res => {
        if (res.materialSpuId) this.$messageTips(this, 'success', `保存${res.type === 1 ? '开单科室' : '执行科室'}成功`)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .section-wrap {
    height: calc(100vh - 25px);
    .section-block {
      margin-top: 15px;
      .section-title {
        font-size: 14px;
        font-weight: bold;
        padding-top: 15px;
      }
    }
  }
  .cascader-multi /deep/ .values {
    cursor: pointer;
    opacity: 0;
    max-height: 38px;
    input {
      cursor: pointer;
    }
  }
  .cascader-multi {
    /deep/ .icon-del {
      display: none
    }
    border: none!important;
    /deep/ .icon-arrow {
      display: none;
    }
  }
  .table-row {
    display: flex;
    align-items: center;
    margin: 0;
    .el-row {
      flex: 1;
    }
  }
</style>

