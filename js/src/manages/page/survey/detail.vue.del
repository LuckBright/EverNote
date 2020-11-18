<template>
  <div>
    <ever-bread-crumb name="返回" path="/manages/survey" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner flex_column_full_hidden">
      <!--    问卷属性表单-->
      <div class="main-head">
        <ever-form2
          v-model="formModel"
          :inline="true"
          ref="form"
          :schema="schema"
          :rules="rules"
        >
          <template slot="default">
            <el-form-item class="fr">
              <el-button type="primary" @click="publish" v-if="surveyId !== '-1'" :disabled="publishBtn.disabled">{{publishBtn.text}}</el-button>
              <el-button type="primary" @click="save">{{buttonText}}</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div class="flex1">
        <iframe
          class="survey-iframe"
          ref="surveyIframe"
          v-if="surveyId !== '-1'"
          :src="editUrl"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
  import storage from '@/util/storage'
  import { request } from '@/util/req'
  import urlMap from '@/manages/page/survey/urls'
  import { debounce1 as debounce } from '@/util/common'
  import '@/manages/page/survey/style.less'

  const schema = [
    {
      name: 'name',
      label: '问卷名称',
      parentClass: '',
    },
  ]
  const rules = {
    name: [
      { required: true, message: '必填项', trigger: 'change' },
    ],
  }
  export default {
    data () {
      const formModel = this.$ever.createObjFromSchema(schema)
      return {
        surveyId: '',
        formModel,
        schema,
        rules,
        publishBtn: {
          text: '发布',
          disabled: false,
        },
      }
    },
    computed: {
      editUrl () {
        let token = storage.getStorageByClinic('TOKEN')
        return this.$ever.api + '/survey/design/my-survey-design/survey.do?surveyId=' + this.surveyId + '&x-access-token=' + token
      },
      buttonText () {
        return this.surveyId === '-1' ? '编辑问卷内容' : '保存'
      },
    },
    created () {
      this.surveyId = this.$route.params.surveyId
      this.schema.find(item => item.name === 'name').parentClass = this.surveyId === '-1' ? '' : 'dni'
    },
    mounted () {
      window.addEventListener('message', this.listenPostMessage, false)
    },
    destroyed () {
      window.removeEventListener('message', this.listenPostMessage)
    },
    methods: {
      listenPostMessage (e) {
        // 问卷发布之后的回调
        if (e.data && e.data.from === 'Survey' && e.data.type === 'save-done') {
          this.$messageTips(this, 'success', '问卷发布成功')
          this.$router.push({ name: 'survey' })
        }
      },
      publish () {
        this.publishBtn = {
          text: '发布中',
          disabled: true,
        }
        // 调用问卷系统的发布 此时会有回调函数
        const iframe = this.$refs.surveyIframe
        const msg = {
          data: {},
          from: 'Survey-save',
          fromIP: window.location.origin,
          type: 'save',
        }
        iframe.contentWindow.postMessage(msg, '*')
      },
      save: debounce(function () {
        if (this.surveyId === '-1') {
          this.$refs.form.$refs.form.validate(valid => {
            if (valid) {
              // 保存问卷名称，生成surveyId
              request(urlMap.save, { surveyName: this.formModel.name }, 'get').then(res => {
                if (res.data && res.data.surveyId) {
                  this.surveyId = res.data.surveyId
                  this.$router.replace({ name: 'surveyDetail', params: { surveyId: this.surveyId } })
                }
              })
            }
          })
        } else {
          // 调用问卷系统的保存 此时不会有回调函数
          const iframe = this.$refs.surveyIframe
          const msg = {
            data: {},
            from: 'Survey-save',
            fromIP: window.location.origin,
            type: 'save-only',
          }
          iframe.contentWindow.postMessage(msg, '*')
        }
      }, 200),
    },
  }
</script>
