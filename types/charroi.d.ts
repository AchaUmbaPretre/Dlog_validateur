export interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  nom_marque: string;
  modele: string;
}

export interface Chauffeur {
  id_chauffeur: number;
  nom: string;
  postnom: string;
}

export interface Motif {
  id_motif_demande: number;
  nom_motif_demande: string;
}

export interface Service {
  id_service_demandeur: number;
  nom_service: string;
}

export interface Destination {
  id_destination: number;
  nom_destination: string;
}

export interface Client {
  id_client: number;
  nom: string;
}

export interface FormState {
  id_vehicule: number | null;
  id_chauffeur: number | null;
  id_motif_demande: number | null;
  id_demandeur: number | null;
  id_client: number | null;
  id_destination: number | null;
  personne_bord: string;
  commentaire: string;
}
