<template>
  <div id="createquestion">
    <ever-bread-crumb :name="!id ? '创建问卷' : '编辑问卷'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
  <el-card>
    <ever-form-model
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="questionform"
      label-position="right">
      <template slot="questions" slot-scope="scope">
        <el-card class="question-item">
          <div v-for="(item,i) in scope.obj.questions" :key="i" class="mb20">
            <el-form ref="optionsform" :model="item" :rules="rules">
              <el-row :gutter="10" class="mb20">
                <el-col :span="2" align="right">问题 {{i+1}}：</el-col>
                <el-col :span="17">
                  <el-form-item prop="subject">
                    <el-input v-model="item.subject" :maxlength="200"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="type">
                    <el-select v-model="item.type" placeholder="请选择 " clearable>
                      <el-option
                        v-for="(opt,i) in questionType"
                        :key="i"
                        :label="opt.label"
                        :value="opt.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" align="right">
                  <i class="iconfont icon-shanchu" style="cursor: pointer" v-if="i > 0" @click="delQuestionItem(i)"></i>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-if="item.type!=3">
                <el-col :span="2" align="right">
                  <label v-if="item.type==1">单选：</label>
                  <label v-if="item.type==2">多选：</label>
                </el-col>
                <el-col :span="20">
                  <el-radio-group v-if="item.type == 1">
                        <span v-for="(obj,j) in item.options.data" :key="j">
                          <el-form ref="itemform" :model="obj" :rules="rules">
                            <el-form-item prop="value">
                              <el-radio class="radio" :label="j" disabled>
                                <el-input v-model="obj.value" :maxlength="100"></el-input>
                              </el-radio>
                              <i class="iconfont icon-shanchu" style="cursor: pointer" @click="delQuestionSubItem(i, j)" v-if="j > 1"></i><i v-if="j <= 1" class="iconfont" style="display:inline-block;width:12px;">&nbsp;</i>
                            </el-form-item>
                          </el-form>
                        </span>
                  </el-radio-group>
                  <el-checkbox-group v-if="item.type == 2">
                      <span v-for="(obj,j) in item.options.data" :key="j">
                        <el-form ref="itemform" :model="obj" :rules="rules">
                          <el-form-item prop="value">
                            <el-checkbox class="checkbox" :label="j" disabled>
                              <el-input v-model="obj.value" :maxlength="200"></el-input>
                            </el-checkbox>
                            <i class="iconfont icon-shanchu" style="cursor: pointer" @click="delQuestionSubItem(i, j)" v-if="j > 1"></i><i v-if="j <= 1" style="display:inline-block;width:12px;"></i>
                          </el-form-item>
                        </el-form>
                      </span>
                  </el-checkbox-group>
                </el-col>
                <el-col :span="2" align="right">
                  <el-button type="text" @click="addQuestionSubItem(i)" v-if="item.type != 3">添加一项</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-row :gutter="10">
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="22">
              <el-button type="text" @click="addQuestionItem">添加一个问题</el-button>
            </el-col>
          </el-row>
        </el-card>
      </template>
      <el-form-item>
        <el-button type="primary" class="submit-btn" @click="saveQuestion">提交</el-button>
        <el-button type="" @click="linkDetailTemp">预览</el-button>
        <el-button type="" class="cancel-btn" @click="prevBack">取消</el-button>
      </el-form-item>
    </ever-form-model>
  </el-card>
  </div>
