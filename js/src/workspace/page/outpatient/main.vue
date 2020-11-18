<template>
  <div>
    <div class="patientListWarp" :style="style">
      <div class="rightbar" @click="changeStyle(false)" ref='rightbar'  @mousedown='mousedown($event,"rightbar")'>患者列表</div>
      <patientList class="leftbar" w="350px" :space='space'></patientList>
    </div>
    <div class="flex_column_full" v-if="key">
      <patient-header
        :key="key + 'header'"
        :appoint="appoint"
        @basemedicalinfo="setBaseMedicalInfo"
        @refreshPage="refresh_page"
        v-bind='headerInfo'
      >
        <template slot="button">
          <el-button type="primary" size="mini" plain @click="openPhrDialog" v-if="config">病历首页</el-button>
        </template>
      </patient-header>
      <div class="outpatient-container flex_col_1_hidden" style="border-radius: 4px" :key="key + 'outpatient'">
        <div class="flex_layout">
          <div class="bingli item">
            <div style="padding-right: 5px;background-color: #ebedef;height: 100%;">
              <menzhenbingli
                v-if="queryData.subsequentVisit!=4"
                :showTitle="true"
                ref="patientcase"
                style="height: 100%;overflow-y:auto;background-color: #fff"
                @quote="quoteRecommend"
                @appoint="setAppoint"
                @results="setResults"
                @schemaId="setSchemaId"
                @saveSuccess="medicalSaveSuccess"
                :dis="!!queryData.status"
              ></menzhenbingli>
            </div>
            <transition name="everfade">
              <div
                class="backbg"
                v-if="['recipeTemplate', 'setMeal', 'filtrate'].indexOf(currentComp) > -1"
                :key="currentComp"
                @click="toggle('')"
              ></div>
            </transition>
            <transition name="everslide-left" mode="out-in">
              <div
                v-if="currentComp === 'recipeTemplate'"
                key="recipeTemplate"
                class="slide-left"
                @click.stop
              >
                <recipe-template
                  class="slide-content"
                  @quote="quoteRecipe"
                  :visitType="1"
                  :providerId="queryData.dptId"
                ></recipe-template>
                <!-- 这里放另一个弹出组件 -->
              </div>
              <div
                v-else-if="currentComp === 'setMeal'"
                key="setMeal"
                class="slide-left"
                @click.stop
              >
                <!-- 套餐 -->
                <set-meal-quote
                  class="slide-content"
                  :patientId="queryData.patientId"
                  :visitType="1"
                  @quote="quoteRecipe($event, 'ids')"
                ></set-meal-quote>
              </div>
              <div
                v-else-if="currentComp === 'filtrate'"
                key="filtrate"
                class="slide-left"
                @click.stop
              >
              <!-- 医嘱分类 -->
              <filtrate
                class="slide-content"
                :visitSn="visitSn"
                @quote="quoteRecipe($event, 'default')"
              >
              </filtrate>
            </div>
            </transition>
          </div>
          <div class="nav item" style>
            <ul style="text-align:center">
              <li
                :class="{active: currentComp==='medicalBackground'}"
                @click.stop="toggle_new('medicalBackground')"
              >
                <el-tooltip class="item" effect="dark" :content="$t('医疗背景')" placement="left">
                  <span>
                    <i class="icon iconfont icon-menzhen-binglimuban"
                      style="fontSize:24px"
                    ></i>
                    <span class="temfont">{{$t('医疗背景')}}</span>
                  </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='patienthistory'}"
                v-if="queryData.subsequentVisit!=4 && $hasPermission('Auth_menu_outdoctor_bljl')"
                @click.stop="toggle_new('patienthistory')"
              >
                <el-tooltip class="item" effect="dark" :content="$t('就诊历史')" placement="left">
                  <span>
                    <i class="icon iconfont icon-menzhen-lishijilu" style="fontSize:24px" title="就诊历史"></i>
                    <span class="temfont">{{$t('就诊历史')}}</span>
                  </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='quoteLayout',disable:disabled}"
                v-if="queryData.subsequentVisit!=4 && $hasPermission('Auth_menu_outdoctor_blmb')"
                @click.stop="toggle_new('quoteLayout')"
              >
              <el-tooltip class="item message" effect="dark" :content="$t('病历速录')" placement="left">
                <span>
                  <sub class="twinkling" v-if="hasNew"></sub>
                  <i class="icon iconfont icon-menzhen-binglimuban" title="病历速录"></i>
                  <span class="temfont">{{$t('病历速录')}}</span>
                </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='recipeTemplate',disable:disabled}"
                v-if="queryData.subsequentVisit!=4 && $hasPermission('Auth_menu_outdoctor_cfmb')"
                @click.stop="toggle_new('recipeTemplate')"
              >
              <el-tooltip class="item" effect="dark" :content="$t('处方模版')" placement="left">
                <span>
                  <i class="icon iconfont icon-menzhen-chufangmuban" title="处方模版"></i>
                  <span class="temfont">{{$t('处方模版')}}</span>
                </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='diagnosticAid',disable:disabled}"
                v-if="queryData.subsequentVisit!=4 && $hasPermission('Auth_menu_outdoctor_zdfz')"
                @click.stop="toggle_new('diagnosticAid')"
              >
              <el-tooltip class="item" effect="dark" :content="$t('诊断录入')" placement="left">
                <span>
                  <i class="icon iconfont icon-nav-jigou-zhenliao" style="fontSize:21px" title="诊断录入"></i>
                  <span class="temfont">{{$t('诊断录入')}}</span>
                </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='setMeal', 'tips_active': setMealStatus,disable:disabled}"
                v-if="queryData.subsequentVisit!=4  && $hasPermission('Auth_menu_outdoctor_tc')"
                @click.stop="toggle_new('setMeal')"
              >
              <el-tooltip class="item" effect="dark" :content="$t('套餐')" placement="left">
                <span>
                  <em v-if="setMealStatus && !disabled" class="tips_icon twinkling">●</em>
                  <i class="icon iconfont icon-chanjian" style="fontSize:21px" title="套餐"></i>
                  <span class="temfont">{{$t('套餐')}}</span>
                </span>
                </el-tooltip>
              </li>
              <li
                :class="{active: currentComp==='filtrate',disable:disabled}"
                v-if="queryData.subsequentVisit!=4  && $hasPermission('Auth_menu_yihu_classify')"
                @click.stop="toggle_new('filtrate')"
              >
              <el-tooltip class="item" effect="dark" :content="$t('医嘱分类')" placement="left">
                <span>
                  <i class="icon iconfont icon-fenlei1" style="fontSize:21px" title="医嘱分类"></i>
                  <span class="temfont">{{$t('医嘱分类')}}</span>
                </span>
                </el-tooltip>
              </li>
            </ul>
          </div>
          <div class="chufang item">
            <div style="background-color: #ebedef;height: 100%;">
              <div class="fullscreen" v-if="queryData.subsequentVisit!=4">
                <open-recipe
                  :space='space'
                  ref="recipe"
                  :appoint="appoint"
                  :share-info="shareInfo"
                  :share-time="shareTime"
                  :results="results"
                  :disabled="disabled"
                  :from-quick="queryData.fromQuick"
                ></open-recipe>
                <!-- 这里放处方组件 -->
              </div>
              <exam-main v-else></exam-main>
            </div>
            <transition name="everfade">
              <div
                class="backbg"
                v-if="['medicalBackground', 'patienthistory', 'quoteLayout', 'diagnosticAid'].indexOf(currentComp) > -1"
                :key="currentComp"
                @click="toggle('')"
              ></div>
            </transition>
            <transition
              name="everslide"
              mode="out-in"
            >
              <div v-if="currentComp === 'medicalBackground'" key="medicalBackground" class="slide">
                <medicalBackground
                  class="active slide-content"
                  code="yi_liao_bei_jing"
                  :dpt-id="queryData.dptId"
                  :patientId="queryData.patientId"
                  :visitId="queryData.visitSn"
                  :disabled="disabled"
                ></medicalBackground>
              </div>
              <div v-else-if="currentComp === 'patienthistory'" key="patienthistory" class="slide">
                <!-- 这里放弹出组件 -->
                <patienthistory
                  @openReport="openReport"
                  class="slide-content"
                  @quote="quoteHandle"
                  @treat="quoteRecipe"
                  :disabled="disabled"
                ></patienthistory>
              </div>
              <div v-else-if="currentComp === 'quoteLayout'" key="quoteLayout" class="slide">
                <!-- 这里放另一个弹出组件 -->
                <quote-layout
                  class="slide-content"
                  @quote="quoteHandle"
                  :dpt-id="queryData.dptId"
                  :schema-id="schemaId"
                ></quote-layout>
              </div>
              <div v-else-if="currentComp === 'diagnosticAid'" key="diagnosticAid" class="slide">
                <!-- 诊断辅助 -->
                <diagnostic-aid
                  class="slide-content"
                  @cancle="diagnostic_aid_cancle"
                  :query="queryData"
                ></diagnostic-aid>
              </div>
            </transition>
          </div>
        </div>
        <report-dialog ref="reportDialog"></report-dialog>
        <phrform-dialog
          :dataId="phrDataId"
          title="病历首页信息"
          tplCode="MEN_ZHEN_BING_LI_SHOU_YE"
          ref="phrformdialog"
          :nosubmit="true"
          @success="success"
        >
          <div slot="dialogFooter" class="pr20">
            <printbtn v-show="phrDataId !== '-1'" :code="`MEN_ZHEN_BING_LI_SHOU_YE`" :params="{id: phrDataId, patientId: queryData.patientId, visitId: queryData.visitSn}"  :lang="printLang">{{$t('打印')}}</printbtn>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </phrform-dialog>
      </div>
    </div>
    <div class="empty" v-else>
      <ever-no-data msg="您未接诊，暂无数据"></ever-no-data>
    </div>
  </div>
