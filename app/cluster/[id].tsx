import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";

import { PhotoGrid, ThemedText, ThemedView } from "@/components";
import { styles } from "@/components/style/cluster-details";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Photo, PhotoCluster } from "@/types/photo";

export default function ClusterDetailScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ id: string; data: string }>();
  const tintColor = useThemeColor({}, "tint");

  const cluster: PhotoCluster | null = useMemo(() => {
    try {
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: new Date(parsed.endDate),
        };
      }
      return null;
    } catch {
      return null;
    }
  }, [data]);

  const handlePhotoPress = useCallback(
    (_photo: Photo, index: number) => {
      if (!cluster) return;
      router.push({
        pathname: "/photo-viewer",
        params: {
          photos: JSON.stringify(cluster.photos),
          initialIndex: index.toString(),
        },
      });
    },
    [router, cluster],
  );

  if (!cluster) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>Кластер не найден</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: cluster.name,
          headerBackTitle: "Назад",
          headerTintColor: tintColor,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <ThemedText type="subtitle">{cluster.name}</ThemedText>
              <ThemedText style={styles.description}>
                {cluster.description}
              </ThemedText>
            </View>
          </View>
          {cluster.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={tintColor} />
              <ThemedText style={styles.locationText}>
                {cluster.location.latitude.toFixed(4)},{" "}
                {cluster.location.longitude.toFixed(4)}
              </ThemedText>
            </View>
          )}
        </View>
        <PhotoGrid photos={cluster.photos} onPhotoPress={handlePhotoPress} />
      </ThemedView>
    </>
  );
}
