import { Images } from '@/assets/images';
import { logout } from '@/redux/authSlice';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BonSortieScreen from '../screens/bonSortieScreen';
import CourseScreen from '../screens/courseScreen';
import ListBonScreen from '../screens/listBonScreen';
import ListCourseScreen from '../screens/listCourseScreen';

type ModalType = 'course' | 'listCourse' | 'bon' | 'listBon' | 'bons' | null;

const Plus = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth?.currentUser);

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
              console.error('Erreur de déconnexion :', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  type Option = {
    label: string;
    icon: any;
    bgColor: string;
    modalKey: ModalType;
  };

  const options : Option[] = [
    {
      label: 'Course',
      icon: Images.reservationIcon,
      bgColor: 'rgba(0, 122, 255, 0.1)',
      modalKey: 'course',
    },
    {
      label: 'Liste des courses',
      icon: Images.listReservation,
      bgColor: 'rgba(52, 199, 89, 0.1)',
      modalKey: 'listCourse',
    },
/*     {
      label: 'Bon de sortie',
      icon: Images.bonIcon,
      bgColor: 'rgba(255, 149, 0, 0.1)',
      modalKey: 'bon',
    }, */
    {
      label: 'Liste des bons',
      icon: Images.listBonIcon,
      bgColor: 'rgba(255, 59, 48, 0.1)',
      modalKey: 'listBon',
    },
  ];

  const openModal = (type: ModalType) => {
    Haptics.selectionAsync();
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'course':
        return <CourseScreen />;
      case 'listCourse':
        return <ListCourseScreen />;
      case 'bons':
        return <BonSortieScreen />;
      case 'listBon':
        return <ListBonScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.containerGlo, isDark && { backgroundColor: '#1c1c1e' }]}>
      {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {(user?.nom || '').substring(0, 2).toUpperCase()}
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

      {/* Banner Image */}
      <View style={styles.imageCard}>
        <Card>
          <Image source={Images.validateurIcon} style={styles.backImage} />
        </Card>
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Bienvenue 👋</Text>
        </View>
      </View>

      {/* Title */}
      <Text variant="titleLarge" style={[styles.title, isDark && { color: '#fff' }]}>
        ⚙️ Nos options
      </Text>

      {/* Options Grid */}
      <View style={styles.container}>
        {options.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => openModal(item.modalKey)}
            android_ripple={{ color: '#ccc', borderless: false }}
            style={({ pressed }) => [
              styles.card,
              {
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
                <Image source={item.icon} style={styles.icon} />
              </View>
              <Text style={[styles.label, isDark && { color: '#eee' }]}>{item.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Feather name="x" size={28} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>{renderModalContent()}</View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Plus;

const styles = StyleSheet.create({
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 21,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  containerGlo: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
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
  title: {
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#111',
    fontSize: 16
  },
  backImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  icon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  modalHeader: {
    alignItems: 'flex-end',
    padding: 15,
  },
});
