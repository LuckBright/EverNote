<template>
  <div class="anomaly-dialog">
    <el-dialog
      title="请选择原因"
      :visible.sync="visibleDialog"
      :modal-append-to-body="false"
      width="90%">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-checkbox-group v-model="dialogData.checkedItems">
          <div class="tablelist" v-for="(item, index) in exceptionData" :key="index">
            <!-- 门诊西药头部 -->
            <div class="header" v-if="Array.isArray(item)">
              <div class="details">
                <el-col :span="5" style="text-align: right;">
                  <span class="light-gray">处方单号:  </span>
                </el-col>
                <el-col :span="19">
                  <span v-if="item[0].recipeCode"> {{item[0].recipeCode}}</span>
                  <span class="light-gray ml10">申请时间:</span>
                  <span v-if="item[0].createTime">{{item[0].createTime | formatDateByExp}}</span>
                </el-col>
              </div>
              <div class="details">
                <el-col :span="5" style="text-align: right;">
                  <span class="light-gray">科室: </span>
                </el-col>
                <el-col :span="19">
                  <span>{{item[0].providerName}}</span>
                  <span class="light-gray ml20">医师: </span>
                  <span>{{item[0].doctorName}}</span>
                </el-col>
              </div>
            </div>
            <!-- 住院西药头部 -->
            <div class="header" v-if="drugPackInfo">
                <div class="udddetails" v-if="drugPackInfo.hospitalizedNumber">
                  <el-row>
                    <el-col :span="5" v-if="drugPackInfo.code" style="text-align: right;">
                      <span class="f_bold">UDD药包：</span>
                    </el-col>
                    <el-col :span="19">
                      <span>{{drugPackInfo.code}}</span>
                      <span class="ml15" v-if="drugPackInfo.spaceRecordObject">
                        {{findBasesourceCode({arr: drugPackInfo.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}
                      </span>
                    </el-col>
                  </el-row>
                </div>
                <div class="udddetails">
                  <el-row>
                    <el-col :span="5" style="text-align: right;">
                    <span class="f_bold">床号：</span>
                    </el-col>
                    <el-col :span="19">
                      <span>{{drugPackInfo.bedNum}}</span>
                      <span class="ml15" v-if="drugPackInfo.patientObject">{{drugPackInfo.patientObject.name}} ({{drugPackInfo.patientObject.sex | formatSex}}) {{drugPackInfo.patientObject.age}}岁</span>
                      <span class="ml15">患者档案号:  <span v-if="drugPackInfo.patientObject && drugPackInfo.patientObject.patientOrg">{{drugPackInfo.patientObject.patientOrg.patientNumber}}</span></span>
                    </el-col>
                  </el-row>
                </div>
                <div class="udddetails">
                  <el-row>
                    <el-col :span="5" style="text-align: right">
                    <span class="f_bold"  v-if="drugPackInfo.allergenList">过敏史：</span>
                    <span v-if="!drugPackInfo.allergenList" class="f_bold ml15">预执行时间：</span>
                    </el-col>
                    <el-col :span="19">
                      <span>{{allergenList(drugPackInfo.allergenList)}}</span>
                      <span v-if="drugPackInfo.allergenList" class="f_bold ml15">预执行时间：</span>
                      <span v-if="drugPackInfo.implementTime">
                        <template v-if="drugPackInfo.implementTime">{{drugPackInfo.implementTime | formatDateByExp('YYYY-MM-DD')}}</template>
                        <strong class="f16">
                          <span v-if="drugPackInfo.termType"> {{drugPackInfo.implementTime | formatDateByExp('HH:mm')}}</span>
                          <span v-else> 立即</span>
                        </strong>
                      </span>
                      <el-tooltip
                        v-if="drugPackInfo.source === '3'"
                        class="f16"
                        style="vertical-align: middle;"
                        effect="dark"
                        content="出院带药"
                        placement="top">
                        <svg class="icon" aria-hidden="true" style="font-size: 18px; height: 18px">
                          <use xlink:href="#icon-dai"></use>
                        </svg>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </div>
              </div>
            <!-- 门诊发药   西药 -->
              <ul v-if="Array.isArray(item) && item[0].adviceType !== '303' && item[0].adviceType !== '304'">
                <li v-for="(childitem, childindex) in item[1]" :key="childindex">
                  <div class="check">
                    <span v-if="operate === 'cancel' && !childitem.outpatientDispenseItem.identification"></span>
                    <el-checkbox v-else :label="childitem">{{childitem.index}}</el-checkbox>
                  </div>
                  <div class="detailed">
                    <el-row :gutter="20">
                      <el-col :span="13" class="detail">
                        <wh-code-to-name
                          :isExt="true"
                          :patchObj="{
                            code: SEARCH_CODE,
                            list: childitem.localSetting && childitem.localSetting.materialSkuObject.ext,
                            isInfo: false
                          }">
                        </wh-code-to-name>
                      </el-col>
                      <el-col :span="!CONSUMABLES_TYPE.includes(item[0].adviceType) ? 9 : 3" class="detail text_color">
                        <wh-code-to-name
                          :showIcon="false"
                          :isExt="true"
                          :patchObj="{
                            code: [SPEC, PACKAGE_CODE],
                            list: childitem.localSetting && childitem.localSetting.materialSkuObject.ext,
                            isInfo: false,
                            mark: '/'
                          }">
                        </wh-code-to-name>
                        <wh-code-to-name
                          :isExt="true"
                          v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)"
                          :showIcon="false" :patchObj="{
                          code: [SPU_SPEC_CODE],
                          list: childitem.localSetting && childitem.localSetting.materialSkuObject.ext,
                          isInfo: false
                        }"></wh-code-to-name>
                      </el-col>
                      <el-col :span="4" v-if="CONSUMABLES_TYPE.includes(item[0].adviceType)" class="detail text_color">
                        <span>数量</span>
                        <span>{{childitem.outpatientDispenseItem.num}}</span>
                        <wh-code-to-name
                          v-if="childitem.localSetting"
                          :isExt="true"
                          :showIcon="false" :patchObj="{
                          code: [SPU_SPEC_CODE],
                          list: childitem.localSetting && childitem.localSetting.materialSkuObject.ext,
                          isInfo: false
                        }"></wh-code-to-name>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" v-if="!CONSUMABLES_TYPE.includes(item[0].adviceType)">
                      <el-col :span="8" class="detail text_color">
                        <span>每次用量</span>
                        {{childitem.outpatientDispenseItem.measure}}{{childitem.outpatientDispenseItem.measureUnitName}}
                      </el-col>
                      <el-col :span="6" class="detail text_color">
                        <span>{{childitem.outpatientDispenseItem.useFreqTxt}}</span>
                      </el-col>
                      <el-col :span="6" class="detail text_color">
                        <span>共 {{childitem.outpatientDispenseItem.totalUseDay}} 天</span>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
              <!-- 门诊发药  中药 -->
              <div class="department" v-else-if="(Array.isArray(item) && item[0].adviceType === '303') || (Array.isArray(item) && item[0].adviceType === '304')">
                <el-row class="tcm-item">
                  <el-col :span="8" v-for="(items, index) in item[1]" :key="index" class="f16">
                    <span v-if="operate === 'cancel' && !items.outpatientDispenseItem.identification"></span>
                    <el-checkbox v-else :label="items">{{items.index}}</el-checkbox>
                    <chinese-name
                      :data="items"
                      :otherData="items.outpatientDispenseItem">
                    </chinese-name>
                  </el-col>
                </el-row>
                <div class="tcm-top">
                  <div>
                    <el-col :span="12" v-if="item[1][0].outpatientDispenseItem.num / item[1][0].outpatientDispenseItem.measure">
                      <span class="light-gray fl">剂数：</span>
                      <span class="red big">{{item[1][0].outpatientDispenseItem.num / item[1][0].outpatientDispenseItem.measure}}</span>剂
                    </el-col>
                    <el-col :span="12" v-if="item[1][0].outpatientDispenseItem.useFreqTxt">
                      <el-col :span="12" class="alg_r">
                        <span class="light-gray fl" style="display: block; width: 100%">频次：</span>
                      </el-col>
                      <span class="tooltip">{{item[1][0].outpatientDispenseItem.useFreqTxt}}</span>
                    </el-col>
                  </div>
                  <div>
                    <el-col :span="12" v-if="item[1][0].outpatientDispenseItem.employtxt">
                      <span class="light-gray fl">用法：</span>
                      <span>{{item[1][0].outpatientDispenseItem.employtxt}}</span>
                    </el-col>
                    <el-col :span="12">
                      <el-col :span="12" class="alg_r">
                        <span class="light-gray fl" style="display: block; width: 100%">是否代煎：</span>
                      </el-col>
                      <span>{{item[1][0].outpatientDispenseItem.decoct === '1' ? '代煎' : '否'}}</span>
                    </el-col>
                  </div>
                  <div>
                    <el-col :span="12" v-if="item[1][0].outpatientDispenseItem && item[1][0].outpatientDispenseItem.entrust">
                      <span class="light-gray fl">嘱托：</span>
                      <el-tooltip placement="top">
                        <div slot="content">{{item[1][0].outpatientDispenseItem.entrust}}</div>
                        <span class="tooltip fl">{{item[1][0].outpatientDispenseItem.entrust}}</span>
                      </el-tooltip>
                    </el-col>
                  </div>
                </div>
              </div>
              <!-- 住院发药中药 -->
              <div class="department" v-else-if="(item.uddDispenseItemList && item.adviceType === '303') || (item.uddDispenseItemList && item.adviceType === '304')">
                <el-row class="tcm-item">
                  <el-col :span="8" v-for="(childitemuddlist, childindex) in item.uddDispenseItemList" :key="childindex" class="f16">
                    <span v-if="operate === 'cancel' && !childitemuddlist.identification"></span>
                    <el-checkbox v-else :label="childitemuddlist" class="mr20">{{childitemuddlist.index}}</el-checkbox>
                    <chinese-name
                      :data="childitemuddlist">
                    </chinese-name>
                  </el-col>
                </el-row>
                <div class="tcm-top">
                  <div class="lh36">
                    <el-col :span="12" v-if="item.uddDispenseItemList[0].num / item.uddDispenseItemList[0].measure">
                      <span class="light-gray fl">剂数：</span>
                      <span class="red big">{{item.uddDispenseItemList[0].num / item.uddDispenseItemList[0].measure}}</span>剂
                    </el-col>
                    <el-col :span="12" v-if="item.uddDispenseItemList[0].useFreqTxt">
                      <el-col :span="12" class="alg_r">
                        <span class="light-gray fl" style="display: block; width: 100%">频次：</span>
                      </el-col>
                      <span class="tooltip">{{item.uddDispenseItemList[0].useFreqTxt}}</span>
                    </el-col>
                  </div>
                  <div class="lh36">
                    <el-col :span="12" v-if="item.employTxt">
                      <span class="light-gray fl">用法：</span>
                      <span>{{item.employTxt}}</span>
                    </el-col>
                    <el-col :span="12">
                      <el-col :span="12" class="alg_r">
                        <span class="light-gray fl" style="display: block; width: 100%">是否代煎：</span>
                      </el-col>
                      <span>{{item.uddDispenseItemList[0].decoct === '1' ? '代煎' : '否'}}</span>
                    </el-col>
                  </div>
                  <div class="lh36">
                    <el-col :span="12" v-if="item.entrust">
                      <span class="light-gray fl">嘱托：</span>
                      <el-tooltip placement="top">
                        <div slot="content">{{item.entrust}}</div>
                        <span class="tooltip fl">{{item.entrust}}</span>
                      </el-tooltip>
                    </el-col>
                  </div>
                </div>
              </div>
              <!-- 住院发药西药 -->
              <ul v-else-if="item.uddDispenseItemList">
                <li v-for="(childitemudd, childindex) in item.uddDispenseItemList" :key="childindex">
                  <div class="check">
                    <span v-if="operate === 'cancel' && !childitemudd.identification"></span>
                    <el-checkbox v-else :label="childitemudd">{{childitemudd.index}}</el-checkbox>
                  </div>
                  <div class="detailed">
                    <el-row :gutter="20">
                      <!-- <chinese-name
                        :data="childitemudd"
                        :otherData="childitemudd.outpatientDispenseItem">
                      </chinese-name> -->
                      <!-- 药品名称 -->
                      <el-col :span="13" class="detail">
                        <wh-code-to-name
                          v-if="childitemudd.localSettingObject"
                          :isExt="true"
                          :patchObj="{
                            code: SEARCH_CODE,
                            list: childitemudd.localSettingObject.materialSkuObject.ext,
                            isInfo: false
                          }"
                          :showSourceValue="childitemudd.source">
                        </wh-code-to-name>
                      </el-col>
                      <!-- 规格 -->
                      <el-col :span="8" class="detail text_color">
                        <wh-code-to-name
                          :showIcon="false"
                          :isExt="true"
                          :patchObj="{
                            code: SPEC,
                            list: childitemudd.localSettingObject.materialSkuObject.ext,
                            isInfo: false
                          }">
                        </wh-code-to-name>
                        <wh-code-to-name
                          :showIcon="false"
                          :isExt="true"
                          :patchObj="{
                            code: [SPU_SPEC_CODE],
                            list: childitemudd.localSettingObject.materialSkuObject.ext,
                            isInfo: false
                          }"
                        ></wh-code-to-name>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="6" class="detail text_color">
                        <span>每次用量</span>
                        {{childitemudd.measure}}{{childitemudd.unitName || childitemudd.measureUnitName}}
                      </el-col>
                      <el-col :span="6" class="detail text_color">
                        <span>{{childitemudd.useFreqTxt}}</span>
                      </el-col>
                      <el-col :span="6" class="detail text_color">
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
          </div>
          </el-checkbox-group>
        </el-col>
        <el-col :span="12">
          <div v-if="visible" class="mb10 treelist" id="treeBox">
            <comm-tree id="commonTree" :api="api" :isSelectAdd="true" @thisSelectData="thisTreeSelectData" :statusType="1"></comm-tree>
          </div>
          <div class="checklist">
            <div class="lists">
              <div class="list_li" v-for="(item, index) in dialogData.selectList" :key="index">
                <el-col :span="20"><span class="cGray">{{index + 1}}、</span>{{item.contentText}}</el-col>
                <el-col :span="4" style="text-align:right"><el-button type="danger" size="small" plain @click="deleSelect(index)">删除</el-button></el-col>
              </div>
              <el-col v-if="!dialogData.selectList.length" class="nodata" :span="24">还没有选择异常原因</el-col>
            </div>
          <div class="input_li">
            <el-col :span="20">
              <el-input v-if="operate === 'sign'" v-model="dialogData.inputVal" maxlength="100" placeholder="请输入异常原因"></el-input>
            </el-col>
          </div>
        </div>
        </el-col>
        <el-col>
          <div class="alg_c footer">
            <el-button plain class="submit" @click="handleCancle">取消</el-button>
            <el-button type="primary" class="submit" :disabled="dialogData.checkedItems.length === 0 || dialogData.selectList.length === 0 && dialogData.inputVal === ''" :loading="submitLoading" @click="handleSave">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/warehouse/page/prescription.review/util/commentapi.js'
