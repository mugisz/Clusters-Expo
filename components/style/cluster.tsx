import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  loadingSubtext: {
    marginTop: 4,
    opacity: 0.6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  headerSubtitle: {
    marginTop: 4,
    opacity: 0.6,
  },
  locationInfo: {
    marginTop: 4,
    opacity: 0.8,
    fontSize: 13,
    color: "#007AFF",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 28,
  },
  locationFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  filterIcon: {
    fontSize: 24,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  filterSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  modeSelector: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.2)",
  },
  modeButtonActive: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.6,
  },
});
