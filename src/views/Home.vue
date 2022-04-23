<template>
  <div class="pie-chart-post">
    <el-card v-for="item in pieChartList" :key="item" class="pie-chart-card">
      <template #header>
        <span>{{ item }}</span>
      </template>
      <div class="pie-chart-zone"></div>
    </el-card>
  </div>
  <div class="chart-range-post">
    <el-card class="pie-chart-range-post">
      <template #header>
        <el-date-picker v-model="pieRangeTime" type="daterange"
                        start-placeholder="开始时间" end-placeholder="结束时间"
                        @change="getRangePostPieChart">
        </el-date-picker>
      </template>
      <div class="pie-chart-zone"></div>
    </el-card>
    <el-card class="bar-chart-range-post">
      <template #header>
        <el-date-picker v-model="barRangeTime" type="date"
                        @change="getRangePostBarChart">
        </el-date-picker>
      </template>
      <div class="bar-chart-daily"></div>
    </el-card>
  </div>
  <div class="line-chart-post">
    <el-card>
      <div class="line-chart-month"></div>
    </el-card>
  </div>
</template>

<script setup>
import * as ECharts from "echarts"
import {getPostBarChart, getPostLineChart, getPostPieChart} from "@/api/statistics.js"
import {computed, nextTick, ref} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()
/*帖子数量饼状图*/
const pieChartList = ["今日发帖", "本周发帖", "本月发帖"]
const getPostCount = async (start, end) => {
  let res = await getPostPieChart(start, end)
  return {
    chat: res.count_small_talk,
    study: res.count_study_share,
    trade: res.count_market,
  }
}
const postPieChart = (className, order, postCnt) => {
  let pieChart = ECharts.init(document.getElementsByClassName(className)[order])
  let option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
    },
    series: [{
      name: "帖子数量",
      type: "pie",
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        {value: postCnt.chat, name: "闲聊区"},
        {value: postCnt.study, name: "学习区"},
        {value: postCnt.trade, name: "交易区"},
      ],
    }],
  }
  pieChart.setOption(option)
  return pieChart
}
const pieChartDomList = []
//时间
const msDay = 1000 * 60 * 60 * 24
const now = new Date()
const nowMs = now.getTime()
const todayZeroMs = new Date(now.toLocaleDateString()).getTime()
const sundayZeroMs = todayZeroMs - now.getDay() * msDay // 本周周日0点
const firstDayZeroOfThisMonthMs = todayZeroMs - (now.getDate() - 1) * msDay // 本月1日0点
//自定义时间
const pieRangeTime = ref([
  new Date(firstDayZeroOfThisMonthMs),
  new Date(todayZeroMs),
])
const getRangePostPieChart = async () => {
  let res = await getPostCount(pieRangeTime.value[0].getTime(), pieRangeTime.value[1].getTime())
  pieChartDomList[3].setOption({
    series: [{
      data: [
        {value: res.chat, name: "闲聊区"},
        {value: res.study, name: "学习区"},
        {value: res.trade, name: "交易区"},
      ],
    }],
  })
}

/*帖子数量折线图*/
let lineChartDom = null

/*条形图*/
let barChartDom = null
const barRangeTime = ref(now)
const barFormatTime = computed(() => barRangeTime.value.toISOString().slice(0, 10))
const getRangePostBarChart = async () => {
  let res = await getPostBarChart(barFormatTime.value)
  barChartDom.setOption({
    series: [{
      data: Object.values(res.post_count_by_day),
    }],
  })
}
/*画图*/
let reqPostPieChart = []
let reqPostLineChart = null
let reqPostBarChart = null
const request = () => {
  reqPostPieChart = []
  reqPostPieChart.push(getPostCount(todayZeroMs, nowMs))
  reqPostPieChart.push(getPostCount(sundayZeroMs, nowMs))
  reqPostPieChart.push(getPostCount(firstDayZeroOfThisMonthMs, nowMs))
  reqPostPieChart.push(getPostCount(pieRangeTime.value[0].getTime(), pieRangeTime.value[1].getTime()))
  reqPostLineChart = getPostLineChart()
  reqPostBarChart = getPostBarChart(barFormatTime.value)
}
request()
nextTick(() => {
  //饼状图
  reqPostPieChart.forEach(async (v, i) => {
    v.then((res) => {
      pieChartDomList[i] = postPieChart("pie-chart-zone", i, res)
    })
  })
  //折线图
  lineChartDom = ECharts.init(document.querySelector(".line-chart-month"))
  reqPostLineChart.then((res) => {
    let keys = Object.keys(res.post_count_by_day)
    let values = Object.values(res.post_count_by_day)
    keys = keys.map((v) => v.slice(5))
    lineChartDom.setOption({
      title: {
        text: "本月每日发帖数量",
      },
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
        },
      },
      xAxis: {
        data: keys,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          type: "line",
          data: values,
          markPoint: {
            data: [
              {type: "max", name: "Max"},
              {type: "min", name: "Min"},
            ],
          },
          markLine: {
            data: [{type: "average", name: "Avg"}],
            silent: true,
          },
        },
      ],
    })
  })
  //条形图
  barChartDom = ECharts.init(document.querySelector(".bar-chart-daily"))
  reqPostBarChart.then((res) => {
    let keys = Object.keys(res.post_count_by_day)
    let values = Object.values(res.post_count_by_day)
    barChartDom.setOption({
      title: {
        text: "24小时发帖数量",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: keys,
      },
      yAxis: {
        type: "value",
        // interval: 1,
      },
      series: [
        {
          data: values,
          type: "bar",
          markLine: {
            data: [{type: "average", name: "Avg"}],
            // yAxis: 100,
            silent: true,
          },
        },
      ],
    })
  })
})
</script>

<style scoped>
.pie-chart-post {
  display: flex;
  justify-content: space-between;
}

.pie-chart-card {
  width: 360px;
}

.pie-chart-zone {
  width: 260px;
  height: 260px;
  margin: 0 auto;
}

.chart-range-post {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}

.pie-chart-range-post {
  width: 380px;
}

.bar-chart-range-post {
  width: 800px;
}

.bar-chart-daily {
  width: 800px;
  height: 300px;
  margin: 0 auto;
}

.line-chart-post {
  margin-top: 1em;
}

.line-chart-month {
  width: 1192px;
  height: 446px;
  margin: 0 auto;
}
</style>