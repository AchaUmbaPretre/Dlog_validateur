import { BonSortie, BonSortieDisplay } from '@/types';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getStatutBS } from './statutIcon';

type Props = {
  data: BonSortieDisplay;
  onFinish: (d: BonSortie) => void;
  onViewDetail: (d: BonSortie) => void;
};

export const BonSortieCard: React.FC<Props> = ({ data, onFinish, onViewDetail }) => {
  const getEtatColor = () => {
    switch (data.etat) {
      case 'aujourdhui':
        return '#28a745';
      case 'anterieur':
        return '#dc3545';
      case 'ulterieur':
        return '#ffc107';
      default:
        return '#007bff';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return moment(dateString).format('HH:mm - DD/MM/YYYY');
  };

  const renderHeure = () => {
    if (data.retour_time) {
      return { label: 'Heure retour', value: formatDate(data.retour_time), color: '#28a745' };
    }
    if (data.sortie_time) {
      return { label: 'Heure sortie', value: formatDate(data.sortie_time), color: '#007bff' };
    }
    return { label: 'Heure prévue', value: formatDate(data.dateHeurePrevue), color: '#17a2b8' };
  };

  return (
    <Card style={[styles.card, { borderLeftColor: getEtatColor() }]}>
      <Card.Content>
        <Text style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#007bff" />{' '}
          <Text style={styles.label}>Destination :</Text>{' '}
          <Text style={styles.value}>{data.nom_destination}</Text>
        </Text>


        <View style={styles.row}>
          <MaterialCommunityIcons name="account-tie" size={20} color="#007bff" />
          <Text style={styles.label}>Chauffeur :</Text>
          <Text style={styles.value}>{data.nom_chauffeur} {data.prenom_chauffeur}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="car" size={20} color="#007bff" />
          <Text style={styles.label}>Véhicule :</Text>
          <Text style={styles.value}>{data.nom_marque}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="card-text" size={20} color="#007bff" />
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value}>{data.immatriculation}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="clock" size={20} color={renderHeure().color} />
          <Text style={styles.label}>{renderHeure().label} :</Text>
          <Text style={[styles.value, { color: renderHeure().color }]}>
            {renderHeure().value}
          </Text>
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
          <MaterialCommunityIcons name="account-tie" size={20} color="#007bff" />
          <Text style={styles.label}>Créé par  :</Text>
          <Text style={styles.value}>{data.user_cr}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonView]}
            onPress={() => onViewDetail(data)}
          >
            <Feather name="eye" size={18} color="#fff" />
            <Text style={styles.buttonText}>Voir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonValidate]}
            onPress={() => onFinish(data)}
          >
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#6B7280', // gris moderne
  },
  value: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827', // texte principal
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 1,
  },
  buttonView: {
    backgroundColor: '#6B7280', // gris neutre
    marginRight: 10,
  },
  buttonValidate: {
    backgroundColor: '#2563EB', // bleu pro
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
    fontSize: 14,
  },
});
