import BonItems from '@/composants/bonItems';
import { getBandeSortie } from '@/services/charroiService';
import { BonSortie } from '@/types';
import { getStatutBS } from '@/utils/statutIcon';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListBonScreen = () => {
  const [data, setData] = useState<any>([]);
  const [filtered, setFiltered] = useState<BonSortie>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBon, setSelectedBon] = useState<BonSortie | null>(null);

  const openModal = (bon) => {
    setSelectedBon(bon);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBon(null);
  };


useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      const response = await getBandeSortie();
      if (!isMounted) return;
      const fetchedData = response.data.map(item => ({
        ...item,
        etat: computeEtat(item.date_prevue),
        dateHeureDepart: formatDate(item.date_prevue),
      }));
      setData(fetchedData);
      setFiltered(fetchedData);
    } catch (error) {
      console.error('Erreur chargement bons :', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();

  const intervalId = setInterval(() => {
    fetchData();
  }, 20000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, []);

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

  const computeEtat = (dateStr) => {
    if (!dateStr) return 'inconnu';
    const mDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mDate.toDateString() === today.toDateString()) return 'aujourdhui';
    if (mDate < today) return 'anterieur';
    return 'ulterieur';
  };

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
        keyExtractor={(item) => (item.id_bande_sortie).toString()}
        renderItem={({ item }) => (
          <BonItems
            item={item}
            openModal={openModal}
            formatDate={formatDate}
            styles={styles}
          />
        )}
        initialNumToRender={10}
        windowSize={5}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {selectedBon ? (
                <>
                  <Text style={styles.modalTitle}>Détail du Bon #{selectedBon.id_bande_sortie}</Text>
                  <View style={[styles.detailRow, { marginBottom: 15, alignItems: 'center' }]}>
                  <MaterialCommunityIcons
                    name={getStatutBS(selectedBon.nom_statut_bs).icon}
                    size={22}
                    color={getStatutBS(selectedBon.nom_statut_bs).color}
                    style={{ marginRight: 8 }}
                  />
                  <View
                    style={[
                      styles.statusBadgeModal,
                      { backgroundColor: getStatutBS(selectedBon.nom_statut_bs).color || '#777' },
                    ]}
                  >
                    <Text style={styles.statusTextModal}>{selectedBon.nom_statut_bs}</Text>
                  </View>
                </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="car" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      {selectedBon.nom_marque} ({selectedBon.immatriculation})
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="account" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      {selectedBon.nom} {selectedBon.prenom_chauffeur}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Date prévue : {new Date(selectedBon.date_prevue).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="exit-run" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Sortie : {selectedBon.sortie_time
                        ? new Date(selectedBon.sortie_time).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : `Prévue ${new Date(selectedBon.date_prevue).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Date retour prévue : {selectedBon.date_retour ? new Date(selectedBon.date_retour).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="exit-to-app" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Retour : {selectedBon.retour_time
                        ? new Date(selectedBon.retour_time).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : selectedBon.date_retour
                        ? `Prévue ${new Date(selectedBon.date_retour).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                        : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Destination : {selectedBon.nom_destination || selectedBon.destination || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clipboard-check" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Motif : {selectedBon.nom_motif_demande || selectedBon.motif || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="office-building" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Service : {selectedBon.nom_service || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="account-group" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Personne à bord : {selectedBon.personne_bord || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="comment-text" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Commentaire : {selectedBon.commentaire || 'Aucun'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="account" size={20} color="#007AFF" />
                    <Text style={styles.detailText}>
                      Créé par : {selectedBon.created || 'N/A'}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  eyeIconContainer: {
  marginLeft: 12,
  padding: 4,
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  statusBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 20,
},
statusText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
  marginLeft: 5,
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
  borderRadius: 20,
  overflow: 'hidden',
  textTransform: 'capitalize',
  elevation: 2,
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
arrowButton: {
  backgroundColor: '#e6f0ff',
  borderRadius: 20,
  padding: 6,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 12,
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 2,
  marginTop:10,
},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusBadgeModal: {
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 15,
  marginLeft: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
statusTextModal: {
  color: 'white',
  fontWeight: '700',
  fontSize: 14,
},

detailRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

detailText: {
  marginLeft: 10,
  fontSize: 16,
  color: '#333',
},

closeButton: {
  marginTop: 25,
  backgroundColor: '#007AFF',
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: 'center',
},

closeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
});