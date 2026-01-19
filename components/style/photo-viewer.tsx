import { ClusterStylesOptionsProps } from "@/types/props";
import { Dimensions, StyleSheet } from "react-native";

export function createClusterStyles(options: ClusterStylesOptionsProps = {}) {
  const SCREEN_WIDTH = options.width ?? Dimensions.get("window").width;
  const SCREEN_HEIGHT = options.height ?? Dimensions.get("window").height;
  const backgroundColor = options.backgroundColor ?? "#000";
  const headerBgColor = options.headerBgColor ?? "rgba(0, 0, 0, 0.4)";
  const footerBgColor = options.footerBgColor ?? "rgba(0, 0, 0, 0.4)";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    errorContainer: {
      flex: 1,
      backgroundColor,
      justifyContent: "center",
      alignItems: "center",
    },
    photoContainer: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
    },
    photo: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: headerBgColor,
    },
    closeButton: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    placeholder: {
      width: 44,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      backgroundColor: footerBgColor,
      gap: 8,
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    footerText: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: 14,
    },
  });
}
