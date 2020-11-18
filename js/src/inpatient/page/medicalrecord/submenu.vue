<template>
  <div class="submenu">
    <el-submenu :index="setIndex(item)"
                v-if="item.nodes && item.nodes.length>0&&(item.code!=='TI_WEN_DAN'&&item.code!=='TI_WEN_JI_LU_DAN')"
                class="el-menu-sub">
      <template slot="title">
        <div class="menu_title_flex">
          <div class="m_name">
            <svg class="icon"
                aria-hidden="true"
                v-if="!item.isInstance">
              <use :xlink:href="`#${item.icon}`"></use>
            </svg>
            <!-- <i class="iconfont" :class="item.icon" v-if="!item.isInstance"></i> -->
            <el-tooltip class="item" effect="dark" content="未提交" placement="left">
              <i v-if="saveStatus(item)"
              class="el-icon-warning"
              style="color:red;"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="已提交" placement="left">
              <i v-if="submitStatus(item)"
              class="el-icon-success"
              style="color:green;"></i>
            </el-tooltip>
            <!-- <i v-if="saveStatus(item)"
              class="el-icon-warning"
              style="color:red;"></i> -->
            <!-- <i v-if="submitStatus(item)"
              class="el-icon-success"
              style="color:green;"></i> -->
            <span>{{item.name}}</span>
            <span v-if="showAdd(item)"
                  @click.stop="quoteTpl(item)">
              <i class="iconfont icon-tianjia add"></i>
            </span>
          </div>
          <span class="p_btn alg_r"
                v-if="item.code === 'BING_CHENG_JI_LU'"
                style="padding-right: 16px;">
            <el-button @click.stop="printMedicalProcess(item.code)"
                       size="mini"  v-if="!readonly">合并打印/续打</el-button>
          </span>
        </div>
        <!-- <el-dropdown @command="handleCommand">
          <span>+</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'inhert',obj:item}">默认模版</el-dropdown-item>
            <el-dropdown-item :command="{type:'other',obj:item}">引用其他模版</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </template>
      <div v-for="(child, index) in item.nodes"
           :key="child.id + recordRandom + index">
        <sub-menu v-if="child.nodes && child.nodes.length>0 &&(child.code!=='TI_WEN_DAN'&&child.code!=='TI_WEN_JI_LU_DAN')"
                  :readonly="readonly"
                  :param="child"
                  @quoteTpl="quoteTpl">
        </sub-menu>
        <template v-else-if="child.anchors && child.anchors.length > 1">
          <el-submenu :index="setIndex(child)">
            <template slot="title">
              <svg class="icon"
                 aria-hidden="true"
                 v-if="!child.isInstance">
                <use :xlink:href="`#${child.icon}`"></use>
              </svg>
              <!-- <i class="iconfont" :class="item.icon" v-if="!child.isInstance"></i> -->
              <el-tooltip class="item" effect="dark" content="未提交" placement="left">
                <i v-if="saveStatus(child)"
                class="el-icon-warning"
                style="color:red;"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="已提交" placement="left">
                <i v-if="submitStatus(child)"
                class="el-icon-success"
                style="color:green;"></i>
              </el-tooltip>
              <!-- <i v-if="saveStatus(child)"
                 class="el-icon-warning"
                 style="color:red;"></i>
              <i v-if="submitStatus(child)"
                 class="el-icon-success"
                 style="color:green;"></i> -->
              <span>{{child.name}}</span>

              <span v-if="showAdd(child)"
                    @click.stop="quoteTpl(child)">
                <i class="iconfont icon-tianjia add"></i>
              </span>
            </template>
            <!-- <ul>
              <li v-for="(anchor, index) in child.anchors" :index="index" @click.stop.prevent="scrollTo(child, index)">
                {{anchor[0]}}
              </li>
            </ul> -->
            <el-menu-item v-for="(anchor, index) in child.anchors" :index="setIndex(child, index)" :key="index">
              &nbsp;{{$moment(anchor[0], 'YYYY-MM-DD').isValid()
                ? anchor[1] + '-' +  $moment(anchor[0], 'YYYY-MM-DD').format('MM-DD')
                : anchor[1]}}
            </el-menu-item>
          </el-submenu>
        </template>
        <el-menu-item :index="setIndex(child)"
                      :key="child.id + index"
                      v-else>
          <svg class="icon"
               aria-hidden="true"
               v-if="!child.isInstance">
            <use :xlink:href="`#${child.icon}`"></use>
          </svg>
          <!-- <i class="iconfont" :class="item.icon" v-if="!child.isInstance"></i> -->
          <el-tooltip class="item" effect="dark" content="未提交" placement="left">
            <i v-if="saveStatus(child)"
            class="el-icon-warning"
            style="color:red;"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="已提交" placement="left">
            <i v-if="submitStatus(child)"
             class="el-icon-success"
             style="color:green;"></i>
          </el-tooltip>
          <!-- <i v-if="saveStatus(child)"
             class="el-icon-warning"
             style="color:red;"></i> -->
          <!-- <i v-if="submitStatus(child)"
             class="el-icon-success"
             style="color:green;"></i> -->
          <span>{{child.name}}</span>

          <span v-if="showAdd(child)"
                @click.stop="quoteTpl(child)">
            <i class="iconfont icon-tianjia add"></i>
          </span>

        </el-menu-item>
        <!-- <el-submenu>
          <el-menu-item :index="index" v-for="(anchor,index) in child.anchors">{{anchor[1]}}</el-menu-item>
        </el-submenu> -->
      </div>
    </el-submenu>

    <el-menu-item :index="setIndex(item)"
                  v-else
                  class="el-menu-each">
      <svg class="icon"
           aria-hidden="true"
           v-if="!item.isInstance">
        <use :xlink:href="`#${item.icon}`"></use>
      </svg>
      <!-- <i class="iconfont" :class="item.icon" v-if="!item.isInstance"></i> -->
      <i v-if="saveStatus(item)"
         class="el-icon-warning"
         style="color:red;"></i>
      <i v-if="submitStatus(item)"
         class="el-icon-success"
         style="color:green;"></i>
      <span>{{item.name}}</span>
      <span v-if="showAdd(item)"
            @click.stop="quoteTpl(item)">
        <i class="iconfont icon-tianjia add"></i>
      </span>
    </el-menu-item>
  </div>
