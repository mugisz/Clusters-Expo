import { ClusteringOptions } from "@/types/photo";
import { ImageLabelingConfig } from "@infinitered/react-native-mlkit-image-labeling";

export const DEFAULT_CLUSTERING_OPTIONS: ClusteringOptions = {
  minClusterSize: 2,
  maxTimeDifference: 7 * 24 * 60 * 60 * 1000,
  useMLLabels: true,
};
export const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

export const unstable_settings = {
  anchor: "(tabs)",
};

export const MODELS: ImageLabelingConfig = {
  nsfw: {
    model: require("@/assets/models/mobilenet.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0.5,
    },
  },
};
