<template>
  <div id="questiondetail">
    <ever-bread-crumb name="问卷详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <el-row class="title" slot="header">
        <el-col :span="24" align="right">
          <el-button @click="updateQuestion">编辑问卷</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="formline">
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="right">
            <template slot="questions" slot-scope="scope">
              <question-item :data="obj.questions" class="mb20"></question-item>
            </template>
          </ever-form-model>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/questionapi'
  import form from '../../util/form'
  import utillist from '../../util/list'
  import questionItem from '../page/questionitem'
  let schema = [
    {
      name: 'sn',
      type: 'label',
      span: 24,
      label: '问卷ID：'
    },
    {
      name: 'name',
      type: 'label',
      span: 24,
      label: '问卷名称：'
    },
    {
      name: 'dptName',
      type: 'label',
      label: '适用部门：',
      span: 24
    },
    {
      name: 'comment',
      type: 'label',
      label: '问卷说明：',
      span: 24
    },
    {
      name: 'questions',
      type: 'custom',
      label: '问卷详情：',
      span: 24
    },
    {
      name: 'creatorName',
      type: 'label',
      span: 6,
      label: '创建人：'
    },
    {
      name: 'updateTime',
      type: 'label',
      label: '创建时间：',
      span: 8
    },
    {
      name: 'state',
      type: 'label',
      label: '状态：',
      span: 6
    }
  ]
  export default {
    mixins: [form, utillist],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.question = []
      return {
        schema,
        api: api,
        id: this.$route.query.id,
        obj: obj
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      updateQuestion () {
        this.$router.push({name: 'createquestion', path: 'createquestion', query: {id: this.id}})
      },
      getDetail () {
        window.sessionStorage.removeItem('QUESTION_TEMP')
        this.api.request({id: this.id}).then(rs => {
          rs.data.questions.forEach(item => {
            if (!item.answer) {
              item.answer = {comment: '', answer: ''}
            }
          })
          this.obj = Object.assign(this.obj, rs.data)
          this.obj.state = '已保存'
          this.obj.dptName = this.obj.dptName || '全部'
        })
      }
    },
    components: {
      questionItem
    }
  }
</script>

