import { everprint } from '@/util/print'

let printArray = []
let codeKey = 'code'
let finished = true

// 打印方法
export function printRecipe (event) {
  let toPrint = printArray.shift()
  if (toPrint) {
    finished = false
    everprint(toPrint.code, toPrint.params, {
      eventCb: (type) => {
        console.log('>>>>> 打印回调状态', type)
        // 打印回调队列
        // 打印成功 或者 其他事件操作 会执行cb
        if (type === 'window-close') {
          printRecipe()
        }
      },
      preview: toPrint.printParams.preview,
      cb: _ => {
        console.log(_, '打印完成')
        toPrint.printParams.cb && toPrint.printParams.cb()
        printRecipe()
      },
      lang: '01',
      printFrom: toPrint.printParams.printFrom
    })
  } else {
    finished = true
  }
}

// 单张单子打印
export function singlePrint (code, params, printParams) {
  printArray = []
  printArray.push({
    code,
    params,
    printParams: {
      preview: printParams && printParams.preview || true,
      printFrom: printParams && printParams.printFrom || false,
      cb: printParams && printParams.cb
    }
  })
  printRecipe()
}

// 多张单子打印
export function mutiplePrint (array) {
  printArray = []
  array.forEach(v => {
    printArray.push({
      code: v.code,
      params: v.params,
      printParams: Object.assign({
        preview: true
      }, v.printParams)
    })
  })
  printRecipe()
}

// 根据不同机构的打印配置，重新组装数据
export function getPrintData (data, configList, index) {
  let list = []
  let curConfig = typeof index === 'number' ? [configList[index]] : configList
  curConfig.forEach(config => {
    data.forEach(item => {
      if (config.config && Object.keys(config.config).length) {
        let n = 0
        Object.keys(config.config).forEach(type => {
          if (type.split('_')[0] === 'no') {
            if (!config.config[type].includes(item[type.split('_')[1]])) {
              n++
            }
          } else {
            if (config.config[type].includes(item[type])) {
              n++
            }
          }
        })
        if (n && n === Object.keys(config.config).length) {
          list.push(item)
        }
      }
    })
  })
  return list
}

// 最新打印逻辑，根据配置解析
export function newPrintEvent (data, configList, baseInfo, organizationId, preview, index, ispersonal) {
  if (ispersonal) {
    codeKey = 'codeP'
  } else {
    codeKey = 'code'
  }
  if (!ispersonal) {
    printArray = []
    finished = true
  }
  let curConfig = typeof index === 'number' ? [configList[index]] : configList
  curConfig.forEach(config => {
    if (!config.children) {
      getPrintArray(config, baseInfo, data, organizationId, preview)
    } else {
      config.children.forEach(val => {
        getPrintArray(val, baseInfo, data, organizationId, preview)
      })
    }
  })
  console.log(JSON.parse(JSON.stringify(printArray)), 'printArray ', finished)
  if (finished) printRecipe()
}

