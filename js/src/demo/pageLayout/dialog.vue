<template>
  <div>
    <ever-bread-crumb name="UI dialog 样式规范" path="/demo/layout/dialog"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <p class="a_ui_01" style="line-height: 30px">弹窗的规范进行了修改，共有大小两个尺寸
          <br>小尺寸：页面宽度<1680px时适用，宽度700px（可根据实际情况调整），最大高度500px;
          <br>大尺寸：页面≧1680px时适用，宽度1000px（可根据实际情况调整），最大高度660px
        </p>
        <p>根据规范在原来elementUI的el-dialog组件上自定义了样式ui_dialog_02；如果内容没必要太宽可固定弹窗为700px的宽度时，增加spe样式</p>
        <el-button @click="dialogVisible = true">显示全屏 弹窗样式</el-button>
        <el-button @click="dialogVisible1 = true">显示UI 弹窗样式</el-button>
        <el-button @click="dialogVisible2 = true">固定700px的弹窗样式</el-button>
        <el-button @click="miniDialog = true">无标题，自定义宽度弹窗样式(非规范)</el-button>
      </div>
    </div>
    <el-dialog title="全屏弹窗样式" :visible.sync="dialogVisible" :fullscreen="true">
      <div style="height:600px;text-align: center;font-size: 20px">这块是弹窗的内容，根据具体替换</div>
      <span slot="footer" class="dialog-footer">
        <el-button>
          <i class="iconfont icon-dayinji-"></i>打印
        </el-button>
        <el-button @click="submit" type="primary">
          <i class="iconfont icon-tijiao"></i>提交
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="弹窗样式" :visible.sync="dialogVisible1" class="ui_dialog_02">
      <div style="height:600px;text-align: center;font-size: 20px">这块是弹窗的内容，根据具体替换</div>
      <span slot="footer" class="dialog-footer">
        <el-button>
          <i class="iconfont icon-dayinji-"></i>打印
        </el-button>
        <el-button @click="submit" type="primary">
          <i class="iconfont icon-tijiao"></i>提交
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="弹窗样式" :visible.sync="dialogVisible2" class="ui_dialog_02 spe">
      <div style="height:600px;text-align: center;font-size: 20px">这块是弹窗的内容，根据具体替换</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit" type="primary">
          <i class="iconfont icon-tijiao"></i>提交
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="miniDialog" custom-class="ui_dialog_01 w_01">
      <div style="height:160px;padding:20px;text-align: center;font-size: 20px">这块是弹窗的内容，根据具体替换</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="spe">取消</el-button>
        <el-button type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      miniDialog: false
    }
  },
  methods: {
    submit () {
      console.log('提交')
    }
  }
}
</script>
