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

export interface BonSortie {
  id_bande_sortie: number;
  nom_destination: string;
  nom_chauffeur: string;
  nom_marque: string;
  nom_cat: string;
  date_prevue: string;
  date_retour: string;
  immatriculation: string;
  user_cr: string;
  nom_motif_demande: string;
  nom_statut_bs: string;
  prenom_chauffeur:string;
  destination:string;
  motif: string;
  nom_statut_bs: string;
  retour_time: string;
}

export interface AffectationItem {
  id_bande_sortie: number,
  id_affectation_demande : number,
  date_prevue: string
  date_retour: string
  nom: string
  immatriculation: string
  nom_marque: string
  nom_cat: string
  nom_motif_demande: string
  nom_service: string
  nom_destination: string
  commentaire: string
  personne_bord: string
  nom_statut_bs: string
}