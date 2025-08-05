import { Images } from '@/assets/images'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Plus = () => {
  const options = [
    { label: 'Réservation', icon: Images.reservationIcon, bgColor: 'rgba(0, 122, 255, 0.1)' },        // Bleu
    { label: 'Liste Réservations', icon: Images.listReservation, bgColor: 'rgba(52, 199, 89, 0.1)' }, // Vert
    { label: 'Bon de sortie', icon: Images.bonIcon, bgColor: 'rgba(255, 149, 0, 0.1)' },              // Orange
    { label: 'Liste des bons', icon: Images.listBonIcon, bgColor: 'rgba(255, 59, 48, 0.1)' },         // Rouge
  ]

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
              <Image source={item.icon} style={styles.icon} />
            </View>
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
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  icon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
})