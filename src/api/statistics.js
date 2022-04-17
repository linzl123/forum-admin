import request from "@/api/request.js"

export function getPostPieChart(start_time, end_time) {
  return request.post("/admin/post-statistics/pie-chart", {
    start_time,
    end_time,
  })
}

export function getPostLineChart(){
  return request.get('/admin/post-statistics/line-chart')
}

// date: yyyy-MM-dd
export function getPostBarChart(date){
  return request.post('/admin/post-statistics/bar-chart',{
    date
  })
}