import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ModelRequiredModalProps } from "@/types/props";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export function ModelRequiredModal({
  visible,
  onClose,
}: ModelRequiredModalProps) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedView style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText type="title" style={styles.title}>
              Потрібна модель ML
            </ThemedText>

            <ThemedText style={styles.description}>
              Для роботи кластеризації по змісту необхідно завантажити та
              встановити модель машинного навчання.
            </ThemedText>

            <View style={styles.stepsContainer}>
              <ThemedText style={styles.stepTitle}>📥 Інструкція:</ThemedText>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>1.</ThemedText>
                <ThemedText style={styles.stepText}>
                  Завантажте модель{" "}
                  <ThemedText style={styles.code}>mobilenet.tflite</ThemedText>
                </ThemedText>
              </View>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>2.</ThemedText>
                <ThemedText style={styles.stepText}>
                  Створіть папку{" "}
                  <ThemedText style={styles.code}>assets/models</ThemedText> у
                  вашому проекті
                </ThemedText>
              </View>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>3.</ThemedText>
                <ThemedText style={styles.stepText}>
                  Помістіть файл{" "}
                  <ThemedText style={styles.code}>mobilenet.tflite</ThemedText>{" "}
                  у цю папку
                </ThemedText>
              </View>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>4.</ThemedText>
                <ThemedText style={styles.stepText}>
                  Перезапустіть додаток
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoBox}>
              <ThemedText style={styles.infoText}>
                💡 Після встановлення моделі кластеризація по змісту стане
                доступною
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Зрозуміло</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 24,
    lineHeight: 22,
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  step: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 8,
    opacity: 0.7,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 13,
    opacity: 0.9,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
