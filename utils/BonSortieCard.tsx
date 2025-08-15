import { BonSortie, BonSortieDisplay } from '@/types';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
      case 'aujourdhui': return '#34D399'; // vert doux
      case 'anterieur': return '#F87171'; // rouge doux
      case 'ulterieur': return '#FBBF24'; // jaune vif
      default: return '#3B82F6'; // bleu pro
    }
  };

  const renderHeure = () => {
  if (data.retour_time)
    return { label: 'Heure retour', value: formatDateSafe(data.retour_time), color: '#10B981' };
  if (data.sortie_time)
    return { label: 'Heure sortie', value: formatDateSafe(data.sortie_time), color: '#3B82F6' };
  return { label: 'Heure prévue', value: formatDateSafe(data.date_prevue), color: '#0EA5E9' };
};


  return (
    <Card style={[styles.card, { borderLeftColor: getEtatColor() }]}>
      <Card.Content>
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#3B82F6" />
          <Text style={styles.label}>Destination :</Text>
          <Text style={styles.value}>{data.nom_destination}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="account-tie" size={20} color="#3B82F6" />
          <Text style={styles.label}>Chauffeur :</Text>
          <Text style={styles.value}>{data.nom_chauffeur} {data.prenom_chauffeur}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="car" size={20} color="#3B82F6" />
          <Text style={styles.label}>Véhicule :</Text>
          <Text style={styles.value}>{data.nom_marque}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="card-text" size={20} color="#3B82F6" />
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value}>{data.immatriculation}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="clock" size={20} color={renderHeure().color} />
          <Text style={styles.label}>{renderHeure().label} :</Text>
          <Text style={[styles.value, { color: renderHeure().color }]}>{renderHeure().value}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name={getStatutBS(data.nom_statut_bs).icon as any}
            size={20}
            color={getStatutBS(data.nom_statut_bs).color}
          />
          <Text style={styles.label}>Statut :</Text>
          <Text style={[styles.value, { color: getStatutBS(data.nom_statut_bs).color }]}>
            {data.nom_statut_bs}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="account-tie" size={20} color="#3B82F6" />
          <Text style={styles.label}>Créé par :</Text>
          <Text style={styles.value}>{data.user_cr}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonView]} onPress={() => onViewDetail(data)}>
            <Feather name="eye" size={18} color="#fff" />
            <Text style={styles.buttonText}>Voir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonValidate]} onPress={() => onFinish(data)}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 16, backgroundColor: '#fff', borderLeftWidth: 6, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, paddingVertical: 6, paddingHorizontal: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingVertical: 2 },
  label: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#6B7280', flexShrink: 0 },
  value: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#111827', flexShrink: 1, flexWrap: 'wrap' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  button: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, elevation: 1 },
  buttonView: { backgroundColor: '#6B7280' },
  buttonValidate: { backgroundColor: '#2563EB' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 6 },
});
