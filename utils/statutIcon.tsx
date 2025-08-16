
interface StatutBS {
  icon: string;
  color: string;
}


export const getStatutBS = (statut?: string): StatutBS => {
  switch (statut) {
    case 'BS validé':
      return { icon: 'checksquare', color: 'green' };
    case 'Départ':
      return { icon: 'arrowright', color: '#2f54eb' };
    case 'Départ sans BS':
      return { icon: 'warning', color: 'volcano' };
    case 'Retour':
      return { icon: 'undo', color: 'green' };
    case 'Retour sans BS':
      return { icon: 'warning', color: 'red' };
    default:
      return { icon: 'infocirlce', color: '#6c757d' };
  }
};

