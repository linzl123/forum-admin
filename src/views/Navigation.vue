<template>
  <el-row>
    <el-col :span="4" class="sidebar">
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
    </el-col>
    <el-col :span="20">
      <el-page-header class="navbar" title="返回" :content="route.meta.content" @back="router.back()"/>
      <div style="padding: 16px">
        <router-view></router-view>
        <!--        <router-view v-slot="{Component,route}">-->
        <!--          <keep-alive>-->
        <!--            <component :is="Component" :key="route.path"></component>-->
        <!--          </keep-alive>-->
        <!--        </router-view>-->
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router"

const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.sidebar {
  background-color: #304156;
  min-height: 100vh;
}

.navbar {
  display: flex;
  height: 50px;
  align-items: center;
  padding-left: 30px;
  background-color: #ffffff;
}
</style>