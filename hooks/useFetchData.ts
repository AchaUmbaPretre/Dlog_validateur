import {
  getChauffeur,
  getDestination,
  getMotif,
  getServiceDemandeur,
  getVehicule,
  getVehiculeDispo,
} from "@/services/charroiService";
import { getClient } from "@/services/clientService";
import { useEffect, useState } from "react";

import { Chauffeur, Client, Destination, Motif, Service, Vehicule } from "@/types";
import { Alert } from "react-native";

export function useFetchData() {
  const [loading, setLoading] = useState(false);
  const [vehiculeList, setVehiculeList] = useState<Vehicule[]>([]);
  const [chauffeurList, setChauffeurList] = useState<Chauffeur[]>([]);
  const [motifList, setMotifList] = useState<Motif[]>([]);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [destinationList, setDestinationList] = useState<Destination[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [vehicule, setVehicule] = useState<Vehicule[]>([]);

  const fetchDatas = async () => {
    try {
      setLoading(true);
      const [
        vehiculeData,
        chauffeurData,
        serviceData,
        motifData,
        destinationData,
        clientData,
        vehiculeDataV,
      ] = await Promise.all([
        getVehiculeDispo(),
        getChauffeur(),
        getServiceDemandeur(),
        getMotif(),
        getDestination(),
        getClient(),
        getVehicule()
      ]);
      setVehiculeList(vehiculeData.data);
      setChauffeurList(chauffeurData.data?.data ?? []);
      setServiceList(serviceData.data);
      setMotifList(motifData.data);
      setDestinationList(destinationData.data);
      setClientList(clientData.data);
      setVehicule(vehiculeDataV.data)
    } catch (err) {
      Alert.alert("Erreur", "Échec de chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  return {
    loading,
    vehiculeList,
    chauffeurList,
    motifList,
    serviceList,
    destinationList,
    clientList,
    fetchDatas,
    vehicule
  };
}
