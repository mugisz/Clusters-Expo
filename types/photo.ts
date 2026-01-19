interface Location {
  latitude: number;
  longitude: number;
}

interface Photo {
  id: string;
  uri: string;
  creationTime: number;
  location: Location | null;
  width?: number;
  height?: number;
  mlLabels?: string[];
}

type ClusterType = "content" | "time" | "other";
type ClusteringMode = "byContent" | "byDate";

interface PhotoCluster {
  id: string;
  name: string;
  photos: Photo[];
  type: ClusterType;
  createdAt: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  location?: Location;
  clusterType?: "event" | "location" | "mixed";
}

interface ClusteringOptions {
  minClusterSize: number;
  maxTimeDifference?: number;
  useMLLabels?: boolean;
  mode?: ClusteringMode;
}

type ClassificationLabel = {
  text: string;
  index: number;
  confidence: number;
};

interface IUsePhotoClusteringResult {
  clusters: PhotoCluster[];
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
  requestPermission: () => Promise<void>;
  refreshClusters: () => Promise<void>;
  totalPhotos: number;
  progress: number;
  clusteringMode: ClusteringMode;
  setClusteringMode: (mode: ClusteringMode) => void;
}
type Asset = {
  id: string;
  uri: string;
  width: number;
  height: number;
  creationTime?: number;
  location?: { latitude: number; longitude: number } | null;
};

export type {
  Asset,
  ClassificationLabel,
  ClusteringMode,
  ClusteringOptions,
  IUsePhotoClusteringResult,
  Photo,
  PhotoCluster,
};
