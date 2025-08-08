import { BonSortie } from '@/types';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  data: {
    id_bon: number;
    nom_destination: string;
    nom_chauffeur: string;
    nom_marque: string;
    immatriculation: string;
    dateHeurePrevue?: string;
    user_cr: string;
    etat?: 'aujourdhui' | 'anterieur' | 'ulterieur';

  };
  onFinish: (d: BonSortie) => void;
};

export const BonSortieCard: React.FC<Props> = ({ data, onFinish }) => {
  const getEtatColor = () => {
  switch (data.etat) {
    case 'aujourdhui':
      return '#28a745'; // vert = aujourd'hui
    case 'anterieur':
      return '#dc3545'; // rouge = passé
    case 'ulterieur':
      return '#ffc107'; // jaune = futur
    default:
      return '#007bff'; // bleu par défaut
  }
};


  return (
    <Card style={[styles.card, { borderLeftColor: getEtatColor() }]}>
      <Card.Content>

        {/* Destination */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#007bff" />
          <Text style={styles.label}>Destination :</Text>
          <Text style={styles.value}>{data.nom_destination}</Text>
        </View>

        {/* Chauffeur */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="account-tie" size={20} color="#28a745" />
          <Text style={styles.label}>Chauffeur :</Text>
          <Text style={styles.value}>{data.nom_chauffeur}</Text>
        </View>

        {/* Véhicule */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="car" size={20} color="#ffc107" />
          <Text style={styles.label}>Véhicule :</Text>
          <Text style={styles.value}>{data.nom_marque}</Text>
        </View>

        {/* Immatriculation */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="card-text" size={20} color="#6f42c1" />
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value}>{data.immatriculation}</Text>
        </View>

        {/* Heure prévue */}
        <View style={styles.row}>
          <Feather name="clock" size={20} color="#17a2b8" />
          <Text style={styles.label}>Heure prévue :</Text>
          <Text style={styles.value}>{data.dateHeurePrevue}</Text>
        </View>

        {/* Createur */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="account-tie" size={20} color="#28a745" />
          <Text style={styles.label}>Crée par  :</Text>
          <Text style={styles.value}>{data.user_cr}</Text>
        </View>

        {/* Bouton Valider */}
        <TouchableOpacity style={styles.button} onPress={() => onFinish(data as BonSortie)}>
          <Feather name="check-circle" size={18} color="#fff" />
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 6, // bande colorée
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#555',
  },
  value: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#222',
    flexShrink: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
    fontSize: 14,
  },
});
