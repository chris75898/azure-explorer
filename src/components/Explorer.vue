<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="p-4 border-b">
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="view = 'projects'"
          :class="[
            'px-4 py-2 rounded',
            view === 'projects' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
          ]"
        >
          Projects
        </button>
        <template v-if="selectedProject">
          <button
            @click="view = 'pipelines'"
            :class="[
              'px-4 py-2 rounded',
              view === 'pipelines' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            ]"
          >
            Pipelines
          </button>
          <button
            @click="view = 'releases'"
            :class="[
              'px-4 py-2 rounded',
              view === 'releases' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            ]"
          >
            Releases
          </button>
        </template>
      </div>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            v-model="query"
            type="text"
            placeholder="Search..."
            class="pl-10 pr-4 py-2 w-full border rounded-md"
          />
        </div>
        <button
          v-if="view === 'releases'"
          @click="query = 'production-no-approvers'"
          class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Filter class="h-5 w-5" />
          Production without approvers
        </button>
      </div>
    </div>

    <div class="p-4">
      <div v-if="view === 'projects' && projects" class="space-y-2">
        <div
          v-for="project in projects"
          :key="project.id"
          @click="selectProject(project.id)"
          class="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
        >
          <h3 class="font-medium">{{ project.name }}</h3>
          <p v-if="project.description" class="text-sm text-gray-600">
            {{ project.description }}
          </p>
        </div>
      </div>

      <div v-if="view === 'pipelines' && pipelines" class="space-y-2">
        <div
          v-for="pipeline in pipelines"
          :key="pipeline.id"
          class="p-4 border rounded-md"
        >
          <div class="flex justify-between items-center">
            <h3 class="font-medium">{{ pipeline.name }}</h3>
            <span
              :class="[
                'px-2 py-1 rounded text-sm',
                pipeline.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                pipeline.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ pipeline.status }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="view === 'releases' && releases" class="space-y-2">
        <div
          v-for="release in filteredReleases"
          :key="release.id"
          class="p-4 border rounded-md"
        >
          <h3 class="font-medium">{{ release.name }}</h3>
          <div class="mt-2 space-y-2">
            <div
              v-for="env in release.environments"
              :key="env.id"
              class="flex items-center justify-between text-sm"
            >
              <span>{{ env.name }}</span>
              <span
                :class="[
                  'px-2 py-1 rounded',
                  env.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                  env.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]"
              >
                {{ env.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Search, Filter } from 'lucide-vue-next';
import createApi from '../services/azureApi';
import type { AzureConfig } from '../types/azure';

const props = defineProps<{
  config: AzureConfig;
}>();

const api = createApi(props.config);
const view = ref<'projects' | 'pipelines' | 'releases'>('projects');
const selectedProject = ref<string | null>(null);
const query = ref('');

const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => api.getProjects()
});

const { data: pipelines } = useQuery({
  queryKey: ['pipelines', selectedProject],
  queryFn: () => selectedProject.value ? api.getPipelines(selectedProject.value) : null,
  enabled: computed(() => !!selectedProject.value)
});

const { data: releases } = useQuery({
  queryKey: ['releases', selectedProject],
  queryFn: () => selectedProject.value ? api.getReleases(selectedProject.value) : null,
  enabled: computed(() => !!selectedProject.value)
});

const filteredReleases = computed(() => {
  if (!releases.value) return [];
  if (query.value === 'production-no-approvers') {
    return releases.value.filter(release =>
      release.environments.some(env =>
        env.name.toLowerCase().includes('production') &&
        (!env.preDeployApprovals || env.preDeployApprovals.length === 0)
      )
    );
  }
  return releases.value;
});

const selectProject = (projectId: string) => {
  selectedProject.value = projectId;
  view.value = 'pipelines';
};
</script>