</template>
<script>
  import api from '../store/questionapi'
  import depart from '../../warehouse/store/departmentapi'
  import form from '../../util/form'

  let schema = [
    {
      name: 'name',
      type: 'text',
      span: 24,
      label: '问卷名称：',
      max: 100,
      placeholder: '请输入问卷名称'
    },
    {
      name: 'dptObject',
      type: 'select',
      options: [{id: -1, name: '全部部门'}],
      needObjFlag: true,
      placeholder: '请选择部门',
      label: '适用部门：',
      span: 6
    },
    {
      name: 'comment',
      type: 'textarea',
      label: '问卷说明：',
      max: 200,
      placeholder: '请输入问卷说明',
      span: 24
    },
    {
      name: 'questions',
      type: 'custom',
      label: '问卷详情：',
      span: 24
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.questions = []
      return {
        schema,
        id: this.$route.query.id,
        api: api,
        depart: depart,
        obj: obj,
        questionType: [{value: 1, label: '单选'}, {value: 2, label: '多选'}, {value: 3, label: '填空'}],
        rules: {
          name: [
            {required: true, message: '请输入问卷名称', trigger: 'blur'}
          ],
          dptObject: [
            {required: true, message: '请选择适用科室', trigger: 'change', type: 'object'}
          ],
          subject: [
            {required: true, message: '请输入问题', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请填入选项', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择类型', trigger: 'change', type: 'number'}
          ],
          questions: [
            {required: true, message: '请填写问卷详情', trigger: 'change', type: 'array'}
          ]
        }
      }
    },
    watch: {
      'obj.dptObject' (val) {
        this.obj.dptId = val.id
        this.obj.dptName = val.name
      }
    },
    created () {
      this.getDptList(schema, 'dptObject')
      this.addQuestionItem()
      this.initQuestion()
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      linkDetailPage () {
        this.$router.push({name: 'questiondetail', path: 'questiondetail'})
      },
      linkDetailTemp () {
        window.sessionStorage.setItem('QUESTION_TEMP', JSON.stringify(this.obj))
        this.$router.push({name: 'questiontemp', path: 'questiontemp'})
      },
      initQuestion () {
        let tempData = JSON.parse(window.sessionStorage.getItem('QUESTION_TEMP'))
        if (tempData) {
          this.obj = Object.assign(this.obj, tempData)
          this.obj.state = '待编辑'
        } else if (this.id) {
          this.api.request({id: this.id}).then(rs => {
            rs.data.questions.forEach(item => {
              if (!item.answer) {
                item.answer = {answer: item.type === 2 ? [] : '', comment: ''}
              } else {
                item.answer.answer = typeof item.answer.answer === 'object' ? JSON.parse(item.answer.answer) : item.answer.answer
              }
              item.options = JSON.parse(item.options)
            })
            this.obj = Object.assign(this.obj, rs.data)
            this.obj.state = '待编辑'
            this.obj.dptObject = {
              id: this.obj.dptId,
              name: this.obj.dptName
            }
          })
        }
      },
      setQuestionSubItem (obj) {
        for (let i = 0; i < 5; i++) {
          obj.options.data.push({ value: '' })
        }
        return obj
      },
      addQuestionItem () {
        if (this.obj.questions.length >= 20) {
          this.$messageTips(this, 'warning', '最多只能添加20个问题')
          return false
        }
        let obj = {
          subject: '',
          type: 1,
          answer: {comment: '', answer: ''},
          options: {data: []}
        }
        this.setQuestionSubItem(obj)
        this.obj.questions.push(obj)
      },
      delQuestionItem (i) {
        this.obj.questions.splice(i, 1)
      },
      addQuestionSubItem (i) {
        if (this.obj.questions[i].options.data.length >= 20) {
          this.$messageTips(this, 'warning', '最多只能添加20个选项')
          return false
        }
        this.obj.questions[i].options.data.push({ value: '' })
      },
      delQuestionSubItem (i, j) {
        if (this.obj.questions[i].options.data.length <= 2) {
          this.$messageTips(this, 'warning', '至少要保留2个选项')
          return false
        }
        this.obj.questions[i].options.data.splice(j, 1)
      },
      saveQuestion () {
        let optvalid = false
        let itemvalid = false
        let submitData = JSON.parse(JSON.stringify(this.obj))
        var This = this
        submitData.questions.forEach(item => {
          if (typeof item.answer.answer === 'object') {
            item.answer.answer = JSON.stringify(item.answer.answer)
          }
          item.options.data = item.options.data.filter(opt => {
            return opt.value !== ''
          })
          const arr = []
          item.options.data.forEach(opt => {
            arr.push(opt.value)
          })
          if (This.isRepeat(arr)) {
            this.$messageTips(this, 'warning', '选项中有相同内容，请检查并修改。')
            return false
          }
          item.options = JSON.stringify(item.options)
        })
        this.$refs.questionform.$refs.form.validate(valid => {
          this.$refs.optionsform.forEach(opt => {
            opt.validate(valids => {
              optvalid = valids
              return valids
            })
          })
          if (this.$refs.itemform.length > 0) {
            this.$refs.itemform.forEach(opt => {
              opt.validate(valids => {
                itemvalid = valids
                return valids
              })
            })
          } else {
            itemvalid = true
          }
          valid && optvalid && itemvalid && this.api.create(submitData).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功', '成功')
              window.sessionStorage.removeItem('QUESTION_TEMP')
              this.$router.push({name: 'question', path: '/crm/question'})
            }
          })
        })
      },
      getDptList (schema, name) {
        let dpt = this.$ever.getFieldFromSchema(schema, name)
        this.depart.list().then(rs => {
          dpt.options = rs
          window.sessionStorage.setItem('THC_CC_DPT', JSON.stringify(rs))
        })
      },
      isRepeat (arr) {
        let isRepeat = false
        let hash = {}
        for (let i in arr) {
          if (hash[arr[i]]) {
            isRepeat = arr[i]
            return isRepeat
          }
          hash[arr[i]] = true
        }
        return isRepeat
      }
    }
  }
</script>
<style scoped>
  .question-item{box-shadow:none ;}
  #createquestion .el-input-group__append{background: #1C7BEF;color: #ffffff;}
  #createquestion .el-radio,
  #createquestion .el-checkbox{margin-left: 0;margin-bottom: 15px;margin-right: 4px;}
  #createquestion .el-radio-group .el-input,
  #createquestion .el-checkbox-group .el-input{width: 100px;margin-right: 4px}
  #createquestion .el-radio-group > span,
  #createquestion .el-checkbox-group > span{margin-right: 15px;display: inline-block;vertical-align: top;}
  #createquestion .el-radio-group  .iconfont,
  #createquestion .el-checkbox-group .iconfont{font-size: 12px;}
</style>
