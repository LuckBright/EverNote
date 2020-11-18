<!--  -->
<template>
  <div class="search-box" :class="{ 'had-attention': hadAttention }">
    <div class="switch">
      <div
        class="jigou inline-block"
        :class="{ active: active === 1 }"
        @click="switchActive(1)"
        v-if="scope === 'tenant' || scope === 'org'"
      >
        <span class="icon inline-block iconfont icon-jigou"></span>
        <span class="">机构</span>
      </div>
      <div
        class="jituan inline-block"
        :class="{ active: active === 2 }"
        :active="2"
        @click="switchActive(2)"
        v-if="scope === 'tenant'"
      >
        <span class="icon inline-block iconfont icon-jituan1"></span>集团
      </div>
    </div>
    <div class="search-controls">
      <span
        class="inline-block search-icon iconfont icon-shuxuegongzuotai-cha"
      ></span
      ><input
        class="search"
        type="text"
        v-model.trim="keyword"
        placeholder="请输入关键词"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="debouncedQueryChange"
        @keydown.enter.prevent="goPatientDetail('exact')"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.esc.stop.prevent="visible = false"
        ref="input"
      />

      <el-button type="primary" class="btn" @click="goPatientDetail('exact')"
        >搜索 <i class="zhuantiao inline-block iconfont icon-zhuantiao"></i
      ></el-button>
    </div>
    <div class="list-container" v-show="visible" @mouseleave="hoverItem(-1)" v-loading="loading">
      <div
        class="suggestions-inner-container inline-block"
        :class="{ hover: index === hoverIndex }"
        v-for="(item, index) in options"
        :key="item.patientId"
        @click="selected(item, true)"
        @mouseenter="hoverItem(index)"
      >
        <div class="name ellipsis item inline-block" :title="item.patientName">
          {{ formatData(item.patientName) }}
        </div>
        <div class="code ellipsis item inline-block">
          {{ formatData(item.patientNumber) }}
        </div>
        <div class="bir ellipsis item inline-block">
          {{ item.birthday | formatDateByExp('YYYY-MM-DD') }}
        </div>
        <div class="id ellipsis item inline-block">
          {{ formatData(item.identificationNumber) }}
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import urlMap from '@/phr/api/urls'
import { request } from '@/util/req'
import { debounce } from 'lodash'

const { list } = urlMap.search
export default {
  props: {
    hadAttention: Boolean,
    scope: {
      type: String,
      default: 'org'
    }
  },
  data () {
    return {
      keyword: '',
      active: 1,
      visible: false,
      options: [],
      hoverIndex: -1,
      loading: false
    }
  },

  components: {},

  computed: {},

  created () {
    this.debouncedQueryChange = debounce(this.handleQueryChange, 300)
  },
  methods: {
    navigateOptions (direction) {
      if (!this.visible) {
        this.visible = true
        return
      }
      if (this.options.length === 0) return
      if (direction === 'next') {
        this.hoverIndex++
        if (this.hoverIndex === this.options.length) {
          this.hoverIndex = 0
        }
      } else if (direction === 'prev') {
        this.hoverIndex--
        if (this.hoverIndex < 0) {
          this.hoverIndex = this.options.length - 1
        }
      }
      this.isNavigate = true
      this.selected(this.options[this.hoverIndex], false)
    },
    hoverItem (index) {
      this.hoverIndex = index
    },
    formatData (val) {
      if (!val) {
        return '--'
      } else {
        return val
      }
    },
    switchActive (data) {
      this.active = data
      this.options = []
      this.debouncedQueryChange()
      this.$refs.input.focus()
    },
    async handleFocus () {
      if (this.options.length) {
        this.visible = true
      }
      this.debouncedQueryChange()
    },
    async handleQueryChange () {
      this.isNavigate = false  // 是否是按 上下箭头切换选中
      if (!this.keyword) {
        this.visible = false
        this.selectedPatient = ''
        this.options = []
        return
      }
      this.loading = true
      this.visible = true
      const scope = this.active === 1 ? 'org' : 'tenant'
      const res = await request(
        list,
        {
          keyword: this.keyword,
          scope,
          offset: 0,
          pagesize: 8,
          rid: 'Auth_menu_phr_patientlist'
        })
      this.options = res && res.data
      this.loading = false
      this.visible = !!this.options.length
    },
    selected (item, go) {
      this.selectedPatient = item
      // const formatData = this.formatData
      // const { patientName, patientNumber, birthday, identificationNumber } = item
      // this.keyword = `${formatData(patientName)}  ${formatData(patientNumber)} ${birthday ? this.$moment(birthday).format('YYYY-MM-DD') : '--'}  ${formatData(identificationNumber)}`
      this.$refs.input.focus()
      if (go) {
        this.goPatientDetail()
      }
    },
    handleBlur (e) {
      setTimeout(() => {
        this.visible = false
        this.hoverIndex = -1
      }, 150)
    },
    goPatientDetail (exact) {
      if (!this.options.length) {
        this.$messageTips(this, 'warning', '未查询到个人健康信息！', '提示')
        return
      }
      if (!this.selectedPatient) {
        this.selected(this.options[0])
      }
      const item = this.selectedPatient
      if (exact === 'exact' && !this.isNavigate) { // 精确查找跳转
        const { patientName, patientNumber, birthday, identificationNumber } = item
        if (this.keyword !== patientName && this.keyword !== patientNumber && this.keyword !== this.$moment(birthday).format('YYYY-MM-DD') && this.keyword !== identificationNumber) {
          this.$messageTips(this, 'warning', '未查询到个人健康信息！', '提示')
          return
        }
      }
      if (this.getVisitTotal(item.visitNumList) === 0) {
        this.$messageTips(this, 'warning', '无就诊记录', '提示')
        return
      }
      this.$router.push({
        path: '/phr/patientdetail',
        query: {
          patientId: item.patientId,
          pagequery: { ...this.$route.query }
        }
      })
    },
    getVisitTotal (list) {
      let temptotal = 0
      if (list) {
        list.forEach((item, index) => {
          temptotal += item.visitNumber
        })
      }
      return temptotal
    },
  }
}

