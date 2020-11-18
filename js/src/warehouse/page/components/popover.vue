<template>
  <span class="pos_re">
    <!-- <el-popover
      placement="top-start"
      trigger="hover">
      <div>
        <ul v-if="data && data.length">
          <li v-for="(item, index) in data">
            <span v-if="item.uniqueCode" style="width: 170px"><b style="width: 50px">唯一码：</b>{{item.uniqueCode}}</span>
            <span v-if="item.ownUniqueCodes" style="width: 170px"><b>商品码：</b>{{item.ownUniqueCodes}}</span>
            <span v-if="item.batchNum" style="width: 170px"><b>生产批号：</b>{{item.batchNum}}</span>
            <span v-if="item.produceDate"><b>生产日期：</b>{{item.produceDate ? $moment(item.produceDate).format('YYYY-MM-DD') : '-'}}</span>
            <span v-if="item.validityDate"><b>有效期：</b>{{item.validityDate ? $moment(item.validityDate).format('YYYY-MM-DD') : '-'}}</span>
            <span v-if="!show" style="width: 50px"><el-button type="text" class="red" @click="handleDelRow(index)">删除</el-button></span>
          </li>
        </ul>
        <ul v-else>
          <li><p class="alg_c">暂无数据</p></li>
        </ul>
      </div>
    </el-popover> -->
    <el-button slot="reference" type="text">共 {{data.length}} 个</el-button>
    <span class="pos_ab"></span>
  </span>
</template>
<script>
export default {
  name: 'popover',
  // data  渲染数据
  // index 当前索引
  // i     父级索引
  props: ['data', 'index', 'i', 'show'],
  methods: {
    handleDelRow (index) {
      this.$emit('handleDelRow', index, this.index, this.i, this.data[index])
    }
  }
}
</script>
<style lang="scss" scoped>
// .cssPs { top: 0; right: 40px; line-height: 50px}
ul, li { margin: 0; padding: 0; line-height: 30px;}
ul li span { padding: 0 10px; width: 130px; display: inline-block; overflow: hidden}
ul li span b { color: #999; font-size: 12px; width: 60px; display: inline-block; text-align: right}
ul li .el-button { display: inline}
// ul li span:first-child, ul li span:nth-child(2) { width: 200px}
// .pos_re { height: 50px; display: inline-block; line-height: 50px}
.pos_re span.pos_ab {display: none; z-index: 999; left: 50%; margin-left: -15px; width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 10px solid #fff; top: 40px}
.bg_rows .pos_re span.pos_ab {display: inline-block;}
</style>
