import axios, { AxiosResponse } from 'axios';
import config from '../config';

const { REACT_APP_SERVER_DOMAIN } = config;
const BASE_URL = `${REACT_APP_SERVER_DOMAIN}/api/charroi`;

/**
 * Requête générique GET
 */
const fetchData = async (endpoint: string): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/${endpoint}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de "${endpoint}" :`, error);
    throw error;
  }
};

// Requêtes GET spécifiques
export const getCatVehicule = () => fetchData('cat_vehicule');
export const getSortieVisiteur = () => fetchData('visiteur_retour');
export const getVehiculeDispo = () => fetchData('vehicule_dispo');
export const getChauffeur = () => fetchData('chauffeur');
export const getServiceDemandeur = () => fetchData('serviceDemadeur');
export const getMotif = () => fetchData('motif');
export const getDestination = () => fetchData('destination');
export const getVehicule = () => fetchData('vehicule');
export const getAffectationDemande = () => fetchData('affectation_demande');
export const getBandeSortie = () => fetchData('bande_sortie');
export const getInfoSortieRetour = () => fetchData('info_sortie_retour');

export const getAffectationDemandeOne = async (
  id: number
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/affectation_demandeOne`, {
      params: { id_affectation_demande: id },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération d'une course :", error);
    throw error;
  }
};

export const getBandeSortieUnique = async (
  id: number
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/bande_sortie_unique`, {
      params: { userId: id },
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la bande sortie unique :', error);
    throw error;
  }
};

// Requêtes POST
export const postValidationDemande = async (
  data: Record<string, any>
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(`${BASE_URL}/validation_demande`, data);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la validation :", error);
    throw error;
  }
};

export const postAffectationDemande = async (
  data: Record<string, any>
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(`${BASE_URL}/affectation_demande`, data);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'affectation :", error);
    throw error;
  }
};

export const postBandeSortie = async (
  data: Record<string, any>
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(`${BASE_URL}/bande_sortie`, data);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du bon de sortie :", error);
    throw error;
  }
};
