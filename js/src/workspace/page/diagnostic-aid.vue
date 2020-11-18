<template>
  <div id="diagnostic_aid" ref='allheight'>
    <div class="topHeader" ref='topHeader'>
      <el-tabs v-model="activeName4" @tab-click="handleClick">
        <el-tab-pane :label="$t('科室常用诊断')" name="2"></el-tab-pane>
        <el-tab-pane v-for='item in titleList4' :label="$t(item.name)" :name="item.id" :key='item.id'></el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName2" @tab-click="handleClick"  v-if='activeName4 === "2"'>
        <el-tab-pane :label="$t('全部')" name="all"></el-tab-pane>
        <el-tab-pane v-for='item in titleList2' :label="$t(item.name)" :name="item.id" :key='item.id'></el-tab-pane>
      </el-tabs>
    </div>
    <div class="middlecontent" :style='style'>
      <el-input
        class="input"
        :placeholder="$t('诊断查找')"
        suffix-icon="el-icon-search"
        @input='searchByRange'
        v-model="search">
      </el-input>
      <el-row>
        <el-checkbox-group v-model="checkList" class="checkbox clearfix" size='medium' text-color='#000'>
          <el-col :span='12'  v-for='(item,index) in result' :key='index'>
            <el-checkbox :label="item">{{item.diseaseNameEn}}&nbsp;{{item | formatLang('diseaseName')}}&nbsp;<template v-if='item.diseaseAlias'>({{item.diseaseAlias}})</template></el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
  <div class="footbottom"  ref='footbottom'>
    <el-button type="primary" @click='sure'>{{$t('确定')}}</el-button>
    <el-button @click='cancle'>{{$t('取消')}}</el-button>
  </div>
  </div>
</template>
<script>
  import api from '../store/diagnosisapi'
import { setTimeout } from 'timers'

export default {
    props: ['query'],
    data () {
      return {
        activeName4: '2',
        activeName2: 'all',
        search: '',
        checkList: [],
        result: [],
        titleList4: [],
        titleList2: [],
        style: {
          height: ''
        }
      }
    },
    methods: {
      computerHeight () {
        setTimeout(_ => {
          this.style.height = (this.$refs.allheight.clientHeight - this.$refs.topHeader.clientHeight - this.$refs.footbottom.clientHeight) + 'px'
        })
      },
      handleClick (tab, event) {
        this.searchByRange()
        this.computerHeight()
      },
      sure () {
        this.$bus.$emit('diagnostic_aid', this.checkList)
      },
      cancle () {
        this.$emit('cancle')
      },
      async getByRangeCode (obj, fn) {
        obj.orgId = this.$store.state.currentUser.organizationId
        let res = await api.getByRangeCode(obj)
        fn(res.data)
      },
      async searchByRange () {
        let obj = {
          diseaseName: this.search
        }
        if (this.activeName4 === '2') {
          obj.diseaseGroupId = this.activeName2 === 'all' ? '' : this.activeName2
          obj.relateId = this.$route.query.dptId
          obj.rangeCode = '2'
          obj.orgId = this.$store.state.currentUser.organizationId
        } else {
          obj.diseaseGroupId = this.activeName4
          obj.rangeCode = '3'
        }

        let result = await api.searchByRange(obj)
        this.checkList = []
        this.result = result.data.resultList
      }
    },
    mounted () {
    // http://doc.everjiankang.com/pages/viewpage.action?pageId=24578330
      // http://doc.everjiankang.com/pages/viewpage.action?pageId=24578323
      // this.getByRangeCode(4)
      this.getByRangeCode({
        rangeCode: 2,
        relateId: this.$route.query.dptId
      }, data => {
        this.titleList2 = data
      })
      this.getByRangeCode({
        rangeCode: 3
      }, data => {
        this.titleList4 = data
      })
      this.searchByRange()
      this.computerHeight()
    },
    watch: {

    },
    components: {

    }
  }
</script>
<style lang='scss'>
  #diagnostic_aid{
    width: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    position: relative;
    .middlecontent{
      overflow-y: scroll;
    }
    .input{
      width: 200px;
    }
    .checkbox{
      padding:20px 0;
      overflow-y: scroll;
    }
    .el-checkbox {
      white-space: nowrap;
      text-overflow:ellipsis;
      overflow: hidden;
      width:100%;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #000;
    }
    .footbottom{
      height:40px;
      padding-top:2px;
    }
  }
</style>
