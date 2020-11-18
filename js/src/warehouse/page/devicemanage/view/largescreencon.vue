<template>
  <div>
    <ever-bread-crumb
      :name="breadCrumbName"
      path="/warehouse/devicelist"
      showTitle="true"
      :pathTo="true"
    ></ever-bread-crumb>
    <div class="bg">
      <div>
        <el-row class="title">
          <el-col>
            <span class="name">基本信息</span>
          </el-col>
        </el-row>
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :rules="rules">
          <div slot="default"></div>
        </ever-form2>
        <el-row class="title">
          <el-col>
            <span class="name">大屏通用诊间</span>
          </el-col>
        </el-row>
        <draggable tag="div" v-model="list" v-bind="dragOptions">
          <el-row v-for="(element, idx) in list" :key="idx">
            <div class="card">
              <el-form
                :rules="rules"
                :model="element"
                label-width="80px"
                :inline="true"
                ref="forms"
              >
                <el-form-item prop="source" label="诊间来源">
                  <el-select
                    v-model="element.source"
                    placeholder="请选择诊间来源"
                    filterable
                    @change="itemSourceHandle(element.source,idx)"
                  >
                    <el-option v-for="(temp, i) in typeArr" :key="i" :value="temp" :label="temp"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="id" label="诊间名称">
                  <el-select
                    v-model="element.id"
                    placeholder="请选择诊间名称"
                    clearable
                    filterable
                    @change="itemHandle(idx)"
                  >
                    <el-option
                      v-for="(temp, i) in element.arr"
                      :key="i"
                      :value="i"
                      :label="temp.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="text" @click="del(idx)">
                    <i class="iconfont icon-delete"></i>
                  </el-button>
                  <el-button type="text" class="handle">
                    <i class="iconfont icon-drag"></i>
                  </el-button>
                  <el-button @click="add" type="text" v-if="idx === (list.length - 1)">
                    <i class="iconfont icon-tianjia"></i>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
        </draggable>
      </div>
      <div class="btns">
        <el-button class="querybtn" @click="cancel">取消</el-button>
        <el-button type="primary" class="querybtn" @click="saveForm">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/devicemanage/store/largescreenapi'