</template>
<script>
import mainjs from '@/workspace/page/outpatient/main.js'
import mousemove from '@/util/mousemove'
export default {
  mixins: [mainjs, mousemove],
  mounted () {
    this.mousedownInit('rightbar')
    if (Number(this.queryData.subsequentVisit) !== 4) {
      this.$bus.$emit('isGetAdvice')
      if (this.$refs.recipe && this.$refs.recipe.$refs.wait) {
        this.$refs.recipe.$refs.wait.getWaitData()
        this.$refs.recipe.$refs.wait.getRecipeData()
      }
    }
  },
  methods: {
    changeStyle (status) {
      if (this.moved) return
      if (status) {
        this.style.left = '-350px'
        return
      }
      this.style.left = this.style.left === 0 ? '-350px' : 0
    },
  },
  watch: {
    '$route.query': {
      handler (val) {
        this.$nextTick(() => {
          if (Number(this.queryData.subsequentVisit) !== 4) {
            this.$bus.$emit('isGetAdvice')
            this.$refs.recipe.$refs.wait.getWaitData()
            this.$refs.recipe.$refs.wait.getRecipeData()
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.flex_layout {
  .bingli {
    flex: 3;
    overflow-x: hidden;
  }
  .chufang {
    flex: 5;
    margin-right: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.icon {
  font-size: 22px;
  color: #666;
}
.active .icon {
  color: #1c7bef;
}
.active span {
  color: #1c7bef;
}
.tips_active {
  position: relative;
  .tips_icon {
    position: absolute;
    top: -6px;
    right: 0;
    line-height: 10px;
    color: #eb9e05;
    // animation: ysBreath 1.5s infinite ease-in-out;
  }
  .icon {
    color: #ee4433;
  }
  .temfont {
    color: #e43;
  }
}
.empty {
  img {
    width: 80px;
    display: block;
    margin: 100px auto 0;
  }
  p {
    text-align: center;
  }
}
.temfont {
  font-size: 12px;
  color: #000;
  cursor: pointer;
  display: inline-block;
  width: 2em;
  line-height: 1.2em;
  vertical-align: top;
}
.slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 100px;
  bottom: 0;
  z-index: 100;
}
.slide-content {
  position: relative;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  z-index: 100;
}
.backbg {
  opacity: 0.2;
  background-color: #000;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}
.everfade-enter.backbg,
.everfade-leave-to.backbg {
  opacity: 0;
}
.everfade-enter-active {
  transition: opacity 1s;
}
.everfade-leave-active {
  transition: opacity 0.5s;
}
.everslide-enter, .everslide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100%);
  /*left: -100%;*/
}
.everslide-leave {
  transform: translateX(0);
}
.everslide-enter-active {
  transition: all 0.3s linear;
  transition-delay: 100ms;
}
.everslide-leave-active {
  transition: all 0.3s ease-in-out;
  transition-delay: 100ms;
}

.slide-left {
  position: absolute;
  top: 0;
  left: 30px;
  right: 0;
  bottom: 0;
  z-index: 100;
}
.everslide-left-enter, .everslide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
  /*left: -100%;*/
}
.everslide-left-leave {
  transform: translateX(0);
}
.everslide-left-enter-active {
  transition: all 0.3s linear;
  transition-delay: 100ms;
}
.everslide-left-leave-active {
  transition: all 0.3s ease-in-out;
  transition-delay: 100ms;
}

ul {
  margin: 0;
  padding: 0;
}
.outpatient-container {
  display: flex;
  height: calc(100vh - 200px);
}
.item {
  position: relative;
}
.nav {
  width: 40px;
  background-color: #fcfcfc;
  box-shadow: 0 1px 8px 0 rgba(204, 204, 204, 0.36);
  .message {
    position: relative;
    sub {
      position: absolute;
      top: 0px;
      left: -8px;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 50%;
    }
  }
  li {
    margin: 10px 0;
    list-style: none;
  }
  .disable {
    span,
    i {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      border-color: #ccc;
    }
  }
}
.fullscreen {
  position: absolute;
  left: 0px;
  top: 1px;
  right: 1px;
  bottom: 1px;
  border: 1px solid #d9ddde;
  box-sizing: border-box;
  background-color: #f1f5f8;
}
@media (max-width: 1600px) {
  .chufang {
    overflow: auto;
  }
}
.patient_list {
  box-shadow: -10px 0px 5px #000;
}
.patientListWarp {
  position: absolute;
  z-index: 3;
  background: #fff;
  top: 40px;
  height: calc(100% - 40px);
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease-in;
  .rightbar {
    position: absolute;
    top: 30%;
    right: -33px;
    width: 27px;
    background: #1c7bef;
    color: #fff;
    text-align: center;
    padding: 10px 3px;
    border-radius: 0 4px 4px 0;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
