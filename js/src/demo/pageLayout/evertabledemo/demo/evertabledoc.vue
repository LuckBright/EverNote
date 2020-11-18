<template>
  <div>
    <h3>文档</h3>
    <p class="demo-desc">api相比el-table要少，如果有任何需求在ever-table上无法完成，可以直接来找fuyongbo@everjiankang.com</p>
    <h4>表格属性和事件</h4>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
    ></ever-table>
    <h4>columns属性</h4>
    <ever-table
      :columns="columns"
      :data="colTableData"
      :is-record-url-params="false"
    ></ever-table>
  </div>
</template>

<script>
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data: function () {
    return {
      tableClass: '', // 控制表格样式 使用空格分隔多种样式的合并
      columns,
      tableData: [
        {
          id: U(),
          param: 'columns',
          description: '显示的列，具体配置见下文',
          type: 'array',
          required: true
        },
        {
          id: U(),
          param: 'url',
          description: '数据来源，url为urls.js中都值，如果传了url和data，则data会被忽略',
          type: 'object/string',
        },
        {
          id: U(),
          param: 'params',
          description: 'url请求都参数，参数可以用_uuid属性强制触发刷新，若加上.sync修饰符，则会自动将url的值赋值给表单queryobj，参考fixedheadertable.vue',
          type: 'object',
        },
        {
          id: U(),
          param: 'method',
          description: '请求方式，默认为post',
          type: 'string',
        },
        {
          id: U(),
          param: 'row-key',
          description: '树状数据所需key，默认为id',
          type: 'string',
        },
        {
          id: U(),
          param: 'data',
          description: '显示的数据，如果数据来源是在ever-table外部，则可以使用该属性',
          type: 'array',
        },
        {
          id: U(),
          param: 'is-pagination',
          description: '是否分页，默认为true',
          type: 'boolean',
        },
        {
          id: U(),
          param: 'pagination-attr',
          description: '分页配置，参考element的el-pagination',
          type: 'object',
        },
        {
          id: U(),
          param: 'table-class',
          description: '控制表格样式，使用空格分隔，ever-table内置了许多类名可供选择，可以参考example-table查看效果，若使用其他值，则需要自定义样式',
          type: 'string',
        },
        {
          id: U(),
          param: 'border',
          description: '与element的el-table保持一致',
          type: 'boolean',
          default: 'false',
        },
        {
          id: U(),
          param: 'is-single-table',
          description: '是否为单选表格，为true时，点击行时会出现选中效果，可以在ref中的currentRow属性获取选中的数据，参考example-table',
          type: 'boolean',
          default: 'false'
        },
        {
          id: U(),
          param: 'is-drag-table',
          description: '表格的列是否可拖拽，如果传了config-option，则该值会被忽略，参考config-table',
          type: 'boolean',
          default: 'false'
        },
        {
          id: U(),
          param: 'show-checkbox',
          description: '是否显示checkbox，为true时显示checkbox，可以在ref中的multipleSelection属性获取选中的数据，参考multiple-table',
          type: 'boolean',
          default: 'false'
        },
        {
          id: U(),
          param: 'primary-key',
          description: '当前表格的主键，如未指定，则会依次尝试将\'id\', \'code\', \'name\'这三个prop作为主键，一般表格都有id，所以大多数情况不用传',
          type: 'string',
          default: '依次尝试id code name',
        },
        {
          id: U(),
          param: 'special-cell-config',
          description: '单元格样式配置，是el-table中的cell-class-name的简化，具体用法参考config-table',
          type: 'array/object',
        },
        {
          id: U(),
          param: 'config-option',
          description: '对于需要进行列配置的表格，需要使用此配置项，具体用法参考config-table',
          type: 'object',
        },
        {
          id: U(),
          param: 'height',
          description: '表格的高度',
          type: 'number',
        },
        {
          id: U(),
          param: 'max-height',
          description: '表格的最大高度',
          type: 'number',
        },
        {
          id: U(),
          param: 'row-class-name',
          description: '行类名与el-table一致',
          type: 'Function({row})',
        },
        {
          id: U(),
          param: 'cell-class-name',
          description: '单元格类名与el-table一致',
          type: 'Function({row, column})',
        },
        {
          id: U(),
          param: 'header-cell-class-name',
          description: '单元格表头类名与el-table一致',
          type: 'Function({column})',
        },
        {
          id: U(),
          param: 'is-auto-height',
          description: '是否启用自动计算表格高度，启用之后，表格高度会自动撑满屏幕，默认为false',
          type: 'boolean',
        },
        {
          id: U(),
          param: 'fixed-height',
          description: '如果自动计算高度不能满足当前页面的需求，则可以使用该属性，告诉ever-table需要减去多少高度，才能自动撑满页面',
          type: 'number',
        },
        {
          id: U(),
          param: 'fixed-height-type',
          description: '与fixed-height作用相同，type为内置的几种高度',
          type: 'number',
        },
        {
          id: U(),
          param: 'is-flex',
          description: '是否采用flex布局',
          type: 'boolean',
          default: 'false'
        },
        {
          id: U(),
          param: 'is-record-url-params',
          description: '该表格的参数是否与浏览器地址栏的查询条件保持同步，大多数页面只有一个表格，所以默认值设为了true；一般一个页面有多个表格时需要用到此参数；如果想保持多个表格都与浏览器地址的查询条件同步，则需要传入另一个参数query-key',
          type: 'boolean',
          default: 'true'
        },
        {
          id: U(),
          param: 'query-key',
          description: '用来区分同一个页面的各个表格的参数，默认值为q',
          type: 'boolean',
          default: 'true'
        },
        {
          id: U(),
          param: 'is-auto-check-row',
          description: '是否执行根据浏览器url地址栏的查询条件进行设置勾选项，默认为true',
          type: 'boolean',
          default: 'true'
        },
        {
          id: U(),
          param: 'eventChange',
          description: '事件监听，对于传入表格中的按钮，事件等作出响应，回调参数prop：事件标识；row：当前行；col：当前列，具体用法参考remote-table',
          type: 'Function({prop, row, col})',
        },
        {
          id: U(),
          param: 'afterSearch',
          description: '查询之后会发送该事件',
          type: 'Function({result})',
        },
        {
          id: U(),
          param: 'rowClick',
          description: '点击行事件，回调参数row：当前行；col：当前列，具体用法参考config-table',
          type: 'Function({row, col})',
        },
        {
          id: U(),
          param: 'selection-change',
          description: '改变checkbox之后触发的事件',
          type: 'Function(selection)',
        },
        {
          id: U(),
          param: 'select',
          description: '选择checkbox之后触发的事件',
          type: 'Function(selection, row)',
        },
        {
          id: U(),
          param: 'select-all',
          description: '手动勾选全选之后触发的事件',
          type: 'Function(selection)',
        },
        {
          id: U(),
          param: 'auto-checked',
          description: '自动根据浏览器地址栏的条件勾选之后触发的事件',
          type: 'Function(selection)',
        },
      ],
      colTableData: [
        {
          id: U(),
          param: 'prop',
          description: '字段名，如果该列不是通过prop获取的，也需要指定一个唯一的prop，如果',
          type: 'string'
        },
        {
          id: U(),
          param: 'label',
          description: '标题，与el-table一致',
          type: 'string'
        },
        {
          id: U(),
          param: 'key',
          description: '将来扩展使用',
          type: 'string'
        },
        {
          id: U(),
          param: 'width',
          description: '列宽，与el-table一致',
          type: 'string/number'
        },
        {
          id: U(),
          param: 'minWidth',
          description: '最小列宽，与el-table一致',
          type: 'string/number'
        },
        {
          id: U(),
          param: 'align',
          description: '对齐方式，与el-table一致',
          type: 'string'
        },
        {
          id: U(),
          param: 'undraggable',
          description: '列是否可拖拽，该字段需要在is-drag-table为true时生效；有些列表的第一列和最后一列不允许拖拽',
          type: 'boolean',
          default: 'false'
        },
        {
          id: U(),
          param: 'type',
          description: '列的类别，如果要渲染链接使用link，如果要渲染按钮使用btns，如果要渲染文本事件（用的少）使用eventText，目前列的类别较少，其可选值为：link，eventText，btns，component等；',
          type: 'string',
        },
        {
          id: U(),
          param: 'linkRoot',
          description: '若指定了该值，则会将显示值作为<router-link>展示，并可以跳转到linkRoot + /:row.id指定的路由上去，该默认跳转方式可以找fuyongbo@everjiankang.com重新制定',
          type: 'string',
        },
        {
          id: U(),
          param: 'urlFormatter',
          description: '若指定了该值，则根据该值进行路由跳转',
          type: 'string/Function({row, col})',
        },
        {
          id: U(),
          param: 'customCellSpanClassFormatter',
          description: '若指定了该值，则在当前td下的span标签上添加class',
          type: 'string/Function({value, row, col})',
        },
        {
          id: U(),
          param: 'formatter',
          description: '若指定了该值，则将值用该函数格式化，',
          type: 'string/Function({value, row, col})',
        },
        {
          id: U(),
          param: 'event',
          description: '当type=eventText时，需要用event来指定该事件的类型，若为object则取prop为事件类型，其他属性可以作为未来扩展',
          type: 'string/object',
        },
        {
          id: U(),
          param: 'notSelectCheckbox',
          description: '点击行时，如果点击到该列，且notSelectCheckbox为true，则不选中该行，默认值为false，即默认会选中该行，注意：当点击的列是"链接"（有linkRoot或者urlFormatter属性）或"按钮"（有btns属性）时，默认不会选中该行',
          type: 'string/object',
        },
        {
          id: U(),
          param: 'beforeHtmlFormatter',
          description: '在显示的文本前附加html代码',
          type: 'string/Function(val, row, col)',
        },
        {
          id: U(),
          param: 'beforeHtmlEvent',
          description: '显示在文本前边内容的事件配置，字符串是prop属性的简写；当prop为_link时，表示的特殊事件是链接（记住当前点击的行）',
          type: 'string/object',
        },
        {
          id: U(),
          param: 'afterHtmlFormatter',
          description: '在显示的文本后附加html代码',
          type: 'string/Function(val, row, col)',
        },
        {
          id: U(),
          param: 'afterHtmlEvent',
          description: '显示在文本后边内容的事件配置，字符串是prop属性的简写；当prop为_link时，表示的特殊事件是链接（记住当前点击的行）',
          type: 'string/object',
        },
        {
          id: U(),
          param: 'btns',
          description: '显示按钮组，数组可以用字面量直接定义，也可以根据一个函数来精确控制；数组的每一项可以是字符串，也可以是对象（包含prop, type, label三个属性），ever-table默认了del和edit为删除和编辑按钮，具体用法参考config-table，若需要更多默认按钮，可以找fuyongbo@everjiankang.com',
          type: 'array/Function(row, col)',
        },
        {
          id: U(),
          param: 'slotName',
          description: '需要使用slot作为列时，可以传入slot，注意，当slot的列为操作列时必须加上isOperate：true，若操作列的名字为opCol则不需要',
          type: 'string',
        },
        {
          id: U(),
          param: 'isOperate',
          description: '当slot的列为操作列时必须加上isOperate：true，若操作列的名字为opCol则不需要',
          type: 'boolean',
        },
        {
          id: U(),
          param: 'showOverflowTooltip',
          description: '文字较多时，是否出现提示',
          type: 'boolean',
        },
        {
          id: U(),
          param: 'component',
          description: '当该列需要使用组件渲染时，需要配置此属性，该属性为一个对象，必填的属性为name，其他属性见demo',
          type: 'object',
        },
      ]
    }
  },
}
</script>

<style scoped lang="less">
  .demo-desc {
    color: #ccc;
  }
</style>
