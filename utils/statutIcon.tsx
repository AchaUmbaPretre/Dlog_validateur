export const getStatutBS = (statut?: string) => {
  switch (statut) {
    case 'Retour':
      return { icon: 'undo', color: 'green' };
    case 'Sortie':
      return { icon: 'export', color: 'orange' };
    case 'Annulé':
      return { icon: 'close-circle', color: 'red' };
    case 'Départ':
      return { icon: 'arrow-right', color: '#1890ff' };
    case 'En attente':
      return { icon: 'clock', color: 'orange' };
    default:
      return { icon: 'information', color: '#6c757d' };
  }
};
