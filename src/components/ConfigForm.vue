<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center gap-2 mb-4">
      <Settings class="w-5 h-5" />
      <h2 class="text-xl font-semibold">Azure DevOps Configuration</h2>
    </div>
    <form @submit="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Base URL</label>
        <input
          v-model="baseUrl"
          type="text"
          placeholder="https://dev.azure.com/your-org"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.baseUrl }"
        />
        <p v-if="errors.baseUrl" class="mt-1 text-sm text-red-600">{{ errors.baseUrl }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">API Key</label>
        <input
          v-model="apiKey"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.apiKey }"
        />
        <p v-if="errors.apiKey" class="mt-1 text-sm text-red-600">{{ errors.apiKey }}</p>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Connect
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Settings } from 'lucide-vue-next';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import type { AzureConfig } from '../types/azure';

const emit = defineEmits<{
  (e: 'submit', config: AzureConfig): void;
}>();

const schema = toFormValidator(
  z.object({
    baseUrl: z.string().url('Please enter a valid URL'),
    apiKey: z.string().min(1, 'API Key is required'),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const baseUrl = ref('');
const apiKey = ref('');

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    baseUrl: values.baseUrl,
    apiKey: values.apiKey,
  });
});
</script>