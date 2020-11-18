<template>
<div>
  <ever-bread-crumb name="拆零单" showTitle="true"></ever-bread-crumb>
  <div class="layout_inner">
    <h2 class="alg_c">拆零单</h2>
    <div class="head">
      <el-row>
        <el-col :span="8"><span class="label">拆零单号：</span><span v-if="obj.splitNumber">{{obj.splitNumber.code || '无'}}</span></el-col>
        <el-col :span="8"><span class="label">创建人：</span><span v-if="obj.updatedBy">{{obj.updatedBy || '无'}}</span></el-col>
        <el-col :span="8"><span class="label">创建时间：</span>{{obj.createTime || '无'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="label">拆零出库：</span><el-button @click="$router.push(`/storages/output/outputedit/${obj.outStock.id}?look=${obj.outStock.id}`)" type="text" v-if="obj.outStock">{{obj.outStock.code}}</el-button></el-col>
        <el-col :span="8"><span class="label">拆零入库：</span><el-button @click="$router.push(`/storages/entry/entryedit/${obj.inStock.id}?look=${obj.inStock.id}`)" type="text" v-if="obj.inStock">{{obj.inStock.code}}</el-button></el-col>
        <el-col :span="8"><span class="label"></span></el-col>
      </el-row>
    </div>
    <div class="content_box mt20">
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="10">
          <h3 v-if="beforeObj">
            <material-show-name
              v-if="beforeObj.materialName"
              :materialName="beforeObj.materialName"
              :icons="beforeObj.icons">
            </material-show-name>
          </h3>
          <ul class="content_list">
            <li v-if="beforeObj">包装单位：{{beforeObj.unitName}}</li>
            <li v-if="beforeObj">包装规格：{{beforeObj.spec}}</li>
            <li v-if="beforeObj">
              拆零数量：{{obj.splitNumberItemList ? obj.splitNumberItemList[0].numBefore : ''}}{{beforeObj.unitName}}
            </li>
          </ul>
        </el-col>
        <el-col :span="4">
          <div class="pos_re">
            <div class="square pos_ab"></div>
            <div class="arrow-right pos_ab"></div>
          </div>
        </el-col>
        <el-col :span="10">
          <div>
            <h3 v-if="afterObj">
              <material-show-name
                v-if="afterObj.materialName"
                :materialName="afterObj.materialName"
                :icons="afterObj.icons">
              </material-show-name>
            </h3>
            <ul class="content_list">
              <li v-if="afterObj">包装单位：{{afterObj.unitName}}</li>
              <li v-if="afterObj">包装规格：{{afterObj.spec}}</li>
              <li v-if="afterObj">
                增加库存：{{obj.splitNumberItemList ? obj.splitNumberItemList[0].numAfter : ''}}
                {{afterObj.unitName}}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>
<script>
import splitApi from '../store/splitapi'
import { patch, SPEC_CODE, PACKAGE_CODE } from '@/util/common'
export default {
  data () {
    return {
      SPEC_CODE,
      PACKAGE_CODE,
      obj: {},
      objId: this.$route.params.id,
      beforeObj: {},
      afterObj: {}
    }
  },
  created () {
    this.getDefault()
  },
  methods: {
    getDefault () {
      splitApi.getById(this.objId).then(res => {
        if (res) {
          let result = res.splitNumberItemList[0]
          this.beforeObj = result.beforeObject
          this.afterObj = result.afterObject
          this.obj = res
          this.obj.beforeObject = result.beforeObject
          this.obj.afterObject = result.afterObject
          this.obj.createTime = result.createTime
        }
      })
    },
    ...patch
  }
}
</script>
<style lang="scss" scoped>
h2.alg_c { padding: 5px 15px 15px}
.head { border: 1px solid #f4f4f4; padding: 15px;
  // /deep/ .el-form-item {margin-bottom: 0;}
  /deep/ .el-row {
    line-height: 40px;
    color: #000;
    font-size: 14px;
    span.label {
      text-align: right;
      width: 100px;
      display: inline-block
    }
  }
}
.content_box {
  border: 1px solid #eee;
  padding: 20px 30px;
  min-height: 150px
}
.content_box h2 { color:#008000; font-size: 28px;}
.content_list { line-height: 40px; font-size: 14px;}
.pos_re { top: 50%; margin-top: -30px;}
.square {
  width: 80px;
  height: 30px;
  top: 15px;
  background: #eee
}
.arrow-right {
  left: 80px;
  width:0;
  height:0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 30px solid #eee;
}
</style>

