<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="450px">
    <template slot="title">
      <span>
        <i class="icon iconfont icon-menzhen-jingshi cRed wid30"></i>
      </span>
      <span class="ml10 f16 f_bold">此用户是受限制用户</span>
    </template>
    <div class="greyDenWar oxhya">
      <div v-for="(item, index) in greyDenies" :key="index" class="mb10">
        <el-row class="mb15">
          <el-col>
            <span class="cGray6 mr10">限制业务</span>
            <span>{{item.service.split(',').map(el =>serviceType[el]).join()}}</span>
          </el-col>
        </el-row>
        <el-row class="mb15">
          <el-col>
            <span class="cGray6 mr10">限制范围</span>
            <span v-show="item.scopeType === 1">集团</span>
            <span
              v-show="item.scopeType === 2"
            >医生 | {{item.scopeDoctorNames && item.scopeDoctorNames.map(zitem => zitem.name).join()}}</span>
          </el-col>
        </el-row>
        <el-row class="mb15">
          <el-col>
            <span class="cGray6 mr10 ml15">限制期</span>
            <span v-show="item.timeWay === 1">永久</span>
            <span v-show="item.timeWay === 2">
              <span>{{item.timeNum}}{{timeTypeArr[item.timeType]}}</span>
              <span class="cGray6 mr15">失效日:</span>
              <span>{{$moment(item.invalidTime).format('YYYY-MM-DD')}}</span>
            </span>
          </el-col>
        </el-row>
        <el-row class="mb15">
          <el-col>
            <span class="cGray6 mr10 fl">限制原因</span>
            <div class="el-textarea is-disabled cGray6" style="width: 300px;">
              <span>{{item.reason || '- -'}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" style="text-align:right;">
      <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    greyDenies: {
      type: Array,
      default: function () {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      serviceType: {
        '1': '预约',
        '2': '挂号'
      },
      timeTypeArr: {
        1: '年',
        2: '月',
        5: '天'
      },
    }
  },
  watch: {
    'visible' (val) {
      this.dialogVisible = val
    },
    'dialogVisible' (val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>
<style scoped>
.greyDenWar{max-height: 200px; padding: 0 10px;}
.greyDenWar .mb10{border-bottom: 1px solid #ddd}
.greyDenWar .mb10:last-child{border-bottom: 0}
</style>
