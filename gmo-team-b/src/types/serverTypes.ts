export interface ServerSummary {
  id: string;
  name: string;
  nameTag?: string; // Add nameTag field for display
  links: { rel: string; href: string }[];
}

export interface ServerListResponse {
  servers: ServerSummary[];
}

export interface ServerListError {
  error: string;
}

export interface EnhancedServerSummary extends ServerSummary {
  nameTag: string;
  displayName: string; // Computed field for UI display
}