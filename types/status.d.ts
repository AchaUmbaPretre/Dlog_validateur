export type StatusKey =
  | "En attente d'affectation"
  | "Véhicule affecté"
  | "En attente de validation du BS"
  | "BS validé"
  | "En cours"
  | "Sorti"
  | "Retourné"
  | "Annulé";

export interface StatusConfig {
  icon: string;
  color: string;
}

export const statusIcons: Record<StatusKey, StatusConfig> = {
  "En attente d'affectation": { icon: "clock-outline", color: "#ffc107" },
  "Véhicule affecté": { icon: "car", color: "#17a2b8" },
  "En attente de validation du BS": { icon: "clipboard-clock-outline", color: "#6f42c1" },
  "BS validé": { icon: "check-circle-outline", color: "#28a745" },
  "En cours": { icon: "progress-clock", color: "#007bff" },
  "Sorti": { icon: "exit-run", color: "#28a745" },
  "Retourné": { icon: "exit-to-app", color: "#dc3545" },
  "Annulé": { icon: "close-circle-outline", color: "#6c757d" },
};

export const defaultStatusConfig: StatusConfig = {
  icon: "help-circle-outline",
  color: "grey",
};
