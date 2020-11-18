import storage from '@/util/storage'
let treeSort = 0
let nodesMap = {}
/**
 * 将数组转换为树
 */
export function convertListToTree (array) {
  const list = []
  treeSort = 0
  nodesMap = {}
  for (const item of array) {
    if (isRoot(item, array)) {
      treeSort++
      item._parent = null
      item._level = 1
      item._sort = treeSort
      nodesMap[item.id] = item
      const children = getChildren(item, array)
      if (children.length > 0) {
        item.children = children
        item._isLeaf = false
      } else {
        item._isLeaf = true
      }
      list.push(item)
    }
  }
  return list
}

/**
 * 判断节点是否为根
 */
function isRoot (item, array) {
  if (item.parentId) {
    for (const a of array) {
      if (a.id === item.parentId) {
        return false
      }
    }
  }
  return true
}

/**
 * 获取所有的子元素
 */
export function getChildren (item, array) {
  const children = []
  for (const data of array) {
    if (item.id === data.parentId) {
      treeSort++
      data._parent = item
      data._level = item._level + 1
      data._sort = treeSort
      nodesMap[data.id] = data
      const _children = getChildren(data, array)
      if (_children.length > 0) {
        data.children = _children
        data._isLeaf = false
      } else {
        data._isLeaf = true
      }
      children.push(data)
    }
  }
  return children
}
export function convertTreeToList (tree) {
  const list = []
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    list.push(item)
    if (item.children && item.children.length) {
      Array.prototype.push.apply(list, convertTreeToList(item.children))
    }
  }
  return list
}
/* 将数组转换为可以被转换成树的数组 */
export function changeToTreeList (list, options = {}) {
  if (!list || !Array.isArray(list)) {
    return []
  }
  /* 注意：这里根据后端数据结构的要求 默认将 code parentCode 作为关系值 */
  return list.map(item => {
    item._id = item._id || item.id
    const value = item[options.value || 'id'] || item._id
    delete item.id
    return {
      ...item,
      label: item[options.label || 'name'],
      value,
      id: item[options.id || 'code'],
      parentId: item[options.parentId || 'parentCode'],
    }
  })
}
export function getParentById (list, id) {
  const crt = list.find(item => item.id === id)
  if (crt) {
    const parent = list.find(item => item.id === crt.parentId)
    if (parent) {
      return parent
    }
  }
  return null
}

export function getAllParentById (list, id, parents = []) {
  const parent = getParentById(list, id)
  if (parent) {
    parents.unshift(parent)
    const paParent = getParentById(list, parent.id)
    if (paParent) {
      return getAllParentById(list, parent.id, parents)
    }
  }
  return parents
}
export function getAllParentId (list, id) {
  return getAllParentById(list, id).map(item => item.id)
}
export function getAllChildrenById (list, id) {
  const children = []
  for (const data of list) {
    if (id === data.parentId) {
      const childList = getAllChildrenById(list, data.id)
      if (childList.length) {
        children.push(...childList)
      }
      children.push(data)
    }
  }
  return children
}
export function getNodeByName (tree, name, key = 'name') {
  for (const node of tree) {
    if (node[key].includes(name)) {
      return node
    } else {
      if (node.children && node.children.length) {
        const found = getNodeByName(node.children, name, key)
        if (found) {
          return found
        }
      }
    }
  }
}
export function getNodesMap () {
  return nodesMap
}
// 根据（数组， id）获取节点
export function getNodeByList (list, idList) {
  convertListToTree(list)
  if (typeof idList === 'string') {
    idList = [idList]
  }
  const nodeList = idList.map(id => nodesMap[id])
  return typeof idList === 'string' ? nodeList[0] : nodeList
}
// 根据（树， id）获取节点
export function getNode (tree, idList) {
  if (typeof idList === 'string') {
    idList = [idList]
  }
  const nodeList = idList.map(id => nodesMap[id])
  return typeof idList === 'string' ? nodeList[0] : nodeList
}
// 将list 按照 tree 的顺序进行排序
export function sortListByTree (tree, list, key = 'bedId') {
  const result = []
  // 在树中依次查找 list 中存在的值，先找到的 先放入 result 这样 就给 list 重新排序了
  for (let a = 0; a < tree.length; a++) {
    const node1 = tree[a]
    if (node1.children && node1.children.length) {
      for (let b = 0; b < node1.children.length; b++) {
        const node2 = node1.children[b]
        if (node2.children && node2.children.length) {
          for (let c = 0; c < node2.children.length; c++) {
            const node3 = node2.children[c]
            if (node3.children && node3.children.length) {
              for (let d = 0; d < node3.children.length; d++) {
                const node4 = node3.children[d]
                const res = list.find(item => (item[key] || item) === node4.id)
                if (res) {
                  result.push(res)
                }
              }
            }
          }
        }
      }
    }
  }
  return result
}
// 将 sortData 按照 list 形成的树 进行排序
export function sortTreeList (list, sortData, options) {
  const sortList = sortData.map(item => ({...item, id: item[options.id]}))
  const sortedList = getNodeByList(list, sortList.map(item => item.id)).sort((a, b) => a._sort - b._sort)
  return sortedList.map(item => sortData.find(data => data[options.id] === item.id))
}
export function sortTreeListByIdList (list, sortIdList) {
  return getNodeByList(list, sortIdList).sort((a, b) => a._sort - b._sort)
}

