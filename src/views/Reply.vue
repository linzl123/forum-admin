<template>
  <el-card class="card">
    <template #header>
      <div class="search">
        <div class="search-item">
          <span class="search-item-text">内容</span>
          <el-input v-model="inputContent" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <span class="search-item-text">发言者</span>
          <el-input v-model="inputNickname" clearable>
            <template #prefix>🔍</template>
          </el-input>
        </div>
        <div class="search-item">
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </template>
    <el-table :data="curReplyArr" row-key="reply_id"
              border style="width: 100%" height="73vh">
      <template #empty>
        <div v-if="loading" v-loading="loading"></div>
        <div v-else>暂无数据</div>
      </template>
      <el-table-column prop="reply_txt" label="内容" min-width="400"/>
      <el-table-column prop="nickname" label="发言者"/>
      <el-table-column prop="avatar" label="头像" width="66">
        <template #default="data">
          <el-avatar :size="40" :src="data.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="reply_time" label="发言时间" width="163"/>
      <el-table-column label="操作" fixed="right">
        <template #default="data">
          <div class="handle">
            <div @click="handleDelete(data.row)">
              <el-tooltip content="删除回复">
                <svg t="1649132980340" class="handle-icon" viewBox="0 0 1024 1024"
                     xmlns="http://www.w3.org/2000/svg" p-id="14280" width="16" height="16">
                  <path d="M106.666667 213.333333h810.666666v42.666667H106.666667z" fill="#d81e06" p-id="14281"></path>
                  <path
                    d="M640 128v42.666667h42.666667V128c0-23.573333-19.093333-42.666667-42.538667-42.666667H383.872A42.496 42.496 0 0 0 341.333333 128v42.666667h42.666667V128h256z"
                    fill="#d81e06" p-id="14282"></path>
                  <path
                    d="M213.333333 896V256H170.666667v639.957333C170.666667 919.552 189.653333 938.666667 213.376 938.666667h597.248C834.218667 938.666667 853.333333 919.68 853.333333 895.957333V256h-42.666666v640H213.333333z"
                    fill="#d81e06" p-id="14283"></path>
                  <path
                    d="M320 341.333333h42.666667v384h-42.666667zM490.666667 341.333333h42.666666v384h-42.666666zM661.333333 341.333333h42.666667v384h-42.666667z"
                    fill="#d81e06" p-id="14284"></path>
                </svg>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import {computed, ref} from "vue"
import store from "@/store"
import {getUserByUid} from "@/api/user.js"
import {useRoute, useRouter} from "vue-router"
import {getCommentWithRepliesByCid} from "@/api/comment.js"
import {deleteReplyByRid} from "@/api/reply.js"

const route = useRoute()
const cid = route.params.cid
// 获取评论
const loading = ref(true)
const allReplyArr = ref([])
const create = async () => {
  loading.value = true
  let res = await getCommentWithRepliesByCid(cid)
  if (res.state === 100) {
    if (res.replies) {
      let resUser
      for (let v of res.replies) {
        v.reply_time = v.reply_time.slice(0, 10) + " " + v.reply_time.slice(11, 19)
        resUser = await getUserByUid(v.u_id)
        v.avatar = resUser.avatar
        v.nickname = resUser.nickname
      }
    }
    allReplyArr.value = res.replies
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  loading.value = false
}
const curReplyArr = computed(() =>
  allReplyArr.value.filter(reply =>
    reply.nickname.includes(inputNickname.value)
    && reply.reply_txt.includes(inputContent.value),
  ),
)
create()
// 查询
const inputContent = ref("")
const inputNickname = ref("")
const resetSearch = () => {
  inputNickname.value = ""
  inputContent.value = ""
  create()
}
// 详情
const router = useRouter()
const handleInfo = (reply) => {
  router.push({path: "/reply", query: {reply_id: reply.reply_id}})
}
// 删除
let delLock = false
const handleDelete = async (reply) => {
  if (delLock) return
  delLock = true
  let res = await deleteReplyByRid(reply.reply_id)
  if (res.state === 100) {
    allReplyArr.value.splice(allReplyArr.value.indexOf(reply), 1)
    store.commit("alert", {message: "删除成功", type: "success"})
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  delLock = false
}
</script>

<style scoped>
</style>