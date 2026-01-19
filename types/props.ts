type IPlaceholderProps = {
  state: "permission" | "loading" | "error" | "empty";
  error?: string | null;
  locationFilter?: boolean;
  tintColor?: string;
  onPress?: () => void;
  requestPermission?: () => void;
};
type ClusterStylesOptionsProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
  headerBgColor?: string;
  footerBgColor?: string;
};

interface ModelRequiredModalProps {
  visible: boolean;
  onClose: () => void;
}

export type {
  ClusterStylesOptionsProps,
  IPlaceholderProps,
  ModelRequiredModalProps,
};
