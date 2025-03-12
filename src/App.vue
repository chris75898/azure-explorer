<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <div v-if="!config" class="max-w-md mx-auto mt-20">
        <ConfigForm @submit="setConfig" />
      </div>
      <Explorer v-else :config="config" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfigForm from './components/ConfigForm.vue';
import Explorer from './components/Explorer.vue';
import type { AzureConfig } from './types/azure';

const config = ref<AzureConfig | null>(null);

const setConfig = (newConfig: AzureConfig) => {
  config.value = newConfig;
};
</script>