import axios from 'axios'

// Use relative baseURL so all requests go through Vite's /api proxy → backend:8000
// This means the frontend always calls its own origin (port 4033) and Vite forwards to FastAPI.
export const api = axios.create({
  baseURL: '',
  timeout: 60000,
})

export const dashboardService = {
  getSummary: () => api.get('/api/dashboard/summary').then(r => r.data),
}

export const accidentService = {
  getByLocation: (group = 'state', limit = 15) =>
    api.get(`/api/accidents/by-location?group=${group}&limit=${limit}`).then(r => r.data),
  getBySeverity: (group = 'overall') =>
    api.get(`/api/accidents/by-severity?group=${group}`).then(r => r.data),
  getByWeather: (group = 'weather_condition') =>
    api.get(`/api/accidents/by-weather?group=${group}`).then(r => r.data),
  getByTime: (group = 'hour') =>
    api.get(`/api/accidents/by-time?group=${group}`).then(r => r.data),
  getTrends: (interval = 'month') =>
    api.get(`/api/accidents/trends?interval=${interval}`).then(r => r.data),
}

export const hotspotService = {
  getHotspots: (riskLevels?: string, city?: string, limit = 300) => {
    const params = new URLSearchParams()
    if (riskLevels) params.append('risk_level', riskLevels)
    if (city && city !== 'All') params.append('city', city)
    params.append('limit', String(limit))
    return api.get(`/api/hotspots?${params.toString()}`).then(r => r.data)
  },
  getInsights: (city?: string) => {
    const params = new URLSearchParams()
    if (city && city !== 'All') params.append('city', city)
    const qs = params.toString() ? `?${params.toString()}` : ''
    return api.get(`/api/hotspots/insights${qs}`).then(r => r.data)
  },
}

export const hadoopService = {
  getHDFS: () => api.get('/api/hadoop/hdfs').then(r => r.data),
  uploadDataset: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/api/hadoop/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
  runMapReduce: (job: string) =>
    api.post('/api/hadoop/mapreduce/run', { job }).then(r => r.data),
  executeHive: (query_name: string) =>
    api.post('/api/hadoop/hive/execute', { query_name }).then(r => r.data),
  runPig: (script: string) =>
    api.post('/api/hadoop/pig/run', { script }).then(r => r.data),
  runSpark: (job: string) =>
    api.post('/api/hadoop/spark/run', { job }).then(r => r.data),
  getJobs: () => api.get('/api/hadoop/jobs').then(r => r.data),
  getYARN: () => api.get('/api/hadoop/yarn').then(r => r.data),
}
