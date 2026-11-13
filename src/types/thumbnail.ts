export type ImageFormat = "jpeg" | "png";

export type ResolutionOrigin = "original" | "upscaled" | "unavailable";

export interface ThumbnailCandidate {
  key: "maxresdefault" | "sddefault" | "hqdefault" | "mqdefault" | "default";
  label: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number | null;
  mimeType: string;
  available: boolean;
}

export interface ResolutionOption {
  id: string;
  label: string;
  targetWidth: number;
  targetHeight: number;
  actualWidth: number;
  actualHeight: number;
  origin: ResolutionOrigin;
  isHighestOriginal?: boolean;
  sourceUrl: string;
  sizeBytes: number | null;
  format: string;
  note?: string;
}

export interface VideoMetadata {
  videoId: string;
  title?: string;
  channelTitle?: string;
  source: "youtube-data-api" | "direct-probe";
}

export interface ExtractResponse {
  videoId: string;
  metadata: VideoMetadata;
  candidates: ThumbnailCandidate[];
  highestOriginal: ThumbnailCandidate | null;
}
