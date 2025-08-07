<template>
  <div>
    <div class="container">
      <div class="header">我的订单</div>
      <van-tabs @click-tab="onClickTab" :active="active">
        <van-tab title="全部" name="" />
        <van-tab title="待支付" name="1" />
        <van-tab title="待服务" name="2" />
        <van-tab title="已完成" name="3" />
        <van-tab title="已取消" name="4" />
      </van-tabs>
      <van-row
        @click="goDetail(item)"
        v-for="item in order"
        :key="item.out_trade_no"
      >
        <van-col span="5">
          <van-image
            width="60"
            height="60"
            radius="5"
            src="https://nfassetoss.southcn.com/__asset/5162dbdd9d/fa90559560.jpg?r=0.08903175412991327"
          />
        </van-col>
        <van-col span="14">
          <div class="text1">
            {{ item.service_name }}
          </div>
          <div class="text2">
            <div>{{ item.hospital_name }}</div>
            <div>预约时间:{{ item.starttime }}</div>
          </div>
        </van-col>
        <van-col
          class="text2"
          :style="{ color: colorMap[item.trade_state] }"
          span="5"
        >
          {{ item.trade_state }}
          <Counter :second="item.timer" v-if="item.trade_state === '待支付'" />
        </van-col>
      </van-row>
      <div class="bottom-text">没有更多了</div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import counter from "../../components/counter.vue";
import { useRouter } from "vue-router";

const colorMap = {
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
};

onMounted(() => {
  getOrderList("");
});

const order = ref([]);
//获取当前vue实例
const { proxy } = getCurrentInstance();

//获取订单列表
const getOrderList = async (state) => {
  const { data } = await proxy.$api.orderList({ state });
  console.log(data); //通过orderList请求到的数据
  data.data.forEach((item) => {
    //得到倒计时的时间
    item.timer = item.order_start_time + 7200000 - Date.now();
  });

  order.value = data.data;
};

const onClickTab = (item) => {
  getOrderList(item.name);
};

const router = useRouter();
//点击某个订单跳转详情
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`);
};

const active = ref("");
</script>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
}
.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }
  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}
.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>