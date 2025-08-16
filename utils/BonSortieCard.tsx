import { BonSortie, BonSortieDisplay } from '@/types';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { formatDateSafe } from './dateUtils';
import { getStatutBS } from './statutIcon';

type Props = {
  data: BonSortieDisplay;
  onFinish: (d: BonSortie) => void;
  onViewDetail: (d: BonSortie) => void;
};

export const BonSortieCard: React.FC<Props> = ({ data, onFinish, onViewDetail }) => {
  const getEtatColor = () => {
    switch (data.etat) {
      case 'aujourdhui': return '#10B981';
      case 'anterieur': return '#EF4444';
      case 'ulterieur': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const renderHeure = () => {
    if (data.retour_time)
      return { label: 'Heure retour', value: formatDateSafe(data.retour_time), color: '#10B981' };
    if (data.sortie_time)
      return { label: 'Heure sortie', value: formatDateSafe(data.sortie_time), color: '#3B82F6' };
    return { label: 'Heure prévue', value: formatDateSafe(data.date_prevue), color: '#0EA5E9' };
  };

  const mapToBonSortie = (): BonSortie => ({
    ...data,
    nom_service: data.nom_service ?? 'Service inconnu',
  });

  const handleFinish = () => onFinish(mapToBonSortie());
  const handleView = () => onViewDetail(mapToBonSortie());

  const statut = getStatutBS(data.nom_statut_bs);

  return (
    <Card style={[styles.card, { borderLeftColor: getEtatColor() }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {data.nom_destination}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: statut.color }]}>
          <AntDesign name={statut.icon} size={14} color="#fff" />
          <Text style={styles.statusText} numberOfLines={1} ellipsizeMode="tail">
            {data.nom_statut_bs}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-tie" size={18} color="#3B82F6" />
          <Text style={styles.label}>Chauffeur :</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {data.nom_chauffeur} {data.prenom_chauffeur}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="car" size={18} color="#3B82F6" />
          <Text style={styles.label}>Véhicule :</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {data.nom_marque}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="card-text" size={18} color="#3B82F6" />
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {data.immatriculation}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="clock" size={18} color={renderHeure().color} />
          <Text style={styles.label}>{renderHeure().label} :</Text>
          <Text style={[styles.value, { color: renderHeure().color }]} numberOfLines={1} ellipsizeMode="tail">
            {renderHeure().value}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-tie" size={18} color="#3B82F6" />
          <Text style={styles.label}>Créé par :</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {data.user_cr}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonView]} onPress={handleView}>
          <Feather name="eye" size={16} color="#fff" />
          <Text style={styles.buttonText}>Voir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonValidate]} onPress={handleFinish}>
          <Feather name="check-circle" size={16} color="#fff" />
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderLeftWidth: 6,
    backgroundColor: '#fff',
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    width: 110,
  },
  value: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonView: {
    backgroundColor: '#6B7280',
  },
  buttonValidate: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
});
