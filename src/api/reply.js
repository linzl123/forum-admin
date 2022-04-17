import request from "@/api/request"

export function getReplyByRid(reply_id) {
  return request.get("/reply/" + reply_id)
}

export function getReplyByUid(u_id) {
  return request.get("/profile/allreplyid-by-uid/" + u_id)
}

export function deleteReplyByRid(reply_id) {
  return request.post("/admin/delete-reply", {
    reply_id,
  })
}