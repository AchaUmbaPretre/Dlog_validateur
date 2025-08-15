import { getAffectationDemande } from '@/services/charroiService';
import { AffectationItem } from '@/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListCourseScreen = () => {
  const [data, setData] = useState<AffectationItem[]>([]);
  const [filtered, setFiltered] = useState<AffectationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAffectationDemande();
        setData(response.data);
        setFiltered(response.data);
      } catch (error) {
        console.error('Erreur chargement courses :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(data);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.nom.toLowerCase().includes(lower) ||
            item.nom_marque.toLowerCase().includes(lower) ||
            item.nom_destination.toLowerCase().includes(lower) ||
            item.immatriculation.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, data]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGoToBonSortie = (id: number) => {
    router.push({
      pathname: '/screens/bonSortieScreen',
      params: { affectationId: String(id) }
    });
  };

  const renderItem = ({ item }: { item: AffectationItem }) => {
    const isBSValide = item.nom_statut_bs === "BS validé";

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            <MaterialCommunityIcons name="car-multiple" size={18} color="#007AFF" /> Course #{item.id_affectation_demande}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="car" size={18} color="#007AFF" />
          <Text style={styles.text}>
            Marque : {item.nom_marque} ({item.immatriculation})
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="account" size={18} color="#007AFF" />
          <Text style={styles.text}>Chauffeur : {item.nom}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar-start" size={18} color="#007AFF" />
          <Text style={styles.text}>Départ : {formatDate(item.date_prevue)}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar-end" size={18} color="#007AFF" />
          <Text style={styles.text}>Retour : {formatDate(item.date_retour)}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={18} color="#007AFF" />
          <Text style={styles.text}>Destination : {item.nom_destination}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="clipboard-text" size={18} color="#007AFF" />
          <Text style={styles.text}>Motif : {item.nom_motif_demande}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="office-building" size={18} color="#007AFF" />
          <Text style={styles.text}>Service : {item.nom_service}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="account-multiple" size={18} color="#007AFF" />
          <Text style={[styles.text, { fontWeight: '600' }]}>A bord : {item.personne_bord}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="note-text" size={18} color="#007AFF" />
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            {item.commentaire || 'Aucun commentaire'}
          </Text>
        </View>

        {isBSValide ? (
          <View style={[styles.boutonBonSortie, styles.boutonDesactive]}>
            <Text style={[styles.boutonBonSortieText, { color: '#888' }]}>Bon de sortie validé</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.boutonBonSortie}
            onPress={() => handleGoToBonSortie(item.id_affectation_demande)}
            activeOpacity={0.7}
          >
            <Text style={styles.boutonBonSortieText}>Voir bon de sortie</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <MaterialCommunityIcons name="loading" size={40} color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par chauffeur, véhicule..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id_affectation_demande.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune course trouvée.</Text>
        }
        contentContainerStyle={filtered.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    </SafeAreaView>
  );
};

export default ListCourseScreen;

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 16,
    marginTop: 10,
    paddingLeft: 4,
    alignSelf: "flex-start",
  },
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
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
  boutonBonSortie: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  boutonBonSortieText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  boutonDesactive: {
    backgroundColor: '#e0e0e0',
  },
});
