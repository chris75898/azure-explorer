import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search, Filter } from 'lucide-react';
import createApi from '../services/azureApi';
import { AzureConfig, Project, Pipeline, Release } from '../types/azure';

interface ExplorerProps {
  config: AzureConfig;
}

export default function Explorer({ config }: ExplorerProps) {
  const api = createApi(config);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [view, setView] = useState<'projects' | 'pipelines' | 'releases'>('projects');
  const [query, setQuery] = useState('');

  const { data: projects } = useQuery('projects', () => api.getProjects());
  const { data: pipelines } = useQuery(
    ['pipelines', selectedProject],
    () => selectedProject ? api.getPipelines(selectedProject) : null,
    { enabled: !!selectedProject }
  );
  const { data: releases } = useQuery(
    ['releases', selectedProject],
    () => selectedProject ? api.getReleases(selectedProject) : null,
    { enabled: !!selectedProject }
  );

  const filterReleases = () => {
    if (!releases) return [];
    return releases.filter(release => 
      release.environments.some(env => 
        env.name.toLowerCase().includes('production') && 
        (!env.preDeployApprovals || env.preDeployApprovals.length === 0)
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setView('projects')}
            className={`px-4 py-2 rounded ${view === 'projects' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
          >
            Projects
          </button>
          {selectedProject && (
            <>
              <button
                onClick={() => setView('pipelines')}
                className={`px-4 py-2 rounded ${view === 'pipelines' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
              >
                Pipelines
              </button>
              <button
                onClick={() => setView('releases')}
                className={`px-4 py-2 rounded ${view === 'releases' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
              >
                Releases
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {view === 'releases' && (
            <button
              onClick={() => setQuery('production-no-approvers')}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Production without approvers
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {view === 'projects' && projects && (
          <div className="space-y-2">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-medium">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {view === 'pipelines' && pipelines && (
          <div className="space-y-2">
            {pipelines.map(pipeline => (
              <div key={pipeline.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{pipeline.name}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    pipeline.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                    pipeline.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pipeline.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'releases' && releases && (
          <div className="space-y-2">
            {(query === 'production-no-approvers' ? filterReleases() : releases).map(release => (
              <div key={release.id} className="p-4 border rounded-md">
                <h3 className="font-medium">{release.name}</h3>
                <div className="mt-2 space-y-2">
                  {release.environments.map(env => (
                    <div key={env.id} className="flex items-center justify-between text-sm">
                      <span>{env.name}</span>
                      <span className={`px-2 py-1 rounded ${
                        env.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                        env.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {env.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}