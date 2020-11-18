import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'
import muduleCtrl from './moduleCtrl'

export default {
  mixins: [ muduleCtrl ],
  props: {
    editData: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      hasEdit: false
    }
  },
  created () {
    if (this.editData.id) {
      console.log(this.editData)
      this._echoData(this.editData)
    }
  },
  methods: {
    sureEdit () {
      let id = this.editData ? this.editData.id : ''
      let moduleData = this._getModuleData(id)
      // 校验标题
      if (moduleData.data.showTitle === moduleShowTtitle.show) {
        if (!moduleData.data.title) {
          this.$message.warning('请输入模块标题')
          return
        }
      }
      // 校验各个模块的数据
      // 轮播图模块
      if (moduleData.type === homeSection.carousel) {
        for (let i = 0; i < moduleData.data.moduleArr.length; i++) {
          let item = moduleData.data.moduleArr[i]
          for (let key in item) {
            if (key === 'goPathName') continue
            if (!item[key]) {
              this.$message.warning('请确认每个轮播图信息完整')
              return false
            }
          }
        }
      }
      // 专家墙模块
      if (moduleData.type === homeSection.doctorWall) {
        if (moduleData.data.moduleArr.length === 0) {
          this.$message.warning('请至少添加一个医生')
          return false
        }
      }
      // 专家墙模块
      if (moduleData.type === homeSection.doctorRecom) {
        if (moduleData.data.moduleArr.length === 0) {
          this.$message.warning('请至少添加一个医生')
          return false
        }
      }
      console.log(moduleData)
      this.$emit('sureEdit', moduleData)
    },
    sureDel () {
      this.$confirm('您确认删除“' + this.moduleName + '”模块及全部内容吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('sureDel', this.editData)
      }).catch(() => { })
    },
    sureClose () {
      if (this._hasEdit()) {
        this.$confirm('您修改的信息尚未保存，是否保存', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sureEdit()
        }).catch(() => {
          this.$emit('sureClose')
        })
      } else {
        this.$emit('sureClose')
      }
    },
    _setModuleInfo (module, moduleName) {
      this.module = module
      this.moduleName = moduleName
    },
    _getModuleData (id) {
      let data = JSON.parse(JSON.stringify(this.commonData))
      return {
        id: id || String(+new Date()), // 时间戳
        type: this.module,
        showH5: this.showH5,
        showMp: this.showMp,
        data: data
      }
    },
    _echoData (editData) {
      this.showMp = editData.showMp
      this.showH5 = editData.showH5
      this.commonData = JSON.parse(JSON.stringify(editData.data))
    },
    _edit () {
      this.hasEdit = true
    },
    _hasEdit () {
      return this.hasEdit
    }
  }
}
