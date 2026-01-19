import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createClusterStyles } from "@/components/style/photo-viewer";
import { Photo } from "@/types/photo";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PhotoViewerScreen() {
  const router = useRouter();
  const { photos: photosParam, initialIndex } = useLocalSearchParams<{
    photos: string;
    initialIndex: string;
  }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const styles = createClusterStyles();
  const photos: Photo[] = useMemo(() => {
    try {
      return photosParam ? JSON.parse(photosParam) : [];
    } catch {
      return [];
    }
  }, [photosParam]);

  const [currentIndex, setCurrentIndex] = useState(
    parseInt(initialIndex || "0", 10),
  );
  const [showControls, setShowControls] = useState(true);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    [],
  );

  const currentPhoto = photos[currentIndex];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("uk", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatLocation = (location?: {
    latitude: number;
    longitude: number;
  }) => {
    if (!location) return "";

    const latHemisphere = location.latitude >= 0 ? "N" : "S";
    const lonHemisphere = location.longitude >= 0 ? "E" : "W";

    const lat = Math.abs(location.latitude).toFixed(4);
    const lon = Math.abs(location.longitude).toFixed(4);

    return `${lat}° ${latHemisphere}, ${lon}° ${lonHemisphere}`;
  };

  const renderPhoto = useCallback(
    ({ item }: { item: Photo }) => (
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        style={styles.photoContainer}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          contentFit="contain"
          transition={100}
        />
      </TouchableOpacity>
    ),
    [toggleControls],
  );

  if (photos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="image-outline" size={48} color="#fff" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={parseInt(initialIndex || "0", 10)}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        {showControls && (
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerText}>
                {currentIndex + 1} / {photos.length}
              </Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        )}

        {showControls && currentPhoto && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.footerRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.footerText}>
                {formatDate(currentPhoto.creationTime)}
              </Text>
            </View>
            {currentPhoto.location && (
              <View style={styles.footerRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.footerText}>
                  {formatLocation(currentPhoto.location)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
}
