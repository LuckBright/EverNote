<template>
  <div>
    <el-dialog
      title="医保费用分解详细信息"
      :visible.sync="v"
      width="50%"
      class="medicalsettle"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="12">
          <span>交易流水号：</span>
          {{medicalsettleobj.details.medPayInfo && medicalsettleobj.details.medPayInfo.length && medicalsettleobj.details.medPayInfo[0].tradeno}}
        </el-col>
        <el-col :span="12">
          <span>收费单据号：</span>
          {{medicalsettleobj.details.medPayInfo && medicalsettleobj.details.medPayInfo.length && medicalsettleobj.details.medPayInfo[0].feeno}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>交易时间：</span>
          {{medicalsettleobj.details.medPayInfo && medicalsettleobj.details.medPayInfo.length && medicalsettleobj.details.medPayInfo[0].tradedate | formatDateByExp('YYYY/MM/DD', 'hh:mm:ss')}}
        </el-col>
      </el-row>
      <div class="medicalpay">
        <h4 class="medicalpaytitle">明细分解信息</h4>
        <el-table
          :data="medicalsettleobj.details.medFeeitem"
          style="width: 100%"
          class="needMargin"
        >
          <el-table-column prop="itemno" label="项目序号" align="center"></el-table-column>
          <el-table-column prop="recipeno" label="处方序号" align="center"></el-table-column>
          <el-table-column prop="hiscode" label="HIS项目代码" align="center"></el-table-column>
          <el-table-column prop="itemcode" label="医保项目代码" align="center"></el-table-column>
          <el-table-column prop="itemname" label="医保项目名称" align="center"></el-table-column>
          <el-table-column prop="itemtype" label="业务分类" align="center"></el-table-column>
          <el-table-column prop="unitprice" label="单价" align="center"></el-table-column>
          <el-table-column prop="fee" label="项目总金额" align="center"></el-table-column>
          <el-table-column prop="feein" label="医保内总金额" align="center"></el-table-column>
          <el-table-column prop="feeout" label="医保外总金额" align="center"></el-table-column>
          <el-table-column prop="selfpay2" label="个人自付2" align="center"></el-table-column>
          <el-table-column prop="state" label="分解状态" align="center"></el-table-column>
          <el-table-column prop="feetype" label="收费类别" align="center"></el-table-column>
          <el-table-column prop="preferentialfee" label="社区优惠金额" align="center"></el-table-column>
          <el-table-column prop="preferentialscale" label="社区优惠比例" align="center"></el-table-column>
        </el-table>
        <el-table :data="medicalsettleobj.details.medPayInfo" style="width: 100%">
          <el-table-column prop="feeall" label="费用总金额" align="center"></el-table-column>
          <el-table-column prop="mzfeein" label="医保内总金额" align="center"></el-table-column>
          <el-table-column prop="mzfeeout" label="医保外总金额" align="center"></el-table-column>
          <el-table-column prop="mzpayfirst" label="本次付起付线金额" align="center"></el-table-column>
          <el-table-column prop="mzselfpay2" label="个人自付2" align="center"></el-table-column>
          <el-table-column prop="mzbigpay" label="门诊大额支付金额" align="center"></el-table-column>
          <el-table-column prop="mzbigselfpay" label="门诊大额自付金额" align="center"></el-table-column>
          <el-table-column prop="mzoutofbig" label="超大额自付金额" align="center"></el-table-column>
          <el-table-column prop="bcpay" label="补充保险支付金额" align="center"></el-table-column>
          <el-table-column prop="jcbz" label="军残补助保险金额" align="center"></el-table-column>
        </el-table>
      </div>
      <div
        class="medicalitem"
        v-show="medicalsettleobj.details.mediCatalog && medicalsettleobj.details.mediCatalog.length > 0"
      >
        <h4 class="medicalpaytitle">分类汇总信息</h4>
        <el-row class="medicaltable">
          <el-col :span="8">
            <medicalitem :medicalitemarr="colarr1"></medicalitem>
          </el-col>
          <el-col :span="8">
            <medicalitem class="medicalitemimport" :medicalitemarr="colarr2"></medicalitem>
          </el-col>
          <el-col :span="8">
            <medicalitem class="medicalitemimport" :medicalitemarr="colarr3"></medicalitem>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import medicalitem from './medicalitem'
export default {
  props: ['medicalsettleobj', 'medicalsettlevisable'],
  data () {
    return {
      colarr1: [],
      colarr2: [],
      colarr3: [],
      medicalmap: {
        medicine: '西药',
        tmedicine: '中成药',
        therb: '中草药',
        labexam: '化验',
        xray: '放射',
        ultrasonic: 'B超',
        ct: 'CT',
        mri: '核磁',
        examine: '检查费',
        treatment: '治疗费',
        material: '材料费',
        operation: '手术费',
        oxygen: '输氧费',
        bloodt: '输血费',
        orthodontics: '正畸费',
        prosthesis: '镶牙费',
        forensicExpertise: '司法鉴定',
        other: '其他'
      }
    }
  },
  methods: {
    arrgroup (arr) {
      let that = this
      that.colarr1 = []
      that.colarr2 = []
      that.colarr3 = []
      arr.forEach(function (item, index) {
        index = index + 1
        if (index % 3 === 1) {
          that.colarr1.push(item)
        } else if (index % 3 === 2) {
          that.colarr2.push(item)
        } else if (index % 3 === 0) {
          that.colarr3.push(item)
        }
      })
    }
  },
  components: {
    medicalitem
  },
  computed: {
    v: {
      get () {
        return this.medicalsettlevisable
      },
      set (val) {
        this.$emit('update:medicalsettlevisable', val)
      }
    }
  },
  watch: {
    'medicalsettleobj.details.mediCatalog': {
      handler (v) {
        if (v && v.length !== 0) {
          this.arrgroup(
            Object.keys(this.medicalmap).map(k => ({
              name: this.medicalmap[k],
              fee: v[0][k] || 0
            }))
          )
        }
      },
      // deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped>
.medicalsettle /deep/ .el-dialog {
  width: 700px;
  top: 150px;
  height: 560px;
  padding: 0 19px 0 20px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.medicalsettle /deep/ .el-dialog__header {
  padding: 0;
}
.medicalsettle /deep/ .el-dialog__title {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #000;
  line-height: 58px;
  border-left: none;
  margin: 0;
  padding: 0;
}
.medicalsettle /deep/ .el-dialog__body {
  height: 502px;
  overflow-y: auto;
  background: #fff;
  padding: 0;
  margin: 0;
  position: relative;
}
.medicalsettle /deep/ .el-row {
  height: 14px;
  line-height: 20px;
  font-family: PingFangSC-Regular;
  color: #000;
}
.medicalsettle /deep/ .el-row span {
  color: #999;
}
.medicalpaytitle {
  padding: 0;
  font-size: 16px;
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 20px 0 20px;
  color: #000;
}
.medicalsettle /deep/ .el-table {
  margin: 0;
  padding: 0;
}
.medicalsettle /deep/ .needMargin {
  margin-bottom: 21px;
}
.medicaltable {
  width: 100%;
}
.medicaltable /deep/ .el-table {
  border-top: none;
}
.medicalsettle /deep/ .medicalitemimport .el-table {
  border-left: none;
}
.medicalsettle /deep/ .dialog-footer {
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
