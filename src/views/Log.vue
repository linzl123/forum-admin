<template>
  <el-card class="card">
    <template #header>
      <div class="search">
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
      <el-table-column prop="http_status_code" label="状态码" width="163"/>
      <el-table-column prop="response_message['响应消息']" label="响应消息" width="155">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import store from "@/store"
import {computed, ref} from "vue"
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
</script>

<style scoped>

</style>