<template>
  <div>
    <el-dialog
      :visible="visible"
      width="500px"
      class="addDialog"
      :close-on-click-modal="false"
      @update:visible="close">
      <div
        slot="title"
        class="title">
        添加事件时效配置
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="value"
          size="small"
          label-width="auto"
          :rules="rules">
          <el-form-item
            v-if="!org"
            label="集团名称:">
            {{ tenantData.name }}
          </el-form-item>
          <el-form-item
            v-if="!org"
            label="机构名称:"
            prop="orgId">
            <ever-org-select
              :is-org="false"
              v-model="value.orgId"></ever-org-select>
          </el-form-item>

          <el-form-item
            label="事件时效描述内容:"
            prop="desc">
            <el-input
              v-model="value.desc"
              placeholder="请输入事件时效描述内容"></el-input>
          </el-form-item>
          <el-form-item
            label="选择发生事件:"
            prop="eventType">
            <ever-select
              v-model="value.eventType"
              :options="eventOptions"
              placeholder="请选择发生事件"></ever-select>
          </el-form-item>
          <el-form-item
            label="事件时效值(小时):"
            prop="expValue">
            <ever-number
              v-model="value.expValue"
              placeholder="请输入事件时效值(小时)"
              number-type="integer"></ever-number>
          </el-form-item>
          <el-form-item
            label="应写文档类别:"
            prop="categoryId">
            <ever-select
              v-model="value.categoryId"
              :options="writeOptions"
              placeholder="请选择应写文档类别"></ever-select>
          </el-form-item>
          <el-form-item
            label="备注信息:"
            prop="comment">
            <el-input
              v-model="value.comment"
              placeholder="请输入备注信息"></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button @click="close">
              关闭
            </el-button>
            <el-button
              type="primary"
              @click="validate({name:'时限质控配置'})">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { request } from '@/util/req'
  import urlMap from '@/form/urls'
  import option from './mixins/option.mixin'
  import { formCheckNonnegativeInt } from '@/util/validate'

  export default {
    name: 'TimeAdd',
    props: {
      visible: Boolean,
      org: Boolean,
      pageName: String
    },
    mixins: [option],
    data () {
      return {
        pageType: 'add',
        value: {
          // 角色 2医生 3护士
          role: 2,
          // 质控类型 1事件 2频率
          type: 1,
          // 事件时效描述内容
          desc: '',
          // 选择发生事件
          eventType: 1,
          // 配置范围 1.集团 2.机构
          scope: 1,
          // 事件时效值
          expValue: '',
          // 表达式类型单位 1小时
          expType: 1,
          // 应写文档类别
          categoryCode: '',
          tenantId: '',
          orgId: '',
          // 备注
          comment: ''
        },

        orgScope: 2,
        config: urlMap.timeConfig,
        rules: {
          eventType: [{ required: true, message: '请输入选择发生事件', trigger: 'blur' }],
          expValue: [
            { required: true, validator: formCheckNonnegativeInt, minValue: 0, trigger: 'change' }
          ],
          categoryId: [{ required: true, message: '请选择应写文档类别', trigger: 'blur' }]
        },
        // 发生事件
        eventOptions: [
          { id: 1, name: '入院' },
          { id: 2, name: '出院' },
          { id: 3, name: '转出' },
          { id: 4, name: '转入' }
        ],
        // 应写文档类别
        writeOptions: []
      }
    },
    watch: {
      visible: {
        handler (val) {
          // 第一次打开新增 查询应写文档类别(住院类型)
          if (val && this.writeOptions.length === 0) {
            request(urlMap.timeConfig.getWriteType, {type: 1}).then(res => {
              if (res.head.errCode === 0 && Array.isArray(res.data)) {
                this.writeOptions = this.makeTypeTree(res.data)
              } else {
                this.writeOptions = []
              }
            })
          }
        }
      }
    },
    methods: {
      resetData () {
        this.value = {
          role: 2,
          type: 1,
          desc: '',
          eventType: 1,
          scope: 1,
          expValue: '',
          expType: 1,
          categoryCode: '',
          tenantId: '',
          orgId: '',
          comment: ''
        }
      },
      makeSaveData () {
        let data = this.makeCommonData()
        if (this.value.eventType) {
          let cur = this.eventOptions.filter(item => item.id === this.value.eventType)
          data.eventName = cur[0].name
        }
        if (this.value.categoryId) {
          let cur = this.writeOptions.filter(item => item.id === this.value.categoryId)
          data.categoryName = cur[0].name
          data.categoryId = cur[0].id
          data.categoryCode = cur[0].code
        }
        if (data.orgId) {
          data.scope = 2
        }
        return data
      },
      makeTypeTree (data) {
        let result = []
        let prefix = '住院'
        let line = ' / '
        let name = ''

        function setTree (list, prefix) {
          list.forEach(item => {
            name = prefix + line + item.name
            result.push({id: item.id, name: name, code: item.code})
            if (item.children && item.children.length > 0) {
              setTree(item.children, name)
            } else {
              name = ''
            }
          })
        }

        setTree(data, prefix)
        return result
      },
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-weight: 700;
  }
  .addDialog {
    /deep/ .el-dialog {
      .el-dialog__body {
        padding: 10px 20px;
        /deep/ .el-form {
          .btns {
            text-align: right;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
