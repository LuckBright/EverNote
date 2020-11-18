<!--  -->
<template>
  <div>
    <div class="be">
      <el-select
        v-if="showSelect"
        v-model="initId"
        placeholder="请选择"
        class="selectbox"
        @change="changeIndex"
        filterable
      >
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id"></el-option>
      </el-select>
      <h3 class="center">{{info}}</h3>
    </div>
    <div class="formbox" @scroll.prevent>
      <div class="form-content" :class="{'form-padding-right': !isDoc}">
        <div v-if="!isDoc" class="no-editor-cover"></div>
        <remote-form
          v-if="!isDoc"
          v-show="initId"
          ref="form"
          v-model="form"
          :schema-id="schemaId"
          :id.sync="showSelect ? optionId : id"
          :nosubmit="true"
          :disabled="true"
          changelog='true'
        ></remote-form>
        <ever-editor v-if="isDoc && initId" :html="htmlText" :editable="false"></ever-editor>
      </div>
    </div>
  </div>
</template>

<script>
import remoteForm from '@/form/components/remoteform'
import everEditor from 'evereditor'
import tplapi from '@/form/store/api'

export default {
  props: {
    options: Array,
    schemaId: String,
    id: String,
    isDoc: Boolean,
    showSelect: {
      default: true
    },
    info: {
      default: ''
    }
  },
  data () {
    return {
      optionId: '-1',
      form: {},
      initId: '',
      copyDoc: {},
      htmlText: ''
    }
  },
  components: {
    remoteForm,
    everEditor
  },
  mounted () {
    this.initId = this.id
    this.changeIndex()
  },
  methods: {
    async changeIndex (index) {
      if (!this.isDoc) {
        this.$refs.form.obj = {}
      }
      if (!this.showSelect) {
        if (this.isDoc) {
          const obj = await tplapi.getById(this.id)
          if (obj.data) {
            this.htmlText = obj.data.text
          }
        }
        return
      }
      this.options.map(item => {
        if (item.id === this.initId) {
          if (this.isDoc) {
            this.htmlText = item.res.currentData
              ? item.res.currentData.text
              : ''
          } else {
            this.$refs.form.obj = item.res.currentData
              ? item.res.currentData
              : {}
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.selectbox {
  width: 96%;
  margin: auto;
}
.be {
  background-color: #eee;
  height: 51px;
  display: flex;
  align-items: center;
}
.formbox {
  height: 500px;
  overflow: auto;
  margin-top: 10px;
  .form-content {
    padding: 0px;
    position: relative;
    overflow: hidden;
    /deep/ .ever__editor.medical {
      border: none;
    }
    /deep/ .ever__editor.medical .editor_content_wrap .editor__content {
      margin: 0 auto;
      box-shadow: none;
    }
    /deep/ .ever__editor.medical .editor_content_wrap {
      max-height: inherit;
    }
  }
  .no-editor-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 99;
  }
  .form-padding-right {
    padding-right: 10px;
  }
}
.center {
  text-align: center;
  width: 200px;
  margin: 0 auto;
}
</style>

