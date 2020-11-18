<template>
  <span class="cell-span" :class="customCellClz">
    <!--显示type为undefined的内容 即正常内容，和可以通过formatter简单格式化的内容-->
    <template v-if="!col.type || (col.type === 'component' && col.component)">
      <ever-table-cell-content :scope="scope" :col="col" :content="getCellContent(scope, col)"
                               @eventChange="onClickHandle"></ever-table-cell-content>
    </template>
    <!--显示type有值的内容 -->
    <!--显示纯btns-->
    <template v-else-if="col.type === 'btns' && col.btns">
      <span class="ever-table-btn-col">
        <template v-for="(btn, index) of getBtns(scope, col).slice(0, maxBtnCount)">
          <!--根据按钮的属性确定按钮的特殊操作-->
          <ever-confirm
            v-if="btn.prop === 'del' || btn === 'del'"
            :class="index === 0 ? '' : 'ml5'"
            :msg="btn.desc || '确定执行删除操作吗？'"
            :action="getBtnText(btn) || '删除'"
            :disabled="btn.disabled"
            :placement="'left'"
            @confirm="onClickHandle(col, btn, scope.row, '', '', scope)"></ever-confirm>
          <el-button
            v-else-if="index < (maxBtnCount - 1) || (index === (maxBtnCount - 1) && getBtns(scope, col).length === maxBtnCount)"
            :class="(index === 0 ? '' : 'ml5 ') + getBtnClassName(btn)"
            :key="index"
            size="small"
            :type="getBtnType(btn)"
            :disabled="btn.disabled"
            @click="onClickHandle(col, btn, scope.row, '', '', scope)"
          >{{getBtnText(btn)}}
          </el-button>
        </template>
        <template v-if="getBtns(scope, col).length > maxBtnCount">
          <el-dropdown trigger="click" @command="onClickHandle(col, $event, scope.row, '', '', scope)">
            <span class="el-dropdown-link cp">
              更多<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="table-button-menu">
              <el-dropdown-item
                v-for="(btn, index) of getBtns(scope, col).slice(maxBtnCount - 1)"
                :key="index"
                :command="btn.prop || btn"
                :disabled="btn.disabled"
              >{{getBtnText(btn)}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!--          上传文件的按钮-->
        <template v-if="getUploadBtns(scope, col).length">
          <ever-upload v-for="(uploadItem, uploadItemIndex) of getUploadBtns(scope, col)"
                       :key="uploadItem.prop"
                       :ref="uploadItem.ref || ('tableUpload' + uploadItemIndex)"
                       class="ever-table-upload"
                       hidden
                       :upload-attrs="uploadItem.uploadAttrs"></ever-upload>
        </template>
      </span>
    </template>
    <template v-else-if="col.type === 'link' && (col.linkRoot || col.urlFormatter)">
      <a :href="'#' + getLink(col, scope.row)" v-if="getCellContent(scope, col) !== getDefaultCellValue(col)"
         @click="onClickHandle(col, '_link', scope.row, getLink(col, scope.row), '', scope)">
        <ever-table-cell-content :scope="scope" :col="col" :content="getCellContent(scope, col)"
                                 @eventChange="onClickHandle"></ever-table-cell-content>
      </a>
      <template v-else>{{getDefaultCellValue(col)}}</template>
    </template>
    <template v-else-if="col.type === 'eventText' && col.event">
      <a v-if="getCellContent(scope, col) !== getDefaultCellValue(col)"
         @click="onClickHandle(col, col.event.prop || col.event, scope.row, '', '', scope)">
        <ever-table-cell-content :scope="scope" :col="col" :content="getCellContent(scope, col)"
                                 @eventChange="onClickHandle"></ever-table-cell-content>
      </a>
      <template v-else>{{getDefaultCellValue(col)}}</template>
    </template>
  </span>
</template>

<script>
import everTableCellContent from './evertablecellcontent.vue'
import everUpload from '@/components/ever-upload'

const defaultCellValue = '--'
// 内置默认按钮映射关系
const btnTextMap = {
  edit: { name: '编辑', type: 'primary' },
  del: { name: '删除', type: 'danger' },
}
const getSafeUrl = url => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
export default {
  components: { everTableCellContent, everUpload },
  props: ['scope', 'col', 'primaryKey', 'tableDefaultCellValue', 'maxBtnCount'],
  data () {
    return {
      defaultCellValue,
    }
  },
  computed: {
    customCellClz () {
      const classObj = {}
      if (this.col.customCellSpanClassFormatter) {
        let customCellClass = this.col.customCellSpanClassFormatter
        if (typeof this.col.customCellSpanClassFormatter === 'function') {
          customCellClass = this.col.customCellSpanClassFormatter({
            value: this.scope.row[this.col.prop],
            row: this.scope.row,
            col: this.col,
          })
        }
        customCellClass.split(' ').forEach(key => {
          classObj[key] = true
        })
      }
      return classObj
    },
  },
  methods: {
    /* 根据默认的按钮映射关系获取按钮的类型 */
    getBtnType (btn) {
      const defaultBtn = btnTextMap[btn.prop || btn]
      if (btn.type) {
        return btn.type
      } else if (defaultBtn) {
        return defaultBtn.type
      } else {
        return 'primary'
      }
    },
    /* 根据默认的按钮映射关系获取按钮的文本 */
    getBtnText (btn) {
      return btn.label || btnTextMap[btn.prop || btn].name
    },
    getBtnClassName (btn) {
      return 'ever-' + this.getBtnType(btn) + '-btn ' + (btn.className || '')
    },
    /* 获取当前link的url */
    getLink (col, row) {
      if (col.urlFormatter) {
        // 按照给定的格式化方法拼接
        return typeof col.urlFormatter === 'function' ? col.urlFormatter({ row, col }) : col.urlFormatter
      } else {
        // 按照默认方式拼接
        return `${getSafeUrl(col.linkRoot || '')}/${row[this.primaryKey]}`
      }
    },
    getBtns ({ row }, col) {
      if (typeof col.btns === 'function') {
        return col.btns({ row, col }).filter(item => !item.hidden)
      } else {
        return col.btns.filter(item => !item.hidden)
      }
    },
    /* 处理点击事件 */
    onClickHandle (col, event, row, linkPath, target, scope) {
      // 如果点击的是上传按钮，则进行上传
      const btn = col.btns && typeof event === 'string' ? this.getBtns({ row }, col).find(btn => btn.prop === event || btn === event) : event
      if (btn && btn.upload) {
        const ref = btn.ref || ('tableUpload' + this.getUploadBtns({ row }, col).findIndex(item => item.prop === btn.prop))
        // 找到上传按钮，并触发之
        this.$refs[ref][0].$refs.upload.$el.querySelector('button').click()
      }
      this.$emit('eventChange', { col, prop: (event.prop || event), row, linkPath, target, scope })
    },
    /* 计算单元格显示的内容 */
    /* 根据columns中的formatter函数获取要显示的内容 */
    getCellContent ({ row, $index }, col) {
      if (col.formatter) {
        return this.getDefaultFormatter(col.formatter({ value: row[col.prop], row, $index, col }), col)
      } else {
        return this.getDefaultFormatter(row[col.prop], col)
      }
    },
    /* 将undefined null ''转化为 this.defaultCellValue */
    getDefaultFormatter (value, col) {
      if (value === undefined || value === null || value === '' || value === 'null' || value === 'undefined') {
        return this.getDefaultCellValue(col)
      }
      return value
    },
    getDefaultCellValue (col) {
      return 'defaultCellValue' in col ? col.defaultCellValue : (this.tableDefaultCellValue === undefined ? this.defaultCellValue : this.tableDefaultCellValue)
    },
    getUploadBtns ({ row }, col) {
      return this.getBtns({ row }, col).filter(btn => btn.upload)
    },
  },
}
</script>

<style scoped lang="less">
.cp {
  cursor: pointer;
}
</style>
