<!-- views/orderWithChart/index.vue -->
<template>
  <div>
    <PanelHead :route="route" />
    <!-- 图表容器 -->
    <div class="chart-container">
      <div ref="echart" class="echart"></div>
    </div>
    <!-- 引入公共表格组件，并监听事件 -->
    <OrderTableCommon
      @order-updated="refreshChart"
      @table-data-loaded="handleTableDataLoaded"
    />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch, reactive } from "vue";
import * as echarts from "echarts";
import { getControlData } from "../../api"; // 图表数据接口

import OrderTableCommon from "../../components/OrderTableCommon.vue"; // 引入公共组件

const route = useRoute();
const echart = ref(null);
let myChart = null;

// 图表数据
const chartData = reactive({
  dates: [],
  orderCounts: [],
  growthRates: [],
});

// 表格数据加载完成时触发（如需用表格数据更新图表）
const handleTableDataLoaded = (tableData) => {
  console.log("表格数据已加载：", tableData);
  // 如需基于表格数据处理图表，可在此处添加逻辑
};

// 刷新图表数据
const refreshChart = async () => {
  try {
    const res = await getControlData();
    const data = res?.data?.data;
    if (data && data.typeList) {
      processChartData(data.typeList);
      initEchart();
    }
  } catch (error) {
    console.error("获取图表数据失败:", error);
  }
};

// 处理图表数据（复用原有逻辑）
const processChartData = (typeList) => {
  const sortedData = [...typeList].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  chartData.dates = sortedData.map((item) => item.date);
  chartData.orderCounts = sortedData.map((item) => item.order_sum);
  chartData.growthRates = sortedData.map((item, index) => {
    if (index === 0) return 0;
    const prev = sortedData[index - 1].order_sum;
    const current = item.order_sum;
    return prev === 0 ? 0 : (((current - prev) / prev) * 100).toFixed(2) - 0;
  });
};

// 初始化图表（复用原有逻辑）
const initEchart = () => {
  if (!echart.value) return;
  if (myChart) myChart.dispose();
  myChart = echarts.init(echart.value);
  myChart.setOption({
    grid: { left: 40, bottom: 30, right: 80, top: 30, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { data: ["已接订单数", "订单增长率(%)"], top: 0 },
    xAxis: { type: "category", data: chartData.dates, boundaryGap: false },
    yAxis: [
      { type: "value", name: "订单数", nameTextStyle: { color: "#67CEBC" } },
      {
        type: "value",
        name: "增长率(%)",
        position: "right",
        nameTextStyle: { color: "#F05050" },
      },
    ],
    series: [
      {
        name: "已接订单数",
        type: "bar",
        data: chartData.orderCounts,
        itemStyle: { color: "#67CEBC" },
      },
      {
        name: "订单增长率(%)",
        type: "line",
        data: chartData.growthRates,
        itemStyle: { color: "#F05050" },
      },
    ],
  });
};

// 监听图表数据变化
watch([() => chartData.dates, () => chartData.orderCounts], () => {
  if (myChart) {
    myChart.setOption({
      xAxis: { data: chartData.dates },
      series: [
        { data: chartData.orderCounts },
        { data: chartData.growthRates },
      ],
    });
  }
});

// 初始化
onMounted(() => {
  refreshChart();
  // 定时刷新图表
  setInterval(refreshChart, 30000);
});
</script>

<style lang="less" scoped>
.chart-container {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  .echart {
    width: 100%;
    height: 400px;
  }
}
</style>