<!--
  录入证件类型，及证件号组件（证件号为值集，目前剔除了身份证号的类型）
  demo: <other-papers v-model="obj.iden" style="width:200px;"></other-apers>
  params：无
-->
<template>
  <el-form style="margin-top:-15px;" size="small" :disabled="disabled ? true : false">
    <el-row v-for="(temp, index) in obj.idens" :key="index" :index="index">
      <div style="display: inline-block;">
        <!-- <sys-type
          code="CV02.01.101"
          v-model="temp.type"
          :use-value="true"
          style="float:left;width:auto;"
          :disabled="disabled ? true : false"
        ></sys-type> -->
         <el-select v-model="temp.type" placeholder="请选择证件号" style="float:left;width:auto;width:100px">
          <el-option
            v-for="(item, i) in data"
            :key="i"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-form-item
          :prop="'idens.' + index + '.mobile'"
          :rules="[{required: false, message: '请输入证件号', trigger: 'blur'},
                  { min: 18, max: 18, message: '请输入18位证件号码', trigger: 'blur' }]"
          style="float:left;margin-bottom:0;margin-left:5px;"
        >
          <el-input v-model.trim="temp.idNo" placeholder="请输入证件号" class="wid"></el-input>
        </el-form-item>
        <el-form-item style="float:left;margin-left:10px;">
          <el-button type="text" v-if="index === 0" @click="addrow">
            <i class="iconfont icon-tianjia"></i>
          </el-button>
          <el-button type="text" v-if="index > 0" @click="delrow(index)">
            <i class="iconfont icon-delete"></i>
          </el-button>
        </el-form-item>
      </div>
    </el-row>
  </el-form>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: ['value', 'disabled'],
  data () {
    let obj = {
      idens: [
        {
          type: '',
          idNo: ''
        }
      ]
    }
    return {
      index: 0,
      obj,
      maxLength: 0,
      data: []
    }
  },
  watch: {
    idens: {
      handler (newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    },
    value: {
      handler (val) {
        if (val && val.length > 0) {
          this.obj.idens = val
        } else {
          this.obj.idens = [{
            type: '',
            idNo: ''
          }]
          this.$emit('input', this.obj.idens)
        }
      },
      immediate: true
    }
  },
  created () {
    sysvalue.listOnce('CV02.01.101').then(rs => {
      this.maxLength = rs.length
      if (rs && rs[0]) {
        this.data = rs.filter(v => {
          return v.name !== '居民身份证'
        })
      }
    })
  },
  methods: {
    addrow () {
      if (this.obj.idens.length < this.maxLength) {
        this.obj.idens.push({
          type: '',
          idNo: ''
        })
      } else {
        this.$notify({
          type: 'warning',
          message: '已达到上限'
        })
      }
    },
    delrow (index) {
      this.obj.idens.splice(index, 1)
    }
  }
}
</script>
<style scoped>
.wid {
  width: 170px;
}
.el-row {
  height: 32px;
  margin-top: 15px;
}
.el-button {
  padding: 0;
}
</style>

