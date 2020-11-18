<template>
  <div>
    <div class="layout_inner">
      <ever-table :data="tableDatas" :columns="columns">
        <template slot="mzfpfl">
          <el-table-column label="门诊发票分类">
            <template slot-scope="scope">
              <sys-type
                code="THC_CPOE_OutpatientReceipt"
                v-model="scope.row.clinicReceiptType"
                :use-value="true"
              ></sys-type>
            </template>
          </el-table-column>
        </template>
        <template slot="zyfpfl">
          <el-table-column label="住院发票分类">
            <template slot-scope="scope">
              <sys-type
                code="THC_CPOE_InpatientReceipt"
                v-model="scope.row.hospitalizedReceiptType"
                :use-value="true"
              ></sys-type>
            </template>
          </el-table-column>
        </template>
        <template slot="basyflxy">
          <el-table-column label="病案首页分类(西医)">
            <template slot-scope="scope">
              <!-- <sys-type
                code="THC_CPOE_ZYBASYFYLX"
                v-model="scope.row.medicalRecordClassify"
                :use-value="true"
              ></sys-type> -->
              <cascader-medical
                v-model="scope.row.medicalRecordClassify"
                filterable
                remote
                clearable
                placeholder="请选择病案首页分类(西医)"
                :props="{ checkStrictly: true }"
                code="THC_CPOE_ZYBASYFYLX"
              ></cascader-medical>
            </template>
          </el-table-column>
        </template>
        <template slot="basyflzy">
          <el-table-column label="病案首页分类(中医)">
            <template slot-scope="scope">
              <!-- <sys-type
                code="THC_CPOE_ZYBASYFYLX_ZY"
                v-model="scope.row.medicalRecordClassifyZy"
                :use-value="true"
              ></sys-type> -->
              <cascader-medical
                v-model="scope.row.medicalRecordClassifyZy"
                filterable
                remote
                clearable
                placeholder="请选择病案首页分类(中医)"
                :props="{ checkStrictly: true }"
                code="THC_CPOE_ZYBASYFYLX_ZY"
              ></cascader-medical>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <div class="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <span>注：修改关系后，所有的物资字典和医嘱字典均自动修改，请慎重操作</span>
      </div>
    </div>
  </div>
</template>
<script>
import cascaderMedical from '@/sob/page/service.manage/cascader.medical.vue'
import api from '@/sob/store/financialcontrol'
import list from '../../util/list'

export default {
  mixins: [list],
  data () {
    return {
      api,
      tableDatas: [],
      type: '',
      columns: [
        {
          prop: 'finTypeName',
          label: '业务分类'
        },
        {
          slotName: 'mzfpfl',
        },
        {
          slotName: 'zyfpfl',
        },
        {
          slotName: 'basyflxy',
        },
        {
          slotName: 'basyflzy',
        }
      ]
    }
  },
  components: {
    cascaderMedical // 病案首页类型
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      api.query({}).then(res => {
        this.tableDatas = res
      })
    },
    save () {
      this.$confirm('修改关系后，所有的物资字典和医嘱字典均自动修改，是否确认修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        api.save(this.tableDatas).then(res => {
          this.$messageTips(this, 'success', '修改成功！')
          this.query()
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.footer {
  span {
    color: red;
    font-size: 12px;
  }
}
</style>
