import { ThemedText, ThemedView } from "@/components";
import { IPlaceholderProps } from "@/types/props";
import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./style/cluster";

export const Placeholder: React.FC<IPlaceholderProps> = ({
  state,
  error,
  locationFilter,
  tintColor = "#007AFF",
  onPress,
  requestPermission,
}) => {
  const insets = useSafeAreaInsets();

  switch (state) {
    case "permission":
      return (
        <ThemedView
          style={[styles.centerContainer, { paddingTop: insets.top }]}
        >
          <ThemedText style={styles.emoji}>📷</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Доступ до галереї
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Для створення кластерів потрібен доступ до ваших фотографій
          </ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={requestPermission}
          >
            <ThemedText style={styles.buttonText}>Дозволити доступ</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );

    case "loading":
      return (
        <ThemedView
          style={[styles.centerContainer, { paddingTop: insets.top }]}
        >
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>
            Аналізуємо фотографії...
          </ThemedText>
          <ThemedText style={styles.loadingSubtext}>
            Це може зайняти кілька секунд
          </ThemedText>
        </ThemedView>
      );

    case "error":
      return (
        <ThemedView
          style={[styles.centerContainer, { paddingTop: insets.top }]}
        >
          <ThemedText style={styles.emoji}>😕</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Щось пішло не так
          </ThemedText>
          <ThemedText style={styles.subtitle}>{error}</ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={onPress}
          >
            <ThemedText style={styles.buttonText}>Спробувати знову</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );

    case "empty":
      return (
        <ThemedView
          style={[styles.centerContainer, { paddingTop: insets.top }]}
        >
          <ThemedText style={styles.emoji}>📭</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Кластери не знайдено
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {locationFilter
              ? "Немає фото з геолокацією. Вимкніть фільтр локації"
              : "Потрібно мінімум 2 фотографії для створення кластера"}
          </ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={onPress}
          >
            <ThemedText style={styles.buttonText}>Оновити</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );

    default:
      return null;
  }
};
