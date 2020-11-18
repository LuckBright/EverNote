import { request } from '@/util/req'
class MedicalRecord {
  constructor (vueInstance, data) {
    this.$vue = vueInstance
    this.recordData = data
  }
  checkDocData (checked) {
    // true的时候需要校验编辑器的内容

  }
  async add (url, params, callback) { // 新建和暂存一个接口？
    // this._checkDocData(false)
    let addRes = await request(url, params)
    if (addRes.head && addRes.head.errCode === 0) {
      console.log('暂存成功')
      callback(addRes.data)
    }
  }
  async edit (url, params, callback) {
    // this._checkDocData(true)
    let editRes = await request(url, params)
    if (editRes.head && editRes.head.errCode === 0) {
      console.log('保存成功')
      callback(editRes.data)
    }
  }
  delete (url) {
    // this.operateRecord.delete(urlMap.medicalRecord.deleteInstance)
    this.$vue.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      request(url, {
        id: this.recordData.id
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$vue.$emit('deleteSuccess', this.recordData.id)
          this.$vue.$messageTips(this.$vue, 'success', '删除成功', '提示')
        }
      })
    })
  }
  get () {

  }
}

export {
  MedicalRecord
}
