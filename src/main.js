import {createApp} from "vue"
import App from "./App.vue"

import router from "@/router"
import store from "@/store"
import "@/styles/index.css"
import {getUsers} from "@/api/admin.js"
import {getImg} from "@/api/image.js"

const app = createApp(App)
app.use(router).use(store).mount("#app")

// @ts-ignore
store.commit("setAlert", ElMessage)

//
getUsers().then(r => {
  r.users.forEach((v) => {
    v.img_id = getImg(v.img_id)
    store.commit("setUserMap", [v.u_id,
      {
        avatar: v.img_id,
        nickname: v.u_nickname,
        silence: v.disable_send_msg_time,
      }])
  })
})
