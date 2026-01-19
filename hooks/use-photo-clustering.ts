import { DEFAULT_CLUSTERING_OPTIONS } from "@/constants/cluster";
import { LABEL_TRANSLATIONS } from "@/constants/translate";
import {
  ClassificationLabel,
  ClusteringMode,
  ClusteringOptions,
  Photo,
  PhotoCluster,
} from "@/types/photo";
import { assetToPhoto, clusterPhotos } from "@/utils/clustering";
import { useImageLabeling } from "@infinitered/react-native-mlkit-image-labeling";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";

export function usePhotoClustering(
  options: ClusteringOptions = DEFAULT_CLUSTERING_OPTIONS,
) {
  const [clusters, setClusters] = useState<PhotoCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [progress, setProgress] = useState(0);
  const [clusteringMode, setClusteringMode] = useState<ClusteringMode>(
    options.mode || "byDate",
  );
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);
  const [locationFilter, setLocationFilter] = useState<boolean>(false);

  const classifier = useImageLabeling("default") as any;

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    } catch {
      setError("Не вдалося запросити дозвіл на доступ до галереї");
      setHasPermission(false);
    }
  }, []);

  const getPhotoLabels = useCallback(
    async (photoUri: string): Promise<string[]> => {
      try {
        if (!classifier) {
          console.warn("Classifier not available yet");
          return [];
        }

        const result = await classifier.classifyImage(photoUri);

        if (!result || !Array.isArray(result) || result.length === 0) {
          return [];
        }

        const filteredLabels: ClassificationLabel[] = result
          .filter((label) => label.confidence && label.confidence > 0.3)
          .slice(0, 5);

        const translatedLabels = filteredLabels
          .map((label) => {
            const text = (label.text || "").toLowerCase().trim();
            return LABEL_TRANSLATIONS[text] || label.text || text;
          })
          .filter(
            (label: string, index: number, self: string[]) =>
              self.indexOf(label) === index,
          );

        return translatedLabels;
      } catch (err) {
        console.warn(`Failed to label image ${photoUri}:`, err);
        return [];
      }
    },
    [classifier],
  );

  const loadPhotos = useCallback(async (): Promise<Photo[]> => {
    const photos: Photo[] = [];
    let hasNextPage = true;
    let endCursor: string | undefined;
    let totalAssets = 0;
    let successfulPhotos = 0;
    let failedPhotos = 0;

    const BATCH_SIZE = 30;

    while (hasNextPage) {
      try {
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.photo,
          first: BATCH_SIZE,
          after: endCursor,
          sortBy: [MediaLibrary.SortBy.creationTime],
        });

        totalAssets += result.assets.length;

        for (const asset of result.assets) {
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);

            const photo = assetToPhoto({
              ...asset,
              location: assetInfo.location || null,
            });

            let labels: string[] = [];
            try {
              labels = await getPhotoLabels(asset.uri);
            } catch (labelErr) {
              console.warn(
                `⚠️ Не вдалося класифікувати ${asset.id}, використовую порожні мітки`,
              );
            }

            photos.push({
              ...photo,
              mlLabels: labels.length > 0 ? labels : ["unlabeled"],
            });

            successfulPhotos++;
            setProgress(photos.length);
          } catch (photoErr) {
            console.error(`❌ Помилка обробки фото ${asset.id}:`, photoErr);
            failedPhotos++;

            try {
              const photo = assetToPhoto({
                ...asset,
                location: null,
              });
              photos.push({
                ...photo,
                mlLabels: [],
              });
              successfulPhotos++;
              setProgress(photos.length);
            } catch (fallbackErr) {
              console.error(
                `💀 Критична помилка для фото ${asset.id}:`,
                fallbackErr,
              );
            }
          }
        }

        hasNextPage = result.hasNextPage;
        endCursor = result.endCursor;
      } catch (batchErr) {
        console.error("💥 Критична помилка завантаження батчу:", batchErr);
        break;
      }
    }

    return photos;
  }, [getPhotoLabels]);

  const filterPhotosByLocation = useCallback(
    (photos: Photo[], requireLocation: boolean = true): Photo[] => {
      if (!requireLocation) {
        return photos;
      }
      return photos.filter((photo) => photo.location);
    },
    [],
  );

  const refreshClusters = useCallback(async () => {
    if (!hasPermission) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      let photos = await loadPhotos();

      if (locationFilter) {
        const beforeFilter = photos.length;
        photos = filterPhotosByLocation(photos, true);
      }

      setTotalPhotos(photos.length);

      if (photos.length === 0) {
        setClusters([]);
        setLoadedPhotos([]);
        return;
      }

      setLoadedPhotos(photos);

      const newClusters = clusterPhotos(photos, {
        ...options,
        mode: clusteringMode,
      });

      const sortedClusters = newClusters.sort((a, b) => {
        const aLatest = Math.max(...a.photos.map((p) => p.creationTime));
        const bLatest = Math.max(...b.photos.map((p) => p.creationTime));
        return bLatest - aLatest;
      });

      setClusters(sortedClusters);
    } catch (err) {
      console.error(" Критична помилка завантаження фото:", err);
      setError("Не вдалося завантажити фотографії");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [
    hasPermission,
    loadPhotos,
    options,
    clusteringMode,
    locationFilter,
    filterPhotosByLocation,
  ]);

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      setHasPermission(status === "granted");
    };
    checkPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      refreshClusters();
    } else {
      setIsLoading(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    if (loadedPhotos.length > 0) {
      let photosToCluster = loadedPhotos;

      if (locationFilter) {
        photosToCluster = filterPhotosByLocation(loadedPhotos, true);
      }

      const newClusters = clusterPhotos(photosToCluster, {
        ...options,
        mode: clusteringMode,
      });

      const sortedClusters = newClusters.sort((a, b) => {
        const aLatest = Math.max(...a.photos.map((p) => p.creationTime));
        const bLatest = Math.max(...b.photos.map((p) => p.creationTime));
        return bLatest - aLatest;
      });

      setClusters(sortedClusters);
    }
  }, [
    clusteringMode,
    loadedPhotos,
    options,
    locationFilter,
    filterPhotosByLocation,
  ]);

  return {
    clusters,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    refreshClusters,
    totalPhotos,
    progress,
    clusteringMode,
    setClusteringMode,
    locationFilter,
    setLocationFilter,
  };
}
