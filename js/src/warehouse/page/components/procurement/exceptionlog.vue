<template>
  <el-tooltip placement="right" effect="light">
    <i class="icon"></i>
    <div slot="content">
      <div class="exception_content">
        <ul>
          <li v-for="(item, index) in logData" :key="index">
            <div class="step">
              <span class="line"></span>
              <span class="bot" :class="{'bot_active': index === 0}"></span>
              <span class="line"></span>
            </div>
            <div class="content">
              <p>操作人：{{item.createName}}  {{item.createTime}}</p>
              <p v-if="item.operationType === 820">原数据：{{item.befNum}}  →  新：{{item.num}}</p>
              <p v-else-if="item.operationType === 819">新增数据</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </el-tooltip>
</template>

<script>
  export default {
    props: ['logData']
  }
</script>

<style lang="less" scoped>
  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    cursor: pointer;
    background: url('../../../../assets/img/info-fill.svg') center no-repeat;
  }
  .exception_content {
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    ul {
      padding: 0;
      margin: 0;
      li {
        display: flex;
        .step {
          margin-right: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .bot {
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: #ccc;
          }
          .bot_active {
            background: #1C7BEF;
          }
          .line {
            display: inline-block;
            width: 2px;
            height: 10px;
            background: #ccc;
          }
          .line:first-child {
            height: 5px;
          }
          .line:last-child {
            flex: 1;
          }
        }
        .content {
          margin-bottom: 10px;
          p {
            margin: 0;
            margin-bottom: 5px;
          }
          p:first-child {
            color: #666;
          }
        }
      }
      li:first-child {
        .step {
          .line:first-child {
            opacity: 0;
          }
        }
      }
      li:last-child {
        .step {
          .line:last-child {
            opacity: 0;
          }
        }
        .content {
          margin-bottom: 0;
          p:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