// 解析配置，处理打印参数
export function getPrintArray (obj, baseInfo, data, organizationId, preview) {
  let recipeIdsObj = {allRecipe: []}
  let recipeIds = [] // 用于多个处方一起打印
  let doctorAdviceIds = {allDoctorAdvice: []}
  let serviceTypes = {allRecipe: [], allDoctorAdvice: []}
  data.forEach(item => {
    let n = 0
    Object.keys(obj.config).forEach(type => {
      if (type.split('_')[0] === 'no') {
        if (!obj.config[type].includes(item[type.split('_')[1]])) {
          n++
        }
      } else {
        if (obj.config[type].includes(item[type])) {
          n++
        }
      }
    })
    if (n && n === Object.keys(obj.config).length) {
      if (obj.isRecipe) {
        if (obj.filter && !Array.isArray(obj.filter)) {
          if (recipeIdsObj['single' + item.recipeId]) {
            if (!recipeIdsObj['single' + item.recipeId].includes(item.recipeId)) {
              recipeIdsObj['single' + item.recipeId].push(item.recipeId)
            }
          } else {
            recipeIds.push(item.recipeId)
            recipeIdsObj['single' + item.recipeId] = [item.recipeId]
          }
          if (serviceTypes['single' + item.recipeId]) {
            if (!serviceTypes['single' + item.recipeId].includes(item.serviceType)) {
              serviceTypes['single' + item.recipeId].push(item.serviceType)
            }
          } else {
            serviceTypes['single' + item.recipeId] = [item.serviceType]
          }
        } else if (obj.filter && Array.isArray(obj.filter) && obj.filter.length) {
          obj.filter.forEach(v => {
            if (recipeIdsObj[v + item[v]]) {
              if (!recipeIdsObj[v + item[v]].includes(item.recipeId)) recipeIdsObj[v + item[v]].push(item.recipeId)
              if (!serviceTypes[v + item[v]].includes(item.serviceType)) serviceTypes[v + item[v]].push(item.serviceType)
            } else {
              recipeIds.push(item.recipeId)
              recipeIdsObj[v + item[v]] = [item.recipeId]
              serviceTypes[v + item[v]] = [item.serviceType]
            }
          })
        } else {
          if (!recipeIdsObj.allRecipe.includes(item.recipeId)) recipeIdsObj.allRecipe.push(item.recipeId)
          if (!serviceTypes.allRecipe.includes(item.serviceType)) serviceTypes.allRecipe.push(item.serviceType)
        }
      } else {
        if (obj.filter && !Array.isArray(obj.filter)) {
          doctorAdviceIds['single' + item.id] = [item.id]
          serviceTypes['single' + item.id] = [item.serviceType]
        } else if (obj.filter && Array.isArray(obj.filter) && obj.filter.length) {
          obj.filter.forEach(v => {
            if (doctorAdviceIds[v + item[v]]) {
              if (!doctorAdviceIds[v + item[v]].includes(item.id)) doctorAdviceIds[v + item[v]].push(item.id)
              if (!serviceTypes[v + item[v]].includes(item.serviceType)) serviceTypes[v + item[v]].push(item.serviceType)
            } else {
              doctorAdviceIds[v + item[v]] = [item.id]
              serviceTypes[v + item[v]] = [item.serviceType]
            }
          })
        } else {
          if (!doctorAdviceIds.allDoctorAdvice.includes(item.id)) doctorAdviceIds.allDoctorAdvice.push(item.id)
          if (!serviceTypes.allDoctorAdvice.includes(item.serviceType)) serviceTypes.allDoctorAdvice.push(item.serviceType)
        }
      }
    }
  })
  setPrintArray(recipeIdsObj, serviceTypes, obj, baseInfo, organizationId, 'recipeIds', preview, recipeIds)
  setPrintArray(doctorAdviceIds, serviceTypes, obj, baseInfo, organizationId, 'doctorAdviceIds', preview)
}

// 组装打印参数
export function setPrintArray (idsObj, typesObj, obj, baseInfo, organizationId, str, preview, recipeIds) {
  if (str === 'recipeIds' && !['CHU_FANG_DAN_ZY', 'MZ_CPOE_CHU_FANG_DAN_ZY_DF'].includes(obj[codeKey])) {
    if (!recipeIds.length) return
    let printObj = {
      code: obj[codeKey],
      params: {
        visitNumber: baseInfo.visitSn,
        visitNumbers: [baseInfo.visitSn],
        patientId: baseInfo.patientId,
        recipeIds
      },
      printParams: {
        preview: preview
      }
    }
    printArray.push(printObj)
    return
  }
  Object.keys(idsObj).forEach(v => {
    if (idsObj[v].length) {
      let printObj = {
        code: obj[codeKey],
        params: {
          visitNumber: baseInfo.visitSn,
          patientId: baseInfo.patientId,
          serviceTypes: typesObj[v],
          ids: [organizationId],     // 卓正版需要的字段
          code: 'yi_liao_bei_jing',  // 卓正版需要的字段
          dptId: baseInfo.dptId,     // 卓正版需要的字段
          visitId: baseInfo.visitSn  // 卓正版需要的字段
        },
        printParams: {
          preview: preview
        }
      }
      printObj.params[str] = idsObj[v]
      printArray.push(printObj)
    }
  })
}
