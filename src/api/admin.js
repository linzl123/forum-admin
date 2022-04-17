import request from "@/api/request.js"

// user
export function getUsers() {
  return request.get("/admin/users")
}

export function getBanUsers() {
  return request.get("/admin/ban-users")
}

export function addBanUser(ban_user_id, reason) {
  return request.post("/admin/add-ban-users", {
    ban_user_id,
    reason,
  })
}

export function cancelBanUser(ban_user_id) {
  return request.post("/admin/cancel-ban-users", {
    ban_user_id,
  })
}

export function silenceUser(user_id, disable_send_msg_time) {
  return request.post("/admin/silence-user", {
    user_id,
    disable_send_msg_time,
  })
}

// ip
export function getBanIps() {
  return request.get("/admin/ban-ips")
}

export function addBanIp(ban_ip, reason) {
  return request.post("/admin/add-ban-ips", {
    ban_ip,
    reason,
  })
}

export function cancelBanIp(ban_ip) {
  return request.post("/admin/cancel-ban-ip", {
    ban_ip,
  })
}

// post
export function setTopPost(post_id, describe, is_top) {
  return request.post("/admin/set-top-post", {
    post_id,
    describe,
    is_top,
  })
}

// 审批
export function fetchSetAuditedUser(user_id, need_approval) {
  return request.post("/admin/set-approval-user", {
    user_id,
    need_approval,
  })
}

export function fetchAuditedPost() {
  return request.get("/admin/need-approval-post")
}

export function fetchApprovePost(approval_post_id) {
  return request.post("/admin/approval-post", {
    approval_post_id,
  })
}

// log