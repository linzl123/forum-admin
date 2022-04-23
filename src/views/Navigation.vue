<template>
  <div>
    <div class="left-menu">
      <el-menu
        :default-active="route.path"
        background-color="#304156"
        text-color="#bfcbd9"
        router
      >
        <el-menu-item index="/">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/post">
          <span>帖子管理</span>
        </el-menu-item>
        <el-menu-item index="/audit">
          <span>审核帖子</span>
        </el-menu-item>
        <el-menu-item index="/ip">
          <span>IP 管理</span>
        </el-menu-item>
        <el-menu-item index="/log">
          <span>日志文件</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-main">
      <el-page-header class="navbar" title="返回" :content="route.meta.content" @back="router.back()"/>
      <div style="padding: 16px">
        <router-view></router-view>
        <!--        <router-view v-slot="{Component,route}">-->
        <!--          <keep-alive>-->
        <!--            <component :is="Component" :key="route.path"></component>-->
        <!--          </keep-alive>-->
        <!--        </router-view>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router"
import store from "@/store"

const route = useRoute()
const router = useRouter()


//WebSocket
const wsUrl = import.meta.env.VITE_WS_URL
const createWebSocket = () => {
  try {
    window.ws = new WebSocket(wsUrl)
    init()
  } catch (e) {
    console.log(e)
    // reconnect(wsUrl)
  }
}
createWebSocket()

function init() {
  window.ws.onclose = () => {
    reconnect(wsUrl)
  }
  window.ws.onerror = () => {
    reconnect(wsUrl)
  }
  window.ws.onmessage = (e) => {
    if (e.data === "PING") {
      window.ws.send("PONG")
    } else {
      store.commit("addLog", JSON.parse(e.data))
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
</script>

<style scoped>
.left-menu {
  box-sizing: border-box;
  position: fixed;
  width: 16vw;
  height: 100vh;
  background-color: #304156;
}

.left-menu:deep(.el-menu) {
  border: 0;
}

.right-main {
  margin-left: 16vw;
}

.navbar {
  display: flex;
  height: 50px;
  align-items: center;
  padding-left: 30px;
  background-color: #ffffff;
}
</style>