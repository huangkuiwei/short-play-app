<script>
import { mapState } from 'vuex';

export default {
  name: 'adv',

  data() {
    return {
      advList: [],
      currentAdv: {},
      swiperList: [],
      totalMoney: Number(uni.getStorageSync('totalMoney')) || 0,
      showNoticeDialog: false,
      withdrawalMoney: '',
    }
  },

  onLoad() {
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    for (let i = 0; i < 4; i++) {
      let userName = ''
      let money = 0

      for (let i = 0; i < 4; i++) {
        userName += numbers[Math.floor(Math.random() * numbers.length)]
        money += Number((Math.random() * numbers.length).toFixed(2))
      }

      this.swiperList.push({
        userName: userName,
        money: money.toFixed(2),
      })
    }

    this.advList = []
    let names = ['八零恋歌', '从不负月光', '反方向的钟', '烽火长祭慎行殇', '侯门嫡女骆宁传', '换专业后山海不相逢', '荒年全村啃树皮', '季总您的马甲叒掉了',
      '家里家外', '假千金翻身富豪', '今夕是何年', '请君入我怀', '全家偷听我心声我负责喝奶', '撒娇大叔最好命', '上错嫁车嫁对郎', '谁在说朕坏话', '深宅胭脂谋',
      '乡下千金竟是老祖', '小小厨娘不好惹', '医妃卿卿', '重生带着妻儿走向致富路', '重生后她飒爆了', '重生文女配只想活命', '重生之为儿媳撑腰'
    ]

    new Array(24).fill(undefined).forEach((item, index) => {
      let moneyData = uni.getStorageSync('moneyData')[3]
      let money = Number(moneyData.minMoney) + Math.random() * (moneyData.maxMoney - moneyData.minMoney)

      this.advList.push({
        name: names[index],
        videoSrc: `/static/videos/${index + 1}.mp4`,
        coverSrc: `/static/images/cover/${index + 1}.jpg`,
        money: money.toFixed(2),
        progress: (20 + Math.random() * 80).toFixed(1),
      })
    })
  },

  computed: {
    ...mapState('app', ['deviceUuid', 'noticeList']),
  },

  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    goback() {
      uni.navigateBack()
    },

    lookAdv(item) {
      this.currentAdv = item
      this.$refs.advDialog.open()
    },

    withdrawal() {
      if (Number(this.withdrawalMoney) < 1) {
        uni.showToast({
          title: '最低提现1',
          icon: 'error'
        })

        return
      }

      if (Number(this.withdrawalMoney) > this.totalMoney) {
        uni.showToast({
          title: '余额不足',
          icon: 'error'
        })

        return
      }

      uni.showLoading({
        title: '请稍等...',
        mask: true,
      })

      setTimeout(() => {
        uni.showToast({
          title: '提现成功',
          icon: 'success'
        })

        this.$refs.withdrawalDialogRef.close()
        this.totalMoney = Number((this.totalMoney - this.withdrawalMoney).toFixed(2))
        uni.setStorageSync('totalMoney', this.totalMoney)

        setTimeout(() => {
          this.showNoticeDialog = true

          this.noticeList.push({
            time: Date.now(),
            money: Number(this.withdrawalMoney).toFixed(2),
          })

          setTimeout(() => {
            this.showNoticeDialog = false
          }, 4000)
        }, 4000)
      }, 2000)
    },

    playEnded() {
      this.$refs.advDialog.close()

      setTimeout(() => {
        this.$refs.successDialog.open()
        this.totalMoney = (this.totalMoney + Number(this.currentAdv.money)).toFixed(2)
        uni.setStorageSync('totalMoney', this.totalMoney)
      }, 500)
    }
  }
}
</script>

