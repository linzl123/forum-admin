import request from "@/api/request"

export function getAllPostsByZone(zone) {
  return request.get("/v2/zone/" + zone)
}

export function getPostByPid(post_id) {
  return request.get("/post/" + post_id)
}

export function getPostsByPids(post_ids) {
  return request.post("/v2/posts", {
    post_ids,
  })
}

export function getHotPosts() {
  return request.get("/allposthot")
}

export function getAllPostIdsByUid(u_id) {
  return request.get("/profile/allpostid-by-uid/" + u_id)
}

export function deletePostByPid(post_id) {
  return request.post("/admin/delete-post", {
    post_id,
  })
}

export function getTopPost() {
  return request.get("/top-post")
}