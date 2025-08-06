export interface ServerSummary {
  id: string;
  name: string;
  links: { rel: string; href: string }[];
}

export interface ServerListResponse {
  servers: ServerSummary[];
}

export interface ServerListError {
  error: string;
}