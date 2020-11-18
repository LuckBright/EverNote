<template>
  <div class="word">
    <el-row v-if="showRadio">
      <el-col>
        <span class="pdr10">词条模板:</span>
        <el-radio-group v-model="categoryType">
          <el-radio :label="'CT_YE_MEI_CI_TIAO'">页眉词条</el-radio>
          <el-radio :label="'CT_YE_JIAO_CI_TIAO'">页脚词条</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <span class="pdr10">引用词条</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :label-width="formLabelWidth">
          <el-form-item label="">
            <el-tabs v-model="activeName" class="nav_tabs">
              <el-tab-pane label="个人" name="2"></el-tab-pane>
              <el-tab-pane v-if='space !== "tech"' label="科室" name="3"></el-tab-pane>
              <el-tab-pane v-if='space !== "tech"' label="机构" name="1"></el-tab-pane>
              <el-tab-pane label="集团" name="0"></el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="templateName" placeholder="请输入模版名称" suffix-icon="el-icon-search" @change="getTreeData">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-tree node-key="id" style="height: 200px;" :data="data" :default-expand-all="true" :props="defaultProps" class="flex_layout_scroll" @node-click="handleNodeClick">
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="content">
          <div class="title">
            预览
          </div>
          <evereditor ref="editor" :html="dataInfo" :editable="false" mode="editor" :options="editorOpts"></evereditor>
        </div>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="save">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import sysUrlMap from '@/emr/urls'
import urlMap from '@/inpatient/urls'
import urlsfortech from '@/infusion/urlsfortech.js'
import { request } from '@/util/req'
import storage from '@/util/storage'

import { editorBaseOpts } from '@/util/common'
import evereditor from 'evereditor'

export default {
  name: 'WordDialog',
  props: {
    visible: {
      type: Boolean
    },
    dptId: {
      type: String,
      default: ''
    },
    // 显示选择 页眉词条/页脚词条
    showRadio: {
      type: Boolean,
      default: false
    },
    space: {
      type: String,
      default: ''
    }
  },
  created () {
    if (this.space === 'tech') {
      this.urlMap = urlsfortech
      this.sysUrlMap = urlsfortech
      this.getCategoryId()
    }
  },
  components: {
    evereditor
  },
  data () {
    return {
      urlMap,
      sysUrlMap,
      editorOpts: {
        ...editorBaseOpts
      },
      // 模版名称
      templateName: '',
      // 模板类型
      activeName: '2',
      formLabelWidth: '5px',
      // 内容词条ID
      categoryId: '',
      // 树数据
      data: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      // 选中节点
      checkedData: {},
      // 预览内容
      dataInfo: '',
      defaultDataInfo: '',
      categoryType: 'CT_NEI_RONG_CI_TIAO'
    }
  },
  watch: {
    visible: {
      handler (val) {
        if (val) {
          this.getTreeData()
        }
      }
    },
    showRadio: {
      handler (val) {
        if (val) {
          this.categoryType = 'CT_YE_MEI_CI_TIAO'
        } else {
          this.categoryType = 'CT_NEI_RONG_CI_TIAO'
        }
      },
      immediate: true
    },
    categoryType: {
      handler () {
        if (this.space !== 'tech') this.getCategoryId()
      },
      immediate: true
    },
    activeName: {
      handler () {
        this.getTreeData()
      }
    },
    checkedData: {
      handler (val) {
        if (val && val.formTemplateId) {
          // 获取内容词条ID
          request(this.urlMap.medicalRecord.getDocTpl, { id: val.formTemplateId }).then(res => {
            this.defaultDataInfo = res.data.schema.element
            let text = res.data.schema.element
            let prefix = '<p></p>'
            if (this.categoryType === 'CT_YE_MEI_CI_TIAO') {
              text = text + prefix
            } else if (this.categoryType === 'CT_YE_JIAO_CI_TIAO') {
              text = prefix + text
            }
            this.dataInfo = text
          })
        } else {
          this.dataInfo = ''
          this.defaultDataInfo = ''
        }
      },
      deep: true
    }
  },
  methods: {
    getCategoryId () {
      // 获取内容词条ID
      request(this.sysUrlMap.templateManage.getCategoryId, { code: this.categoryType }).then(res => {
        this.categoryId = res.data.id
        this.getTreeData()
      })
    },
    getTreeData () {
      this.checkedData = {}
      let params = {
        // 模板类型
        businessType: this.activeName,
        // 内容词条ID
        categoryId: this.categoryId,
        // 模板名称
        name: this.templateName,
        // 文档类型
        designerId: '2'
      }
      if (this.activeName === '3') {
        params.businessId = this.dptId
      } else if (this.activeName === '2') {
        params.businessId = storage.getLocalStorage('USERID')
      } else if (this.activeName === '1') {
        params.businessId = storage.getLocalStorage('CLINICID')
      } else if (this.activeName === '0') {
        params.businessId = storage.getLocalStorage('TENANTID')
      }

      // 获取模板列表
      let url = this.space === 'tech' ? this.urlMap.medicalRecord.skill_tplList : this.urlMap.medicalRecord.tplList
      request(url, params).then(res => {
        this.data = res.data
      })
    },
    handleNodeClick (data) {
      this.checkedData = data
    },
    save () {
      if (!this.dataInfo) {
        this.$messageTips(this, 'warning', '请选择一个模版', '提示')
        return
      }
      this.close()
      this.$emit('save', this.defaultDataInfo)
    },
    close () {
      this.$emit('update:visible', false)
      this.checkedData = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.word {
  border: 1px solid #efefef;
  .nav_tabs {
    /deep/ .el-tabs__nav-wrap {
      background-color: #fff;
    }
  }
}
.pdr10 {
  padding-left: 12px;
  display: block;
  margin: 9px 0 10px;
  font-weight: 600;
}
.dialog_word {
  .nav_tabs {
    /deep/.el-tabs__header .el-tabs__item {
      border-left: none;
      height: 25px;
      line-height: 25px;
      &.is-active {
        padding-right: 10px;
      }
    }
    /deep/ .el-tabs__nav-wrap {
      background-color: #fff;
    }
  }
}

.content {
  margin: 10px;
  padding-left: 10px;
  height: 400px;
  border-left: 1px solid #ddd;
  .title {
    height: 35px;
    line-height: 35px;
    color: #000;
    font-weight: 700;
  }
  /deep/ .ever__editor.medical .editor_content_wrap .editor__content {
    height: 300px;
  }
}
</style>
