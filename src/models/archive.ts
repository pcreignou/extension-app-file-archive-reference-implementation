export interface ArchiveFileBody {
  file: {
    path: string;
    name: string;
    type: string;
    bytes: string;
    length: number;
  };
  order?: number;
  overwrite?: boolean;
}

export interface ArchiveFileResponse {
  success: boolean;
}
