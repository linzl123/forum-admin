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
          <span class="search-item-text">帐号</span>
          <el-input v-model="inputUname" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <span class="search-item-text">昵称</span>
          <el-input v-model="inputNickname" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </template>
    <el-table :data="curUserArr" row-key="u_id"
              border style="width: 100%" height="73vh">
      <template #empty>
        <div v-if="loading" v-loading="loading"></div>
        <div v-else>暂无数据</div>
      </template>
      <el-table-column prop="u_id" label="ID"/>
      <el-table-column prop="ImgId" label="头像">
        <template #default="data">
          <el-avatar :size="40" :src="data.row.img_id"/>
        </template>
      </el-table-column>
      <el-table-column prop="u_name" label="帐号"/>
      <el-table-column prop="u_nickname" label="昵称"/>
      <el-table-column prop="u_time" label="创建时间" width="163"/>
      <el-table-column prop="silenceTime" label="禁言到期时间" width="155"/>
      <el-table-column prop="banReason" label="封禁原因"/>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="data">
          <div class="handle">
            <div @click="handleSilence(data.row)">
              <el-tooltip content="禁言此用户">
                <svg t="1649160745059" class="handle-icon" viewBox="0 0 1024 1024"
                     xmlns="http://www.w3.org/2000/svg" p-id="14633" width="16" height="16">
                  <path
                    d="M795.136 180.224L193.536 756.736c-0.512 0.512-0.512 2.048 0 2.56l33.28 33.28c0.512 0.512 2.048 0.512 2.56 0L830.464 216.064c0.512-0.512 0.512-2.048 0-2.56l-33.28-33.28c-0.512-0.512-1.536-0.512-2.048 0zM296.96 591.36v-2.56h-49.152c-1.024 0-2.048 1.024-1.536 2.048 2.56 13.824 6.656 27.136 11.264 38.912 0.512 1.024 2.048 1.536 3.072 0.512l36.352-38.912z m385.536-390.656c0.512-0.512 0.512-1.536 0.512-2.048-28.672-55.808-89.6-96.256-158.208-96.256-99.84 0-179.2 79.36-179.2 179.2v256c0 2.56 317.952-317.44 336.896-336.896z m-256 486.4c-1.024 1.024-0.512 2.048 0.512 2.56 27.648 17.408 60.416 29.696 95.232 29.696 99.84 0 179.2-79.36 179.2-179.2V413.696c0-1.536-2.048-2.56-3.072-1.024l-271.872 274.432z m98.304 80.896c-48.128 0-96.256-14.848-134.656-42.496-0.512-0.512-1.536-0.512-2.048 0l-33.28 33.28c-1.024 1.024-0.512 2.048 0 2.56 40.448 29.696 90.112 49.664 142.848 54.784 1.024 0 1.536 1.024 1.536 1.536v47.616c0 1.024-1.024 1.536-1.536 1.536H476.16c-17.92 0-31.744 16.896-26.624 33.792 3.072 10.752 12.288 17.408 24.576 17.408h99.84c17.92 0 31.744-16.896 26.624-33.792-3.072-10.752-12.288-17.408-24.576-17.408h-24.064c-1.024 0-1.536-1.024-1.536-1.536v-47.616c0-1.024 0.512-1.536 1.536-1.536 123.904-10.752 230.4-107.008 253.952-228.352 0-1.024-0.512-2.048-1.536-2.048h-47.616c-1.024 0-1.536 0.512-1.536 1.536-24.064 104.448-120.832 180.736-230.4 180.736z"
                    p-id="14634" fill="#1296db"></path>
                </svg>
              </el-tooltip>
            </div>
            <div @click="handleAudited(data.row)">
              <el-tooltip :content="data.row.auditedText">
                <svg t="1650197474395" class="handle-icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="1350" width="16" height="16">
                  <path
                    d="M655.701 1014.443c-41.728 6.229-88.746 9.557-140.885 9.557H355.413c-388.266 0-477.994-210.432-171.392-435.797 47.275-34.646 105.814-58.966 177.494-69.803 0.512 0 0.981 0.17 1.28 0.512l84.522 79.701c0.512 0.598 1.494 0.598 2.091 0l84.907-80.213c65.877 9.941 120.746 31.019 166.101 61.141a256 256 0 0 0-44.715 434.902z m-207.445-63.574h0.128v0.086l92.16-87.04a1.707 1.707 0 0 0 0.256-1.451l-91.136-258.475c-0.341-1.28-2.261-1.28-2.773 0l-91.136 258.39c-0.086 0.597 0 1.109 0.426 1.45l92.075 87.04zM177.109 256c0-141.397 121.43-256 271.062-256 149.333 0 270.378 113.92 271.274 254.72 0.683 139.093-125.269 258.048-272.554 257.28-149.12-0.768-269.782-114.944-269.782-256z"
                    p-id="1351" :fill="data.row.auditedColor"></path>
                  <path
                    d="M810.667 1024a213.333 213.333 0 1 1 0-426.667 213.333 213.333 0 0 1 0 426.667z m-14.72-125.013a34.347 34.347 0 0 0-34.902 34.304c0 19.072 15.787 34.346 34.902 34.346a34.688 34.688 0 0 0 34.901-34.346 34.688 34.688 0 0 0-34.901-34.347z m1.109-241.024c-29.995 0-54.016 8.192-72.533 24.533-18.518 16.341-29.44 38.699-29.995 59.435-0.555 20.736 48.512 16.341 50.176 5.973 1.621-10.88 9.813-28.33 19.627-35.968 9.258-7.637 21.248-11.99 34.901-11.99 14.72 0 26.155 3.84 34.347 11.435a34.773 34.773 0 0 1 12.544 27.307 35.2 35.2 0 0 1-7.126 20.693c-3.242 3.84-12.501 12.544-28.885 25.6-15.787 13.099-26.71 24.534-32.17 34.902s-8.15 23.466-8.15 39.808v13.098h49.579c-0.512-15.274 1.109-25.6 3.84-31.104 2.73-5.973 9.813-13.61 21.248-22.869 22.357-18.56 37.12-33.28 43.605-44.16 6.57-10.923 10.368-22.357 10.368-34.347 1.664-22.357-7.637-41.472-26.155-57.813-18.56-16.341-43.605-24.533-75.221-24.533z"
                    p-id="1352" :fill="data.row.auditedColor"></path>
                </svg>
              </el-tooltip>
            </div>
            <div @click="handleBan(data.row)">
              <el-tooltip :content="data.row.banText">
                <svg t="1649001325314" class="handle-icon" viewBox="0 0 1024 1024"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="10748" width="16" height="16">
                  <path
                    d="M512 36.571429a475.428571 475.428571 0 1 1 0 950.857142 475.428571 475.428571 0 0 1 0-950.857142z m305.590857 228.059428l-552.96 552.96a393.142857 393.142857 0 0 0 552.96-552.96zM512 118.857143a393.142857 393.142857 0 0 0-305.590857 640.512l552.96-552.96A391.533714 391.533714 0 0 0 512 118.857143z"
                    p-id="10749" :fill="data.row.banColor"></path>
                </svg>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="silenceDialog" title="禁言时长（全为0则取消）" width="30%">
    <div class="silence-time">
      <div>
        <el-input-number v-model="dayInput" controls-position="right" :min="0"/>
        <span>&ensp;天</span>
      </div>
      <div>
        <el-input-number v-model="hourInput" controls-position="right" :min="0"/>
        <span>&ensp;小时</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="silenceCancel">取消</el-button>
      <el-button type="primary" @click="silenceEnsure" :loading="silenceLoading">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="banDialog" title="封禁用户">
    <div>
      <h3>封禁原因</h3>
      <el-input v-model="banInput" placeholder="请输入封禁原因"/>
    </div>
    <template #footer>
      <el-button @click="banCancel">取消</el-button>
      <el-button type="primary" @click="banEnsure" :loading="banLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, ref} from "vue"
