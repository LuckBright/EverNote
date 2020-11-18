<template>
<div class="search">
  <AddContent
      title="搜索框"
      :show-close-btn="!!editData.id"
      @sureEdit="sureEdit"
      @sureDel="sureDel"
      @sureClose="sureClose"
  >
    <div class="search-content">
      <el-radio-group @change="_edit" v-model="commonData.styleType">
        <div class="radio-item">
          <el-radio :label='searchTypes.party'>
            <div class="radio-content">
              <div class="search-box">
                <div class="search-box-pre">
                  <i class="el-icon-search"></i>
                </div>
                <span class="search-box-placeholder">搜索医生、搜索…</span>
              </div>
            </div>
          </el-radio>
        </div>
       <div class="radio-item">
         <el-radio :label="searchTypes.circle">
           <div class="radio-content">
             <div class="search-box circle">
               <div class="search-box-pre">
                 <i class="el-icon-search"></i>
               </div>
               <span class="search-box-placeholder">搜索医生、搜索…</span>
             </div>
           </div>
         </el-radio>
       </div>
      </el-radio-group>
      <MuduleCtrl
        style="margin-top: 10px;"
        :showMp="showMp"
        :showH5="showH5"
        @showMpChange="showMpChange"
        @showH5Change="showH5Change"
      >
      </MuduleCtrl>
    </div>
  </AddContent>
</div>
</template>

<script>
import AddContent from './base/add.content'
import { searchTypes, homeSection } from '../assets/json/homeSection'
import operation from '../mixins/operation'
import MuduleCtrl from './base/module.ctrl'

export default {
  name: 'add.search',
  components: {
    AddContent,
    MuduleCtrl
  },
  mixins: [operation],
  data () {
    return {
      searchTypes: searchTypes,
      commonData: {
        styleType: searchTypes.party
      },
    }
  },
  created () {
    this._setModuleInfo(homeSection.search, '搜索框')
  }
}
</script>

<style scoped lang="less">
  /deep/ .form-list{
    border-top: none;
    .form-item{
      border-bottom: none;
    }
  }
  .search-content{
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    padding: 20px;
    margin: 20px;
  }
  .radio-content{
    display: inline-block;
  }
  .radio-item{
    &:first-child{
      margin-bottom: 20px;
    }
  }
  .circle{
    border-radius: 40px;
  }
  .search-box{
    height: 40px;
    line-height: 40px;
    width: 355px;
    border: 1px solid #E0E0E0;
    position: relative;
    padding-left: 40px;
    .search-box-pre{
      position: absolute;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 45px;
      left: 0;
      top: 0;
      i{
        color: #999999;
        font-size: 20px;
      }
    }
    .search-box-placeholder{
      font-size: 16px;
      color: rgba(0,0,0,0.25);
    }
  }
</style>
