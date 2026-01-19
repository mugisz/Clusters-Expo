import {
  ClusterCard,
  ModelRequiredModal,
  PlaceholderRenderer,
  ThemedText,
  ThemedView,
} from "@/components";
import { styles } from "@/components/style/cluster";
import { usePhotoClustering } from "@/hooks/use-photo-clustering";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PhotoCluster } from "@/types/photo";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClustersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, "tint");
  const [showModelModal, setShowModelModal] = useState(false);

  const {
    clusters,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    refreshClusters,
    clusteringMode,
    setClusteringMode,
    locationFilter,
    setLocationFilter,
    totalPhotos,
  } = usePhotoClustering();

  const handleClusterPress = useCallback(
    (cluster: PhotoCluster) => {
      router.push({
        pathname: "/cluster/[id]",
        params: { id: cluster.id, data: JSON.stringify(cluster) },
      });
    },
    [router],
  );

  const renderCluster = ({ item }: { item: PhotoCluster }) => (
    <ClusterCard cluster={item} onPress={() => handleClusterPress(item)} />
  );

  const handleModeChange = useCallback(
    (mode: "byContent" | "byDate") => {
      if (mode === "byContent") {
        setShowModelModal(true);
      } else {
        setClusteringMode(mode);
      }
    },
    [setClusteringMode],
  );

  const handleCloseModal = useCallback(() => {
    setShowModelModal(false);
    setClusteringMode("byContent");
  }, [setClusteringMode]);

  const handleLocationFilterToggle = useCallback(() => {
    setLocationFilter((prev) => !prev);
  }, [setLocationFilter]);

  const totalClustered = clusters.reduce((sum, c) => sum + c.photos.length, 0);
  const photosWithLocation = clusters.reduce(
    (sum, c) => sum + c.photos.filter((p) => p.location).length,
    0,
  );

  if (isLoading || error || clusters.length === 0) {
    return (
      <PlaceholderRenderer
        isLoading={isLoading}
        error={error}
        clusters={clusters}
        hasPermission={hasPermission!}
        requestPermission={requestPermission}
        refreshClusters={refreshClusters}
        locationFilter={locationFilter}
        tintColor={tintColor}
      />
    );
  }
  return (
    <ThemedView style={styles.container}>
      <ModelRequiredModal visible={showModelModal} onClose={handleCloseModal} />

      <FlatList
        data={clusters}
        renderItem={renderCluster}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[tintColor]}
            refreshing={isLoading}
            onRefresh={refreshClusters}
            tintColor={tintColor}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <ThemedText type="title" style={styles.headerTitle}>
                  Кластери
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  {clusters.length} кластерів · {totalClustered} фото
                </ThemedText>
                {locationFilter && (
                  <ThemedText style={styles.locationInfo}>
                    📍 {photosWithLocation} з геолокацією
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={[styles.locationFilter, { borderColor: tintColor }]}>
              <View style={styles.filterLeft}>
                <ThemedText style={styles.filterIcon}>🗺️</ThemedText>
                <View>
                  <ThemedText style={styles.filterTitle}>
                    Тільки з геолокацією
                  </ThemedText>
                  <ThemedText style={styles.filterSubtitle}>
                    {totalPhotos > 0
                      ? `${photosWithLocation} з ${totalPhotos} фото (${Math.round((photosWithLocation / totalPhotos) * 100)}%)`
                      : "Завантаження..."}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={locationFilter}
                onValueChange={handleLocationFilterToggle}
                trackColor={{ false: "#767577", true: tintColor + "80" }}
                thumbColor={locationFilter ? tintColor : "#f4f3f4"}
              />
            </View>

            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  clusteringMode === "byDate" && styles.modeButtonActive,
                  { borderColor: tintColor },
                ]}
                onPress={() => handleModeChange("byDate")}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    clusteringMode === "byDate" && {
                      color: tintColor,
                      fontWeight: "600",
                    },
                  ]}
                >
                  📅 По даті
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  clusteringMode === "byContent" && styles.modeButtonActive,
                  { borderColor: tintColor },
                ]}
                onPress={() => handleModeChange("byContent")}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    clusteringMode === "byContent" && {
                      color: tintColor,
                      fontWeight: "600",
                    },
                  ]}
                >
                  📷 По змісту
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </ThemedView>
  );
}
