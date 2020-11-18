<!-- 电子病历类型管理table -->
<template>
  <div>
    <el-table
    :data="tableData"
    :show-header="false"
    style="width: 100%; margin: 0;">
      <el-table-column
        prop=""
        label="文档名称"
        width="300">
        <template slot-scope="scope">
          <div v-if="scope.row.isLabel != 2 || scope.row.managesObj">
            <el-row v-if="scope.row.managesObj && !scope.row.isShowSecond" :style="indent">
              <el-col :span="8">
                <span>{{scope.row.managesObj.name}}</span>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" size="small" @click="handelEdit(scope.row.managesObj.id)">属性</el-button>
                <ever-confirm v-if="isManage" width="228px" placement="left" :msg="`你是否删除${scope.row.managesObj.name}及其所有模版`" action="删除" @confirm="handelDelItem(scope.row.managesObj.id)"></ever-confirm>
                <div style="display: inline-block">
                  <el-tooltip class="ml5" effect="dark" content="向上移动" placement="top">
                    <i class="iconfont icon-shangsheng" @click="handelRise(scope.row.managesObj.id)"></i>
                  </el-tooltip>
                  <el-tooltip class="ml5" effect="dark" content="向下移动" placement="top">
                    <i class="iconfont icon-xiajiang" @click="handelDecline(scope.row.managesObj.id)"></i>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row v-else-if="!scope.row.managesObj" :style="indent">
              <el-col :span="8">
                <span>{{scope.row.name}}</span>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" size="small" @click="handelEdit(scope.row.id)">属性</el-button>
                <ever-confirm v-if="isManage" width="228px" placement="left" :msg="`你是否删除${scope.row.name}及其所有模版`" action="删除" @confirm="handelDelItem(scope.row.id)"></ever-confirm>
                <div style="display: inline-block">
                  <el-tooltip class="ml5" effect="dark" content="向上移动" placement="top">
                    <i class="iconfont icon-shangsheng" @click="handelRise(scope.row.id)"></i>
                  </el-tooltip>
                  <el-tooltip class="ml5" effect="dark" content="向下移动" placement="top">
                    <i class="iconfont icon-xiajiang" @click="handelDecline(scope.row.id)"></i>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="使用场景">
        <template slot-scope="scope">
          <template v-if="!scope.row.isShowSecond && scope.row.managesObj && scope.row.managesObj.type">
            {{ scope.row.managesObj.type | formateValueToFnt({ list: SCENES_TYPE }) }}
          </template>
          <template v-else-if="scope.row.type">
            {{ scope.row.type | formateValueToFnt({ list: SCENES_TYPE }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="使用角色">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{ scope.row.managesObj.role | formateValueToFnt({ list: DOCTOR_NURSE, separator: '，' }) }}
          </template>
          <template v-else>
            {{ scope.row.role | formateValueToFnt({ list: DOCTOR_NURSE, separator: '，' }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="打印-另起一页">
        <template slot-scope="scope">
          <span v-if="scope.row.managesObj && !scope.row.isShowSecond">{{scope.row.managesObj.printPage == yesno[0].id ? yesno[0].name  : yesno[1].name}}</span>
          <span v-else-if="scope.row.printPage">{{scope.row.printPage == yesno[0].id ? yesno[0].name  : yesno[1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="打印-文末可续打">
        <template slot-scope="scope">
          <span v-if="scope.row.managesObj && !scope.row.isShowSecond">{{scope.row.managesObj.printContinue == yesno[0].id ? yesno[0].name  : yesno[1].name}}</span>
          <span v-else-if="scope.row.printContinue">{{scope.row.printContinue == yesno[0].id ? yesno[0].name  : yesno[1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="可写次数">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{ scope.row.managesObj.canCreateMore | formateValueToFnt({ list: WRITABLE_TIMES }) }}
          </template>
          <template v-else>
            {{ scope.row.canCreateMore | formateValueToFnt({ list: WRITABLE_TIMES }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="质控基准点">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{ scope.row.managesObj.qualityPoint | formateValueToFnt({ list: BASE_TIME }) }}
          </template>
          <template v-else>
            {{ scope.row.qualityPoint | formateValueToFnt({ list: BASE_TIME }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="开始时间">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{scope.row.managesObj.startTime}}{{ scope.row.managesObj.unit | formateValueToFnt({ list: HOURLY_DAY }) }}
          </template>
          <template v-else>
            {{scope.row.startTime}}{{ scope.row.unit | formateValueToFnt({ list: HOURLY_DAY }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="结束时间">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{scope.row.managesObj.endTime}}{{ scope.row.managesObj.unit | formateValueToFnt({ list: HOURLY_DAY }) }}
          </template>
          <template v-else>
            {{scope.row.endTime}}{{ scope.row.unit | formateValueToFnt({ list: HOURLY_DAY }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="前序文档">
        <template slot-scope="scope">
          <template v-if="scope.row.managesObj && !scope.row.isShowSecond">
            {{ scope.row.managesObj.beforeCode | formateValueToFnt({ list: categoryList }) }}
          </template>
          <template v-else>
            {{ scope.row.beforeCode | formateValueToFnt({ list: categoryList }) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="使用科室">
        <template slot-scope="scope">
          <span>{{scope.row.dptName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="模版类型">
        <template slot-scope="scope">
          {{ scope.row.designerId | formateValueToFnt({ list: TEMPLATE_TYPE }) }}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isLabel != 2" :disabled="!isManage && !scope.row.formTemplateId" type="primary" size="small" @click="handelStencil(scope.row)">模版</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {SCENES_TYPE, DOCTOR_NURSE, WRITABLE_TIMES, BASE_TIME, HOURLY_DAY, TEMPLATE_TYPE} from '@/form/util/anamnesistype'
import {yesno} from '@/util/common'
export default {
  /**
   * props                        字段含义
   * @param tabulationData        数据
   * @param customApi             传入自定义api
   * @param depth                 index
   * @param isTree                是否树型数据
   */
  props: ['tabulationData', 'customApi', 'depth', 'isTree', 'categoryList', 'orgId'],
  data () {
    return {
      SCENES_TYPE,
      DOCTOR_NURSE,
      WRITABLE_TIMES,
      BASE_TIME,
      HOURLY_DAY,
      TEMPLATE_TYPE,
      yesno,
      tableData: [],
      isScrollId: '',
      isManage: this.$route.matched[0].meta.manage || false
    }
  },
  created () {
    this._tab(this.tabulationData)
  },
  computed: {
    indent () {
      return { marginLeft: `${this.depth * 20}px` }
    }
  },
  methods: {
    // 排序调整（上升）
    handelRise (id) {
      this.$emit('tabRise', id)
    },
    // 排序调整（下降）
    handelDecline (id) {
      this.$emit('tabDecline', id)
    },
    // 编辑
    handelEdit (id) {
      this.$emit('tabQueryId', id)
    },
    handelDelItem (id) {
      this.$emit('delTabId', id)
    },
    // 模版
    handelStencil (formTemplateId) {
      this.$emit('tabTemplateId', formTemplateId)
    },
    _tab (arr) {
      let templateManagesNotArr = []
      let templateManagesArr = []
      if (arr) {
        if (arr.templateManages && arr.templateManages.length) {
          arr.templateManages.forEach((temp, i) => {
            // 是否显示相同病历类型
            if (i > 0) temp.isShowSecond = true
            Object.assign(temp, {managesObj: arr})
            templateManagesNotArr.push(temp)
          })
        } else if (arr.id) {
          templateManagesArr.push(arr)
        }
      }
      this.$nextTick(() => {
        this.tableData = [...templateManagesNotArr, ...templateManagesArr]
      })
    }
  },
  watch: {
    'tabulationData' (obj) {
      this._tab(obj)
    }
  }
}
</script>
<style lang="less" scoped>
// .tree_Table {margin-top: 0px;}
</style>
