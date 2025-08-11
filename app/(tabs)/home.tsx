import { Images } from '@/assets/images';
import { logout } from '@/redux/authSlice';
import { getBandeSortieUnique, postValidationDemande } from '@/services/charroiService';
import { BonSortie } from '@/types';
import { BonSortieCard } from '@/utils/BonSortieCard';
import { isOnline, storePendingValidation, syncPendingValidations } from '@/utils/offlineSyncUtils';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ActivityIndicator, Card, Snackbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector((state: any) => state.auth?.currentUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [bon, setBon] = useState<BonSortie[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, déconnecter',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              dispatch(logout());
              await AsyncStorage.multiRemove(['token', 'user']);
              router.replace('/login');
            } catch (error) {
              console.error('Erreur lors de la déconnexion :', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const fetchData = async () => {
    try {
      const [bonData] = await Promise.all([
        getBandeSortieUnique(userId),
      ]);
      setBon(bonData.data);
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
          () => {
            setSnackbarMessage("✅ Données hors ligne synchronisées.");
            setSnackbarVisible(true);
            fetchData();
          },
          (err) => {
            console.log("❌ Erreur de synchro :", err);
          }
        );
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const onFinish = (d: BonSortie): void => {
    const heure = new Date(d.date_prevue).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const message = `🚚 Destination : ${d.nom_destination}\n👨‍✈️ Chauffeur : ${d.nom_chauffeur}\n🚗 Marque : ${d.nom_marque}\n🕒 Heure prévue : ${heure}\n\nSouhaitez-vous valider ce bon ?`;

    Alert.alert('Confirmation de validation', message, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        style: 'default',
        onPress: async () => {
          const payload = { ...d, validateur_id: userId };

          if (await isOnline()) {
            try {
              await postValidationDemande(payload);
              setSnackbarMessage(`✅ Bon validé en ligne`);
              fetchData();
            } catch (error) {
              setSnackbarMessage(`❌ Erreur de validation en ligne`);
            }
          } else {
            await storePendingValidation(payload);
            setSnackbarMessage(`📦 Bon sauvegardé hors ligne`);
          }

          setSnackbarVisible(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(user?.nom || '').substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.nom}</Text>
              <Text style={styles.userRole}>{user?.role}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            {loading ? (
              <ActivityIndicator animating size={24} />
            ) : (
              <Feather name="log-out" size={26} color="#d9534f" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>👋 Bienvenue sur DLOG</Text>

        <Card style={styles.imageCard}>
          <Image source={Images.backIcon} style={styles.backImage} />
        </Card>

        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="file-document-multiple" size={20} color="#333" /> Liste des bons de sortie
        </Text>

        <TextInput
          placeholder="🔍 Rechercher par chauffeur ou immatriculation"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        />

        {/* List */}
        <View style={{ marginBottom: 40 }}>
          {bon.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="file-search-outline" size={50} color="#ccc" />
              <Text style={{ color: '#888', marginTop: 8 }}>Aucun bon de sortie disponible</Text>
            </View>
          ) : (
            ['aujourdhui', 'ultérieur', 'antérieur'].map((etat) => {
              const filtered = bon
              .filter((item) => {
                const datePrevue = moment.utc(item.date_prevue);
                const today = moment.utc().startOf('day');

                if (etat === 'aujourdhui') return datePrevue.isSame(today, 'day');
                if (etat === 'antérieur') return datePrevue.isBefore(today, 'day');
                if (etat === 'ultérieur') return datePrevue.isAfter(today, 'day');
                return false;
              })
              .filter((item) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                  item.nom_chauffeur.toLowerCase().includes(searchLower) ||
                  item.immatriculation?.toLowerCase().includes(searchLower)
                );
              });

              if (filtered.length === 0) return null;

              const titre = {
                antérieur: '🚨 Antérieur',
                aujourdhui: '📅 Aujourd’hui',
                ultérieur: '⏳ Ultérieur',
              }[etat];

              return (
                <View key={etat} style={{ marginBottom: 20 }}>
                  <Text style={styles.groupTitle}>{titre}</Text>
                  {filtered.map((item, index) => (
                    <BonSortieCard
                      key={`${etat}-${index}`}
                      data={{
                        ...item,
                        dateHeurePrevue: item.date_prevue
                          ? moment.utc(item.date_prevue).format('DD-MM-YYYY HH:mm')
                          : '',
                        immatriculation: item.immatriculation || 'N/A', // ajout
                      }}
                      onFinish={onFinish}
                    />
                  ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Snackbar */}
      <View style={{ 
        position: 'absolute', 
        bottom: 56, // ou la hauteur de ta bottom bar (exemple: 56)
        width: '100%', 
        zIndex: 9999,
        elevation: 9999,
        }}
      >
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={5000}
          style={{ backgroundColor: '#333' }}
          action={{
            label: 'Fermer',
            textColor: '#fff',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 23,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#222',
  },
  userRole: {
    fontSize: 11,
    color: '#777',
    fontFamily: 'Inter-Regular',
  },
  title: {
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111',
  },
  imageCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 20,
  },
  backImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
});