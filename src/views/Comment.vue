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
    <el-table :data="curCommentArr" row-key="comment_id"
              border style="width: 100%" height="73vh">
      <template #empty>
        <div v-if="loading" v-loading="loading"></div>
        <div v-else>暂无数据</div>
      </template>
      <el-table-column prop="comment_txt" label="内容" min-width="400">
        <template #default="data">
          <div class="content">
            {{ data.row.comment_txt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="img_id" label="图片">
        <template #default="data">
          <template v-if="data.row.img_id">
            <img class="image" :src="data.row.img_id"/>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="发言者"/>
      <el-table-column prop="avatar" label="头像" width="66">
        <template #default="data">
          <el-avatar :size="40" :src="data.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="comment_time" label="发言时间" width="163"/>
      <el-table-column label="操作" fixed="right">
        <template #default="data">
          <div class="handle">
            <div @click="handleInfo(data.row)">
              <el-tooltip content="查看评论详情">
                <svg t="1649001114567" class="handle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                     p-id="3799" width="16" height="16">
                  <path
                    d="M560 800l-10.464-416h-75.072L464 800h96z m-14.144-493.984c9.44-9.312 14.144-20.672 14.144-34.016 0-13.6-4.704-24.992-14.144-34.208A46.784 46.784 0 0 0 512 224c-13.12 0-24.448 4.608-33.856 13.792A45.856 45.856 0 0 0 464 272c0 13.344 4.704 24.704 14.144 34.016 9.408 9.312 20.704 13.984 33.856 13.984 13.12 0 24.448-4.672 33.856-13.984zM512 32C246.912 32 32 246.912 32 512c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m0 64c229.76 0 416 186.24 416 416s-186.24 416-416 416S96 741.76 96 512 282.24 96 512 96z"
                    p-id="3800" fill="#1296db"></path>
                </svg>
              </el-tooltip>
            </div>
            <div @click="handleDelete(data.row)">
              <el-tooltip content="删除评论">
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
import {getImg} from "@/api/image.js"
import store from "@/store"
import {getUserByUid} from "@/api/user.js"
import {useRoute, useRouter} from "vue-router"
import {deleteCommentByCid, getAllCommentIdsByPid, getCommentByCid, getCommentWithRepliesByCid} from "@/api/comment.js"

const route = useRoute()
const pid = route.params.pid
// 获取评论
const loading = ref(true)
const allCommentArr = ref([])
const create = async () => {
  loading.value = true
  let res = await getAllCommentIdsByPid(pid)
  if (res.state === 100) {
    if (res.comment_ids) {
      let reqComment = Array(res.comment_ids.length)
      res.comment_ids.forEach((v, i) => {
        reqComment[i] = getCommentByCid(v)
      })
      let resComment = await Promise.all(reqComment)
      let resUser, i = 0
      for (let v of resComment) {
        v.comment_id = res.comment_ids[i++]
        v.img_id = getImg(v.img_id)
        v.comment_time = v.comment_time.slice(0, 10) + " " + v.comment_time.slice(11, 19)
        resUser = await getUserByUid(v.u_id)
        v.avatar = resUser.avatar
        v.nickname = resUser.nickname
      }
      allCommentArr.value = resComment
    }
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  loading.value = false
}
const curCommentArr = computed(() =>
  allCommentArr.value.filter(comment =>
    comment.nickname.includes(inputNickname.value)
    && comment.comment_txt.includes(inputContent.value),
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
const handleInfo = (comment) => {
  router.push("/post/" + pid + "/comment/" + comment.comment_id + "/reply")
}
// 删除
let delLock = false
const handleDelete = async (comment) => {
  if (delLock) return
  delLock = true
  let res = await deleteCommentByCid(comment.comment_id)
  if (res.state === 100) {
    allCommentArr.value.splice(allCommentArr.value.indexOf(comment), 1)
    store.commit("alert", {message: "删除成功", type: "success"})
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  delLock = false
}
</script>

<style scoped>
.image {
  width: 40px;
  height: 40px;
  object-fit: scale-down;
}
</style>