<template>
  <el-card class="card">
    <template #header>
      <div class="search">
        <div>
          <div class="search-item" style="margin-bottom: 1em">
            <div class=" search-zone">
              <el-select v-model="zone" placeholder="全部">
                <el-option v-for="(item,idx) in zoneList" :key="idx"
                           :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div style="margin-left: 1em">
              <el-date-picker v-model="defineTime" type="daterange"
                              start-placeholder="开始时间" end-placeholder="结束时间">
              </el-date-picker>
            </div>
          </div>
          <div class="search-item">
            <div class="search-item">
              <span class="search-item-text">标题</span>
              <el-input v-model="inputTitle" clearable>
                <template #prefix>🔍</template>
              </el-input>
            </div>
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
          </div>
        </div>
        <div>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </template>
    <el-table :data="curPostArr" row-key="post_id"
              border style="width: 100%" height="73vh">
      <template #empty>
        <div v-if="loading" v-loading="loading"></div>
        <div v-else>暂无数据</div>
      </template>
      <el-table-column prop="zone" label="分区" width="66"/>
      <el-table-column prop="post_name" label="标题" min-width="100"/>
      <el-table-column prop="post_txt" label="内容" min-width="300">
        <template #default="data">
          <div class="content">
            {{ data.row.post_txt }}
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
      <el-table-column prop="hot" label="热度" width="108" sortable/>
      <el-table-column prop="nickname" label="发言者"/>
      <el-table-column prop="avatar" label="头像" width="66">
        <template #default="data">
          <el-avatar :size="40" :src="data.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="post_time" label="发言时间" width="144"/>
      <el-table-column label="操作" fixed="right">
        <template #default="data">
          <div class="handle">
            <div @click="handleInfo(data.row)">
              <el-tooltip content="查看帖子评论">
                <svg t="1649001114567" class="handle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                     p-id="3799" width="16" height="16">
                  <path
                    d="M560 800l-10.464-416h-75.072L464 800h96z m-14.144-493.984c9.44-9.312 14.144-20.672 14.144-34.016 0-13.6-4.704-24.992-14.144-34.208A46.784 46.784 0 0 0 512 224c-13.12 0-24.448 4.608-33.856 13.792A45.856 45.856 0 0 0 464 272c0 13.344 4.704 24.704 14.144 34.016 9.408 9.312 20.704 13.984 33.856 13.984 13.12 0 24.448-4.672 33.856-13.984zM512 32C246.912 32 32 246.912 32 512c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m0 64c229.76 0 416 186.24 416 416s-186.24 416-416 416S96 741.76 96 512 282.24 96 512 96z"
                    p-id="3800" fill="#1296db"></path>
                </svg>
              </el-tooltip>
            </div>
            <div @click="handleDelete(data.row)">
              <el-tooltip content="删除帖子">
                <svg t="1649132980340" class="handle-icon" viewBox="0 0 1024 1024" version="1.1"
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
import {deletePostByPid, getHotPosts, getPostsByPids} from "@/api/post.js"
import {getUserByUid} from "@/api/user.js"
import {useRouter} from "vue-router"

// 获取帖子
const loading = ref(true)
const zoneList = [
  {label: "全部分区", value: ""},
  {label: "闲聊区", value: "闲聊区"},
  {label: "学习区", value: "学习区"},
  {label: "交易区", value: "交易区"},
]
const zone = ref(zoneList[0].value)
const allPostArr = ref([])
const create = async () => {
  loading.value = true
  let res = await getHotPosts()
  if (res.state === 100) {
    let idArr = Array(res.hot_desc.length),
      hotArr = Array(res.hot_desc.length)
    res.hot_desc.forEach((v, i) => {
      idArr[i] = v.post_id
      hotArr[i] = v.post_hot
    })
    res = await getPostsByPids(idArr)
    if (res.state === 100) {
      res.posts.forEach((v, i) => {
        v.img_id = getImg(v.img_id)
        v.post_time = v.post_time.slice(0, 10) + " " + v.post_time.slice(27)
        v.msTime = new Date(v.post_time).getTime()
        console.log(v.post_time)
        getUserByUid(v.u_id).then((ret) => {
          v.avatar = ret.avatar
          v.nickname = ret.nickname
        })
        v.hot = hotArr[i]
        v.zone = zoneList[v.zone].label
      })
      allPostArr.value = res.posts
    } else {
      store.commit("alert", {message: "服务器出错", type: "error"})
    }
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  loading.value = false
}
const curPostArr = computed(() =>
  allPostArr.value.filter(post =>
    post.nickname.includes(inputNickname.value)
    && post.post_name.includes(inputTitle.value)
    && post.post_txt.includes(inputContent.value)
    && post.zone.includes(zone.value)
    && post.msTime > formatTime.value[0] && post.msTime < formatTime.value[1],
  ),
)
create()
// 查询
const inputTitle = ref("")
const inputContent = ref("")
const inputNickname = ref("")
const resetSearch = () => {
  inputTitle.value = ""
  inputContent.value = ""
  inputNickname.value = ""
  create()
}
// 详情
const router = useRouter()
const handleInfo = (post) => {
  router.push("/post/" + post.post_id + "/comment")
}
// 删除
const handleDelete = async (post) => {
  let res = await deletePostByPid(post.post_id)
  if (res.state === 100) {
    allPostArr.value.splice(allPostArr.value.indexOf(post), 1)
    store.commit("alert", {message: "删除成功", type: "success"})
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
}
// 时间
const defineTime = ref([new Date((new Date().getFullYear()).toString()), new Date()])
const formatTime = computed(() =>
  [defineTime.value[0].getTime(), defineTime.value[1].getTime()],
)
</script>

<style scoped>
.image {
  width: 40px;
  height: 40px;
  object-fit: scale-down;
}

.search-zone {
  width: 100px;
}
</style>