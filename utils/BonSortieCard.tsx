import moment from 'moment';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Card, Text } from 'react-native-paper';

interface BonSortie {
  id_bande_sortie: number;
  nom_destination: string;
  nom_chauffeur: string;
  nom_marque: string;
  nom_cat: string;
  date_prevue: string;
  date_retour: string;
  immatriculation: string;
  user_cr: string;
}

interface BonSortieCardProps {
  data: BonSortie & {
    dateHeurePrevue: string;
    dateHeureRetour: string;
  };
  onFinish: (bon: BonSortie) => void;
}

export const BonSortieCard = ({ data, onFinish }: BonSortieCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    setLoading(true);
    await onFinish(data);
    setLoading(false);
  };

  const getStatut = () => {
    const datePrevue = moment.utc(data.date_prevue);
    const today = moment.utc().startOf('day');

    if (datePrevue.isSame(today, 'day')) return { label: 'Aujourd’hui', color: '#0d6efd' };
    if (datePrevue.isBefore(today, 'day')) return { label: 'En retard', color: '#dc3545' };
    return { label: 'À venir', color: '#ffc107' };
  };

  const statut = getStatut();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={`🚚 ${data.nom_destination}`}
        subtitle={`🕒 Départ prévu : ${data.dateHeurePrevue}`}
        right={() => (
          <Badge style={{ ...styles.badge, backgroundColor: statut.color }}>
            {statut.label}
          </Badge>
        )}
      />
      <Card.Content>
        <View style={styles.row}>
          <Text style={styles.label}>👨‍✈️ Chauffeur</Text>
          <Text style={styles.value}>{data.nom_chauffeur}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🚗 Véhicule</Text>
          <Text style={styles.value}>{`${data.nom_marque} (${data.immatriculation})`}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🛻 Type</Text>
          <Text style={styles.value}>{data.nom_cat}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🕕 Retour prévu</Text>
          <Text style={styles.value}>{data.dateHeureRetour}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>👤 Créé par</Text>
          <Text style={styles.value}>{data.user_cr}</Text>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          icon="check"
          mode="contained"
          onPress={handleValidation}
          buttonColor="#198754"
          textColor="#fff"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Validation...' : 'Valider'}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: '500',
    color: '#555',
    fontSize: 14,
  },
  value: {
    fontWeight: '600',
    color: '#222',
    fontSize: 14,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  badge: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
});
