<template>
  <el-card class="card">
    <template #header>
      <div class="search">
        <div class="search-item search-zone">
          <el-select v-model="zone">
            <el-option v-for="(item,idx) in zoneList" :key="idx"
                       :label="item.label" :value="item.value"/>
          </el-select>
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
        <div class="search-item">
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
      <el-table-column prop="nickname" label="发言者"/>
      <el-table-column prop="avatar" label="头像" width="66">
        <template #default="data">
          <el-avatar :size="40" :src="data.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="post_time" label="发言时间" width="163"/>
      <el-table-column label="操作" fixed="right">
        <template #default="data">
          <div class="handle">
            <div @click="handleAudit(data.row)">
              <el-tooltip content="确认通过审核">
                <svg t="1650202988536" class="handle-icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="3262" width="16" height="16">
                  <path
                    d="M512 68.266667c244.053333 0 443.733333 199.68 443.733333 443.733333s-199.68 443.733333-443.733333 443.733333S68.266667 756.053333 68.266667 512 267.946667 68.266667 512 68.266667z m0-68.266667C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z"
                    p-id="3263" fill="#1296db"></path>
                  <path
                    d="M740.625067 413.184l-261.290667 256a44.9536 44.9536 0 0 1-64.170667 0l-128.341333-125.7472c-18.3296-17.954133-18.3296-44.919467 0-62.8736a44.9536 44.9536 0 0 1 64.170667 0l96.256 94.3104 229.205333-220.0576a44.9536 44.9536 0 0 1 64.170667 0c13.755733 13.448533 13.755733 40.413867 0 58.368z"
                    p-id="3264" fill="#1296db"></path>
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
import {fetchApprovePost, fetchAuditedPost} from "@/api/admin.js"
import store from "@/store"
import {getImg} from "@/api/image.js"
import {getUserByUid} from "@/api/user.js"

// 获取帖子
const loading = ref(true)
const allPostArr = ref([])
const create = async () => {
  loading.value = true
  let res = await fetchAuditedPost()
  if (res.state === 100) {
    res.approval_posts.forEach((v, i) => {
      getUserByUid(v.u_id).then((ret) => {
        v.avatar = ret.avatar
        v.nickname = ret.nickname
      })
      v.img_id = getImg(v.img_id)
      v.post_time = v.post_time.slice(0, 10) + " " + v.post_time.slice(11, 19)
      v.zone = zoneList[v.zone].label
    })
    allPostArr.value = res.approval_posts
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
    && post.zone.includes(zone.value),
  ),
)
create()
// 查询
const zoneList = [
  {label: "全部分区", value: ""},
  {label: "闲聊区", value: "闲聊区"},
  {label: "学习区", value: "学习区"},
  {label: "交易区", value: "交易区"},
]
const zone = ref(zoneList[0].value)
const inputTitle = ref("")
const inputContent = ref("")
const inputNickname = ref("")
const resetSearch = () => {
  inputTitle.value = ""
  inputContent.value = ""
  inputNickname.value = ""
  zone.value = ""
  create()
}
// 审核
let auditLock = false
const handleAudit = async (post) => {
  if (auditLock) return
  auditLock = true
  let res = await fetchApprovePost(post.post_id)
  if (res.state === 100) {
    allPostArr.value.splice(allPostArr.value.indexOf(post), 1)
    store.commit("alert", {message: "审核成功", type: "success"})
  } else {
    store.commit("alert", {message: "服务器出错", type: "error"})
  }
  auditLock = false
}
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