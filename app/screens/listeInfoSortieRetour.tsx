import { getInfoSortieRetour } from '@/services/charroiService';
import { BonSortie } from '@/types';
import { syncPendingValidations } from '@/utils/offlineSyncUtils';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Divider } from 'react-native-paper';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

const ListeInfoSortieRetour = () => {
  const [data, setData] = useState<BonSortie>([]);
  const [lastOperations, setLastOperations] = useState<BonSortie>([]);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const drawerProgress = useSharedValue(-DRAWER_WIDTH);

  const fetchData = async () => {
    try {
      const [bonData] = await Promise.all([getInfoSortieRetour()]);
      setData(bonData.data || []);
    } catch (error) {
      Alert.alert("Erreur", "Échec de chargement des données.");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPendingValidations(
          () => fetchData(),
          (err) => console.log("❌ Erreur de synchro :", err)
        );
      }
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (data.length) {
      const latestOps: { [key: string]: any } = {};
      data.forEach(item => {
        const immat = item.immatriculation || '';
        if (!latestOps[immat] || new Date(item.created_at) > new Date(latestOps[immat].created_at)) {
          latestOps[immat] = item;
        }
      });
      setLastOperations(Object.values(latestOps));
    }
  }, [data]);

  const openDrawer = (operation: any) => {
    setSelectedOperation(operation);
    drawerProgress.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  };

  const closeDrawer = () => {
    drawerProgress.value = withTiming(-DRAWER_WIDTH, { duration: 300, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(setSelectedOperation)(null);
    });
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerProgress.value }],
  }));

  const filteredOperations = lastOperations.filter(op =>
    op.immatriculation?.toLowerCase().includes(searchText.toLowerCase()) ||
    op.nom_marque?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'Sortie':
        return '#FF6B6B';
      case 'Retour':
        return '#4ECDC4';
      default:
        return '#555';
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Dernières opérations des véhicules</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par immatriculation ou marque"
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView>
          {filteredOperations.map((op, index) => (
            <View key={op.id_sortie_retour}>
              <TouchableOpacity onPress={() => openDrawer(op)}>
                <View style={styles.item}>
                  <Text style={styles.index}>{index + 1}.</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vehicle}>{op.immatriculation || '-'} - {op.nom_marque || '-'}</Text>
                    <Text style={[styles.type, { color: getTypeColor(op.type) }]}>
                      {op.type || '-'} - {op.created_at ? moment(op.created_at).format('DD/MM/YYYY HH:mm') : '-'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          ))}
        </ScrollView>

        {/* Drawer */}
        {selectedOperation && (
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.drawer, drawerStyle]}>
              <Text style={styles.drawerTitle}>Détails de l'opération</Text>
              <ScrollView>
                <Text style={styles.detail}>Véhicule: {selectedOperation.immatriculation || '-'}</Text>
                <Text style={styles.detail}>Marque: {selectedOperation.nom_marque || '-'}</Text>
                <Text style={styles.detail}>Catégorie: {selectedOperation.nom_cat || '-'}</Text>
                <Text style={styles.detail}>Chauffeur: {selectedOperation.nom_chauffeur || '-'}</Text>
                <Text style={styles.detail}>Client: {selectedOperation.nom_client || '-'}</Text>
                <Text style={styles.detail}>Destination: {selectedOperation.nom_destination || '-'}</Text>
                <Text style={styles.detail}>Service: {selectedOperation.nom_service || '-'}</Text>
                <Text style={[styles.detail, { color: getTypeColor(selectedOperation.type) }]}>
                  Type: {selectedOperation.type || '-'}
                </Text>
                <Text style={styles.detail}>Mouvement Exceptionnel: {selectedOperation.mouvement_exceptionnel ? 'Oui' : 'Non'}</Text>
                <Text style={styles.detail}>Date: {selectedOperation.created_at ? moment(selectedOperation.created_at).format('DD/MM/YYYY HH:mm') : '-'}</Text>
              </ScrollView>
              <Button mode="contained" onPress={closeDrawer} style={{ marginTop: 20 }}>Fermer</Button>
            </Animated.View>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ListeInfoSortieRetour;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  searchInput: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 10 
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', marginBottom: 4, borderRadius: 8, elevation: 1 },
  index: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  vehicle: { fontSize: 16, fontWeight: 'bold' },
  type: { fontSize: 14 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: -2, height: 0 },
  },
  drawerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  detail: { fontSize: 16, marginBottom: 8 },
});
