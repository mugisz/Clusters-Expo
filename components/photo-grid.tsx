import { Photo } from "@/types/photo";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photo: Photo, index: number) => void;
  numColumns?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function PhotoGrid({
  photos,
  onPhotoPress,
  numColumns = 3,
}: PhotoGridProps) {
  const spacing = 2;
  const photoSize = (SCREEN_WIDTH - spacing * (numColumns + 1)) / numColumns;

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <TouchableOpacity
      style={[
        styles.photoContainer,
        {
          width: photoSize,
          height: photoSize,
          marginLeft: spacing,
          marginBottom: spacing,
        },
      ]}
      onPress={() => onPhotoPress(item, index)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
        contentFit="cover"
        transition={150}
      />
      {item.location && (
        <View style={styles.locationBadge}>
          <View style={styles.locationDot} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={[styles.grid, { paddingTop: spacing }]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingBottom: 100,
  },
  photoContainer: {
    borderRadius: 4,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  locationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: 4,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
});
