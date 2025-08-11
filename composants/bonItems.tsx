import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type StatusKey =
  | "En attente d'affectation"
  | "Véhicule affecté"
  | "En attente de validation du BS"
  | "BS validé"
  | "En cours"
  | "Sorti"
  | "Retourné"
  | "Annulé";

interface StatusConfig {
  icon: string;
  color: string;
}

const statusIcons: Record<StatusKey, StatusConfig> = {
  "En attente d'affectation": { icon: "clock-outline", color: "#ffc107" },
  "Véhicule affecté": { icon: "car", color: "#17a2b8" },
  "En attente de validation du BS": { icon: "clipboard-clock-outline", color: "#6f42c1" },
  "BS validé": { icon: "check-circle-outline", color: "#28a745" },
  "En cours": { icon: "progress-clock", color: "#007bff" },
  "Sorti": { icon: "exit-run", color: "#28a745" },
  "Retourné": { icon: "exit-to-app", color: "#dc3545" },
  "Annulé": { icon: "close-circle-outline", color: "#6c757d" },
};

interface BonItemProps {
  item: any;
  openModal: (bon: any) => void;
  formatDate: (dateStr: string) => string;
  styles: any;
}

const BonItem = ({ item, openModal, formatDate, styles }: BonItemProps) => {
  const statusKey = (item?.nom_statut_bs?.trim() || "") as StatusKey;
  const statusConfig: StatusConfig =
    statusIcons[statusKey] || { icon: "help-circle-outline", color: "grey" };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          <MaterialCommunityIcons name="file-document" size={18} color="#007AFF" />
          Bon #{item.id_bande_sortie || item.id}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
          <MaterialCommunityIcons name={statusConfig.icon} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.nom_statut_bs}</Text>
        </View>
      </View>

      {/* Informations véhicule */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="car" size={18} color="#007AFF" />
        <Text style={styles.text}>
          {item.nom_marque} ({item.immatriculation})
        </Text>
      </View>

      {/* Chauffeur */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="account" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom} {item.prenom_chauffeur}</Text>
      </View>

      {/* Heures sortie */}
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="exit-run"
          size={18}
          color={item.sortie_time ? "#28a745" : "#ffc107"}
        />
        <Text style={styles.text}>
          Sortie : {item.sortie_time ? formatDate(item.sortie_time) : `Prévue ${formatDate(item.date_prevue)}`}
        </Text>
      </View>

      {/* Heures retour */}
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="exit-to-app"
          size={18}
          color={item.retour_time ? "#dc3545" : "#ffc107"}
        />
        <Text style={styles.text}>
          Retour : {item.retour_time ? formatDate(item.retour_time) : `Prévue ${formatDate(item.date_retour)}`}
        </Text>
      </View>

      {/* Destination */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_destination || item.destination}</Text>
      </View>

      {/* Motif */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="clipboard-text" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_motif_demande || item.motif}</Text>
      </View>

      {/* Bouton pour ouvrir modal */}
      <TouchableOpacity
        onPress={() => openModal(item)}
        style={styles.arrowButton}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="eye" size={26} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(BonItem);
