import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PhotoCluster } from "@/types/photo";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

interface ClusterCardProps {
  cluster: PhotoCluster;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 200;

export function ClusterCard({ cluster, onPress }: ClusterCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");

  const getClusterIcon = () => {
    switch (cluster.clusterType) {
      case "event":
        return "🎉";
      case "location":
        return "📍";
      case "mixed":
        return "✨";
      default:
        return "📷";
    }
  };

  const previewPhotos = cluster.photos.slice(0, 4);
  const remainingCount = Math.max(0, cluster.photos.length - 4);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageGrid}>
        {previewPhotos.length === 1 && (
          <Image
            source={{ uri: previewPhotos[0].uri }}
            style={styles.singleImage}
            contentFit="cover"
            transition={200}
          />
        )}
        {previewPhotos.length === 2 && (
          <>
            <Image
              source={{ uri: previewPhotos[0].uri }}
              style={styles.halfImage}
              contentFit="cover"
              transition={200}
            />
            <Image
              source={{ uri: previewPhotos[1].uri }}
              style={styles.halfImage}
              contentFit="cover"
              transition={200}
            />
          </>
        )}
        {previewPhotos.length === 3 && (
          <>
            <Image
              source={{ uri: previewPhotos[0].uri }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.sideImages}>
              <Image
                source={{ uri: previewPhotos[1].uri }}
                style={styles.smallImage}
                contentFit="cover"
                transition={200}
              />
              <Image
                source={{ uri: previewPhotos[2].uri }}
                style={styles.smallImage}
                contentFit="cover"
                transition={200}
              />
            </View>
          </>
        )}
        {previewPhotos.length >= 4 && (
          <>
            <Image
              source={{ uri: previewPhotos[0].uri }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.sideImages}>
              <Image
                source={{ uri: previewPhotos[1].uri }}
                style={styles.smallImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.smallImageContainer}>
                <Image
                  source={{ uri: previewPhotos[2].uri }}
                  style={styles.smallImage}
                  contentFit="cover"
                  transition={200}
                />
                {remainingCount > 0 && (
                  <View style={styles.overlay}>
                    <ThemedText style={styles.overlayText}>
                      +{remainingCount}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </View>

      <ThemedView style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.icon}>{getClusterIcon()}</ThemedText>
          <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
            {cluster.name}
          </ThemedText>
        </View>
        <ThemedText style={[styles.description, { color: iconColor }]}>
          {cluster.description}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageGrid: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    flexDirection: "row",
    gap: 2,
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  halfImage: {
    width: "50%",
    height: "100%",
  },
  mainImage: {
    width: "66%",
    height: "100%",
  },
  sideImages: {
    width: "34%",
    height: "100%",
    gap: 2,
  },
  smallImage: {
    width: "100%",
    height: "50%",
  },
  smallImageContainer: {
    width: "100%",
    height: "50%",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});
