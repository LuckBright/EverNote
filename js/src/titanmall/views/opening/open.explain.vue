<template>
  <div class="explain">
    <div class="top-text">
      <span>想了解更多，欢迎拨打热线。咨询电话：010-86221537</span>
    </div>
    <div class="text-tbody">
      <div>
        <p class="mall-text">私域商城</p>
        <span class="tip-span">
          医生可以根据患者在院内的个人健康档案和过往的诊疗记录，为患者推荐商品；系统也可以根据每个人诊疗记录和过往的检验结果，在医生认可的情况下自动推送商品给患者。
        </span>
        <p>
          <el-button
            type="primary"
            round
            style="width: 154px"
            @click="
              () => {
                $router.push('/titanmall/open');
              }
            "
          >开通商城
          </el-button
          >
        </p>
      </div>
      <div class="card">
        <div class="box">
          <div class="card-box">
            <p class="z-icon">
              <img src="../../assets/img/ts.png"/>
            </p>
            <p class="title">精准推送</p>
            <span
              class="sub-heading"
            >根据用户健康档案或电子病历精准推送相关商品。</span
            >
          </div>
          <div class="card-box mg">
            <p class="z-icon">
              <img src="../../assets/img/sj.png"/>
            </p>
            <p class="title">数据反馈</p>
            <span
              class="sub-heading"
            >根据大数据实时反馈调整上/下架商品，优选交易最高、点评最好。</span
            >
          </div>
          <div class="card-box">
            <p class="z-icon">
              <img src="../../assets/img/zdy.png"/>
            </p>
            <p class="title">自定义商品</p>
            <span
              class="sub-heading"
            >可按需定义上架服务类、实物类、会员类等不同商品。</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .explain {
    background: #fff;

    .top-text {
      height: 34px;
      line-height: 34px;
      background: #e9f2fd;
      padding-left: 40px;

      span {
        font-size: 14px;
        color: #666;
      }
    }

    .text-tbody {
      text-align: center;

      .mall-text {
        font-size: 40px;
        color: #000;
        line-height: 50px;
        margin: 40px 0 20px;
      }

      .tip-span {
        display: inline-block;
        width: 760px;
        font-size: 18px;
        color: #666666;
        line-height: 26px;
        margin-bottom: 20px;
      }

      .card {
        margin-top: 60px;
        height: 360px;
        // padding-left: 170px;
        .box {
          margin: 0 auto;
          width: 1100px;
          height: 360px;

          .card-box {
            float: left;
            width: 340px;
            height: 100%;
            background: #ffffff;
            box-shadow: 0 9px 22px 0 rgba(69, 158, 255, 0.2);

            .z-icon {
              margin-top: 63px;
              height: 58px;
            }

            .title {
              font-size: 24px;
              color: #222a41;
              text-align: center;
              line-height: 36px;
              margin: 30px 0 21px;
            }

            .sub-heading {
              display: inline-block;
              width: 300px;
              text-align: left;
              font-size: 18px;
              color: #666666;
              letter-spacing: 0;
              line-height: 26px;
            }
          }

          .mg {
            margin: 0 40px;
          }
        }
      }
    }
  }
</style>
