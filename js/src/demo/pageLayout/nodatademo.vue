<template>
  <div style="width:500px;">
    <p class="cRed">数据为空的时候可以用这个组件，ever-no-data</p>
    <p class="cRed">tipTxt 显示文案</p>
    <p class="cRed">height 图片区域高度 默认80px高</p>
    <p class="cRed">可以通过custom这个下面文案区域替换掉</p>
    <p class="cRed">如果多次传 tipTxt="XXXX" 觉得太麻烦，可以在组件内增加自己的提示语，改为传msgType='1'(字符串)
      这个逻辑有点画蛇添足的意思，但是避免了页面出现大量重复的文本，也不用业务方在自己模块内定义变量，放到一处维护</p>
    <div>
      <ever-no-data>
        <template slot="custom">
          <div style="padding-top:10px">手术未执行，尚未生成手术记录</div>
          <el-button style="margin-top:10px" type="primary">立即执行</el-button>
        </template>
      </ever-no-data>
    </div>
    <div>
      <ever-no-data tipTxt="请选择患者，查看患者详情" size="small"></ever-no-data>
    </div>
    <div>
      <ever-no-data></ever-no-data>
    </div>
    <div>
      <ever-no-data height="180"></ever-no-data>
    </div>
    <div>
      <ever-no-data msgType="2"></ever-no-data>
    </div>
  </div>
</template>
