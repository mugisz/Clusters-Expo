import {
  useImageLabelingModels,
  useImageLabelingProvider,
} from "@infinitered/react-native-mlkit-image-labeling";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { MODELS } from "@/constants/cluster";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const models = useImageLabelingModels(MODELS);

  const { ImageLabelingModelProvider } = useImageLabelingProvider(models);

  return (
    <ImageLabelingModelProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="cluster/[id]"
            options={{
              headerShown: true,
              title: "Кластер",
            }}
          />
          <Stack.Screen
            name="photo-viewer"
            options={{
              headerShown: false,
              presentation: "fullScreenModal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ImageLabelingModelProvider>
  );
}
