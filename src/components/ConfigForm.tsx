import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings } from 'lucide-react';

const configSchema = z.object({
  baseUrl: z.string().url('Please enter a valid URL'),
  apiKey: z.string().min(1, 'API Key is required'),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigFormProps {
  onSubmit: (data: ConfigFormData) => void;
}

export default function ConfigForm({ onSubmit }: ConfigFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Azure DevOps Configuration</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Base URL</label>
          <input
            {...register('baseUrl')}
            type="text"
            placeholder="https://dev.azure.com/your-org"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.baseUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.baseUrl.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            {...register('apiKey')}
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.apiKey && (
            <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Connect
        </button>
      </form>
    </div>
  );
}