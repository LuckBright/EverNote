<template>
  <div>
    <el-select
      v-model="select"
      :size="size"
      filterable
      remote
      clearable
      :loading="loading"
      style="width:100%"
      :class="{'leftIcon':leftIcon}"
      class="select"
      :remote-method="suggest"
      :placeholder="placeholder || '请选择项目'"
      :disabled="disabled"
      :value-key="valueKey || 'id'"
      popper-class="service_select"
      :default-first-option="true"
      @change="change"
      @clear="clear"
      ref="select"
      @focus="selectFocus"
    >
      <!--@visible-change="bindScrollFun"-->
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="getLabel(item)"
        :value="item"
      >
        <p class="el-option-spe inline">
          <span class="rightMargin">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.threeServiceClassify || item.serviceClassification"></sys-value>
          </span>
        </p>
        <span>
          <template v-if="isChufang(item.serviceClassification)">{{ item | formatLang('byname') }}</template>
          <template v-else>{{ item | formatLang }}</template>
          <template
            v-if="isChufang(item.serviceClassification) && (item.name || item.byname)"
          >（{{ item | formatLang }}）</template>
        </span>
        <!-- <p :class="isChufang(item.serviceClassification) ? 'el-option-spe' : 'el-option-spe inline'"> -->
        <p :class="'el-option-spe inline'" style="margin-left:10px">
          <!-- <span class="rightMargin">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.threeServiceClassify || item.serviceClassification"></sys-value>
          </span> -->
          <span class="rightMargin" v-if="item.templateType">
            {{item.templateType === 1 ? '个人' : '科室' }}
          </span>
          <template v-if="!isNull(item.spec) && ['10008', '299', '300', '301', '302', '303', '304'].includes(item.serviceClassification)">
            <span class="rightMargin">{{ item | formatLang('spec') }}</span>
          </template>
          <span
            v-if="!isNull(item.unitName)"
            class="rightMargin"
          >{{ item | formatLang('unitName') }}</span>
          <span v-if="!isNull(item.price)" class="rightMargin">{{ item.price }}元</span>
          <span
            v-if="!isNull(item.chargeLevel)"
            class="rightMargin"
          >{{ $t(feeMap['' + item.chargeLevel]) }}</span>
          <span
            v-if="['301','302','303','304'].includes(item.serviceClassification) && !isNull(item.medicalInsuranceObject) && !isNull(item.medicalInsuranceObject.stdFeeClass) && [576,577].includes(item.medicalInsuranceObject.stdFeeClass)"
            class="rightMargin"
					>{{ $t(stdFeeClassMap['' + item.medicalInsuranceObject.stdFeeClass]) }}</span>
          <!-- 显示顺序毒麻精放药品、高危药品、抗菌药品 -->
					<span class="warning-type" v-if="item.specialClassify"><sys-value type="THC_BASE_STAFF_PERMISSION2" :code="item.specialClassify"></sys-value></span>
					<span class="warning-type" v-if="+item.highRisk === 1">高危药品</span>
					<span class="warning-type" v-if="item.antibioticType"><sys-value type="THC_BASE_STAFF_PERMISSION2" :code="item.antibioticType"></sys-value></span>
        </p>
      </el-option>
    </el-select>
    <p v-if="serviceId && String(select.isValid) === '0'" class="marks">已停用</p>
  </div>
</template>
<script>
import { isNull, objFind, formatLang } from '@/util/common'
import api from '../store/medicalapi'
// import recipeTplApi from '@/sob/store/casecontentapi'
import tmplApi from '@/sob/store/tmpl.api.js'

