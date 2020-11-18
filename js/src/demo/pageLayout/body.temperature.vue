<template>
    <div >
        <div class="print"><button @click="print">打印</button></div>
        <div class="test3">
            <el-scrollbar 
                ref="myScrollbar"
            >
                <div class="scroll" style="padding-right:15px;" id="printContent">
                    <div class="temperature_wrap">
                        <div class="left_title_div"></div>
                        <div class="right_content">
                            <div class="content_auto">
                                
                            </div>
                        </div>
                    </div>
                </div>
             </el-scrollbar>
            <!-- <div class="legend">
                <div class="icon" v-for="item in icons" :key="item">
                    <p>{{item}}</p>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import {axisTest} from '../../emr/components/temperature/test.js'

export default {
  data () {
    return {
      icons: ['腋温', '口温', '肛温', '降温', '脉搏', '心率', '心率起搏器', '疼痛', '镇痛', '腋温脉搏重叠', '口温脉搏重叠', '肛温脉搏重叠', '心率脉搏重叠', '疼痛镇痛重叠', '向上箭头', 'H图标']
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      axisTest()
    })
    this.handlerScroll()
  },
  methods: {
    handlerScroll () {
      let scrollbarEl = this.$refs.myScrollbar.wrap
      let clientHeight = window.innerHeight || document.documentElement.clientHeightundingClientRect().top
      let height = scrollbarEl.offsetHeight
      let top = scrollbarEl.getBoundingClientRect().top + window.scrollY
      if ((top + height) < clientHeight) return false
      scrollbarEl.onscroll = function () {
        let inScrollTop = scrollbarEl.scrollTop
        let inScrollHeight = scrollbarEl.scrollHeight - height
        let ratio = inScrollTop / inScrollHeight
        let bodyScrollHeight = window.document.body.scrollHeight
        let top = bodyScrollHeight * ratio
        scrollTo(0, top)
      }
    },
    print () {
      var oldhtml = document.body.innerHTML
      document.body.innerHTML = document.getElementById('printContent').innerHTML
      document.body.setAttribute('class', 'printBody')

      window.print()
      document.body.innerHTML = oldhtml
      window.location.reload()
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.el-scrollbar__wrap{
    overflow-x:auto;
}
.print{
    height: 30px;
    line-height: 30px;
}
.test3{/*需要考虑a4纸的大小*/
    /* width: 1000px; */
    margin:0 auto;
    display:flex;
    flex-direction: row;
    text-align: left;
    height:800px;
    overflow: hidden;
}
.temperature_wrap{
    display:flex;
    flex-direction: row;
    width: 700px;
    overflow:hidden;
}
.left_title_div{
    border:1px solid #000;
    border-right:none;
    border-bottom:none;
    text-align: left;
    box-sizing:border-box;
}
.left_title,.left_title_div{
    width: 130px;
}
.right_content{
    width:570px;
    border-bottom:1px solid #000;
    
}
.content_auto{
    width:100%;
    height:100%;
    border-bottom:1px solid #000;
    box-sizing:border-box;
}
.legend{
    width: 200px;
    height:300px;
    
}
.legend .icon{
    display: flex;
    flex-direction: row;
}
.legend p {
    line-height:20px;
}

</style>
