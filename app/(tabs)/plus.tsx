import { Images } from '@/assets/images'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Plus = () => {
  const options = [
    { label: 'Réservation', icon: Images.reservationIcon },
    { label: 'Liste Réservations', icon: Images.listReservation },
    { label: 'Bon de sortie', icon: Images.bonIcon },
    { label: 'Liste des bons', icon: Images.listBonIcon },
  ]

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Plus

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 48,
    width: 48,
    marginBottom: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
})