</template>
<script>
import phrapi from '@/form/store/phrapi'
import subMenu from './submenu.vue'
import { jcpPrintEditor } from '@/util/common'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  name: 'subMenu',
  components: {
    subMenu
  },
  props: ['param', 'readonly', 'visitId'],
  data: function () {
    return {
      item: this.param,
      recordRandom: Math.random()
    }
  },
  methods: {
    async printMedicalProcess (code) {
      commandLog({
        content: '对病程记录进行了合并打印/续打操作',
        opModuleOne: `电子病历-病历书写-病程记录`,
        opType: 'PRINT',
        patientId: this.patientId,
        patientName: this.$route.query.patientName,
        visitNumber: this.visitId
      })
      const postdata = {
        code: code,
        visitId: this.visitId
      }
      let printConfig = {
        printFrom: true,
        preview: true
      }
      try {
        let pageSettings
        const res = await phrapi.getPrintContinueRecords(postdata)
        if (res && res.length) {
          const newDom = document.createElement('div')
          const domArr = []
          let dataIds = []
          // anotherRecord: 0 || 1,      是否分页
          // anotherPage: 0 || 1   结尾是否连续
          res.forEach((item, index) => {
            if (index === 0 || ['SHOU_CI_BING_CHENG_JI_LU_XIN', 'SHOU_CI_BING_CHENG_JI_LU'].includes(item.code)) {
              let pageInfo = (item.structure && item.structure.schema) || {}
              pageSettings = pageInfo.pageSettings
            }
            if (item.data && item.data.data && item.data.data.text) {
              let data = item.data.data
              newDom.innerHTML = data.text
              domArr.push({
                dom: newDom.innerHTML,
                header: data.header || '',
                footer: data.footer || '',
                track: data.track || false,
                anotherRecord: item.anotherRecord || 0,
                anotherPage: item.anotherPage || 0
              })
              dataIds.push(item.data.id)
            }
          })
          jcpPrintEditor(this, printConfig, pageSettings, domArr)
        } else {
          this.$messageTips(this, 'warning', '暂无可打印的数据！', '提示')
        }
      } catch (err) {
        this.$messageTips(this, 'error', '打印数据有误，请联系管理员处理', '提示')
      }
    },
    showAdd (item) { // 显示加号
      let hideAddCode = ['ZHU_YUAN_BING_AN_SHOU_YE', 'TI_WEN_DAN', 'TI_WEN_JI_LU_DAN']
      // && !(this.$route.query.from === 'medicalRecall')召回查看详情不显示加号
      return (!item.isInstance && !hideAddCode.includes(item.code) && !this.readonly)
    },
    saveStatus (item) { // 草稿状态
      return item.isInstance && item.status === 1
    },
    submitStatus (item) { // 提交状态
      return item.isInstance && item.status === 2
    },
    scrollTo (item, index) {
      console.log('select1234 ', index)
      setTimeout(_ => {
        this.$emit('select', this.setIndex(item, index))
      }, 10)
    },
    setIndex (item) {
      let indexObj = null
      if (item.isInstance) {
        indexObj = {
          id: item.id,
          code: item.code,
          isInstance: item.isInstance,
          isRecall: item.isRecall,
          categoryName: item.categoryName,
          categoryId: item.categoryId,
          type: item.type,
          designerId: item.designerId,
          status: item.status,
          title: item.name,
          formTemplateId: item.formTemplateId,
          templateScopeId: item.templateScopeId
        }
      } else {
        indexObj = {
          id: item.id,
          code: item.code,
          isInstance: item.isInstance,
          isRecall: item.isRecall,
          categoryName: item.categoryName,
          categoryId: item.categoryId,
          type: item.type
        }
      }
      return JSON.stringify(indexObj)
    },
    setIndexOld (item, index = -1) { // 设置index值
      return item.id + 'ā' +
        item.status + 'ā' +
        item.name + 'ā' +
        item.formTemplateId + 'ā' +
        item.isUpdate + 'ā' +
        item.isInstance + 'ā' +
        item.categoryName + 'ā' +
        item.categoryId + 'ā' +
        item.code + 'ā' +
        item.designerId + 'ā' +
        item.type + 'ā' +
        item.templateScopeId + 'ā' +
        item.rootCode + 'ā' +
        index
    },
    quoteTpl (item) {
      this.searchCount(item)
    },
    async searchCount (item) {
      let params = {
        visitId: this.visitId || this.$route.query.hospitalizedNumber,
        code: item.code,
        patientId: this.$route.query.patientId
      }
      let res = await phrapi.searchCount(params)
      if (res) this.$emit('quoteTpl', JSON.parse(JSON.stringify(item)))
    }
    // handleCommand (command) {//这个代码默认模版功能会用到
    //   if (command.type === 'other') {
    //     this.quoteTpl(command.obj)
    //   } else if (command.type === 'inhert') {
    //     console.log('引用默认模版')
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.menu_title_flex {
  display: inline-flex;
  width: 100%;
  .m_name {
    flex: 1;
  }
  span.p_btn {
    flex: 1;
    .el-button {
      position: relative;
      top: -3px;
    }
  }
}
.submenu {
  .add {
    color: #1c7bef;
    font-size: 14px;
  }
  .el-submenu [class^="el-icon-"] {
    margin-right: -2px;
  }
  .el-menu .fa {
    margin-right: 10px;
  }
  .el-submenu .el-menu-item {
    height: 30px;
    line-height: 30px;
    background: #f9f9f9;
  }
  /deep/.el-submenu__title {
    height: 30px;
    line-height: 30px;
    background: #f9f9f9;
  }
  /deep/.el-menu-item span {
    font-size: 14px;
  }
}
</style>

