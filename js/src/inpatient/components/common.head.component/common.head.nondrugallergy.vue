<template>
  <span class="common-head-def-container is-bg-container is-bg-red common-head-ellipsis">
    <span class="common-head-def-label">{{$t(itemConfig.displayName)}}：</span>
    <el-tooltip class="item" effect="dark" :content="parsedValue.origin || '--'" placement="top">
      <span class="common-head-def-value">
        {{parsedValue.view || '--'}}
      </span>
    </el-tooltip>
<!--    <span class="common-head-def-value">-->
<!--      {{parsedValue.view}}-->
<!--      <span v-for="(item,i) in parsedValue.guomin" :key="i">-->
<!--        <template v-if="i > 0"> /</template>-->
<!--        <template v-if="item.allergen">-->
<!--          <template v-if="Array.isArray(item.allergen)">-->
<!--            <span v-for="(sitem, si) in item.allergen" :key="si"><template v-if="si > 0">-</template>{{sitem.name}}</span>-->
<!--          </template>-->
<!--          <span v-else>{{item.allergen.name}}</span>-->
<!--        </template>-->
<!--      </span>-->
<!--    </span>-->
  </span>
</template>
<script>
  export default {
    props: {
      itemConfig: {
        type: Object,
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
      parsedValue () {
        // 获取要展示的文字，并根据文字的长度进行截取
        // 使用 css 的 ellipsis 功能时遇到其他样式问题，故采用该方案替代
        let res = ''
        if (this.itemConfig.value) {
          const value = JSON.parse(this.itemConfig.value)
          if (value.guomin) {
            res = value.guomin.map(item => {
              if (Array.isArray(item.allergen)) {
                return item.allergen.length === 1 && item.allergen[0].id === '9' ? `${item.allergen[0].name}${item.remark ? `-${item.remark}` : ''}` : item.allergen.map(a => a.name).join('-')
              } else if (item.allergen) {
                return item.allergen
              } else {
                return ''
              }
            }).filter(item => item).join('/')
          }
        }
        return {
          view: res.length > 22 ? res.slice(0, 22) + '...' : res,
          origin: res,
        }
        // const value = this.itemConfig.value ? JSON.parse(this.itemConfig.value) : []
        // return this.itemConfig.value ? JSON.parse(this.itemConfig.value) : []
      }
    },
  }
</script>