import {addBanUser, cancelBanUser, fetchSetAuditedUser, getBanUsers, getUsers, silenceUser} from "@/api/admin.js"
import {getImg} from "@/api/image.js"
import store from "@/store"

// 获取用户
const loading = ref(true)
const allUserArr = ref([])
const create = async () => {
  loading.value = true
  let reqUser = getUsers()
  let reqBanUser = getBanUsers()
  let [resBanUser, resUser] = await Promise.all([reqBanUser, reqUser])
  if (resUser.state === 100 && resBanUser.state === 100) {
    let now = new Date().valueOf()
    let banUser = null
    resUser.users.forEach((v) => {
      banUser = resBanUser.ban_user_id_and_reason.find(i => i.user_id === v.u_id)
      if (banUser) {
        v.banReason = banUser.reason
        v.banColor = "#d81e06"
        v.banText = "取消封禁此用户"
      } else {
        v.banReason = ""
        v.banColor = "#8a8a8a"
        v.banText = "封禁此用户"
      }
      if (v.need_approval) {
        v.auditedText = "取消标记为需审核用户"
        v.auditedColor = "#d81e06"
      } else {
        v.auditedText = "标记为需审核用户"
        v.auditedColor = "#8a8a8a"
      }
      v.img_id = getImg(v.img_id)
      v.u_time = v.u_time.slice(0, 10) + " " + v.u_time.slice(11, 19)
      if (v.disable_send_msg_time - now > 0) {
        v.silenceTime = new Date(Number(v.disable_send_msg_time)).toLocaleString()
      }
    })
    allUserArr.value = resUser.users
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  loading.value = false
}
const curUserArr = computed(() =>
  allUserArr.value.filter(user =>
    String(user.u_id).includes(inputUid.value)
    && user.u_name.includes(inputUname.value)
    && user.u_nickname.includes(inputNickname.value),
  ),
)
create()
// 查询
const inputUid = ref("")
const inputUname = ref("")
const inputNickname = ref("")
const resetSearch = () => {
  inputUid.value = ""
  inputUname.value = ""
  inputNickname.value = ""
}
// 禁言
const silenceDialog = ref(false)
const dayInput = ref(0)
const hourInput = ref(0)
const silenceLoading = ref(false)
let checkedUser = null
const handleSilence = async (user) => {
  checkedUser = user
  silenceDialog.value = true
}
const silenceEnsure = async () => {
  silenceLoading.value = true
  let time = String(new Date().valueOf() + dayInput.value * 86400000 + hourInput.value * 3600000)
  let res = await silenceUser(checkedUser.u_id, time)
  if (res.state === 100) {
    if (dayInput.value !== 0 || hourInput.value !== 0) {
      dayInput.value = 0
      hourInput.value = 0
      checkedUser.silenceTime = new Date(Number(time)).toLocaleString()
      store.commit("alert", {message: "禁言成功", type: "success"})
    } else {
      checkedUser.silenceTime = ""
      store.commit("alert", {message: "取消禁言成功", type: "success"})
    }
    silenceDialog.value = false
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  silenceLoading.value = false
}
const silenceCancel = () => {
  silenceDialog.value = false
}
// 禁用
const banDialog = ref(false)
const banInput = ref("")
const banLoading = ref(false)
let checkUser = null
let banLock = false
const handleBan = async (user) => {
  if (banLock) return
  banLock = true
  if (user.banReason === "") {
    banInput.value = user.banReason
    checkUser = user
    banDialog.value = true
  } else {
    let res = await cancelBanUser(user.u_id)
    if (res.state === 100) {
      user.banReason = ""
      user.banColor = "#8a8a8a"
      user.banText = "封禁此用户"
      store.commit("alert", {message: "取消封禁成功", type: "success"})
    } else {
      store.commit("alert", {message: "服务器出错", type: "error"})
    }
  }
  banLock = false
}
const banEnsure = async () => {
  banLoading.value = true
  if (banInput.value === "") {
    store.commit("alert", {message: "请输入原因", type: "warning"})
  } else {
    let res = await addBanUser(checkUser.u_id, banInput.value)
    if (res.state === 100) {
      checkUser.banReason = banInput.value
      checkUser.banColor = "#d81e06"
      checkUser.banText = "取消封禁此用户"
      store.commit("alert", {message: "封禁成功", type: "success"})
      banDialog.value = false
    } else {
      store.commit("alert", {message: "服务器出错", type: "error"})
    }
  }
  banLoading.value = false
}
const banCancel = () => {
  banDialog.value = false
}
// 标记为需审核用户
let auditedLock = false
const handleAudited = async (user) => {
  if (auditedLock) return
  auditedLock = true
  if (user.need_approval) {
    let res = await fetchSetAuditedUser(user.u_id, false)
    if (res.state === 100) {
      user.need_approval = false
      user.auditedText = "标记为需审核用户"
      user.auditedColor = "#8a8a8a"
      store.commit("alert", {message: "取消标记成功", type: "success"})
    } else {
      store.commit("alert", {message: "服务器出错", type: "error"})
    }
  } else {
    let res = await fetchSetAuditedUser(user.u_id, true)
    if (res.state === 100) {
      user.need_approval = true
      user.auditedText = "取消标记为需审核用户"
      user.auditedColor = "#d81e06"
      store.commit("alert", {message: "标记成功", type: "success"})
    } else {
      store.commit("alert", {message: "服务器出错", type: "error"})
    }
  }
  auditedLock = false
}
</script>

<style scoped>
.silence-time {
  display: flex;
  justify-content: space-around;
}
</style>