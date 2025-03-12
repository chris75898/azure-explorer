export interface AzureConfig {
  baseUrl: string;
  apiKey: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Pipeline {
  id: number;
  name: string;
  revision: number;
  status: string;
}

export interface Release {
  id: number;
  name: string;
  status: string;
  environments: ReleaseEnvironment[];
}

export interface ReleaseEnvironment {
  id: number;
  name: string;
  status: string;
  preDeployApprovals: Approval[];
}

export interface Approval {
  id: number;
  approver: {
    displayName: string;
    uniqueName: string;
  };
}