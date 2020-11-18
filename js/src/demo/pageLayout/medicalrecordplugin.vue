<template>
  <div class="layout_inner">
    <ever-bread-crumb name="列表" path="/demo/layout/list"></ever-bread-crumb>
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- <clinic-arrange-select v-model="arrange" :arrangeUseList="arrangeUseList"></clinic-arrange-select> -->
        <p>皮试</p>
        <ever-skintest v-model="skin"></ever-skintest>
        <p>非药物过敏源</p>
        <ever-allergen v-model="allergen1" :type="1"></ever-allergen>
        <hr />
        <p>药物过敏源</p>
        <ever-allergen
          v-model="allergen2"
          :type="1"
          :code="['THC_SYS_DRUG_ALLERGEN_PRIMARY', 'THC_SYS_DRUG_ALLERGEN_SECONDARY']"
        ></ever-allergen>
        <hr />
        <p>旧版过敏史</p>
        <ever-allergen v-model="allergen3"></ever-allergen>
        <hr />
        <p>新的诊断组件</p>
        <p>
          参数列表：showType: 针对组件分类
          <br />check: 是否有待查勾选
        </p>
        <el-row>
          simple （诊断）
          <ever-diagnosis v-model="diagnosis1" showType="simple" v-bind="$attrs" v-on="$listeners"></ever-diagnosis>
        </el-row>
        <el-row>
          simple （诊断+备注）
          <ever-diagnosis v-model="diagnosis2" :check="true" v-bind="$attrs" v-on="$listeners"></ever-diagnosis>
        </el-row>
        <el-row>
          pathology （诊断+病理信息）
          <ever-diagnosis
            v-model="diagnosis3"
            showType="pathology"
            v-bind="$attrs"
            v-on="$listeners"
          ></ever-diagnosis>
        </el-row>
        <el-row>
          complex（诊断+入院情况+效果)
          <ever-diagnosis v-model="diagnosis4" showType="complex"></ever-diagnosis>
        </el-row>
        <hr />
        <p>中医四诊</p>
        <sizhen v-model="sizhen" ref="sizhen"></sizhen>
        <!-- <sizhen :value.sync="obj.tcmDiagno" ref="sizhen"></sizhen> -->
        <p>牙科选择</p>
        <toothvalue v-model="toothValue"></toothvalue>
        <p>眼科 眼位输入</p>
        <eyeocuexam v-model="eyeocuexam" :eyeocuexam="eyeOcuExam" ref="eyevalue"></eyeocuexam>
        <hr />
        <p>非标准曲线</p>
        <div>
          <sign-chart :chart-config="chartConfig" :patient-id="patientId" :sign-type="signType"></sign-chart>
        </div>
        <p>非标准曲线（带基线）</p>
        <div>
          <sign-chart2 :chart-config="chartConfig" :patient-id="patientId" :sign-type="signType"></sign-chart2>
        </div>
        <p>标准曲线</p>
        <div>
          <standard-sign-chart
            :key="signType+'WHO'"
            :patient-id="standardPatientId"
            :sex="sex"
            :birthDay="birthDay"
            :signType="standardSignType"
            chartType="WHO"
            :show-title="false"
          ></standard-sign-chart>
          <standard-sign-chart
            :key="signType+'CDC'"
            :patient-id="standardPatientId"
            :sex="sex"
            :birthDay="birthDay"
            :signType="standardSignType"
            chartType="CDC"
          ></standard-sign-chart>
        </div>

        <p>病历编辑器 - 数据结构化</p>
        <p>
          <button @click="saveModule" v-show="isDev">保存模板</button>
          <button @click="getModuleData" v-show="!isDev">获取数据结构</button>
        </p>
        <div>
          <evereditor
            v-if="isDev"
            ref="editor"
            :html="html"
            mode="design"/>
          <evereditor
            v-else
            ref="editor"
            :html="html"
            mode="editor"
            :data-loader="dataLoader"/>
        </div>

      </el-col>
      <el-col :span="10" style="line-height:30px">
        skin:
        <br />
        {{skin}}
        <hr />
        allergen1:
        <br />
        {{allergen1}}
        <hr />allergen2:
        <br />
        {{allergen2}}
        <hr />allergen3:
        <br />
        {{allergen3}}
        <hr />diagnosis1:
        <br />
        {{diagnosis1}}
        <hr />diagnosis2:
        <br />
        {{diagnosis2}}
        <hr />diagnosis3:
        <br />
        {{diagnosis3}}
        <hr />diagnosis4:
        <br />
        {{diagnosis4}}
        <hr />sizhen:
        <br />
        {{sizhen}}
        <hr />toothValue:
        <br />
        {{toothValue}}
        <hr />eyeocuexam:
        <br />
        {{eyeocuexam}}
        <hr />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import clinicArrangeSelect from '@/components/medical/clinic.arrange.select'
import signChart from '@/components/signchart'
import signChart2 from '@/components/signchart2'
import standardSignChart from '@/components/standard.sign.chart'
import evereditor from 'evereditor'

import api from '@/form/store/api'
import phrapi from '@/form/store/phrapi'

