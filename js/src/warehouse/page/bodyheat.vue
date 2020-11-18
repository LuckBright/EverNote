<template>
  <div>
    <div class="bg">
      <div class="forms">
        <ever-form2 :nosubmit="true" :schema="schema" v-model="obj">
          <template slot="type">
            <el-radio v-model="obj.type" label="1">体温单</el-radio>
            <!-- <el-radio v-model="obj.type" label="2" v-if="hurtList.length > 0">体温疼痛单</el-radio> -->
            <el-form label-width="100px" v-if="obj.type == 2" style="margin-left: -100px">
              <el-form-item
                label="疼痛评估单："
                style="margin: 15px 0px 0px 0px"
                v-if="hurtList.length > 0"
              >
                <div v-for="(idItem,index) in hurtIds" :key="index">
                  <el-select
                    v-model="idItem.id"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in hurtList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-button type="text" v-if="index === 0" @click="addrow">
                    <i class="iconfont icon-tianjia"></i>
                  </el-button>
                  <el-button type="text" v-if="index > 0" @click="delrow(index)">
                    <i class="iconfont icon-delete"></i>
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template slot="baseInfo">
            <el-checkbox
              v-for="item in infoArr"
              v-model="item.checked"
              :label="item.name"
              :key="item.name"
            >{{item.name}}</el-checkbox>
          </template>
          <template slot="time">
            <el-time-select v-model="time" :picker-options="pickerOptions"></el-time-select>
          </template>
          <template slot="in">
            <el-select v-model="inArr" placeholder="请选择" filterable multiple>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.displayName"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
          <template slot="out">
            <el-select v-model="outArr" placeholder="请选择" filterable multiple>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.displayName"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
        </ever-form2>
      </div>
      <div class="btns">
        <el-button type="primary" class="querybtn" @click="store">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/bodyheat.js'
