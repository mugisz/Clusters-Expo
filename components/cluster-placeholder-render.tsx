import { PhotoCluster } from "@/types/photo";
import { IPlaceholderProps } from "@/types/props";
import { Placeholder } from "./cluster-placeholder";

export function PlaceholderRenderer({
  isLoading,
  error,
  clusters,
  hasPermission,
  requestPermission,
  refreshClusters,
  locationFilter,
  tintColor,
}: Omit<IPlaceholderProps, "state"> & {
  isLoading: boolean;
  clusters: PhotoCluster[];
  hasPermission: boolean;
  refreshClusters: () => void;
}) {
  if (!hasPermission) {
    return (
      <Placeholder
        state="permission"
        requestPermission={requestPermission}
        tintColor={tintColor}
      />
    );
  }

  if (isLoading || error || clusters.length === 0) {
    let state: "loading" | "error" | "empty" = "loading";
    if (error) state = "error";
    else if (clusters.length === 0) state = "empty";

    return (
      <Placeholder
        state={state}
        error={error}
        onPress={refreshClusters}
        locationFilter={locationFilter}
        tintColor={tintColor}
      />
    );
  }

  return null;
}