export default {
  name: 'demo',
  data () {
    return {
      standardSignType: 'WEIGHT',
      standardPatientId: 'Wp2UlG05w3ptTvIGA3p',
      birthDay: '2017-05-07 00:00:00',
      patientId: 'lhNpTyVkltTwUyZCdvl',
      signType: 'BODY_TEMPERATURE',
      sex: 1,
      chartConfig: {
        'width': 636, // Number 默认值636 注:尺寸太小有可能会影响图表的查看
        'height': 380, // Number 默认值380 注:尺寸太小有可能会影响图表的查看
        'chartTitle': 'BMI', // String
        'xAxisName': 'x轴名称时间轴', // String
        'yAxisName': 'y轴名称y轴名称' // String
      },
      eyeOcuExam: {
        l1: '1',
        l2: '2',
        l3: '43',
        l4: '6',
        l5: '5',
        l6: '6'
      },
      skin: [
        {
          materialName: '西药测试速度',
          materialId: 'e2d8ccb8-be68-11e9-abd1-0242ac110011',
          result: '1',
          date: '2019-08-13 12:00'
        }
      ],
      allergen1: {
        isAllergicHis: true,
        guomin: [
          {
            allergen: [
              {
                id: '3',
                name: '环境'
              },
              {
                id: '302',
                name: '动物毛发'
              }
            ],
            remark: ''
          }
        ]
      },
      allergen2: {
        isAllergicHis: true,
        guomin: [
          {
            allergen: [
              {
                id: '10',
                name: '生物制品'
              },
              {
                id: '43',
                name: '糜蛋白酶'
              }
            ],
            remark: ''
          },
          {
            allergen: [
              {
                id: '11',
                name: '二氢吡啶类钙通道阻滞药'
              },
              {
                id: '18',
                name: '非洛地平'
              }
            ],
            remark: ''
          },
          {
            allergen: [
              {
                id: '13',
                name: '破坏DNA的铂类'
              },
              {
                id: '45',
                name: '奈达铂'
              }
            ],
            remark: ''
          }
        ]
      },
      allergen3: '',
      hasAllergicHis: true,
      arrange: '',
      arrangeUseList: [
        {
          id: 1,
          name: '出诊'
        },
        {
          id: 2,
          name: '不出诊'
        },
        {
          id: 3,
          name: '陪诊'
        },
        {
          id: 4,
          name: '其他'
        }
      ],
      diagnosis1: [
        {
          diseaseType: 2,
          diseaseCode: 'H01.13',
          diseaseCodeCategory: '',
          diseaseName: '眼睑湿疹性皮肤炎',
          diseaseOrigId: '97880030138337628',
          diagnoseType: 1,
          comment: 'sdsdsdsds',
          position: '',
          diagnoseList: [],
          positionData: [],
          groupList: []
        }
      ],
      diagnosis2: [],
      diagnosis3: [
        // {
        //   diseaseType: 2,
        //   diseaseName: '癌',
        //   diseaseCode: 'M80100/3',
        //   diseaseOrigId: 'f5ddbaa9-1548-11e9-b9b8-68f728cf9001',
        //   diagnoseType: 1,
        //   comment: '',
        //   position: '',
        //   diagnoseList: [],
        //   positionData: [],
        //   diseaseAlias: '',
        //   groupList: [],
        //   binglihao: 'asdasdsdsdsdsd'
        // }
      ],
      diagnosis4: [],
      sizhen: '',
      toothValue: {
        input: '',
        toothPick: {
          lefttop: '876',
          righttop: '',
          leftbottom: '',
          rightbottom: ''
        }
      },
      eyeocuexam: {},
      visitType: '1',
      // region editor
      // 开发模式
      isDev: false,
      html: localStorage.getItem('content') || '',
      patientId2: 'sz5utrLVyCg0DETzBiy',
      visitId2: 'OP20190000007440',
      dptId2: 'bb6c8ecb-8798-4949-ae8f-0308bc2f5017',
      formTemplateId: 'eec11373-5bdc-40a1-ba3e-8cbe2b9368bd'
      // endregion
    }
  },
  components: {
    clinicArrangeSelect,
    signChart,
    signChart2,
    standardSignChart,
    evereditor
  },
  // region editor
  created () {
    this.visitType = this.$route.matched[0] && this.$route.matched[0].meta.type || '1'
  },
  methods: {
    // 获取输入框的扁平结构
    getModuleData () {
      let items = this.$refs.editor.getAllFlatData()
      let obj = {
        // id: '6cf0a332-be88-4f45-a545-4b7ec6265b4b',
        text: this.$refs.editor.getHtml()
      }
      phrapi.createOrUpdate(this.formTemplateId,
        obj,
        {
          visitId: this.visitId2,
          patientId: this.patientId2,
          dptId: this.dptId2,
          items
        })
        .then(result => {
          console.log(result)
        })
    },
    // 保存模板
    saveModule () {
      let html = this.$refs.editor.getHtml()
      localStorage.setItem('content', html)
    },
    // 产品模式下
    // 数据加载
    dataLoader (columns) {
      return api.getMetaData(columns, this.patientId2, this.visitId2, this.visitType).then(result => {
        return result
      })
    }
  }
  // endregion
}
</script>
