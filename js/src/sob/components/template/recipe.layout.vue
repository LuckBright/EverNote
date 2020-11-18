<template>
  <div class="ever_template_quote">
    <el-row style="height: 60px;padding: 10px 0;overflow: hidden;">
      <el-col :span="12">
        <span
          style="display:block; font-size:18px;font-weight:blod; line-height:42px; padding:0 10px; padding-right: 20px;"
        >{{tempTitle}}</span>
      </el-col>
      <el-col :span="12" align="right">
        <!-- <el-form style="margin: 0;"> -->
          <!-- <el-form-item style="margin: 0;"> -->
        <!-- 不能用form表单，回车会造成一次刷新页面，url域名后加了个？ -->
        <el-input
          @keyup.enter.native.stop.prevent="enterSearch"
          placeholder="请输入模版名称"
          v-model="tplName"
          ref="firstfocus"
          style="font-size:14px;"
        >
          <!-- <el-button slot="append" icon="icon iconfont icon-chaxun" @click="getTplList"></el-button> -->
        </el-input>
          <!-- </el-form-item> -->
        <!-- </el-form> -->
      </el-col>
    </el-row>
    <div class="quote_wrap">
      <el-row class="list_wrap">
        <el-col :span="6" class="list_item">
          <simple-list
            :belong-type="belongType"
            :tpl-list="tplList"
            @select="tplSelect"
            @nav="typeChange"
          ></simple-list>
        </el-col>
        <el-col :span="18" class="con_wrap list_item">
          <recipe-fee-content
            v-model="detailData"
            ref="recipecontent"
            @quote="quoteHandle"
            v-if="visitType === 5"
          ></recipe-fee-content>
          <recipe-content v-model="detailData" ref="recipecontent" @quote="quoteHandle" v-else></recipe-content>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/sob/store/tmpl.api.js'
// import apidept from '@/sob/store/casecontentdeptapi'
import simpleList from './simple.list'
import recipeContent from '@/sob/components/template/recipe.content'
import recipeFeeContent from '@/sob/components/template/recipe.fee.content'
import { Trim } from '@/util/common'
import { setTimeout } from 'timers'

export default {
  props: ['visitType', 'providerId'],
  data () {
    return {
      belongType: '1',
      tplName: '',
      tpltype: 1,
      templateSource: 1,
      dptId: this.$route.query.dptId,
      tplList: [],
      detailData: '',
      detailTil: ''
    }
  },
  components: {
    simpleList,
    recipeContent,
    recipeFeeContent
  },
  computed: {
    // api () {
    //   return this.belongType === '1' ? api : apidept
    // },
    tempTitle () {
      if (this.visitType === 1) {
        return '处方模版'
      } else if (this.visitType === 3) {
        return '医嘱模版'
      } else if (this.visitType === 5) {
        return '计费模版'
      }
    }
  },
  created () {
    this.api = api
    if (this.visitType === 1) {
      this.tpltype = 1
      this.templateSource = 1
    } else if (this.visitType === 3) {
      this.tpltype = 3
      this.templateSource = 1
    } else if (this.visitType === 5) {
      this.tpltype = ''
      this.templateSource = 2
    }
    this.getTplList()
    // 为什么v-focus derecitve不管事 加载之后设置 focus
  },
  updated () {
    setTimeout(_ => {
      this.$refs.firstfocus && this.$refs.firstfocus.focus()
    }, 300)
  },
  methods: {
    getTplList () {
      let params = {
        templateType: this.belongType,
        sceneType: this.tpltype,
        templateSource: this.templateSource,
        providerId: this.providerId,
        templateName: this.tplName,
        offset: 0,
        pagesize: 1000
      }
      this.api.list(params).then(res => {
        if (res && res.list.length) {
          this.tplSelect(res.list[0])
          this.tplList = res.list
        } else {
          this.tplList = []
          this.detailData = ''
        }
        // if (res && res.resultList) {
        //   let dataList = res.resultList || res
        //   dataList.map(data => {
        //     data.content = typeof data.content === 'string' ? JSON.parse(data.content, true) : data.content
        //     return data
        //   })
        //   this.tplList = dataList
        //   this.detailData = dataList[0]
        //   this.$refs.recipecontent.selectAll()
        // } else {
        //   this.tplList = []
        //   this.detailData = ''
        // }
      })
    },
    typeChange (type) {
      this.belongType = type
    },
    tplSelect (data) {
      this.getTplDetail(data.id).then(res => {
        if (res) {
          this.detailData = JSON.parse(res.content)
          this.$refs.recipecontent && this.$refs.recipecontent.selectAll()
        } else {
          this.detailData = ''
        }
      })
    },
    async getTplDetail (id) {
      let res = await api.getById(id)
      return res
    },
    quoteHandle (items) {
      this.$emit('quote', items)
    },
    enterSearch () {
      this.$refs.recipecontent.quoteHandle()
    }
  },
  watch: {
    'belongType' () {
      this.getTplList()
    },
    'tplName' (val) {
      this.tplName = Trim(val)
      this.getTplList()
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_template_quote {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .top_til {
    padding-top: 10px;
    padding-left: 15px;
    font-size: 16px;
    font-weight: 500;
    line-height: 35px;
  }
  .search_box {
    padding: 15px;
    max-width: 400px;
  }
  .quote_wrap {
    flex: 1;
    border-top: 1px solid #eee;
    overflow: hidden;
    .list_wrap {
      height: 100%;
      overflow: hidden;
      .list_item {
        height: 100%;
      }
    }
    .con_wrap {
      padding: 0 10px;
      border-left: 1px solid #eee;
      font-size: 14px;
    }
  }
}
</style>