/* 获取更新后的结构数据 */
export function getUpdatedStruct (list, draggingNode, dropNode, dropType, field) {
  const id = draggingNode.data._id
  // 原始的code
  const oldCode = draggingNode.data[field]
  // 新的code
  let code = dropNode.data[field]
  if (dropType === 'inner') {
    code = dropNode.data.id
  }
  const subject = list.find(item => item.id === id)
  if (subject) {
    subject[field] = code
    if (oldCode === code) {
      list = list.filter(item => item.id !== id)
    }
  } else {
    list.push({id: id, [field]: code})
  }
  return list
}
function getSimpleObj (obj, includes = [], excludes = []) {
  if (includes.length === 0 && excludes.length === 0) return obj
  if (typeof includes === 'string') { includes = [includes] }
  if (typeof excludes === 'string') { excludes = [excludes] }
  const newObj = {}
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (includes.length) {
        if (includes.includes(p)) {
          newObj[p] = obj[p]
        }
      } else if (excludes.length) {
        if (!excludes.includes(p)) {
          newObj[p] = obj[p]
        }
      }
    }
  }
  return newObj
}
export function getObjByIncludes (obj, includes) {
  return getSimpleObj(obj, includes)
}
export function getObjByExcludes (obj, excludes) {
  return getSimpleObj(obj, [], excludes)
}
export function getObjNoTreeFields (obj) {
  return getObjByExcludes(obj, ['children', '_id', '_isLeaf', '_level', '_parent', 'id', 'parentId', 'label', 'value'])
}
export function getSearchId () {
  // 当前页面是机构管理工作站，则使用当前登录人所在机构的 id 作为条件，否则使用集团 id 作为条件
  if (isWarehouse()) {
    return storage.getStorageByClinic('CLINICID')
  } else if (isManages()) {
    return storage.getLocalStorage('TENANTID')
  }
}
export function isManages () {
  // return this.$route.path.includes('/manages/index')
  return window.location.href.includes('/manages/index.html')
}
export function isWarehouse () {
  // return this.$route.path.includes('/warehouse/index')
  return window.location.href.includes('/warehouse/index.html')
}
export function getCrtPath () {
  if (isWarehouse()) {
    return '/warehouse'
  } else if (isManages()) {
    return '/manages'
  }
}
export function mixin (a, b) {
  return a.map(ai => b.map(bi => ai + bi)).reduce((pi, ci) => [...pi, ...ci], [])
}
export function isNotEmpty (val) {
  return val && JSON.stringify(val) !== '{}' && JSON.stringify(val) !== '[]'
}
export function calcCount (str, c = '.') {
  let count = 0
  str.split('').forEach(item => {
    if (item === c) {
      count++
    }
  })
  return count
}
export function convertSingleFieldListToTree (list, field = 'code', splitStr = '.') {
  let treeList = list.map(item => {
    if (item.code.includes(splitStr)) {
      return {
        ...item,
        parentCode: item.code.slice(0, item.code.lastIndexOf(splitStr))
      }
    } else {
      return {
        ...item,
        parentCode: ''
      }
    }
  })
  return convertListToTree(changeToTreeList(treeList, {id: 'code', value: 'code'}))
}

