<template>
  <div class="layout_inner flex_column_1_hidden">
    <div class="flex_layout_scroll pt20">
      <el-form label-position="right" label-width="150px" class="custom-form " v-loading="loading">
        <el-form-item label="价格精度配置">
          <el-input-number controls-position="right"  v-model="priceDecimal" size="small" :min="0" :max="6" :precision="0"></el-input-number>
          <el-button type="primary" size="small" @click="setPriceDecimal" :loading="setPriceDecimalLoad">保存</el-button>
        </el-form-item>
        <template v-for="(item, index) in list">
          <el-form-item :label="`${item.name}价格`" :key="index">
            <div class="line_h">
              <el-switch
                size="small"
                v-model="item.enable"
                @change="handerChange(item)">
              </el-switch>
              <span class="ml20" v-if="item.desc">{{item.desc}}</span>
              <span class="ml20" v-if="item.name === '加急'">注：加急价格仅对基础价格适用</span>
            </div>
            <template v-if="item.list && item.enable">
              <el-table
                border
                :data="item.list"
                style="width: 40%">
                <el-table-column
                  prop="name"
                  align="center"
                  label="医保名称">
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="180">
                  <template slot-scope="scope">
                    <el-switch
                      size="small"
                      v-model="scope.row.enable"
                      @change="handerChange(item, scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/tariffs/modify.price.api.js'
import { setPriceDecimal } from '@/manages/components/price.manage/price.config.js'

export default {
  data () {
    return {
      list: [],
      loading: false,
      priceDecimal: null,
      setPriceDecimalLoad: false
    }
  },
  created () {
    this.initScene()
    this.getPriceDecimal()
  },
  methods: {
    handerChange (parent, row) {
      const { type, enable, list = [], subordinate } = parent
      // 当前操作项是父节点并且其有子项时，不进行接口请求（每一个医保大项存在子项时，必须同步开启其中的子项）
      if (list && list.length && !row && enable) return
      // 关闭父节点操作，传递每条明细给后端，并把每条明细关闭
      const params = {
        enable,
        type,
        subordinate
      }
      if (list && list.length && !row && !enable) {
        params.sceneList = []
        // 把每条明细enable 设置为false
        list.forEach(item => {
          item.enable = false
          params.sceneList.push({
            scene: item.id,
            sceneName: item.name,
            type,
            enable: item.enable,
          })
        })
      }
      this.loading = true
      // 子节点操作
      if (row) {
        const { id: scene, name: sceneName, enable } = row
        params.sceneList = [
          {
            scene,
            sceneName,
            type,
            enable,
          }
        ]
      }
      api.setSceneTenant({ sceneTypeList: [params] }).then(res => {
        const { code } = res || {}
        this[code ? 'everError' : 'everSuccess'](`修改${code ? '失败' : '成功'}`)
        code && this.initScene()
      }).finally(_ => {
        this.loading = false
      })
    },
    initScene () {
      this.loading = true
      api.initScene().then(res => {
        const { head = {}, data = [] } = res
        if (head.errCode === 0) {
          this.list = data
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    getPriceDecimal () {
      api.getTenant().then(res => {
        this.priceDecimal = res.digitCapacity
        this.priceDecimalId = res.id
      })
    },
    setPriceDecimal () {
      this.setPriceDecimalLoad = true
      let params = {
        digitCapacity: this.priceDecimal
      }
      if (this.priceDecimalId) {
        params.id = this.priceDecimalId
      }
      api.setTenant(params).then(res => {
        if (res) {
          setPriceDecimal(this.priceDecimal)
          this.$messageTips(this, 'success', '保存成功')
        }
        this.setPriceDecimalLoad = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-form {
  width: 100%;
  /deep/ .el-form-item__label {
    padding-right: 20px;
    font-weight: bold;
    font-size: 16px;
  }
  /deep/ .el-form-item__content {
    line-height: 22px
  }
}
.line_h {
  height: 32px;
  line-height: 32px
}
</style>
