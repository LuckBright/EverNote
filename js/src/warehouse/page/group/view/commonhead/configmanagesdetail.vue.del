<!--<template>-->
<!--  <div class="">-->
<!--    <ever-bread-crumb :name="$route.params.code === '-1' ? '创建' : '编辑'"></ever-bread-crumb>-->
<!--    <div class="layout_inner oh h100">-->
<!--      <el-row class="oh h100" :gutter="10">-->
<!--        <el-col :span="18" class="oh h100 df fdc">-->
<!--          <div class="main-head" v-if="$route.params.code === '-1'">-->
<!--            <ever-form2-->
<!--              v-model="queryObj"-->
<!--              ref="form"-->
<!--              :schema="querySchema"-->
<!--              :inline="true"-->
<!--            >-->
<!--              <template slot="default">-->
<!--                <el-form-item>-->
<!--                </el-form-item>-->
<!--              </template>-->
<!--            </ever-form2>-->
<!--          </div>-->
<!--          <div class="station-name">{{stationName}}</div>-->
<!--          <div v-if="!availableArr.length && $route.params.code === '-1'">-->
<!--            所有工作站均已完成配置，不能再添加-->
<!--          </div>-->
<!--          <div v-else-if="showConfigList" class="config-container flex1 oxhya">-->
<!--            <template v-for="item in configList.filter(c => c)">-->
<!--              <div class="separate-box" v-if="item.isSeparate">-->
<!--                <span class="separate-icon"></span>{{item.paramValue}}-->
<!--              </div>-->
<!--              <el-checkbox :class="[{'is-first': item.isFirst}, 'config-checkbox']" v-else="item.isSeparate" :label="item.paramValue" v-model="item._checked" @change="changeCheckbox(item)"></el-checkbox>-->
<!--            </template>-->
<!--          </div>-->
<!--          <div class="operator-btn mt20">-->
<!--            <el-button type="primary" @click="saveData">保存</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="6" class="oh h100">-->
<!--          <div class="sort-box oh h100 df fdc">-->
<!--            <div class="sort-title">-->
<!--              <span>排序列表（可拖拽调整顺序）</span>-->
<!--              <el-button size="mini" type="text" @click="insertPageChart">-->
<!--                <i class="icon iconfont icon-PHR-charufenyema mr2"></i>插入分页符-->
<!--              </el-button>-->
<!--            </div>-->
<!--            <div class="config-sort-item config-sort-item-head first-item">-->
<!--              <span class="sort-index">序号</span>-->
<!--              <span>名称</span>-->
<!--            </div>-->
<!--            <div class="sort-ul flex1 oxhya">-->
<!--              &lt;!&ndash;          <div class="sort-li" v-for="item in sortList.filter(s => s)">{{item.paramValue}}</div>&ndash;&gt;-->
<!--              <draggable v-if="sortList.length" v-model="sortList" @end="resetSort">-->
<!--                <transition-group>-->
<!--                  <div v-for="(element,index) in sortList"-->
<!--                      :class="['config-sort-item', element.paramKey === '-1' ? 'separate-item' : '']"-->
<!--                      :key="element.paramKey + '' + index"-->
<!--                  >-->
<!--                    <span v-if="element.paramKey !== '-1'">-->
<!--                      <span class="sort-index">{{element.sortIndex}}</span>-->
<!--                      <span>{{element.paramValue}}</span>-->
<!--                      <span class="el-icon-circle-close del-item" @click="delItem(element, index)"></span>-->
<!--                    </span>-->
<!--                    <el-button class="btn-close" v-else @click="clearSeparate(element, index)" size="mini" icon="el-icon-circle-close" circle></el-button>-->
<!--                    &lt;!&ndash;                    <span v-else @click="clearSeparate(element, index)">清除</span>&ndash;&gt;-->
<!--                  </div>-->
<!--                </transition-group>-->
<!--              </draggable>-->
<!--              <div v-else class="config-sort-item no-data">-->
<!--                暂无数据-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  import { querySchema, groupListToObjList } from './model'-->
<!--  import { request } from '@/util/req'-->
<!--  import commonUrl from '@/util/urls'-->
<!--  import urlMap from './urls'-->
<!--  import draggable from 'vuedraggable'-->