import { SEARCH_CODE, SPU_SPEC_CODE, patch, SPACE_CODE, debounce, SPEC, CONSUMABLES_TYPE, PACKAGE_CODE } from '@/util/common'
import commTree from '@/warehouse/page/prescription.review/components/commontree.vue'
import chineseName from '@/warehouse/page/storages/dispensings/components/chinese.name'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    exceptionData: {
      type: Array,
      default () {
        return []
      }
    },
    operate: {
      type: String,
      default: ''
    },
    drugPackInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      api,
      dialogData: {
        checkedItems: [],
        selectList: [], // 异常原因
        inputVal: ''
      },
      SEARCH_CODE,
      SPACE_CODE,
      PACKAGE_CODE,
      CONSUMABLES_TYPE,
      submitLoading: false,
      SPU_SPEC_CODE,
      SPEC,
      optionsParent: []
    }
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.submitLoading = false
        this.dialogData.checkedItems = []
        this.dialogData.selectList = []
        this.dialogData.inputVal = ''
        this.scrollToBottom()
      }
    }
  },
  methods: {
    scrollToBottom () {
      setTimeout(_ => {
        const dom = document.querySelector('#treeBox')
        const commonTree = document.querySelector('#commonTree')
        const domHeight = dom.offsetHeight // 盒子高度
        let treeHeight = commonTree.offsetHeight // 树的历史高度
        dom.addEventListener('click', function (e) {
          setTimeout(function () {
            const top = dom.getBoundingClientRect().top // 元素上边距离页面上边的距离
            const newTreeHeight = commonTree.offsetHeight // 树的实时高度
            const scrollHeight = (newTreeHeight - treeHeight) > domHeight ? (domHeight - 50) : (newTreeHeight - treeHeight)
            if ((e.pageY - top) > (domHeight - 40) && treeHeight < newTreeHeight) {
              treeHeight = newTreeHeight
              dom.scrollTo(0, scrollHeight + dom.scrollTop)
            } else {
              treeHeight = 0
            }
          }, 300)
        }, true)
      }, 300)
    },
    ...patch,
    // 过敏史
    allergenList (data) {
      let arr = []
      if (!data) return
      data.forEach(item => {
        item && arr.push(item.name)
      })
      return arr.join(', ') || '无'
    },
    handleSave () {
      this.submitLoading = true
      this.$emit('confirm', this.dialogData)
    },
    handleCancle () {
      this.$emit('update:visible', false)
    },
    thisTreeSelectData (data) {
      this.$nextTick(_ => { // 组件更新完毕之后才执行
        setTimeout(_ => {
          let dom = this.$el.querySelector('.lists')
          let domHeight = dom.offsetHeight // 盒子的高度
          let treeHeight = dom.scrollHeight - domHeight // 滚动条隐藏的高度
          setTimeout(_ => {
            dom.scrollTop = dom.scrollTop + treeHeight
          })
        }, 300)
      })
      this.addSelect(data)
    },
    deleSelect (data) {
      this.dialogData.selectList.splice(data, 1)
    },
    selectData () {
      let params = {
        level: 1,
        status: 1
      }
      this.api.list(params).then(res => {
        if (res) {
          this.loopData(res)
          this.optionsParent = res
        }
      })
    },
    loopData (data, de) {
      if (de) {
        data.forEach(item => {
          delete item.name
          if (item.subList) this.loopData(item.subList, de)
        })
      } else {
        data.forEach(item => {
          item.name = item.contentText
          if (item.subList) this.loopData(item.subList)
        })
      }
    },
    selectsuccess () {
      this.loopData(this.dialogData.selectList, 'delete')
      this.$emit('selectcomment', this.dialogData.selectList)
      this.dialogVisible = false
    },
    addSelect: debounce(function (data) {
      let index = this.dialogData.selectList.findIndex(item => {
        return item.id === data.id
      })
      if (index > -1) {
        return this.$messageTips(this, 'warning', '当前异常原因已经选择过了')
      }
      this.dialogData.selectList.push(data)
    }, 300)
  },
  components: {
    commTree,
    chineseName
  },
  computed: {
    visibleDialog: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  }
}