import sapi from '@/warehouse/page/devicemanage/store/selfmachineapi'
import draggable from 'vuedraggable'
import { TERMINAL_TYPE } from '@/util/common'
let querySchema = [
  {
    name: 'sn',
    label: '大屏编号',
    span: 6,
    props: {
      placeholder: '请输入大屏编号'
    }
  },
  {
    name: 'name',
    label: '大屏显示名称',
    span: 6,
    props: {
      placeholder: '请输入大屏显示名称'
    }
  },
  {
    name: 'location',
    label: '大屏所在位置',
    comp: 'el-input',
    span: 13,
    props: {
      placeholder: '请输入大屏所在位置',
      type: 'textarea',
      rows: 20,
      minRows: 20,
      maxRows: 20
    }
  },
  {
    name: 'description',
    label: '备注',
    span: 13,
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '请输入备注',
      minRows: 20,
      maxRows: 20
    }
  }
]
export default {
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    var validatePass = (rule, value, callback) => {
      if (!`${value}`) {
        callback(new Error('请选择一个诊间'))
      } else {
        let length = 0
        this.list.forEach(item => {
          const id = item.res.id
          if (
            this.thcClinicsList[value] &&
            this.thcClinicsList[value].id === id
          ) {
            length++
          } else if (
            this.pacsClinicsList[value] &&
            this.pacsClinicsList[value].id === id
          ) {
            length++
          } else if (
            this.lisClinicsList[value] &&
            this.lisClinicsList[value].id === id
          ) {
            length++
          }
        })
        if (length > 1) {
          callback(new Error('不可选择相同诊间'))
        }
      }
    }
    var validateSn = (rule, value, callback) => {
      if (!value) {
        callback(new Error('必填项'))
      } else if (!/^[\da-z]+$/i.test(value)) {
        callback(new Error('大屏编码只允许字母和数字'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      breadCrumbName: this.$route.params.id
        ? `编辑${TERMINAL_TYPE[1].name}配置`
        : `新建${TERMINAL_TYPE[1].name}`,
      TERMINAL_TYPE,
      querySchema,
      queryObj,
      thcClinicsList: [],
      pacsClinicsList: [],
      lisClinicsList: [],
      rules: {
        sn: [
          { required: true, trigger: ['blur', 'change'], type: 'string' },
          { validator: validateSn }
        ],
        name: [
          {
            required: true,
            message: '必填项',
            trigger: ['blur', 'change'],
            type: 'string'
          }
        ],
        id: [
          {
            required: true,
            validator: validatePass,
            trigger: ['blur', 'change']
          }
        ]
      },
      type: 'THC',
      typeArr: ['THC', 'PACS', 'LIS'],
      clinic: '',
      clinicArr: [],
      idMap: {}
    }
  },
  computed: {
    currentId () {
      return this.$route.params.id
    },
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  async created () {
    await this.getThcRoomList()
    await this.getPacsRoomList()
    await this.getLisRoomList()
    if (this.currentId) {
      this.getScreenInfo()
      this.$ever.getFieldFromSchema(
        this.querySchema,
        'sn'
      ).props.disabled = true
    } else {
      this.$ever.getFieldFromSchema(
        this.querySchema,
        'sn'
      ).props.disabled = false
      this.list.push({
        id: '',
        source: 'THC',
        arr: this.thcClinicsList
      })
    }
  },
  methods: {
    itemHandle (idx) {
      const item = this.list[idx]
      const resIndex = item.id
      item.res = item.arr[resIndex]
    },
    itemSourceHandle (val, idx) {
      switch (val) {
        case 'THC':
          this.list[idx].arr = this.thcClinicsList
          break
        case 'PACS':
          this.list[idx].arr = this.pacsClinicsList
          break
        case 'LIS':
          this.list[idx].arr = this.lisClinicsList
          break
        default:
          this.list[idx].arr = []
      }
      this.list[idx].id = ''
      delete this.list[idx].res
    },
    add () {
      this.list.push({
        id: '',
        source: 'THC',
        arr: this.thcClinicsList
      })
    },
    del (idx) {
      if (this.list.length === 1) return
      this.list.splice(idx, 1)
    },
    // 获取thc所有诊间列表
    async getThcRoomList () {
      const res = await api.getThcRoomList()
      this.thcClinicsList = res.data ? res.data : []
      this.thcClinicsList.forEach((item, index) => {
        item.type = 3
        this.idMap[item.id] = {id: index, source: 'THC', res: item, arr: this.thcClinicsList}
      })
    },
    // 获取pacs所有诊间列表
    async getPacsRoomList () {
      const res = await api.getPacsRoomList()
      this.pacsClinicsList = res.data ? res.data : []
      this.pacsClinicsList.forEach((item, index) => {
        item.type = 788
        this.idMap[item.id] = {id: index, source: 'PACS', res: item, arr: this.pacsClinicsList}
      })
    },
    // 获取lis所有诊间列表
    async getLisRoomList () {
      const res = await sapi.getDrawBloodRoomList()
      this.lisClinicsList = res.data ? res.data : []
      this.lisIdMap = {}
      this.lisClinicsList.forEach((item, index) => {
        item.type = 787
        this.idMap[item.id] = {id: index, source: 'LIS', res: item, arr: this.lisClinicsList}
      })
    },
    // 编辑状态下，获取已有的大屏信息
    getScreenInfo () {
      let params = {
        id: this.currentId
      }
      api.getScreenInfo(params).then(res => {
        if (res.head.errCode === 0 && res.data) {
          const clinics = JSON.parse(res.data.clinics) ? JSON.parse(res.data.clinics) : []
          clinics.forEach(item => {
            const obj = {}
            obj.res = item
            if (item.id in this.idMap) {
              this.list.push(this.idMap[item.id])
            }
          })
          this.queryObj = res.data
        }
      })
    },
    // 保存
    saveForm () {
      let validate = true
      this.$refs.forms.forEach(form => {
        form.validate(val => {
          if (!val) {
            validate = val
          }
        })
      })
      if (!validate) {
        return
      }
      this.$refs.form.$refs.form.validate(validate => {
        if (validate) {
          let params = JSON.parse(JSON.stringify(this.queryObj))
          params.clinics = []
          this.list.forEach(item => {
            if (item.res) {
              params.clinics.push(item.res)
            }
          })
          params.clinics = JSON.stringify(params.clinics)
          if (this.currentId) {
            // 编辑
            api.updateScreen(params).then(res => {
              if (res.head.errCode === 0 && res.data) {
                this.$messageTips(this, 'success', '保存成功', '提示')
                this.$router.back()
                this.$store.commit('setDevice', '102')
              }
            })
          } else {
            // 新增
            api.createScreen(params).then(res => {
              if (res.head.errCode === 0 && res.data) {
                this.$messageTips(this, 'success', '保存成功', '提示')
                this.$router.back()
                this.$store.commit('setDevice', '102')
              }
            })
          }
        }
      })
    },
    cancel () {
      this.$router.back()
      this.$store.commit('setDevice', '102')
    }
  },
  components: {
    draggable
  }
}
</script>
<style lang="scss" scoped>
.bg {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  .mainTitle {
    text-align: center;
    margin: 20px 0;
  }
  .title {
    border-left: 2px solid #1c7bef;
    padding-left: 10px;
  }
  .ghost {
    opacity: 0.2;
    background: #c8ebfb;
  }
  .card {
    margin: 10px 0px;
    color: #000;
    font-size: 14px;
    padding-top: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
}
</style>
