import { Images } from '@/assets/images';
import { logout } from '@/redux/authSlice';
import { getBandeSortieUnique, postValidationDemande } from '@/services/charroiService';
import { BonSortieCard } from '@/utils/BonSortieCard';
import { isOnline, storePendingValidation, syncPendingValidations } from '@/utils/offlineSyncUtils';
import { Feather } from '@expo/vector-icons';
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
  TouchableOpacity,
  View
} from 'react-native';
import { ActivityIndicator, Card, Snackbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';


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


const Home = () => {
  const user = useSelector((state: any) => state.auth?.currentUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [bon, setBon] = useState<BonSortie[]>([])
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const fetchData = async() => {
    try {
      const [ bonData ] = await Promise.all([
        getBandeSortieUnique(userId),
      ])
      setBon(bonData.data)
    } catch (error) {
     Alert.alert("Erreur", "Échec de chargement des données.");
    }
  }

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(user?.nom || '')
                  .split(' ')
                  .slice(0, 2)
                  .map((word: string) => word.charAt(0).toUpperCase())
                  .join('')}
                </Text>
                </View>
              <View>
            <Text variant="titleMedium">{user?.nom}</Text>
            <Text variant="bodySmall" style={{ color: '#777' }}>{user?.role}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleLogout}>
          {loading ? (
          <ActivityIndicator animating size={24} />
          ) : (
            <Feather name="log-out" size={24} color="#d9534f" />
          )}
          </TouchableOpacity>
        </View>

        {/* Welcome Title */}
        <Text variant="titleLarge" style={styles.title}>👋 Bienvenue sur DLOG</Text>

        {/* Image */}
        <Card style={styles.imageCard}>
          <Image source={Images.backIcon} style={styles.backImage} />
        </Card>

        <Text variant="titleLarge" style={styles.title}>⚙️ Liste de bons de sortie</Text>

        <View style={{ marginBottom: 40 }}>
          {bon.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#888' }}>Aucun bon de sortie disponible</Text>
            </View>
          ) : (
            <>
              {['aujourdhui', 'avenir', 'ultérieur'].map((etat) => {
                const filtered = bon.filter((item) => {
                  const datePrevue = moment.utc(item.date_prevue);
                  const today = moment.utc().startOf('day');

                  if (etat === 'aujourdhui') return datePrevue.isSame(today, 'day');
                  if (etat === 'avenir') return datePrevue.isAfter(today, 'day');
                  if (etat === 'ultérieur') return datePrevue.isBefore(today, 'day');
                  return false;
                });

                if (filtered.length === 0) return null;

                const titre = {
                  ultérieur: '🚨 Ultérieur',
                  aujourdhui: '📅 Aujourd’hui',
                  avenir: '⏳ À venir',
                }[etat];

                return (
                  <View key={etat} style={{ marginBottom: 20 }}>
                    <Text variant="titleMedium" style={{ marginBottom: 10 }}>{titre}</Text>
                    {filtered.map((item, index) => (
                      <BonSortieCard
                        key={`${etat}-${index}`}
                        data={{
                          ...item,
                          dateHeurePrevue: item.date_prevue
                            ? moment.utc(item.date_prevue).format('DD-MM-YYYY HH:mm')
                            : '',
                          dateHeureRetour: item.date_retour
                            ? moment.utc(item.date_retour).format('DD-MM-YYYY HH:mm')
                            : '',
                        }}
                        onFinish={onFinish}
                      />
                    ))}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: 'Fermer',
          onPress: () => setSnackbarVisible(false),
        }}
      >
          {snackbarMessage}
        </Snackbar>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 10
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  title: {
    marginVertical: 20,
    fontWeight: 'bold',
    fontSize: 18
  },
  imageCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  backImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    padding: 10
  },

  bold: {
    fontWeight: '600',
  },
  cardTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
cardSubtitle: {
  fontSize: 14,
  color: '#888',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 4,
},
value: {
  fontWeight: '600',
  color: '#333',
},
});