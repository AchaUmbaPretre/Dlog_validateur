import { postValidationDemande } from '@/services/charroiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const STORAGE_KEY = 'pendingValidations';

export const storePendingValidation = async (data: any) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const validations = existing ? JSON.parse(existing) : [];
    validations.push(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validations));
  } catch (e) {
    console.error("❌ Erreur de stockage local :", e);
  }
};

export const syncPendingValidations = async (onSuccess?: () => void, onError?: (err: any) => void) => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const pending = stored ? JSON.parse(stored) : [];

    for (const item of pending) {
      try {
        await postValidationDemande(item);
      } catch (e) {
        console.warn("⚠️ Échec d’un élément :", e);
        if (onError) onError(e);
        return;
      }
    }

    await AsyncStorage.removeItem(STORAGE_KEY);
    if (onSuccess) onSuccess();
  } catch (e) {
    console.error("❌ Erreur de synchronisation :", e);
    if (onError) onError(e);
  }
};

export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};