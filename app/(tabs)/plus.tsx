import { Images } from '@/assets/images';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BonSortieScreen from '../screens/bonSortieScreen';
import CourseScreen from '../screens/courseScreen';
import ListBonScreen from '../screens/listBonScreen';
import ListCourseScreen from '../screens/listCourseScreen';


type ModalType = 'course' | 'listCourse' | 'bon' | 'listBon' | null;

const Plus = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth?.currentUser);
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

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

  const options: {
    label: string;
    icon: any;
    bgColor: string;
    modalKey: ModalType;
  }[] = [
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
    {
      label: 'Bon de sortie',
      icon: Images.bonIcon,
      bgColor: 'rgba(255, 149, 0, 0.1)',
      modalKey: 'bon',
    },
    {
      label: 'Liste des bons',
      icon: Images.listBonIcon,
      bgColor: 'rgba(255, 59, 48, 0.1)',
      modalKey: 'listBon',
    },
  ];

  const openModal = (type: ModalType) => {
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
      case 'bon':
        return <BonSortieScreen />;
      case 'listBon':
        return <ListBonScreen />;
      default:
        return null;
    }
  };

  return (
    <>
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
      <View style={styles.imageCard}>
        <Image source={Images.validateurIcon} style={styles.backImage} />
      </View>

      <Text variant="titleLarge" style={styles.title}>⚙️ Nos options</Text>

      <View style={styles.container}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => openModal(item.modalKey)}
          >
            <View style={styles.cardContent}>
              <View
                style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}
              >
                <Image source={item.icon} style={styles.icon} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Feather name="x" size={28} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>{renderModalContent()}</View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Plus;

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10
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
    marginVertical: 15,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
    backImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
    imageCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
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
