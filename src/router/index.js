import {createRouter, createWebHistory} from "vue-router"

const routes = [
  {
    path: "/",
    component: () => import("@/views/Navigation.vue"),
    children: [
      {
        path: "",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/user",
        component: () => import("@/views/User.vue"),
        meta: {
          content: "用户管理",
        },
      },
      {
        path: "/post",
        component: () => import("@/views/Post.vue"),
        meta: {
          content: "帖子管理",
        },
      },
      {
        path: "/post/:pid/comment",
        component: () => import("@/views/Comment.vue"),
        meta: {
          content: "帖子的评论",
        },
      },
      {
        path: "/post/:pid/comment/:cid/reply",
        component: () => import("@/views/Reply.vue"),
        meta: {
          content: "评论的回复",
        },
      },
      {
        path: "/audit",
        component: () => import("@/views/AuditPost.vue"),
        meta: {
          content: "审核帖子",
        },
      },
      {
        path: "/ip",
        component: () => import("@/views/IP.vue"),
        meta: {
          content: "IP 管理",
        },
      },
      {
        path: "/log",
        component: () => import("@/views/Log.vue"),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
]

const router = createRouter({
  history: createWebHistory("/admin"),
  routes,
})

export default router
