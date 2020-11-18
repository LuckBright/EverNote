<template>
  <el-dialog
    ref="everdialog"
    :visible.sync="dialogVisible"
    :title="dialogTitle || '新建'"
    class="ui_dialog_02 spe"
    :close-on-click-modal="false"
  >
    <div style="height:200px;text-align: center;font-size: 20px">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="22"
        :rules="rules"
        :nosubmit="true"
        @submit="submitForm()"
        class="alg_l"
      >
        <template slot="doctorInfo">
          <el-row>
            <el-col :span="6">
              <div class="avatar_img">
                <ever-image
                    :src="obj.img"
                >
                </ever-image>
              </div>
            </el-col>
            <el-col :span="17">
              <el-row class="mt10 ml10">
                <el-col>
                  <strong class="f18 colorBlack">{{obj.name}}</strong>
                </el-col>
                <el-col v-if="obj.subTitle && obj.type == HOME_MANAGE_TYPE[4].id">
                  <span class="f16 colorOrange mr10">{{JSON.parse(obj.subTitle).skillsTitle2Name}}</span>
                  <span
                    class="f16"
                  >{{JSON.parse(obj.subTitle).tsStaffSubjectList && JSON.parse(obj.subTitle).tsStaffSubjectList.length && JSON.parse(obj.subTitle).tsStaffSubjectList[0].orgSubjectName}}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <template slot="sort">
          <el-row>
            <el-col :span="8">
              <sys-num
                v-model="obj.sort"
                :placeholder="sortPlaceholder"
                :max="sortLength"
              ></sys-num>
                <!-- :containZero="true"
                :valueLength="sortLength"
                :valueNumber="sortNum" -->
            </el-col>
            <el-col :span="16">
              <span class="ml10 light-gray">{{sortPlaceholder}}</span>
            </el-col>
          </el-row>
        </template>
        <template slot="context">
          <el-row>
            <el-col :span="8">
              <ever-select v-model="dialogActionId" :options="LINK_SELECT"></ever-select>
            </el-col>
            <el-col :span="16">
              <el-input
                style="width: calc(100% - 10px)"
                class="ml10"
                v-model="obj.context"
                placeholder="链接地址"
                clearable
              ></el-input>
            </el-col>
          </el-row>
        </template>
        <template slot="img">
          <ever-upload-file
            v-model="obj.img"
            :limit="1"
            :tipsFlag="true"
            accept="图片"
            tips="支持不超过200k的png、jpg、jpeg格式图片"
            btnTxt="上传图片"
          ></ever-upload-file>
        </template>
        <template slot="status">
          <el-row class="form_checkbox">
            <el-checkbox v-model="statusInfo">保存后立即上线</el-checkbox>
          </el-row>
        </template>
      </ever-form2>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm()" :disabled="lodingBtn">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { HOME_MANAGE_TYPE, LINK_SELECT, HOME_STATUS_SELECT } from '@/titancare/utils/common'
import { HOSPITAL_SCHEMA, PASS_SITE_SCHEMA, SQUARE_SITE_SCHEMA, DOCTOR_INFO_SCHEMA } from '@/titancare/views/homemanage/schema/homeinfoschema'
export default {
  props: ['type', 'api'],
  data () {
    return {
      LINK_SELECT,
      schema: [],
      obj: {},
      rules: {
        sort: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        context: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        subTitle: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        img: [
          { required: true, message: '请添加图片', trigger: ['blur', 'change'] }
        ]
      },
      dialogVisible: false,
      statusInfo: false,
      dialogActionId: LINK_SELECT[0].id,
      dialogTitle: '',
      HOME_MANAGE_TYPE,
      sortLength: 99,
      sortPlaceholder: '0-99数字越大，展示位置靠前',
      sortNum: null,
      lodingBtn: false
    }
  },
  created () { },
  methods: {
    open (data) {
      this.lodingBtn = false
      this.schema = this.createObject({ type: this.type }).schema
      this.obj = this.createObject({ type: this.type }).obj
      this.obj.type = this.type
      this.obj.status = 0
      this.cacheObj = JSON.parse(JSON.stringify(this.obj))
      if (this.type === HOME_MANAGE_TYPE[4].id || this.type === HOME_MANAGE_TYPE[5].id) {
        this.sortLength = 10000
        this.sortPlaceholder = '0-10000数字越大，展示位置靠前'
      } else {
        this.sortLength = 99
        this.sortPlaceholder = '0-99数字越大，展示位置靠前'
      }
      this.statusInfo = false
      if (data && data.id) {
        this.dialogTitle = `${data.name}`
        Object.assign(this.obj, data)
        this.dialogActionId = this.obj.actionId + ''
      }
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    submitForm () {
      this.$refs.form.$refs.form.validate(async (valid) => {
        if (valid) {
          let params = {}
          Object.assign(params, this.obj)
          if (this.statusInfo) params.status = HOME_STATUS_SELECT[2].id
          params.actionId = this.dialogActionId
          if (this.type === HOME_MANAGE_TYPE[3].id) params.name = '通栏'
          this.lodingBtn = true
          if (this.lodingBtn) {
            this.api.createOrUpdate(params).then(res => {
              setTimeout(() => {
                this.lodingBtn = false
              }, 1000)
              if (res && res.errCode === 0) {
                this.$emit('seachList', true)
                this.close()
              }
            })
          }
        }
      })
    },
    switchQuerySchema (type) {
      let objSchema = []
      switch (type) {
        case HOME_MANAGE_TYPE[1].id:
          objSchema = HOSPITAL_SCHEMA
          break
        case HOME_MANAGE_TYPE[2].id:
          objSchema = SQUARE_SITE_SCHEMA
          break
        case HOME_MANAGE_TYPE[3].id:
          objSchema = PASS_SITE_SCHEMA
          break
        case HOME_MANAGE_TYPE[4].id:
          objSchema = DOCTOR_INFO_SCHEMA
          break
        case HOME_MANAGE_TYPE[5].id:
          objSchema = DOCTOR_INFO_SCHEMA
          break
      }
      return objSchema
    },
    createObject ({ type }) {
      let schema = this.switchQuerySchema(type) || []
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    }
  }
}
</script>

<style scoped lang="less">
.avatar_img {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
}
.ui_dialog_02 /deep/.form_checkbox {
  margin-top: -10px !important;
}
</style>