</script>
<style lang='scss' scoped>
.search-box {
  width: 680px;
  height: 85px;
  box-sizing: border-box;
  position: absolute;
  top: 25%;
  left: 30%;
  font-size: 14px;
  .list-container {
    height: 276px;
    box-shadow: 0 4px 4px 0 #bbcae1;
    background-color: #ffffff;
    position: absolute;
    width: 100%;
    top: 78px;
    z-index: 6;
    border-radius: 0px 0px 4px 4px;
    .suggestions-inner-container {
      height: 32px;
      color: #333333;
      line-height: 32px;
      width: 100%;
      cursor: default;
      .name {
        margin-left: 38px;
        width: 80px;
      }
      .code {
        width: 150px;
      }
      .bir {
        width: 100px;
      }
      .id {
        width: 140px;
      }
      .item {
        margin-right: 5px;
      }
    }
    .suggestions-inner-container:hover {
      background: #e7f2ff;
    }
    .hover {
      background: #e7f2ff;
    }
  }
  .switch {
    user-select: none;
    .icon {
      font-size: 14px;
      color: #ffffff;
    }
    .jituan,
    .jigou {
      box-sizing: border-box;
      height: 35px;
      width: 90px;
      background: #4484c9;
      padding: 10px 10px 10px 20px;
      color: white;
      cursor: pointer;
    }
    .jigou {
      margin-right: -4px;
      border-radius: 4px 0px 0 0;
      box-shadow: -2px -3px 4px 0 rgba(187, 187, 187, 0.3);
    }
    .jituan {
      border-radius: 0px 4px 0px 0px;
      box-shadow: 2px -3px 4px 0 rgba(187, 187, 187, 0.3);
      .icon {
        position: relative;
        top: -1px;
        margin-right: 5px;
      }
    }
    .active {
      background: #ffffff;
      color: #666666;
      cursor: auto;
      font-weight: 600;
      .icon {
        color: #4484c9;
        cursor: text;
        font-weight: 400;
      }
    }
  }
  .search-controls {
    height: 50px;
    background: #ffffff;
    box-shadow: 0 2px 5px 0 #cbd2dd;
    border-radius: 0px 4px 4px 4px;
    .search {
      outline: none;
      width: 79%;
      box-sizing: border-box;
      height: 76%;
      border: 0px;
      margin: 6px 1px 0 0px;
    }
    .search-icon {
      color: #8a929e;
      margin-left: 20px;
      margin-right: 3px;

      font-size: 14px;
      cursor: auto;
    }
    .btn {
      box-sizing: border-box;
      width: 87px;
      height: 32px;
      background: #4484c9;
      border-radius: 4px;
      border-radius: 4px;
      padding: 6px;
    }
    .zhuantiao {
      width: 14px;
      height: 10px;
      margin-left: 15px;
      font-size: 14px;
    }
  }
}
.had-attention {
  top: 5%;
}
</style>
