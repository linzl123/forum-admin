<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180"/>
    <el-table-column prop="name" label="Name" width="180"/>
    <el-table-column prop="address" label="Address"/>
  </el-table>
</template>

<script setup>

import {onUnmounted} from "vue"

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
]
//WebSocket
const wsUrl = import.meta.env.VITE_WS_URL
let ws = null
const createWebSocket = () => {
  try {
    ws = new WebSocket(wsUrl)
    init()
  } catch (e) {
    console.log(e)
    // reconnect(wsUrl)
  }
}

try {
  createWebSocket()
} catch (e) {
  console.log(e)
}

function init() {
  ws.onclose = () => {
    reconnect(wsUrl)
  }
  ws.onerror = () => {
    reconnect(wsUrl)
  }
  ws.onmessage = (e) => {
    if (e.data === "PING") {
      ws.send("PONG")
    } else {
      console.log(JSON.parse(e.data))
      console.log(new Date().toLocaleString())
    }
  }
}

let lockReconnect = false

function reconnect(url) {
  if (lockReconnect) return
  lockReconnect = true
  setTimeout(() => {
    createWebSocket(url)
    lockReconnect = false
  }, 3000)
}

onUnmounted(() => {
  ws.onmessage = null
  ws.onclose = null
  ws.close()
})
</script>

<style scoped>

</style>