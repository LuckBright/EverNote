<template>
  <div>
    <ever-bread-crumb name="列表" :path="`${rootPath}/forms`"></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
      {{obj}}
      <remoteform :id.sync="id" :schema-id="schemaId" v-model="obj" :slot-names="['default', 'col_2']" ref="form">
        <el-col :span="24" slot="default">
          <el-form-item>
            <el-button @click="save()">保存</el-button>
          </el-form-item>
        </el-col>
        <template slot="col_2">
          <div>测试占位组件</div>
        </template>
      </remoteform>
    </div>
  </div>
</template>
<script>
import remoteform from '../components/remoteform'
import formapi from '../store/api'
export default {
  data () {
    return {
      obj: null,
      schemaId: this.$route.params.schemaId,
      id: this.$route.params.id
    }
  },
  created () {
  },
  computed: {
    rootPath () {
      return `${this.$route.matched[0].path}/`
    }
  },
  methods: {
    save () {
      let blood = 'DL_XUE_YA'
      if (this.obj[blood]) {
        if (!this.obj[blood]['systolicPressure'] && !this.obj[blood]['diastolicPressure']) {
          this.obj[blood] = null
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          formapi.createOrUpdate(this.schemaId, this.obj, this.id, {})
        }
      })
    }
  },
  components: {
    remoteform
  }
}
</script>
