<template>
  <div class="ever_allergichis_wrap" style="overflow:hidden;padding-right:10px">
    <el-form v-for="(item, i) in input" :key="i" :rules="rules" :model="item" ref="form">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item prop="clinic">
            <el-select v-model="item.clinic" placeholder="请选择机构" clearable @change="itemClinicHandle(item)">
              <el-option
                v-for="(temp, i) in orgItemList"
                :key="i"
                :value="temp.id"
                :label="temp.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="arrange">
            <el-select v-model="item.arrange" placeholder="请选择机构排班" clearable>
              <el-option
                v-for="(temp, i) in orgArrangeList"
                :key="i"
                :value="temp.id"
                :label="temp.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="arrangeUse">
            <el-select v-model="item.arrangeUse" placeholder="请选择机构排班" clearable>
              <el-option
                v-for="(temp, i) in arrangeUseOpts"
                :key="i"
                :value="temp.id"
                :label="temp.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delAllergyItem(i)" v-if="input.length > 1"></i>
          <i class="iconfont icon-tianjia" @click="addItem(i)" v-if="(i + 1) === (input.length)"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from '@/arrange/store/appointapi'
  export default {
    props: ['value', 'arrangeUseList'],
    data () {
      let emptyObj = {clinic: '', arrange: '', arrangeUse: ''}
      return {
        api,
        emptyObj,
        input: this.value && this.value.length ? this.value : [Object.assign({}, emptyObj)],
        disabled: true,
        rules: {
          clinic: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          arrange: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          arrangeUse: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        },
        orgItemList: [],
        orgArrangeList: [],
        arrangeUseOpts: this.arrangeUseList || []
      }
    },
    created () {
      this.getOrgList()
    },
    methods: {
      getOrgList () {
        this.api.getOrgList().then(rs => {
          rs.data.map(item => {
            this.orgItemList.push({
              id: '' + item.clinicId,
              name: item.clinicName
            })
          })
        })
      },
      addItem () {
        let isValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (isValid) this.input.push(Object.assign({}, this.emptyObj))
      },
      delAllergyItem (i) {
        this.input.splice(i, 1)
      },
      itemClinicHandle (item) {
        console.log('----item----', item)
        // 监听机构变化  通过机构id请求排班数据
        this.orgArrangeList = [{id: '1', name: 'ceshi'}]
      }
    },
    watch: {
      'value' (val) {
        this.input = val
      },
      'input': {
        handler (val) {
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .el-form{
      margin-bottom: 15px;
      /deep/ .el-form-item{
        margin-bottom: 0;
        .el-select{
          width: 100%;
        }
      }
    }
    .handle_btn{
      line-height: 36px;
      white-space: nowrap;
      .iconfont{
        font-size: 14px;
        padding: 5px;
        color: #333;
        &.icon-delete{
          color: #aaa;
        }
      }
    }
    .el-col{
      &:nth-last-child(2) {
        padding-right: 5px !important;
      }
    }
  }
</style>
