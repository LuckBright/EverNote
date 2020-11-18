<template>
  <div style="margin-top: 50px;padding: 30px">
    <h5>测试 phrform</h5>
    <phrform :schema-id.sync="tplId" :visit-id="visitId" :patient-id="patientId" v-model="obj"  ref="form" :dptId="dptId" :code="code">
     <!--  <el-col :span="24" slot="default">
        <el-form-item>
          <el-button @click="save()">保存</el-button>
        </el-form-item>
      </el-col> -->
      <template slot="col_2">
        <div>测试占位组件</div>
      </template>
    </phrform>
    <!-- <bingliref></bingliref> -->
    <!-- <precheck :task="task"></precheck> -->
  </div>
</template>
<script>
import phrform from '../components/phrform'
import bingliref from '@/workspace/components/bingliref'
import precheck from '@/workspace/page/dialog-precheck'
export default {
  data () {
    return {
      obj: null,
      tplId: '',
      visitId: this.$route.query.visitId,
      patientId: this.$route.query.patientId,
      dptId: this.$route.query.dptId,
      code: this.$route.query.code,
      task: {
        taskId: 'task12',
        taskName: '预检',
        variables: {
          visitNumber: '123v'
        },
        patient: {
          id: '234'
        },
        appointment: {
          providerid: 2
        }
      }
    }
  },
  created () {
  },
  methods: {
    save () {

    }
  },
  components: {
    phrform,
    bingliref,
    precheck
  }
}
</script>