<template>
  <view class="adv-page">
    <view class="banner">
      <view class="logo">
        <image mode="widthFix" src="/static/images/video.png"/>
        <text>看短剧，得收益</text>
      </view>
      <view class="title">短剧推广</view>
      <view class="btn">看短剧，日赚百元起</view>
      <view class="swiper">
        <swiper autoplay :interval="2000" :vertical="true">
          <swiper-item v-for="(item, index) in swiperList" :key="index">
            <image mode="widthFix" src="/static/images/notice.png"/>
            <text>用户：{{ item.userName }}完成推广提现{{ item.money }}</text>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="options">
      <view>
        <text class="title">我的余额：{{ totalMoney }}</text>
      </view>
      <view @click="$refs.withdrawalDialogRef.open()">
        <text class="title">点击提现</text>
      </view>
    </view>

    <view class="adv-list">
      <view class="adv-item" v-for="item of advList" :key="item.name"  @click="lookAdv(item)">
        <view class="poster">
          <image class="cover" mode="aspectFill" :src="item.coverSrc"/>
        </view>

        <view class="tip">
          <text class="name">短剧：{{ item.name }}</text>
          <text class="btn">观看赚收益</text>
          <view class="progress" :style="{ width: item.progress + '%' }">
            {{ item.progress }}%
          </view>
        </view>

        <view class="money">
          <text>+{{item.money}}</text>
          <text>{{ Math.round(10 * item.progress) }}已赚</text>
        </view>
      </view>
    </view>

    <uni-popup ref="withdrawalDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="withdrawal-dialog">
        <view class="title">提现</view>
        <input type="number" v-model="withdrawalMoney" placeholder="请输入提现金额">
        <view class="btn">
          <button @click="$refs.withdrawalDialogRef.close()">
            取消
          </button>

          <button type="primary" @click="withdrawal">
            确定
          </button>
        </view>
      </view>
    </uni-popup>

    <view class="notice-dialog" v-if="showNoticeDialog" @click="jumpUrl('/pages/noticeList/noticeList')">
      <view class="left">
        <image mode="widthFix" src="/static/images/horn.png"/>
      </view>

      <view class="right">
        <text>微信支付</text>
        <text>微信支付：您收到一笔活动奖励</text>
      </view>
    </view>

    <uni-popup
        ref="advDialog"
        :is-mask-click="false"
    >
      <view class="adv-dialog">
        <video
            :controls="false"
            autoplay
            object-fit="contain"
            :src="currentAdv.videoSrc"
            @ended="playEnded"
        >
        </video>

        <view class="btn">
          <text>点击查看详情</text>
        </view>
      </view>
    </uni-popup>

    <uni-popup
        ref="successDialog"
        background-color="#ffffff"
        border-radius="20px 20px 20px 20px"
    >
      <view class="success-dialog">
        <view class="tip">观看成功，增加{{currentAdv.money}}</view>
        <view class="btn">
          <text @click="$refs.successDialog.close()">知道了</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.adv-page {
  background: linear-gradient(to bottom, #ffffff, #90BBFF);
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .banner {
    padding: 30rpx 30rpx;
    display: flex;
    flex-direction: column;

    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;

      image {
        width: 60rpx;
        margin-right: 12rpx;
      }

      text {
        color: #2F44DD;
        font-size: 24rpx;
      }
    }

    .title {
      text-align: center;
      font-size: 100rpx;
      font-weight: bold;
      font-style: italic;
      color: #2F44DD;
      letter-spacing: 4rpx;
      margin-bottom: 40rpx;
    }

    .btn {
      align-self: center;
      width: 370rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx 0;
      background: #2F44DD;
      color: #ffffff;
      font-size: 28rpx;
      border-radius: 40rpx;
      margin-bottom: 40rpx;
    }

    .swiper {
      padding: 0 20rpx;
      margin-bottom: 20rpx;

      swiper {
        border-radius: 16rpx;
        padding: 14rpx 0;
        height: 60rpx;

        swiper-item {
          font-size: 28rpx;
          padding-left: 40rpx;
          display: flex;
          align-items: center;

          image {
            width: 40rpx;
            margin-right: 4rpx;
          }

          text {
            color: #1f1f1f;
          }
        }
      }
    }
  }

  .options {
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
    margin-bottom: 40rpx;

    view {
      width: 44%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100rpx;
      color: #ffffff;

      &:nth-child(1) {
        background: #4cd964;
      }

      &:nth-child(2) {
        background: #e43d33;
      }

      .title {
        font-style: italic;
      }
    }
  }

  .adv-list {
    padding: 0 30rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .adv-item {
      width: 100%;
      background: #ffffff;
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;
      position: relative;
      padding-right: 20rpx;

      .poster {
        flex-shrink: 0;
        width: 260rpx;
        height: 200rpx;

        .cover {
          border-radius: 6rpx;
          width: 100%;
          height: 100%;
        }
      }

      .tip {
        flex-grow: 1;
        height: 100%;
        overflow: hidden;
        padding: 0 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        text {
          &.name {
            font-size: 20rpx;
            color: #222B45;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          &.btn {
            font-size: 20rpx;
            padding: 8rpx 40rpx;
            background: #DBCFF3;
            color: #2F44DD;
          }
        }

        .progress {
          height: 30rpx;
          background: #7B58E9;
          border-radius: 15rpx;
          font-size: 20rpx;
          color: #ffffff;
          display: flex;
          align-items: center;
          padding-left: 20rpx;
        }
      }

      .money {
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30rpx;

        text {
          color: #F56B2C;

          &:nth-child(1) {
            font-size: 32rpx;
          }

          &:nth-child(2) {
            font-size: 24rpx;
          }
        }
      }
    }
  }

  .adv-dialog {
    width: 550rpx;
    height: 400rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12rpx;

    video {
      width: 460rpx;
      height: 260rpx;
    }

    .btn {
      margin-top: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 30rpx;

      text {
        padding: 8rpx 100rpx;
        font-size: 26rpx;
        color: #ffffff;
        background: #007aff;
        border-radius: 30rpx;
      }
    }
  }

  .success-dialog {
    width: 550rpx;
    padding: 40rpx;

    .tip {
      font-size: 30rpx;
      margin-bottom: 40rpx;
    }

    .btn {
      text-align: right;
      color: #007aff;
    }
  }
}

.withdrawal-dialog {
  width: 550rpx;
  padding: 40rpx 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    text-align: center;
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
  }

  input {
    height: 86rpx;
    margin-bottom: 40rpx;
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 16rpx;
    padding: 0 30rpx;
    font-size: 36rpx;
  }

  .btn {
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: space-around;

    button {
      width: 180rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 30rpx;
    }
  }
}

.notice-dialog {
  display: flex;
  align-items: center;
  background: #ffffff;
  position: fixed;
  z-index: 999;
  left: 40rpx;
  right: 40rpx;
  border-radius: 8rpx;
  padding: 30rpx 30rpx;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  animation: 4s ease kf1;

  @keyframes kf1 {
    0% {
      top: 0;
      opacity: 0;
    }

    10% {
      top: 100rpx;
      opacity: 1;
    }

    90% {
      top: 100rpx;
      opacity: 1;
    }

    100% {
      top: 0;
      opacity: 0;
    }
  }

  .left {
    background: #00C800;
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 40rpx;

    image {
      width: 50rpx;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10rpx;

    text {
      &:nth-child(1) {
        font-size: 32rpx;
        font-weight: bold;
      }

      &:nth-child(2) {
        font-size: 28rpx;
      }
    }
  }
}
</style>