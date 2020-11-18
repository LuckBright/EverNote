import adviceapi from '@/inpatient/store/adviceapi'
import medicalapi from '@/workspace/store/medicalapi'
import recipeapi from '@/workspace/store/recipeapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import storage from '@/util/storage'
import uuid from 'uuid/v1'
import { objFind } from '@/util/common'
export default {
  props: {
    visitType: Number,
    userInfo: Object
  },
  data () {
    return {
      adviceapi,
      medicalapi,
      recipeapi,
      sysvalue,
      storage,
      baseInfo: this.userInfo || this.$route.query,
      waitData: [],
      configData: [],
      sendData: [],
      loading: false,
      isDragCancel: false,
      startIndex: 0,
      endIndex: 0,
      contextList: [],
      waitContextList: [
        { id: '1', name: '上移', disabled: false, methodName: 'moveupChange' },
        { id: '2', name: '下移', disabled: false, methodName: 'movedowmChange', border: true },
        { id: '3', name: '组合医嘱', disabled: false, methodName: 'getGroupAdvice' },
        { id: '4', name: '取消组合', disabled: false, methodName: 'cancelGroupAdvice', border: true },
        { id: '5', name: '删除医嘱', disabled: false, methodName: 'delWaitService' }
      ]
    }
  },
  created () {
    this.setTicketCode()
  },
  methods: {
    // 表格某行被双击，触发编辑医嘱事件
    editWaitService ({ row, column, cell, event }) {
      if (String(row.status) !== '0') return false
      if (!row.isSelect) {
        if (this.waitDataObj[row.mainGroupId] && this.waitDataObj[row.mainGroupId].length) {
          this.waitDataObj[row.mainGroupId].forEach(item => {
            if (!item.isSelect) {
              item.isSelect = true
              let index = this.waitData.findIndex(val => { return val.id === item.id })
              this.$set(this.waitData, index, item)
            }
          })
        }
      }
      this.$bus.$emit('edit:orderData', JSON.parse(JSON.stringify(this.waitDataObj[row.mainGroupId])), () => {
        this.curStatus = ''
        this.delWaitService(row, this.waitData.findIndex(item => { return item.id === row.id }), true)
      })
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({ index, isWait, row }) {
      if (isWait) {
        this.waitContextList.forEach((v) => {
          v.disabled = !this.getStatusShow(this.waitData[index], index, v.id)
        })
        this.contextList = this.waitContextList
      } else {
        this.contextList = this.$refs.sendarea.getMenuList(index, row)
      }
    },
    // 待提交区操作按钮显示判断逻辑
    getStatusShow (item, index, id) {
      if (id === '1') {               // 上移
        // 第一条医嘱及第一条父子医嘱，框选区域，不能上移
        if (!this.waitData.findIndex(val => { return val.id === this.waitDataObj[item.mainGroupId][0].id }) || this.startIndex < this.endIndex) {
          return false
        } else {
          return true
        }
      } else if (id === '2') {        // 下移
        // 最后一条医嘱及最后一条父子医嘱，框选区域，不能下移
        let sindex = this.waitData.findIndex(val => { return val.id === this.waitDataObj[item.mainGroupId][this.waitDataObj[item.mainGroupId].length - 1].id })
        if ((sindex === this.waitData.length - 1) || this.startIndex < this.endIndex) {
          return false
        } else {
          return true
        }
      } else if (id === '3') {        // 组合医嘱
        // 右键在框选区域，可以组合医嘱（因为不能组合需要给出提示，所以不能组合的判断放在点击组合医嘱按钮之后）
        if (this.startIndex < this.endIndex && index >= this.startIndex && index <= this.endIndex) {
          return true
        } else {
          return false
        }
      } else if (id === '4') {        // 取消组合
        // 不框选 右键在父子医嘱上 或者只框选了父子医嘱 并且右键在父子医嘱上，可以取消组合
        if (item.mainFlag > 0) {
          let n = 0
          if (this.startIndex < this.endIndex) {
            let data = this.waitData.filter((v, m) => {
              return m >= this.startIndex && m <= this.endIndex
            })
            data.forEach(v => {
              let flag = objFind(this.waitDataObj[item.mainGroupId], { id: v.id })
              if (!flag && !n) {
                n++
              }
            })
          }
          // n 大于零 不显示 等于零  显示
          if (!n) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (id === '5') {        // 删除医嘱
        // 右键在框选区域外，可以删除
        if (this.startIndex < this.endIndex) {
          return false
        } else {
          return true
        }
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index, isWait }) {
      if (isWait) {
        this[item.methodName](this.waitData[index], index)
      } else {
        this.$refs.sendarea.contextSelect(item, index)
      }
    },
    // 框选回调
    dragSelect ({ startIndex, endIndex }) {
      this.startIndex = startIndex
      this.endIndex = endIndex
    },
    // 上移
    moveupChange (item, index) {
      this.updateWaitData(item, index, 'up')
    },
    // 下移
    movedowmChange (item, index) {
      this.updateWaitData(item, index, 'down')
    },
    // 组合医嘱
    getGroupAdvice (item, index) {
      let tempList = this.waitData.filter((v, n) => {
        return n >= this.startIndex && n <= this.endIndex
      })
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      let flag5 = false
      let ids = []
      tempList.forEach(m => {
        // 只能西药/中成药组合
        if (!['301', '302'].includes(m.serviceType) && !flag1) {
          flag1 = true
        }
        // 父子医嘱不能再次组合
        if (['301', '302'].includes(m.serviceType) && m.mainFlag && !flag2) {
          flag2 = true
        }
        // 包含相同的医嘱不能组合
        if (['301', '302'].includes(m.serviceType) && !flag3) {
          if (ids.includes(m.serviceId)) {
            flag3 = true
          } else {
            ids.push(m.serviceId)
          }
        }
        // 住院医生，组合医嘱时，不允许长期和临时医嘱组合
        if (['301', '302'].includes(m.serviceType) && !flag4 && this.visitType === 3) {
          if (tempList[0].termType !== m.termType) {
            flag4 = true
          }
        }
        // 库房不同，不能组合
        if (['301', '302'].includes(m.serviceType) && !flag5) {
          if (tempList[0].storageRoomId !== m.storageRoomId) {
            flag5 = true
          }
        }
      })
      if (flag1 || flag2) {
        return this.$messageTips(this, 'warning', '只允许未组合的【西药/中成药】进行组合医嘱', '提示')
      } else if (flag3) {
        return this.$messageTips(this, 'warning', '相同的医嘱不能进行组合', '提示')
      } else if (flag4) {
        return this.$messageTips(this, 'warning', '不允许长期医嘱和临时医嘱进行组合', '提示')
      } else if (flag5) {
        return this.$messageTips(this, 'warning', '库房不同，不能进行组合医嘱', '提示')
      } else {
        this.isDragCancel = true
        this.$confirm('组合医嘱时，系统将自动把子医嘱的频次、用法、天数等信息跟父医嘱保持一致，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isDragCancel = false
          this.updateWaitData(item, index, 'group')
        }).catch(() => {
          this.isDragCancel = false
        })
      }
    },
    // 取消组合
    cancelGroupAdvice (item, index) {
      this.updateWaitData(item, index, 'ungroup')
    },
    // 删除医嘱
    delWaitService (item, index, isEdit) {
      this.updateWaitData(item, index, 'delete', isEdit)
    },
    // 调整顺序，添加或取消父子医嘱，删除医嘱，更新待提交数据
    async updateWaitData (item, index, type, isEdit) {
      let params = []
      let tips = '修改成功'
      let curIndex = Object.keys(this.waitDataObj).findIndex(val => { return val === item.mainGroupId })
      if (type === 'up') {
        if (this.waitDataObj[item.mainGroupId] && this.waitDataObj[item.mainGroupId].length) {
          let preGroupId = Object.keys(this.waitDataObj)[curIndex - 1]
          let upSerialList = []
          this.waitDataObj[item.mainGroupId].forEach(v => {
            upSerialList.push(v.serialNumber)
            params.push({ id: v.id })
          })
          this.waitDataObj[preGroupId].forEach(m => {
            upSerialList.push(m.serialNumber)
            params.push({ id: m.id })
          })
          upSerialList = upSerialList.sort(function (a, b) {
            return a - b
          })
          params.forEach((n, k) => {
            n.serialNumber = upSerialList[k]
          })
        }
      } else if (type === 'down') {
        if (this.waitDataObj[item.mainGroupId] && this.waitDataObj[item.mainGroupId].length) {
          let nextGroupId = Object.keys(this.waitDataObj)[curIndex + 1]
          let downSerialList = []
          this.waitDataObj[nextGroupId].forEach(v => {
            downSerialList.push(v.serialNumber)
            params.push({ id: v.id })
          })
          this.waitDataObj[item.mainGroupId].forEach(m => {
            downSerialList.push(m.serialNumber)
            params.push({ id: m.id })
          })
          downSerialList = downSerialList.sort(function (a, b) {
            return a - b
          })
          params.forEach((n, k) => {
            n.serialNumber = downSerialList[k]
          })
        }
      } else if (type === 'group') {
        for (let i = this.startIndex; i < this.endIndex + 1; i++) {
          if (i === this.startIndex) {
            params.push({
              id: this.waitData[i].id,
              mainFlag: 1
            })
          } else {
            let mainAdvice = this.waitData[this.startIndex]
            let mainAdviceJson = mainAdvice.adviceJson
            let childAdvice = this.waitData[i]
            let obj = {
              id: childAdvice.id,
              mainFlag: 2,
              mainGroupId: mainAdvice.mainGroupId,
              employ: mainAdvice.employ,
              useFreq: mainAdvice.useFreq,
              useDay: mainAdvice.useDay,
              source: mainAdvice.source,
              // storageRoomId: mainAdvice.storageRoomId,
              executeProviderId: mainAdvice.executeProviderId,
              executeNumber: mainAdvice.executeNumber,
              sendOrgId: mainAdvice.sendOrgId,
              count: 1
            }
            if (mainAdvice.startTime) {
              obj.startTime = mainAdvice.startTime
            }
            if (mainAdvice.useFreqTime) {
              obj.useFreqTime = mainAdvice.useFreqTime
            }
            obj.adviceJson = Object.assign({}, childAdvice.adviceJson, {
              employName: mainAdviceJson.employName,
              useFreqName: mainAdviceJson.useFreqName,
              executeProviderName: mainAdviceJson.executeProviderName,
              sendOrgName: mainAdviceJson.sendOrgName,
              dropSpeed: mainAdviceJson.dropSpeed
            })
            // obj.adviceJson = childAdvice.adviceJson
            // obj.adviceJson.employName = mainAdvice.employName
            // obj.adviceJson.useFreqName = mainAdvice.useFreqName
            // obj.adviceJson.storageRoomName = mainAdvice.storageRoomName
            // obj.adviceJson.executeProviderName = mainAdvice.executeProviderName
            // obj.adviceJson.sendOrgName = mainAdvice.sendOrgName
            let freqValue = await this.recipeapi.getUsefreqList()
            let oldValue = objFind(freqValue.data, { id: childAdvice.useFreq }) ? objFind(freqValue.data, { id: childAdvice.useFreq }).num : 1
            let oldRatio = childAdvice.count / (oldValue * (childAdvice.useDay || 1))
            let newValue = objFind(freqValue.data, { id: obj.useFreq }) ? objFind(freqValue.data, { id: obj.useFreq }).num : 1
            obj.count = Math.ceil(oldRatio * newValue * (obj.useDay || 1))
            let doctorAdviceContent = []
            obj.adviceJson.employName && doctorAdviceContent.push(obj.adviceJson.employName)
            doctorAdviceContent.push('每次 ' + (childAdvice.measure || '') + (childAdvice.adviceJson.measureUnitName || ''))
            obj.useDay && doctorAdviceContent.push('用 ' + obj.useDay + ' 天')
            obj.adviceJson.useFreqName && doctorAdviceContent.push(obj.adviceJson.useFreqName)
            if (this.visitType === 3) {
              doctorAdviceContent.push('领' + (obj.count || 0) + (childAdvice.adviceJson.countUnitName || ''))
            }
            if (this.visitType === 1) {
              doctorAdviceContent.push('共' + (obj.count || 0) + (childAdvice.adviceJson.countUnitName || ''))
            }
            obj.adviceJson.doctorAdviceContent = doctorAdviceContent.filter(v => v).join(' , ')
            obj.adviceFeesDtoList = childAdvice.adviceFeesDtoList.map(v => {
              if (Number(v.feesType) === 1) {
                v.count = obj.count
              }
              return v
            })
            params.push(obj)
          }
        }
      } else if (type === 'ungroup') {
        // 获取当前父子医嘱的条数
        let n0 = this.waitDataObj[item.mainGroupId] && this.waitDataObj[item.mainGroupId].length
        // 获取当前父子医嘱的父医嘱的index值
        let m0 = this.waitData.findIndex(value => { return value.id === this.waitDataObj[item.mainGroupId][0].id })
        for (let i = m0; i < m0 + n0; i++) {
          let obj = {
            id: this.waitData[i].id,
            mainFlag: 0
          }
          if (i !== m0) {
            obj.mainGroupId = this.getUUId()
          }
          params.push(obj)
        }
      } else if (type === 'delete') {
        if (this.waitDataObj[item.mainGroupId] && this.waitDataObj[item.mainGroupId].length) {
          this.waitDataObj[item.mainGroupId].forEach(val => {
            params.push({
              id: val.id,
              delFlag: 1, // delFlag: 是否删除：0、否；1、是
              adviceFeesDtoList: val.adviceFeesDtoList && val.adviceFeesDtoList.map(fee => {
                return {
                  id: fee.id,
                  delFlag: 1
                }
              }) || []
            })
          })
          tips = '删除成功'
        }
      }
      if (!params.length) return false
      await this.setTicketCode()
      await this.updateDoctorAdvice(params, tips, isEdit)
      // 接口返回成功后，页面数据处理
      this.getWaitData()
    },
    // 调用更新医嘱接口
    async updateDoctorAdvice (params, tips, isEdit) {
      let res = await this.recipeapi.updateDoctorAdvice(params)
      if (res && res.head && !res.head.errCode) {
        if (!isEdit) {
          this.startIndex = 0
          this.endIndex = 0
          this.$messageTips(this, 'success', tips, '提示')
        }
      } else {
        return false
      }
    },
    // 获取uuid
    getUUId () {
      return uuid()
    },
    // 获取最新x-ticket-code并保存
    setTicketCode () {
      this.adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && this.storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    }
  },
  computed: {
    waitDataObj () {
      let obj = {}
      this.waitData.forEach(v => {
        if (obj[v.mainGroupId]) {
          obj[v.mainGroupId].push(v)
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      return obj
    }
  },
  watch: {
  }
}
