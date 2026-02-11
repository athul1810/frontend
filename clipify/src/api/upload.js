import apiClient from './client.js';
import { getApiBaseURL } from './client.js';

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/api/upload', formData);
  return data;
}

export async function startJob(body) {
  const { data } = await apiClient.post('/api/jobs', body);
  return data;
}

export async function getJobStatus(jobId) {
  const { data } = await apiClient.get(`/api/jobs/${jobId}`);
  return data;
}

export async function processVideo(body) {
  const { data } = await apiClient.post('/api/process', body);
  return data;
}

export function getOutputVideoURL(outputPath) {
  const base = getApiBaseURL();
  return `${base}${outputPath.startsWith('/') ? '' : '/'}${outputPath}`;
}