export default {
  // searchType(number): 1：医嘱项，2：收费项
  props: ['type', 'threeType', 'value', 'disabled', 'placeholder', 'valueKey', 'param', 'dealtype', 'scene', 'providerId', 'areaId', 'placement', 'belongType', 'isSet', 'size', 'isAddTpl', 'searchType', 'leftIcon', 'isFee', 'serviceId', 'emitName', 'query', 'providerTypes'], // providerTypes-执行地类型
  data () {
    let feeMap = {
      '1': '甲类',
      '2': '乙类',
      '3': '丙类',
      '4': '离休'
      // '1': '无自付',
      // '2': '有自付',
      // '3': '全自付'
    }
    let stdFeeClassMap = {
      '576': '复方可报',
      '577': '单方可报'
    }
    return {
      loading: false,
      options: [],
      axiosObj: {},
      input: this.value || '',
      feeMap,
      stdFeeClassMap,
      isNull,
      objFind,
      formatLang,
      queryStr: '',
      suggestType: 0,
      pagesize: 30,
      isValid: '',
      serviceIdSet: ''
    }
  },
  computed: {
    select: {
      set (val) {
        if (val.content) {
          return
        }
        this.$emit('input', val)
      },
      get () {
        if (this.input) {
          if (typeof this.input === 'object' && this.input.echo === undefined) {
            this.input.echo = true
          } else if (this.input.echo === true) {
            this.input.echo = false
          }
          if (this.input.name && this.input.echo !== false) {
            this.suggest(this.input.name, this.input.echo)
          }
        }
        return this.input
      }
    }
  },
  mounted () {
    this.space = this.$route.matched[0].meta.space // 工作台标示
    this.key = Math.random().toString().substring(2)
    if (this.$refs.select.$refs.popper) {
      this.$refs.select.$refs.popper.currentPlacement = this.placement || 'bottom-start'
    }
  },
  methods: {
    getLabel (item) {
      let name = this.formatLang(item, 'name') ? '（' + this.formatLang(item, 'name') + '）' : ''
      return this.isChufang(item.serviceClassification) ? (item.spec ? (this.formatLang(item, 'byname') + name + '  ' + this.formatLang(item, 'spec')) : this.formatLang(item, 'byname')) : this.formatLang(item)
    },
    bindScrollFun (flag) {
      if (flag) {
        let t = this.$refs.select.$refs.popper.$el.querySelector('.el-select-dropdown__wrap')
        this.$nextTick((_) => {
          t.addEventListener('scroll', (_) => {
            if (t.clientHeight + t.scrollTop - t.scrollHeight === 0) {
              let a = this.options
              let b = this.options.slice(0)
              this.options = a.concat(b)
            }
          }, false)
        })
      }
    },
    selectFocus (e) {
      // focus 初始
      this.queryStr = ''
    },
    isChufang (type) {
      let str = '301,302,303,304'
      return str.includes(type)
    },
    async change (val) {
      // 处方模版的逻辑
      if (val.content) {
        let res = await tmplApi.getById(val.id)
        let content = res.content ? JSON.parse(res.content) : []
        content.forEach(item => {
          if (this.space === 'ana') {
            item.subVisitType = 303
          } else if (this.space === 'birth_doctors') {
            item.subVisitType = 304
          } else {
            item.subVisitType = 301
          }
        })
        val.content = content
        if (this.emitName) {
          this.$bus.$emit(this.emitName, val.content)
        } else {
          this.$bus.$emit('yihu:setRecipeTemplateToWaitarea', val.content)
          return
        }
        this.$emit('input', '')
      } else {
        this.$emit('change', val)
      }
    },
    clear () {
      this.options = []
      this.$emit('clear')
    },
    suggest (query) {
      this.queryStr = query
      if (!this.serviceIdSet && this.belongType && !this.isSet) {
        this.isValid = '1'
      }
      const _self = this
      if (isNull(query)) {
        _self.options = []
        return
      }
      _self.suggestFn(query)
    },
    async suggestFn (query) {
      const _self = this
      if (query && query.indexOf('　')) query = query.split('　')[0]
      this.$emit('query', query)
      _self.loading = true
      // 如果是#开头的表示要加载处方模版
      if (!this.isAddTpl && query.startsWith('#')) {
        setTimeout(async _ => {
          let _type = this.scene
          let templateSource = '1'
          if (this.isFee) {
            _type = ''
            templateSource = '2'
          }
          let params = {
            templateRequests: [1, 2, 3].map(item => {
              return {
                providerId: this.providerId || '',
                areaId: this.areaId || '',
                templateName: query.slice(1),
                templateType: item,
                sceneType: _type,
                templateSource
              }
            })
          }
          let res = await tmplApi.getAllTplList(params)
          if (res) {
            let dataList = res
            dataList.map(data => {
              data.name = data.templateName
              data.content = []
              // data.content = typeof data.content === 'string' ? JSON.parse(data.content, true) : data.content
              data.content.forEach(value => {
                if (this.space === 'ana') {
                  value.subVisitType = 303
                } else if (this.space === 'birth_doctors') {
                  value.subVisitType = 304
                } else {
                  value.subVisitType = 301
                }
                // if (value.visitType === 1) {
                //   // if (typeof value.serviceItem === 'string') {
                //   //   value.chargeLevel = JSON.parse(value.serviceItem).chargeLevel
                //   // } else {
                //   //   value.chargeLevel = value.serviceItem.chargeLevel
                //   // }
                // }
              })
              return data
            })
            _self.loading = false
            _self.options = dataList
          } else {
            _self.options = []
          }
          this.$nextTick(_ => {
            return this.$refs.select && this.$refs.select.broadcast('ElSelectDropdown', 'updatePopper')
          })
        }, 20)
      } else {
        let param = {
          pagesize: this.pagesize || 30,
          scene: this.scene || 1,
          providerTypes: this.providerTypes
        }
        // 同过url取参数不是很好，目前保留，以后使用组件用用props中的query来传递参数
        if (this.$route.query.visitSn) param.visitNumber = this.$route.query.visitSn
        if (this.$route.query.hospitalizedNumber) param.hospitalizedNumber = this.$route.query.hospitalizedNumber
        param = Object.assign({}, param, this.query || {})
        let adviceType = []
        if (this.type) {
          if (this.type.indexOf(',') !== -1) {
            adviceType = this.type.split(',')
          } else {
            adviceType = [this.type]
          }
        }
        param.serviceClassificationList = adviceType
        if (this.threeType) {
          param.threeServiceClassify = this.threeType
        }
        // param.serviceSetClassification = this.type
        if (this.searchType === 1) {
          param.isAdviceList = [11, 10]
        } else if (this.searchType === 2) {
          param.isAdviceList = [11, 1]
        }
        if (this.isFee) {
          param.isSet = 0
        }
        Object.assign(param, { name: query })
        let func
        setTimeout(async _ => {
          // 扫码开医嘱没这功能了
          // if (this.suggestType === 1) {
          //   param.code = query
          //   func = api.getServiceBySweepCode(param)
          // } else {
            // if (this.isAddTpl) {
            //   func = api.getServiceItem(param)
            // } else {
            //   func = api.searchForBrowser(param)
            // }
          if (this.isSet) {
            func = api.getServiceSetAll(param)
          } else {
            if (!this.belongType) {
              func = api.searchForBrowser(param, this.key)
            }
          }
          // }
          // 获取集团医嘱项目
          if (this.belongType) {
            if (this.isSet) {
              param.belongType = this.belongType
              func = api.getServiceSet(param)
            } else {
              param.serviceBelongType = this.belongType
              if (this.isValid) {
                param.isValid = this.isValid
              }
              delete param.scene
              delete param.isSet
              func = api.queryServiceVariable(param)
            }
          }
          const result = await func
          _self.loading = false
          if (result) {
            _self.options = result.data || []
            if (this.input) {
              let value = objFind(result.data, { id: this.input.id })
              Object.assign(this.input, value)
            }
            if (this.serviceIdSet && this.belongType && !this.isSet) {
              this.serviceIdSet = ''
            }
            this.$nextTick(_ => {
              if (this.suggestType === 1) {
                this.suggestType = 0
                if (result.data && result.data.length) {
                  this.input = JSON.parse(JSON.stringify(result.data[0]))
                  this.input.echo = false
                }
              }
              return this.$refs.select && this.$refs.select.broadcast('ElSelectDropdown', 'updatePopper')
            })
          }
        }, 20)
      }
    }
  },
  watch: {
    value (val) {
      val = val || ''
      this.input = val
    },
    input () {
      this.$emit('input', this.input)
    },
    'dealtype' () {
      this.options = []
    },
    queryStr (val, old) {
      // 被遗忘的代码，先干掉，貌似是为扫码开医嘱
      // if (!old && val.length > 3 && /^[a-zA-Z0-9]{10,32}$/.test(val)) {
      //   this.suggestType = 1
      // } else {
      //   this.suggestType = 0
      // }
    },
    serviceId (val) {
      this.serviceIdSet = val
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select-dropdown {
  .el-option-spe {
    margin: 0;
    font-size: 12px;
    line-height: 14px !important;
    .rightMargin {
      margin-right: 10px;
    }
  }
  .el-option-spe.inline {
    display: inline-block;
  }
}

.leftIcon {
  /deep/ .el-input {
    input {
      padding-left: 36px;
    }
  }
}
.marks {
  margin: 2px 0 0;
  color: #f56c6c;
  font-size: 12px;
  line-height: 18px;
}
.service_select {
  .el-select-dropdown__item {
    padding: 8px 10px;
    height: auto;
    line-height: 1;
    span {
      line-height: 14px !important;
    }
  }
}
.warning-type {
	color: red;
}
.hover .warning-type {
	color: #fff;
}
</style>