<!--  export default {-->
<!--    components: {draggable},-->
<!--    data () {-->
<!--      const queryObj = this.$ever.createObjFromSchema(querySchema)-->
<!--      return {-->
<!--        queryObj,-->
<!--        querySchema,-->
<!--        allStationList: [],-->
<!--        showConfigList: false,-->
<!--        availableArr: [],-->
<!--        configList: [],-->
<!--        allConfig: [],-->
<!--        sortList: [],-->
<!--        stationName: '',-->
<!--      }-->
<!--    },-->
<!--    watch: {-->
<!--    },-->
<!--    async created () {-->
<!--      // 获取全部的配置字段-->
<!--      await this.getAllConfigList()-->
<!--      this.configList = groupListToObjList(this.allConfig.sort((a, b) => a.sourceTypeName.localeCompare(b.sourceTypeName)))-->
<!--      if (this.$route.params.code && this.$route.params.code !== '-1') {-->
<!--        // 查询当前配置数据-->
<!--        request(urlMap.thcPageHeadTemplateConfig.getDetailByCode, {code: this.$route.params.code}, 'get').then(res => {-->
<!--          this.showConfigList = true-->
<!--          this.sortList = res.data.configs-->
<!--          this.stationName = res.data.thcPageHeadTemplateConfig.name-->
<!--          this.resetSort()-->
<!--          // 根据 this.allConfig 和 configList 合并出一个 merge list 出来-->
<!--          this.configList = groupListToObjList(this.allConfig.map(c => ({-->
<!--            ...c,-->
<!--            _checked: this.sortList.filter(s => s).some(con => con.paramKey === c.paramKey)-->
<!--          })))-->
<!--        })-->
<!--      } else {-->
<!--        // 查询所有的工作站-->
<!--        request(commonUrl.valueSet.getValueSetItems, { 'setCode': 'THC_PATIENT_HEADER' }).then(res => {-->
<!--          if (res.head.errCode === 0) {-->
<!--            this.allStationList = res.data-->
<!--            // 查询已选工作站-->
<!--            request(urlMap.thcPageHeadTemplateConfig.getAll).then(resp => {-->
<!--              this.availableArr = this.allStationList.filter(item => !resp.data.some(e => e.code === item.code))-->
<!--                .map(item => ({id: item.code, name: item.name}))-->
<!--              this.querySchema[0].props.options = this.availableArr-->
<!--              this.showConfigList = true-->
<!--            })-->
<!--          }-->
<!--        })-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--      delItem (item, index) {-->
<!--        const configItem = this.configList.find(c => c.id === item.id)-->
<!--        if (configItem) {-->
<!--          configItem._checked = false-->
<!--          this.sortList.splice(index, 1)-->
<!--          this.resetSort()-->
<!--        }-->
<!--      },-->
<!--      resetSort () {-->
<!--        this.sortList = this.sortList.map((s, index) => {-->
<!--          const sortIndex = index + 1 - this.sortList.slice(0, index).filter(sl => sl.paramKey === '-1').length-->
<!--          return {-->
<!--            ...s,-->
<!--            sortIndex,-->
<!--          }-->
<!--        })-->
<!--      },-->
<!--      clearSeparate (item, index) {-->
<!--        this.sortList.splice(index, 1)-->
<!--        this.resetSort()-->
<!--      },-->
<!--      // 当勾选时，将数据加入到 sortList 中，取消勾选时，移除-->
<!--      changeCheckbox (item) {-->
<!--        if (item._checked) {-->
<!--          this.sortList.push(item)-->
<!--        } else {-->
<!--          this.sortList = this.sortList.filter(s => s).filter(s => s.paramKey !== item.paramKey)-->
<!--        }-->
<!--        this.resetSort()-->
<!--      },-->
<!--      insertPageChart () {-->
<!--        this.sortList.push({-->
<!--          paramKey: '-1',-->
<!--          id: '-1',-->
<!--        })-->
<!--        this.resetSort()-->
<!--      },-->
<!--      async getAllConfigList () {-->
<!--        const res = await request(urlMap.thcPageHeadConfig.getAll)-->
<!--        this.allConfig = res.data.map(c => ({...c, _checked: false}))-->
<!--      },-->
<!--      saveData () {-->
<!--        let params = {}-->
<!--        if (!this.sortList.length) {-->
<!--          this.$messageTips(this, 'error', '配置项为空')-->
<!--          return-->
<!--        }-->
<!--        if (this.$route.params.code === '-1') {-->
<!--          if (!this.queryObj.station) {-->
<!--            this.$messageTips(this, 'error', '请选择工作站')-->
<!--            return-->
<!--          }-->
<!--          params.code = this.queryObj.station-->
<!--          params.name = this.availableArr.find(a => a.id === this.queryObj.station).name-->
<!--        } else {-->
<!--          params.id = this.$route.params.id-->
<!--        }-->
<!--        params.pageHeadConfigIds = this.sortList.map(c => c.id)-->
<!--        request(urlMap.thcPageHeadTemplateConfig[this.$route.params.code === '-1' ? 'insert' : 'modifyConfig'], params).then(res => {-->
<!--          if (res.head.errCode === 0) {-->
<!--            this.$messageTips(this, 'success', '操作成功')-->
<!--            if (this.$route.params.code === '-1') {-->
<!--              // 如果是新增，则需要展示一个新的列表-->
<!--              this.$router.push({name: 'commonhead', params: {index: 'config'}})-->
<!--            } else {-->
<!--              this.$router.back()-->
<!--            }-->
<!--          }-->
<!--        })-->
<!--      },-->
<!--    },-->
<!--  }-->
<!--</script>-->
<!--<style lang="less" scoped>-->
<!--  .mr2 {-->
<!--    margin-right: 2px;-->
<!--  }-->
<!--  .separate-box {-->
<!--    line-height: 40px;-->
<!--  }-->
<!--  .sort-title {-->
<!--    line-height: 40px;-->
<!--    padding: 0 10px;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--  }-->
<!--  .sort-box {-->
<!--    border: 1px solid #ccc;-->
<!--    box-sizing: border-box-->
<!--  }-->
<!--  .config-sort-item-head {-->
<!--    background-color: #F0F5FA;-->
<!--  }-->
<!--  .config-sort-item {-->
<!--    position: relative;-->
<!--    line-height: 40px;-->
<!--    border-bottom: 1px solid #ccc;-->
<!--    padding-left: 10px;-->
<!--    cursor: move;-->
<!--    &.sortable-chosen {-->
<!--      border: 2px dashed #ccc;-->
<!--      background-color: #eee;-->
<!--    }-->
<!--    &.no-data {-->
<!--      color: #c1c1c1;-->
<!--    }-->
<!--    &.first-item {-->
<!--      border-top: 1px solid #ccc;-->
<!--    }-->
<!--    &.separate-item {-->
<!--      background-color: #0f78f3;-->
<!--      height: 1px;-->
<!--      position: relative;-->
<!--      .btn-close {-->
<!--        position: absolute;-->
<!--        top: -13px;-->
<!--        right: 0;-->
<!--        border-color: transparent;-->
<!--      }-->
<!--      &:hover {-->
<!--        height: 5px;-->
<!--      }-->
<!--    }-->
<!--    &:hover {-->
<!--      background-color: #E6E6E6;-->
<!--    }-->
<!--    .sort-index {-->
<!--      text-align: center;-->
<!--      display: inline-block;-->
<!--      width: 70px;-->
<!--      padding-right: 20px;-->
<!--    }-->
<!--    .del-item {-->
<!--      display: none;-->
<!--      cursor: pointer;-->
<!--      color: #333;-->
<!--      position: absolute;-->
<!--      top: 0;-->
<!--      margin-top: 12px;-->
<!--      right: 10px;-->
<!--      &:hover {-->
<!--        color: #1a7bee;-->
<!--      }-->
<!--    }-->
<!--    &:hover {-->
<!--      .del-item {-->
<!--        display: initial;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  .oai {-->
<!--    overflow: auto!important;-->
<!--  }-->
<!--  span.separate-icon {-->
<!--    display: inline-block;-->
<!--    width: 4px;-->
<!--    background: #1C7BEF;-->
<!--    height: 14px;-->
<!--    margin-right: 5px;-->
<!--    vertical-align: -2px;-->
<!--  }-->
<!--  .config-checkbox {-->
<!--    line-height: 40px;-->
<!--  }-->
<!--  .config-container {-->
<!--    margin-left: 10px;-->
<!--    .separate-box {-->
<!--      margin-left: -10px;-->
<!--    }-->
<!--  }-->
<!--  .station-name {-->
<!--    font-weight: bold;-->
<!--    font-size: 18px;-->
<!--    line-height: 44px;-->
<!--  }-->
<!--</style>-->
