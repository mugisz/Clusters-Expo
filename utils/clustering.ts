import { monthNames } from "@/constants/cluster";
import { Asset, ClusteringOptions, Photo, PhotoCluster } from "@/types/photo";

function clusterByMLLabels(photos: Photo[]): Map<string, Photo[]> {
  const labelGroups = new Map<string, Photo[]>();

  photos.forEach((photo) => {
    if (photo.mlLabels && photo.mlLabels.length > 0) {
      const primaryLabel = photo.mlLabels[0];

      if (!labelGroups.has(primaryLabel)) {
        labelGroups.set(primaryLabel, []);
      }
      labelGroups.get(primaryLabel)!.push(photo);
    }
  });

  return labelGroups;
}

function clusterByMonth(photos: Photo[]): Map<string, Photo[]> {
  const monthGroups = new Map<string, Photo[]>();

  photos.forEach((photo) => {
    const date = new Date(photo.creationTime);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, []);
    }
    monthGroups.get(monthKey)!.push(photo);
  });

  return monthGroups;
}

function getClusterDescription(photos: Photo[], clusterName: string): string {
  const photoCount = photos.length;
  const dateRange =
    photos.length > 0
      ? `${new Date(Math.min(...photos.map((p) => p.creationTime))).toLocaleDateString("uk-UA")} — ${new Date(Math.max(...photos.map((p) => p.creationTime))).toLocaleDateString("uk-UA")}`
      : "";

  return `${photoCount} ${photoCount === 1 ? "фото" : photoCount < 5 ? "фотографій" : "фотографій"}${dateRange ? ` • ${dateRange}` : ""}`;
}

export function clusterPhotos(
  photos: Photo[],
  options: ClusteringOptions,
): PhotoCluster[] {
  const mode = options.mode || "byContent";

  if (mode === "byContent") {
    return clusterPhotosByContent(photos, options);
  } else {
    return clusterPhotosByDate(photos, options);
  }
}

function clusterPhotosByContent(
  photos: Photo[],
  options: ClusteringOptions,
): PhotoCluster[] {
  const clusters: PhotoCluster[] = [];

  const mlClusters = clusterByMLLabels(photos);

  mlClusters.forEach((clusterPhotos, label) => {
    if (clusterPhotos.length >= options.minClusterSize) {
      clusterPhotos.sort((a, b) => b.creationTime - a.creationTime);

      const startDate = new Date(
        Math.min(...clusterPhotos.map((p) => p.creationTime)),
      );
      const endDate = new Date(
        Math.max(...clusterPhotos.map((p) => p.creationTime)),
      );

      clusters.push({
        id: `ml-${label.toLowerCase().replace(/\s+/g, "-")}`,
        name: label,
        photos: clusterPhotos,
        type: "content",
        createdAt: Date.now(),
        description: getClusterDescription(clusterPhotos, label),
        startDate,
        endDate,
        clusterType: "mixed",
      });
    }
  });

  const photosWithoutLabels = photos.filter(
    (photo) => !photo.mlLabels || photo.mlLabels.length === 0,
  );

  if (photosWithoutLabels.length >= options.minClusterSize) {
    const monthClusters = clusterByMonth(photosWithoutLabels);

    monthClusters.forEach((clusterPhotos, monthName) => {
      if (clusterPhotos.length >= options.minClusterSize) {
        clusterPhotos.sort((a, b) => b.creationTime - a.creationTime);

        const startDate = new Date(
          Math.min(...clusterPhotos.map((p) => p.creationTime)),
        );
        const endDate = new Date(
          Math.max(...clusterPhotos.map((p) => p.creationTime)),
        );

        clusters.push({
          id: `month-${monthName.toLowerCase().replace(/\s+/g, "-")}`,
          name: monthName,
          photos: clusterPhotos,
          type: "time",
          createdAt: Date.now(),
          description: getClusterDescription(clusterPhotos, monthName),
          startDate,
          endDate,
          clusterType: "event",
        });
      }
    });
  }

  return clusters.sort((a, b) => {
    const typeOrder = { content: 0, time: 1, other: 2 };
    const typeCompare = typeOrder[a.type] - typeOrder[b.type];
    if (typeCompare !== 0) return typeCompare;
    return b.photos.length - a.photos.length;
  });
}

function clusterPhotosByDate(
  photos: Photo[],
  options: ClusteringOptions,
): PhotoCluster[] {
  const clusters: PhotoCluster[] = [];

  const monthClusters = clusterByMonth(photos);

  monthClusters.forEach((clusterPhotos, monthName) => {
    clusterPhotos.sort((a, b) => b.creationTime - a.creationTime);

    const startDate = new Date(
      Math.min(...clusterPhotos.map((p) => p.creationTime)),
    );
    const endDate = new Date(
      Math.max(...clusterPhotos.map((p) => p.creationTime)),
    );

    clusters.push({
      id: `month-${monthName.toLowerCase().replace(/\s+/g, "-")}`,
      name: monthName,
      photos: clusterPhotos,
      type: "time",
      createdAt: Date.now(),
      description: getClusterDescription(clusterPhotos, monthName),
      startDate,
      endDate,
      clusterType: "event",
    });
  });

  return clusters;
}

export function assetToPhoto(asset: Asset): Photo {
  return {
    id: asset.id,
    uri: asset.uri,
    creationTime: asset.creationTime || Date.now(),
    location: asset.location || null,
    width: asset.width,
    height: asset.height,
    mlLabels: [],
  };
}
