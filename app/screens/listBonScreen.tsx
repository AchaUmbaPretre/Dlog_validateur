import { getBandeSortie } from '@/services/charroiService';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListBonScreen = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBandeSortie();
        // On suppose que la réponse contient un tableau dans response.data
        const fetchedData = response.data.map(item => ({
          ...item,
          etat: computeEtat(item.date_prevue),
          dateHeureDepart: formatDate(item.date_prevue),
          // Tu peux ajouter ici d'autres formats ou conversions si besoin
        }));
        setData(fetchedData);
        setFiltered(fetchedData);
      } catch (error) {
        console.error('Erreur chargement bons :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Met à jour filtered quand search ou data change
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(data);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            (item.nom?.toLowerCase().includes(lower) || '') ||
            (item.immatriculation?.toLowerCase().includes(lower) || '') ||
            (item.nom_chauffeur?.toLowerCase().includes(lower) || '')
        )
      );
    }
  }, [search, data]);

  // Calcul simple d'état par rapport à aujourd'hui
  const computeEtat = (dateStr) => {
    if (!dateStr) return 'inconnu';
    const mDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mDate.toDateString() === today.toDateString()) return 'aujourdhui';
    if (mDate < today) return 'anterieur';
    return 'ulterieur';
  };

  // Format de date français
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Couleur selon état
  const getEtatColor = (etat) => {
    switch (etat) {
      case 'aujourdhui':
        return '#28a745'; // vert
      case 'anterieur':
        return '#dc3545'; // rouge
      case 'ulterieur':
        return '#ffc107'; // jaune
      default:
        return '#007bff'; // bleu
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          <MaterialCommunityIcons name="file-document" size={18} color="#007AFF" /> Bon #{item.id_bande_sortie || item.id}
        </Text>
        <Text style={[styles.etat, { backgroundColor: getEtatColor(item.etat) }]}>
          {item.etat}
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="car" size={18} color="#007AFF" />
        <Text style={styles.text}>
          {item.nom_marque} ({item.immatriculation})
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="account" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_chauffeur || item.nom}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="calendar-start" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.dateHeureDepart}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_destination || item.destination}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="clipboard-text" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_motif_demande || item.motif}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="office-building" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.nom_service || item.service}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="account-multiple" size={18} color="#007AFF" />
        <Text style={styles.text}>{item.personne_bord || item.personnesABord}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="note-text" size={18} color="#007AFF" />
        <Text style={[styles.text, { fontStyle: 'italic' }]}>
          {item.commentaire || 'Aucun commentaire'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <MaterialCommunityIcons name="loading" size={40} color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher par nom, chauffeur ou immatriculation..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => (item.id_bande_sortie || item.id || index).toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun bon de sortie trouvé.</Text>
        }
        contentContainerStyle={filtered.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    </View>
  );
};

export default ListBonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  etat: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  text: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
