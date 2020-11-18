<template>
  <div class="autoprintset layout_inner">
    <div class="allSwitch">
      <span>自动打印开启</span>
      <el-switch v-model="allSwitch" @change="changeSwitch('MASTER_SWITCH')"></el-switch>
      <p class="tips">注：开启后，医生<span>提交医嘱</span>时将会自动打印对应的单据</p>
      <div class="list">
        <ever-table :columns="columns" :data="tableDatas" @row-dblclick="rowClick">
          <template slot="appointmentNum" slot-scope="scope">
            <span>{{tableName[scope.row.code]}}</span>
          </template>
          <template slot="serviceType" slot-scope="scope">
            <el-switch
            :disabled="!allSwitch"
            :value="!!(scope.row.isValid)"
            @input="(val) => scope.row.isValid = val"
            @change="changeSwitch(scope.row.code, scope.row.isValid)"
            ></el-switch>
          </template>
        </ever-table>
      </div>
      <span>打印预览</span>
      <el-switch :disabled="!allSwitch" v-model="preview" @change="changeSwitch('PRINT_PREVIEW')"></el-switch>
      <p class="tips">注：开启后，医生<span>打印</span>时将会自动弹出打印预览界面</p>
    </div>
  </div>
</template>
<script>
import api from '@/sob/store/autoprintsetapi'
export default {
  data () {
    return {
      api,
      allSwitch: false,
      preview: false,
      disabled: false,
      columns: [
        {
          slot: 'appointmentNum',
          prop: 'appointmentNum',
          label: '单据名称',
          align: 'center'
        },
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: '自动打印',
          align: 'center'
        }
      ],
      tableDatas: [],
      tableName: {
        YAO_PIN_CHU_FANG: '药品处方',
        CHU_ZHI_DAN: '处置单',
        JIAN_CHA_SHEN_QING_DAN: '检查申请单',
        JIAN_YAN_SHEN_QING_DAN: '检验申请单',
        ZHI_LIAO_DAN: '治疗单',
        SHOU_SHU_SHEN_QING_DAN: '手术申请单',
        FEI_YONG_QING_DAN: '费用清单'
      }
    }
  },
  created () {
    this.getIsValidByOrgId()
  },
  methods: {
    async getIsValidByOrgId () {
      let params = [
        {
          code: 'MASTER_SWITCH'
        },
        {
          code: 'YAO_PIN_CHU_FANG'
        },
        {
          code: 'CHU_ZHI_DAN'
        },
        {
          code: 'JIAN_CHA_SHEN_QING_DAN'
        },
        {
          code: 'JIAN_YAN_SHEN_QING_DAN'
        },
        {
          code: 'ZHI_LIAO_DAN'
        },
        {
          code: 'SHOU_SHU_SHEN_QING_DAN'
        },
        {
          code: 'FEI_YONG_QING_DAN'
        },
        {
          code: 'PRINT_PREVIEW'
        }
      ]
      let res = await api.getIsValidByOrgId(params)
      if (res && res.head && res.head.errCode === 0) {
        this.allSwitch = !!res.data[0].isValid
        this.preview = !!res.data[8].isValid
        this.tableDatas = res.data.splice(1, 7)
      }
    },
    async changeSwitch (code, val) {
      let isValid = ''
      if (code === 'MASTER_SWITCH') {
        isValid = this.allSwitch ? 1 : 0
      } else if (code === 'PRINT_PREVIEW') {
        isValid = this.preview ? 1 : 0
      } else {
        isValid = val ? 1 : 0
      }
      let res = await api.updateIsValidByOrgId({ code: code, isValid: isValid })
      if (res && res.head && res.head.errCode === 0) {
        this.getIsValidByOrgId()
        this.$messageTips(this, 'success', '修改保存成功', '提示')
      }
    },
    changeIsValid () {
    },
    rowClick () {
    }
  }
}
</script>
<style scoped lang="scss">
.autoprintset {
  .allSwitch {
    p {
      span {
        color: red;
      }
    }
    .list {
      width: 500px;
    }
    font-size: 14px;
    /deep/ .el-switch {
      margin-left: 10px;
    }
    .tips {
      text-indent: 94px;
      color: #999;
      font-size: 13px;
    }
  }
}
</style>

