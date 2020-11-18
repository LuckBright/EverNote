<template>
  <el-row type="flex"
          class="add">
    <el-col :span="5">
      <el-tree :default-expanded-keys="expandKey"
               node-key="id"
               :data="treeData"
               :props="defaultProps"
               @node-click="handleNodeClick"
               :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </el-col>
    <el-col :span="19"
            v-if="nodeObj.id"
            class="con_wrap">
      <p style="padding-left:30px;">预览窗口，点击“确定”进入编辑</p>
      <div class="form con_box"
           v-if="nodeObj.designerId==='1'">
        <phrform :schema-id.sync="nodeObj.formTemplateId"
                 :visitId="$route.query.hospitalizedNumber || $route.query.visitId || $route.query.visitSn"
                 :patientId="$route.query.patientId"
                 dataId="-1"
                 :data-model-id="nodeObj.formDataId"
                 :dptId="$route.query.dptId"
                 v-model="formObj"
                 ref="form2"
                 :code="code"
                 :key="nodeObj.id + nodeObj.formTemplateId + nodeObj.formDataId"
                 :nosubmit="true"
                 :allDisabled="true"></phrform>
        <div class="mask"></div>
      </div>
      <div class="doc con_box"
           v-if="nodeObj.designerId==='2'">
        <phrdoc
                :data-id="nodeObj.formDataId"
                :dptId="$route.query.dptId"
                :schema-id="nodeObj.formTemplateId"
                :visit-id="$route.query.hospitalizedNumber || $route.query.visitId || $route.query.visitSn"
                :patient-id="$route.query.patientId"
                :key="nodeObj.id + nodeObj.formTemplateId + nodeObj.formDataId"
                :editable="false"></phrdoc>
        <!-- <div class="mask"></div> -->
      </div>
      
    </el-col>
    <el-col :span="19"
            v-else>
      <everNoData tipTxt="请选择一个模版"></everNoData>
    </el-col>
  </el-row>
</template>
<script>
import tplmanageapi from '@/form/store/tplmanageapi'
import phrdoc from '@/form/components/phrdoc'
export default {
  props: ['visible'],
  data () {
    return {
      code: '',
      docTpl: {
        html: '',
        editable: false
      },
      dataId: -1,
      formObj: {},
      nodeObj: {},
      treeData: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      expandKey: []
    }
  },
  created () {
    this.code = this.nodeObj.formDataId ? '' : this.nodeObj.code
  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    handleNodeClick (node) {
      // nodeType 2 5，6可以加载右侧文档 或者表单
      var typeOk =
        node.nodeType === 2 || node.nodeType === 5 || node.nodeType === 6
      if (typeOk) {
        this.$emit('input', node)
        this.nodeObj = node
        if (!node.formDataId) {
          this.nodeObj.formDataId = '-1'
        }
      }
    },
    getTreeData () {
      tplmanageapi
        .loadMedicalList({
          type: 2, // 1-住院 2-门诊 3-急诊 4-体检 5-随访 6-手术麻醉
          dptId: this.$route.query.dptId,
          role: '1'// 1医生 2护士
        })
        .then(res => {
          res.map(item => {
            this.expandKey.push(item.id)
          })
          this.treeData = res
        })
    }
  },
  components: {
    phrdoc
  },
  watch: {
    'nodeObj.id': function () {
      this.docTpl = {
        html: '',
        editable: false
      }
    },
    visible (val) {
      if (val) this.getTreeData()
    }
  }
}
</script>
<style lang="scss" scoped>
.add {
  height: 500px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  .el-tree {
    /deep/ .el-tree-node__content {
      height: 32px;
      line-height: 32px;
    }
    /deep/.el-tree-node__expand-icon.is-leaf{
      padding: 0;
    }
  }
  .con_wrap {
    /deep/ .ever__editor.medical {
      .menubar {
        display: none;
      }
      .editor_content_wrap {
        max-height: fit-content;
      }
    }
    .con_box {
      position: relative;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #000;
      z-index: 10;
      opacity: 0.02;
    }
  }
  .el-col {
    overflow: auto;
    .form {
      padding: 10px;
    }
  }
  .el-col-5 {
    border-right: 1px solid #ccc;
  }
}
</style>

