import axios from 'axios';
import { AzureConfig, Project, Pipeline, Release } from '../types/azure';

const createApi = (config: AzureConfig) => {
  const api = axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Basic ${btoa(`:${config.apiKey}`)}`,
    },
  });

  return {
    async getProjects() {
      const response = await api.get('/_apis/projects?api-version=7.0');
      return response.data.value as Project[];
    },

    async getPipelines(projectId: string) {
      const response = await api.get(`/${projectId}/_apis/pipelines?api-version=7.0`);
      return response.data.value as Pipeline[];
    },

    async getReleases(projectId: string) {
      const response = await api.get(`/${projectId}/_apis/release/releases?api-version=7.0`);
      return response.data.value as Release[];
    },

    async queryReleases(projectId: string, query: any) {
      const response = await api.post(`/${projectId}/_apis/release/releases/query?api-version=7.0`, query);
      return response.data.value as Release[];
    },
  };
};

export default createApi;