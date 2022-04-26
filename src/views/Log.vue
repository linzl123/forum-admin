<template>
  <el-card class="card">
    <template #header>
      <div class="search">
        <div class="search-item">
          <el-switch
            v-model="wsConnect"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :loading="wsLoading"
            @click="wsSwitch"
          />
          {{ wsConnectText }}
        </div>
        <div class="search-item">
          <span class="search-item-text">ID</span>
          <el-input v-model="inputUid" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <span class="search-item-text">操作</span>
          <el-input v-model="inputOperate" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <span class="search-item-text">状态码</span>
          <el-input v-model="inputStatus" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <div class="search-item">
          <el-button @click="clearLog">清空</el-button>
        </div>
      </div>
    </template>
    <el-table :data="curLogList" border style="width: 100%" height="73vh">
      <template #empty>
        <div>暂无数据</div>
      </template>
      <el-table-column prop="u_id" label="UID"/>
      <el-table-column prop="ip" label="IP"/>
      <el-table-column prop="operate_name" label="操作"/>
      <el-table-column prop="http_status_code" label="状态码"/>
      <el-table-column prop="response_message['state_message']" label="响应消息"/>
      <el-table-column prop="operate_time" label="时间"/>
    </el-table>
  </el-card>
</template>

<script setup>
import store from "@/store"
import {computed, ref, watch} from "vue"
//
const curLogList = computed(() =>
  store.state.logList.filter(log =>
    String(log.u_id).includes(inputUid.value)
    && log.operate_name.includes(inputOperate.value)
    && String(log.http_status_code).includes(inputStatus.value),
  ),
)
// 查询
const inputUid = ref("")
const inputOperate = ref("")
const inputStatus = ref("")
const resetSearch = () => {
  inputUid.value = ""
  inputOperate.value = ""
  inputStatus.value = ""
}
//
const clearLog = () => {
  store.commit("clearLog")
}
// WebSocket
const wsLoading = ref(false)
const wsConnect = ref()
if (window.ws) {
  wsConnect.value = (window.ws.readyState === 1)
} else {
  wsConnect.value = false
}
const wsConnectText = computed(() => wsConnect.value ? "连接中" : "未连接")
const wsSwitch = () => {
  wsLoading.value = true
  if (wsConnect.value) {
    createWebSocket()
  } else {
    window.ws.close()
  }
}
const createWebSocket = () => {
  const wsUrl = import.meta.env.VITE_WS_URL
  try {
    window.ws = new WebSocket(wsUrl)
    window.ws.onopen = () => {
      wsConnect.value = true
      wsLoading.value = false
    }
    window.ws.onclose = () => {
      wsConnect.value = false
      wsLoading.value = false
    }
    window.ws.onmessage = (e) => {
      if (e.data === "PING") {
        window.ws.send("PONG")
      } else {
        store.commit("addLog", JSON.parse(e.data))
      }
    }
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
</style>