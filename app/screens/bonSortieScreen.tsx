import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";
import { Button, Card, Surface, TextInput, Title } from "react-native-paper";
import { useSelector } from "react-redux";

import { useFetchData } from "@/hooks/useFetchData";
import { RootState } from "@/redux/store";
import { getAffectationDemandeOne, postBandeSortie } from "@/services/charroiService";
import { FormState } from "@/types";

interface ShowPickerState {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
}

const pickerFields = [
  { label: "Véhicule *", key: "id_vehicule", dataKey: "vehiculeList", labelProp: "immatriculation", valueProp: "id_vehicule" },
  { label: "Chauffeur *", key: "id_chauffeur", dataKey: "chauffeurList", labelProp: "nom", valueProp: "id_chauffeur" },
  { label: "Motif *", key: "id_motif_demande", dataKey: "motifList", labelProp: "nom_motif_demande", valueProp: "id_motif_demande" },
  { label: "Service Demandeur *", key: "id_demandeur", dataKey: "serviceList", labelProp: "nom_service", valueProp: "id_service_demandeur" },
  { label: "Client", key: "id_client", dataKey: "clientList", labelProp: "nom", valueProp: "id_client" },
  { label: "Destination", key: "id_destination", dataKey: "destinationList", labelProp: "nom_destination", valueProp: "id_destination" },
];

const BonSortieScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth?.currentUser?.id_utilisateur);
  const {
    loading,
    vehiculeList,
    chauffeurList,
    motifList,
    serviceList,
    destinationList,
    clientList,
    fetchDatas,
  } = useFetchData();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
  const { affectationId } = useLocalSearchParams();
  const [datePrevue, setDatePrevue] = useState<Date | null>(null);
  const [dateRetour, setDateRetour] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<ShowPickerState | null>(null);

  const router = useRouter();
  const affectationIdNumber = Array.isArray(affectationId)
    ? Number(affectationId[0])
    : Number(affectationId);

  const handleChange = (name: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const fetchData = async () => {
  try {
    const { data } = await getAffectationDemandeOne(affectationIdNumber);
    console.log(data)
    if (data) {
      setForm({
        id_vehicule: data.id_vehicule ?? null,
        id_chauffeur: data.id_chauffeur ?? null,
        id_motif_demande: data.id_motif_demande ?? null,
        id_demandeur: data.id_demandeur ?? null,
        id_client: data.id_client ?? null,
        id_destination: data.id_destination ?? null,
        personne_bord: data.personne_bord || '',
        commentaire: data.commentaire || '',
      });

      setDatePrevue(data.date_prevue ? new Date(data.date_prevue) : null);
      setDateRetour(data.date_retour ? new Date(data.date_retour) : null);
    }
  } catch (error) {
    console.log("Erreur fetch affectation:", error);
  }
};


      useEffect(()=> {
        fetchData()
      }, [affectationId])

  const handleSubmit = async () => {
    if (!form.id_vehicule || !form.id_chauffeur || !form.id_motif_demande || !form.id_demandeur) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
       await postBandeSortie({ ...form, date_prevue: datePrevue, date_retour: dateRetour,  id_affectation_demande : affectationId, user_cr: userId });
      Alert.alert("Succès", "Course enregistrée avec succès !");

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
      Alert.alert("Erreur", "Impossible d'enregistrer le bon.");
    }
  };

  const renderPicker = (
    label: string,
    key: keyof FormState,
    data: any[],
    labelProp: string,
    valueProp: string
  ) => (
    <View style={styles.field} key={key}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={form[key]} onValueChange={(val) => handleChange(key, val)}>
          <Picker.Item label={`-- Sélectionner ${label.toLowerCase()} --`} value={null} />
          {data.map((item, index) => (
            <Picker.Item key={`${key}-${item[valueProp] ?? index}`} label={item[labelProp]} value={item[valueProp]} />
          ))}
        </Picker>
      </View>
    </View>
  );

  const openPicker = (label: string, value: Date | null, onChange: (date: Date) => void) => {
    const initialDate = value || new Date();

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: "date",
        is24Hour: true,
        display: "default",
        onChange: (_event, selectedDate) => {
          if (selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: "time",
              is24Hour: true,
              display: "default",
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
      setShowPicker({ label, value, onChange });
    }
  };

  const renderDateTimePicker = (label: string, value: Date | null, onChange: (date: Date) => void) => (
    <View style={styles.field} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Button mode="outlined" onPress={() => openPicker(label, value, onChange)} style={{ borderRadius: 0, borderColor: "#ccc" }}>
        <Text style={{ color: "#555" }}>{value ? value.toLocaleString() : "Choisir la date et l'heure"}</Text>
      </Button>
    </View>
  );
  
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <Surface style={styles.titleContainer} elevation={4}>
              <View style={styles.titleBar} />
              <Title style={styles.titleText}>Créer un bon de sortie</Title>
              <View style={styles.titleBar} />
            </Surface>
            {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#007bff" />
            </View>
            ) : (
              <Card style={styles.card}>
                <Card.Content>
                  {renderDateTimePicker("Date & heure de départ prévue", datePrevue, setDatePrevue)}
                  {renderDateTimePicker("Date & heure de retour prévue", dateRetour, setDateRetour)}

                  {pickerFields.map(({ label, key, dataKey, labelProp, valueProp }) =>
                    renderPicker(label, key, {
                      vehiculeList,
                      chauffeurList,
                      motifList,
                      serviceList,
                      destinationList,
                      clientList,
                    }[dataKey], labelProp, valueProp)
                  )}

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
                    value={form.commentaire}
                    onChangeText={(val) => handleChange("commentaire", val)}
                    style={styles.input}
                  />

                  <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
                    Soumettre
                  </Button>
                </Card.Content>
              </Card>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    backgroundColor: "#F0F2F5"
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  inner: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
  marginTop: 20,
  marginBottom: 24,
  paddingVertical: 10,
  backgroundColor: "#fff",
  borderRadius: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 6,
  },
  titleBar: {
    width: 4,
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 4,
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151", // gris moyen
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
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
  modalHeader: {
    alignItems: "flex-end",
    padding: 15,
  },
});