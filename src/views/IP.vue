<template>
  <el-card class="card">
    <template #header>
      <div class="search">
        <div class="search-item">
          <span class="search-item-text">IP</span>
          <el-input v-model="inputIP" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <span class="search-item-text">封禁原因</span>
          <el-input v-model="inputReason" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <div class="search-item">
          <el-button @click="banDialog=true">添加封禁</el-button>
        </div>
      </div>
    </template>
    <el-table :data="curIpArr" row-key="ip"
              border>
      <el-table-column prop="ip" label="IP"/>
      <el-table-column prop="reason" label="封禁原因"/>
      <el-table-column label="操作">
        <template #default="data">
          <el-button @click="handleCancelBan(data.row)">取消封禁</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="banDialog" title="封禁IP">
    <div>
      <h3>封禁IP</h3>
      <el-input v-model="ipInput" placeholder="xxx.xxx.xxx.xxx"/>
    </div>
    <div>
      <h3>封禁原因</h3>
      <el-input v-model="reasonInput" placeholder="请输入封禁原因"/>
    </div>
    <template #footer>
      <el-button @click="banCancel">取消</el-button>
      <el-button type="primary" @click="banEnsure" :loading="banLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, ref} from "vue"
import {getBanIps, addBanIp, cancelBanIp} from "@/api/admin.js"
import store from "@/store"

const allIpArr = ref([])
const curIpArr = computed(() =>
  allIpArr.value.filter(ip =>
    ip.ip.includes(inputIP.value) && ip.reason.includes(inputReason.value),
  ),
)

const create = () => {
  getBanIps().then((res) => {
    allIpArr.value = res.ban_ip_and_reason
  })
}
create()
// 查询
const inputIP = ref("")
const inputReason = ref("")
const resetSearch = () => {
  inputIP.value = ""
  inputReason.value = ""
  create()
}
// 封禁
const banDialog = ref(false)
const ipInput = ref("")
const reasonInput = ref("")
const banLoading = ref(false)
const banEnsure = async () => {
  banLoading.value = true
  if (reasonInput.value === "") {
    store.commit("alert", {message: "请输入原因", type: "warning"})
  } else {
    if (/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(ipInput.value)) {
      let res = await addBanIp(ipInput.value, reasonInput.value)
      if (res.state === 100) {
        allIpArr.value.push({ip: ipInput.value, reason: reasonInput.value})
        banDialog.value = false
        ipInput.value = ""
        reasonInput.value = ""
        store.commit("alert", {message: "封禁成功", type: "success"})
      } else if (res.state === 102) {
        store.commit("alert", {message: "该IP已被封禁", type: "info"})
      } else {
        store.commit("alert", {message: "服务器出错", type: "error"})
      }
    } else {
      store.commit("alert", {message: "请输入正确的IP地址", type: "warning"})
    }
  }
  banLoading.value = false
}
const banCancel = () => {
  banDialog.value = false
}
// 取消封禁
const handleCancelBan = async (ip) => {
  let res = await cancelBanIp(ip.ip)
  if (res.state === 100) {
    allIpArr.value.splice(allIpArr.value.indexOf(ip), 1)
    store.commit("alert", {message: "删除成功", type: "success"})
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
}
</script>

<style scoped>
.search-item-text {
  width: 6em;
}
</style>