</script>
<style scoped lang="less">
.anomaly-dialog {
  /deep/ .el-dialog__header {
    text-align: center;
    font-weight: bold;
  }
  .department {
    padding: 15px;
    height: 402px;
    overflow-y: auto;
    .tcm-top {
      margin-top: 20px;
      border-top: 1px solid #ccc;
    }
    .span-label {
      color: rgb(207, 204, 204);
    }
    .tooltip {
      width: 50%;
      height: 30px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      display: block;
    }
    .lh36 {
      line-height: 36px;
    }
    .tcm-item {
      line-height: 36px;
      height: 260px;
      overflow-y: auto;
    }
  }
  .details /deep/ .el-col .el-col-4 {
    padding: 0;
  }
  /deep/ .common-tree-box .el-tree {
    border-top: none;
  }
  /deep/ .el-dialog__body {
    padding: 0;
    .details {
      height: 45px;
      line-height: 45px;
      font-size: 14px;
    }
    .udddetails {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    .el-checkbox-group {
      font-size: 14px;
    }
    ul {
      margin: 0;
      padding: 0;
      height: 432px;
      overflow-y: auto;
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        .detailed {
          width: 85%;
          border: 1px solid #ccc;
          float: left;
          margin-top: 10px;
        }
        .span-label {
          color: #9EA09E;
        }
        .tooltip {
          width: 50%;
          height: 30px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          display: block;
        }
        .detail {
          line-height: 30px;
          font-size: 14px;
          overflow: hidden;
          margin-left: 10px;
        }
        .chinese_detail {
          line-height: 30px;
          font-size: 14px;
          overflow: hidden;
          margin-left: 5px;
        }
        .check {
          width: 10%;
          float: left;
          margin-top: 10px;
          text-align: center;
        }
      }
    }
  }
  .tablelist {
    background: #eee;
    height: 524px;
    overflow: hidden;
    margin: 15px;
  }
  .header {
    border-bottom: 2px solid #999;
  }
  .treelist {
    height: 300px;
    max-height: 300px;
    overflow-y: auto;
    border:1px solid #ccc;
    margin: 15px;

  }
  .input_li {
    line-height: 36px;
    overflow: hidden;
    margin-top: 15px;
  }
  .list_li {
    line-height: 24px;
    padding:5px 10px;
    overflow: hidden;
  }
  .checklist {
    border: 1px solid #ccc;
    background: #eee;
    height: 205px;
    margin: 15px;
    .lists {
      height: 140px;
      overflow-y: auto;
    }
    .nodata {
      line-height: 140px;
      text-align: center;
      color: #666;
    }
  }
  .footer {
    line-height: 80px;
  }
  .submit {
    width: 80px;
    height: 35px;
  }
  .ml45 {
    margin-left: 45px;
  }
  .text_color {
    color: #666;
  }
}
</style>
