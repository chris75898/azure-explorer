import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AzureConfig } from './types/azure';
import ConfigForm from './components/ConfigForm';
import Explorer from './components/Explorer';

const queryClient = new QueryClient();

function App() {
  const [config, setConfig] = useState<AzureConfig | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          {!config ? (
            <div className="max-w-md mx-auto mt-20">
              <ConfigForm onSubmit={setConfig} />
            </div>
          ) : (
            <Explorer config={config} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;