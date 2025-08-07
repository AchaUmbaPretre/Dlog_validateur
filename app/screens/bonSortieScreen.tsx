import {
  getChauffeur,
  getDestination,
  getMotif,
  getServiceDemandeur,
  getVehiculeDispo,
  postBandeSortie,
} from "@/services/charroiService";
import { getClient } from "@/services/clientService";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Card, TextInput, Title } from "react-native-paper";
import { useSelector } from "react-redux";

// TYPES
interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  nom_marque: string;
  modele: string;
}
interface Chauffeur {
  id_chauffeur: number;
  nom: string;
  postnom: string;
}
interface Motif {
  id_motif_demande: number;
  nom_motif_demande: string;
}
interface Service {
  id_service_demandeur: number;
  nom_service: string;
}
interface Destination {
  id_destination: number;
  nom_destination: string;
}
interface Client {
  id_client: number;
  nom: string;
}
interface FormState {
  id_vehicule: number | null;
  id_chauffeur: number | null;
  id_motif_demande: number | null;
  id_demandeur: number | null;
  id_client: number | null;
  id_destination: number | null;
  personne_bord: string;
  commentaire: string;
}

type Props = {
  affectationId: number;
};

const BonSortieScreen: React.FC<Props> = ({affectationId}) => {
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [loadingData, setLoadingData] = useState(false);

  const [vehiculeList, setVehiculeList] = useState<Vehicule[]>([]);
  const [chauffeurList, setChauffeurList] = useState<Chauffeur[]>([]);
  const [motifList, setMotifList] = useState<Motif[]>([]);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [destinationList, setDestinationList] = useState<Destination[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);

  const [form, setForm] = useState<FormState>({
    id_vehicule: null,
    id_chauffeur: null,
    id_motif_demande: null,
    id_demandeur: null,
    id_client: null,
    id_destination: null,
    personne_bord: "",
    commentaire: "",
  });

  const [datePrevue, setDatePrevue] = useState<Date | null>(null);
  const [dateRetour, setDateRetour] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<any>(null); // facultatif si tu veux gérer les pickers iOS

  const router = useRouter();

  const fetchDatas = async () => {
    try {
      setLoadingData(true);
      const [
        vehiculeData,
        chauffeurData,
        serviceData,
        motifData,
        destinationData,
        clientData,
      ] = await Promise.all([
        getVehiculeDispo(),
        getChauffeur(),
        getServiceDemandeur(),
        getMotif(),
        getDestination(),
        getClient(),
      ]);
      setVehiculeList(vehiculeData.data);
      setChauffeurList(chauffeurData.data?.data ?? []);
      setServiceList(serviceData.data);
      setMotifList(motifData.data);
      setDestinationList(destinationData.data);
      setClientList(clientData.data);
    } catch (err) {
      Alert.alert("Erreur", "Échec de chargement des données.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  const handleChange = (name: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.id_vehicule || !form.id_chauffeur || !form.id_motif_demande || !form.id_demandeur ) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
      setLoadingData(true);
      await postBandeSortie({ ...form,  id_affectation_demande : affectationId, date_prevue: datePrevue, date_retour: dateRetour, user_cr: userId });
      Alert.alert("Succès", "Le bon de sortie est enregistré avec succès !");
      setForm({
        id_vehicule: null,
        id_chauffeur: null,
        id_motif_demande: null,
        id_demandeur: null,
        id_client: null,
        id_destination: null,
        personne_bord: "",
        commentaire: "",
      });
      setDatePrevue(null);
      setDateRetour(null);
      fetchDatas();
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'enregistrer le retour.");
    } finally {
      setLoadingData(false);
    }
  };

  const renderPicker = (
    label: string,
    key: keyof FormState,
    data: any[],
    labelProp: string,
    valueProp: string
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form[key]}
          onValueChange={(val) => handleChange(key, val)}
        >
          <Picker.Item label={`-- Sélectionner ${label.toLowerCase()} --`} value={null} />
          {data.map((item, index) => (
            <Picker.Item
              key={`${key}-${item[valueProp] ?? index}`}
              label={item[labelProp]}
              value={item[valueProp]}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  const openPicker = (
    label: string,
    value: Date | null,
    onChange: (date: Date) => void
  ) => {
    const initialDate = value || new Date();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'date',
        is24Hour: true,
        display: 'default',
        onChange: (_event, selectedDate) => {
          if (selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              is24Hour: true,
              display: 'default',
              onChange: (_evt, selectedTime) => {
                if (selectedTime) {
                  const finalDate = new Date(selectedDate);
                  finalDate.setHours(selectedTime.getHours());
                  finalDate.setMinutes(selectedTime.getMinutes());
                  onChange(finalDate);
                }
              },
            });
          }
        },
      });
    } else {
      setShowPicker({ label, value, onChange }); // à implémenter si iOS
    }
  };

  const renderDateTimePicker = (
    label: string,
    value: Date | null,
    onChange: (date: Date) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Button
        mode="outlined"
        onPress={() => openPicker(label, value, onChange)}
        style={{ borderRadius: 0, borderColor: '#ccc' }}
      >
        <Text style={{ color: '#555' }}>
          {value ? value.toLocaleString() : "Choisir la date et l'heure"}
        </Text>
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <Title style={styles.title}>Créer un bon de sortie</Title>

          {loadingData ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                {renderDateTimePicker("Date & heure de départ prévue", datePrevue, setDatePrevue)}
                {renderDateTimePicker("Date & heure de retour prévue", dateRetour, setDateRetour)}

                {renderPicker("Véhicule *", "id_vehicule", vehiculeList, "immatriculation", "id_vehicule")}
                {renderPicker("Chauffeur *", "id_chauffeur", chauffeurList, "nom", "id_chauffeur")}
                {renderPicker("Motif *", "id_motif_demande", motifList, "nom_motif_demande", "id_motif_demande")}
                {renderPicker("Service Demandeur *", "id_demandeur", serviceList, "nom_service", "id_service_demandeur")}
                {renderPicker("Client", "id_client", clientList, "nom", "id_client")}
                {renderPicker("Destination", "id_destination", destinationList, "nom_destination", "id_destination")}

                <Text style={styles.label}>Personnes à bord</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Saisir les noms"
                  value={form.personne_bord}
                  onChangeText={(val) => handleChange("personne_bord", val)}
                  style={styles.input}
                />

                <Text style={styles.label}>Commentaire *</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Commenter..."
                  value={form.autorise_par}
                  onChangeText={(val) => handleChange("commentaire", val)}
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loadingData}
                  disabled={loadingData}
                  style={styles.button}
                >
                  Soumettre
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BonSortieScreen;


const styles = StyleSheet.create({
  backButton: {
  marginBottom: 16,
  marginTop: 10,
  paddingLeft: 4,
  alignSelf: "flex-start",
},
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  inner: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  field: {
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  card: {
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
});