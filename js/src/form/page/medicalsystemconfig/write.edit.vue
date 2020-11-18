<template>
  <div>
    <el-dialog
      :visible="visible"
      class="writeEdit"
      width="395px"
      title="编辑系统设置"
      :close-on-click-modal="false"
      @update:visible="close">
        <el-form ref="form" :model="value" size="small" label-width="auto" :rules="rules">
          <div class="partItem" v-if="!org">
            <p class="partTitle">添加机构</p>
            <el-form-item  label="集团名称:">
              {{ value.tenantName }}
            </el-form-item>
            <el-form-item label="机构名称:" prop="orgId" v-if="showOrg">
              <ever-org-select :is-org="false" v-model="value.orgId"></ever-org-select>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">字体设置</p>
            <el-form-item label="字体:" prop="fontfamily">
              <sys-select v-model="value.fontfamily" :options="FONT_TYPE_NAMES" :disabled="disabled" :value-key="'fontFamily'"></sys-select>
            </el-form-item>
            <el-form-item label="字号:" prop="fontsize">
              <sys-select v-model="value.fontsize" :options="FONT_PT_SIZES" :disabled="disabled" :value-key="'pt'"></sys-select>
            </el-form-item>
            <el-form-item label="备注信息:" prop="remarks">
              <el-input v-model="value.remarks" placeholder="请输入备注信息" :disabled="disabled" clearable></el-input>
            </el-form-item>
          </div>
          <div class="partItem">
            <p class="partTitle">复制粘贴</p>
            <el-form-item label="" prop="copyset" label-width="8px">
              <el-checkbox-group v-model="value.copyset" :disabled="disabled" :min="1">
                <el-checkbox v-for="(v, k) in copySetOptions" :key="k" :label="v.id">{{v.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="close">关闭</el-button>
          <el-button type="primary" size="small" @click="validate({name:'病历书写配置'})" :disabled="disabled">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { request } from '@/util/req'
  import urlMap from '@/form/urls'
  import option from './mixins/option.mixin'
  import {FONT_PT_SIZES, FONT_TYPE_NAMES} from './font.config.js'

  export default {
    name: 'WriteEdit',
    props: {
      visible: Boolean,
      form: Object,
      org: Boolean,
      pageName: String
    },
    mixins: [option],
    data () {
      return {
        FONT_PT_SIZES,
        FONT_TYPE_NAMES,
        value: {
          tenantId: '',
          orgId: '',
          fontfamily: '',
          fontsize: '',
          remarks: '',
          copyset: []
        },
        pageType: 'edit',
        config: urlMap.writeConfig,
        copySetOptions: [
          {id: '1', name: '患者本次就诊相同或不同病历类型复制粘贴'},
          {id: '2', name: '患者既往就诊相同或不同病历类型复制粘贴'},
          {id: '3', name: '从其他患者历次就诊相同或不同病历类型复制粘贴'},
          {id: '4', name: '从外部进行数据的复制粘贴'}
        ],
        rules: {
          orgId: [{ required: true, trigger: 'change' }]
        }
      }
    },
    computed: {
      disabled () {
        return !this.value.orgId && this.showOrg
      }
    },
    mounted () {
      if (!this.showOrg) this.rules = {}
    },
    methods: {
      makeSaveData () {
        let data = JSON.parse(JSON.stringify(this.makeCommonData()))
        if (data.list && data.list.length) {
          let hasFontsize = false
          let hasFontfamily = false
          data.list.map(item => {
            switch (item.code) {
              case 'FONTSIZE':
                item.value = data['fontsize']
                hasFontsize = true
                break
              case 'TYPEFACE':
                item.value = data['fontfamily']
                hasFontfamily = true
                break
              case 'COPY_AND_PASTE':
                item.value = JSON.stringify(data['copyset'])
                break
            }
            return item
          })
          if (!hasFontsize) {
            data.list.push({code: 'FONTSIZE', value: data.fontsize})
          }
          if (!hasFontfamily) {
            data.list.push({code: 'TYPEFACE', value: data.fontfamily})
          }
        }
        delete data.fontfamily
        delete data.fontsize
        delete data.copyset
        return data
      }
    }
  }
</script>

<style lang="scss" scoped>
.writeEdit {
  /deep/.el-dialog__header {
    padding: 10px 20px;
    .el-dialog__header .el-dialog__title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  /deep/.el-dialog__body {
    padding: 0 20px 10px;
    .el-form {
      .partItem {
        border-top: 1px solid #DDDFE6;
        padding: 10px 0 13px;
        .partTitle {
          color: #333;
          font-weight: 600;
          margin: 6px 0;
          text-indent: 5px;
          &:before {
            content: '';
            width: 3px;
            background-color: #1c7bef;
            height: 14px;
            float: left;
            border-radius: 3px;
            margin-top: 1px;
          }
        }
      }
      /deep/ .el-checkbox-group {
        margin-top: 1px;
        .el-checkbox {
          line-height: 27px;
        }
        .el-checkbox.is-checked {
          .el-checkbox__label {
            color: #000;
          }
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    border: none;
    padding: 0 15px 15px;
    text-align: right;
    button {
      padding: 9px 15px;
    }
  }
}
</style>