const schema = [
  {
    name: 'type', // TYPE
    label: '体温单类型',
    comp: 'custom'
  },
  {
    name: 'baseInfo', // BASE_INFO
    label: '患者基本信息',
    comp: 'custom'
  },
  {
    name: 'inHospitalTxt', // IN_HOSPITAL_TXT
    label: '"住院日数"文案',
    comp: 'el-input'
  },
  {
    name: 'operationTxt', // OPERATION_TXT
    label: '"手术日数"文案',
    comp: 'el-input'
  },
  {
    name: 'time', // START_HOUR START_MINUTE
    label: '24h液体入出量累计时间',
    comp: 'custom'
  },
  {
    name: 'in', // IN
    label: '液体入量',
    comp: 'custom'
  },
  {
    name: 'out', // OUT
    label: '液体出量',
    comp: 'custom'
  }
]
export default {
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      time: '',
      infoArr: [
        {
          name: '姓名',
          checked: false,
          key: 'name'
        },
        {
          name: '性别',
          checked: false,
          key: 'sex'
        },
        {
          name: '年龄',
          checked: false,
          key: 'age'
        },
        {
          name: '出生日期',
          checked: false,
          key: 'birthday'
        },
        {
          name: '科别',
          checked: false,
          key: 'dptName'
        },
        {
          name: '床号',
          checked: false,
          key: 'bed'
        },
        {
          name: '病案号',
          checked: false,
          key: 'hospitalNum'
        },
        {
          name: '入院日期',
          checked: false,
          key: 'enterDate'
        }
      ],
      inArr: [],
      outArr: [],
      options: [],
      pickerOptions: {
        start: '00:00',
        step: '00:01',
        end: '23:59'
      },
      hurtIds: [{ id: '' }],
      hurtList: [],
      keysArr: [
        'TYPE',
        'TEMPLATE_IDS',
        'BASE_INFO',
        'IN_HOSPITAL_TXT',
        'OPERATION_TXT',
        'START_HOUR',
        'START_MINUTE',
        'OUT',
        'IN'
      ],
      updateArr: []
    }
  },
  computed: {},
  created () {
    this.getOption()
    // 疼痛评估单
    // this.queryTemplate()
    this.getConfig()
  },
  methods: {
    store () {
      if (this.updateArr.length === 0) {
        this.add()
      } else {
        this.update()
      }
    },
    async queryTemplate (name) {
      const res = await api.queryTemplate({ name, pagesize: 1000 })
      if (Array.isArray(res.resultList)) {
        this.hurtList = res.resultList
      }
    },
    async getConfig () {
      const res = await api.getConfig()
      let hour
      let min
      if (Array.isArray(res) && res.length === 0) return
      this.updateArr = res
      this.updateArr.map(item => {
        const code = item.code
        const value = item.value
        if (value) {
          if (code === 'BASE_INFO') {
            const keyMap = {}
            this.infoArr.map((item, index) => {
              keyMap[item.key] = index
            })
            value.split(',').map(key => {
              if (key in keyMap) this.infoArr[keyMap[key]].checked = true
            })
          }
          if (code === 'IN') {
            value.split(',').map(item => {
              this.inArr.push(item)
            })
          }
          if (code === 'OUT') {
            value.split(',').map(item => {
              this.outArr.push(item)
            })
          }
          if (code === 'START_HOUR') {
            hour = value
          }
          if (code === 'START_MINUTE') {
            min = value
          }
          if (code === 'IN_HOSPITAL_TXT') {
            this.obj.inHospitalTxt = value
          }
          if (code === 'OPERATION_TXT') {
            this.obj.operationTxt = value
          }
          if (code === 'TYPE') {
            this.obj.type = value
          }
          if (hour && min) {
            this.time = this.paddingZero(hour) + ':' + this.paddingZero(min)
          }
          if (code === 'TEMPLATE_IDS') {
            const ids = value.split(',')
            ids.map(item => {
              const obj = {}
              obj.id = item
              this.hurtIds.push(obj)
            })
          }
        }
      })
    },
    paddingZero (str) {
      if (!str) return
      if (str.length > 1) {
        return str
      } else {
        return `0${str}`
      }
    },
    async getOption () {
      const res = await api.getOneByCode()
      if (Array.isArray(res)) {
        this.options = res
      }
    },
    formatTime (time) {
      return { hour: time.substr(0, 2), min: time.substr(3, 2) }
    },
    async add () {
      let res = []
      this.keysArr.map(key => {
        const obj = {
          code: key,
          type: 3,
          value: '',
          scope: 1
        }
        res.push(obj)
      })
      res = this.format(res)
      const response = await api.add(res)
      if (response) {
        this.getConfig()
        this.$messageTips(this, 'success', '保存成功')
      }
    },
    format (res) {
      const obj = this.obj
      const time = this.formatTime(this.time)
      res.map(item => {
        const code = item.code
        if (code === 'BASE_INFO') {
          const baseKey = []
          this.infoArr.map((item, index) => {
            if (item.checked) {
              baseKey.push(item.key)
            }
          })
          item.value = baseKey.join()
        }
        if (code === 'IN') {
          item.value = this.inArr.join(',')
        }
        if (code === 'OUT') {
          item.value = this.outArr.join(',')
        }
        if (code === 'START_HOUR') {
          item.value = time.hour.substr(0, 1) === '0' ? time.hour.substr(1, 1) : time.hour
        }
        if (code === 'START_MINUTE') {
          item.value = time.min.substr(0, 1) === '0' ? time.min.substr(1, 1) : time.min
        }
        if (code === 'IN_HOSPITAL_TXT') {
          item.value = obj.inHospitalTxt
        }
        if (code === 'OPERATION_TXT') {
          item.value = obj.operationTxt
        }
        if (code === 'TYPE') {
          item.value = obj.type
        }
        if (code === 'TEMPLATE_IDS') {
          const ids = []
          this.hurtIds.map(item => {
            if (item.id) {
              ids.push(item.id)
            }
          })
          item.value = ids.join()
        }
      })
      return res
    },
    async update () {
      let res = this.format(this.updateArr)
      const response = api.updateConfig(res)
      if (response) {
        this.$messageTips(this, 'success', '保存成功')
        this.getOption()
      }
    },
    addrow () {
      const obj = { id: '' }
      this.hurtIds.push(obj)
    },
    delrow () {
      this.hurtIds.pop()
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.bg {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  .btns {
    margin-left: 120px;
    height: 80px;
    line-height: 80px;
  }
}
</style>
