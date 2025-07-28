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
    console.error(`Erreur lors de la récupération de ${endpoint} :`, error);
    throw error;
  }
};

export const getBandeSortieUnique = async (id: number): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/bande_sortie_unique`, {
      params: { userId: id },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la bande sortie unique :", error);
    throw error;
  }
};
