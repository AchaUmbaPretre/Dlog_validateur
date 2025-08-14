import { savePushToken } from '@/services/charroiService';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface NotificationData {
  id_bande_sortie?: number;
}

type RootStackParamList = {
  BandeSortieDetails: { id: number };
};

export default function useNotificationService(userId: number) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      if (token) {
        savePushTokenToServer(userId, token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue en premier plan:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response);
      const data = response.notification.request.content.data as NotificationData;
      if (data.id_bande_sortie) {
        navigation.navigate('BandeSortieDetails', { id: data.id_bande_sortie });
      }
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userId]);

  return expoPushToken;
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (!Device.isDevice) {
    console.log('⚠️ Les notifications push ne fonctionnent que sur un vrai appareil.');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permissions refusées', 'Impossible de recevoir les notifications.');
    return null;
  }

  const tokenResult = await Notifications.getExpoPushTokenAsync();
  token = tokenResult.data;
  console.log('Expo Push Token:', token);

  return token;
}

async function savePushTokenToServer(userId: number, token: string) {
  try {
    await savePushToken(userId, token);
    console.log('Push token enregistré sur le serveur');
  } catch (err) {
    console.error('Erreur enregistrement push token:', err);
  }
}
