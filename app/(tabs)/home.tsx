import { Images } from '@/assets/images';
import { logout } from '@/redux/authSlice';
import { getBandeSortieUnique } from '@/services/charroiService';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

const BonSortieCard = ({ data }: { data: any }) => (

  <Card style={styles.card}>
    <Card.Content style={{gap:10}}>
      <Text>🚚 Destination : <Text style={styles.bold}>{data.nom_destination}</Text></Text>
      <Text>👨‍✈️ Chauffeur : <Text style={styles.bold}>{data.nom_chauffeur}</Text></Text>
      <Text>🚗 Marque : <Text style={styles.bold}>{data.nom_marque}</Text></Text>
      <Text>🛻 Type de véhicule : <Text style={styles.bold}>{data.nom_cat}</Text></Text>
      <Text>🕒 Heure prévue : <Text style={styles.bold}>{data.heurePrevue}</Text></Text>
      <Text>🕕 Heure retour : <Text style={styles.bold}>{data.heureRetour}</Text></Text>
    </Card.Content>
    <Card.Actions>
      <Button   
        buttonColor="#007BFF"
        textColor="#ffffff"
        mode="contained" 
        onPress={() => {}}
      >
        Valider
      </Button>
    </Card.Actions>
  </Card>
);

interface BonSortie {
  id_bande_sortie: number;
  nom_destination: string;
  nom_chauffeur: string;
  nom_marque: string;
  nom_cat: string;
  date_prevue: string;
  date_retour: string;
}


const Home = () => {
  const user = useSelector((state: any) => state.auth?.currentUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [bon, setBon] = useState<BonSortie[]>([])

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

  useEffect(()=> {
    fetchData()
  }, [userId])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={Images.userIcon} style={styles.avatar} />
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

        <View style={{marginBottom:60}}>
          {bon.map((item, index) => (
          <BonSortieCard
            key={index}
            data={{
              nom_destination: item.nom_destination,
              nom_chauffeur: item.nom_chauffeur,
              nom_marque: item.nom_marque,
              type: item.nom_cat,
              heurePrevue: item.date_prevue ? new Date(item.date_prevue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
              heureRetour: item.date_retour ? new Date(item.date_retour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
            }}
          />
))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  title: {
    marginVertical: 20,
    fontWeight: 'bold',
  },
  imageCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
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
});
