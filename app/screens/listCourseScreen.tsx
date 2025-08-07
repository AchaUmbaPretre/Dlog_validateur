import { getAffectationDemande } from '@/services/charroiService'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Card, Paragraph, Surface, Text, Title } from 'react-native-paper'

interface AffectationItem {
  id_affectation_demande: number
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
}

const ListCourseScreen = () => {
  const [data, setData] = useState<AffectationItem[]>([])
  const [filteredData, setFilteredData] = useState<AffectationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    try {
      const response = await getAffectationDemande()
      setData(response.data)
      setFilteredData(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const lowerSearch = search.toLowerCase()
    const filtered = data.filter(
      (item) =>
        item.nom.toLowerCase().includes(lowerSearch) ||
        item.nom_marque.toLowerCase().includes(lowerSearch) ||
        item.nom_destination.toLowerCase().includes(lowerSearch) ||
        item.immatriculation.toLowerCase().includes(lowerSearch)
    )
    setFilteredData(filtered)
  }, [search, data])

  const renderItem = ({ item }: { item: AffectationItem }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <Title style={styles.title}>Course #{item.id_affectation_demande}</Title>
        <Paragraph style={styles.paragraph}>
          🚗 Véhicule: {item.nom_marque} ({item.immatriculation})
        </Paragraph>
        <Paragraph style={styles.paragraph}>👤 Chauffeur: {item.nom}</Paragraph>
        <Paragraph style={styles.paragraph}>📅 Départ: {formatDate(item.date_prevue)}</Paragraph>
        <Paragraph style={styles.paragraph}>🕘 Retour: {formatDate(item.date_retour)}</Paragraph>
        <Paragraph style={styles.paragraph}>📍 Destination: {item.nom_destination}</Paragraph>
        <Paragraph style={styles.paragraph}>🎯 Motif: {item.nom_motif_demande}</Paragraph>
        <Paragraph style={styles.paragraph}>🏢 Service: {item.nom_service}</Paragraph>
        <Paragraph style={styles.commentaire}>📝 {item.commentaire || 'Aucun commentaire'}</Paragraph>
        <Paragraph style={styles.personne}>👥 À bord: {item.personne_bord}</Paragraph>
      </Card.Content>
    </Card>
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.blueBar} />
        <Surface style={styles.header} elevation={4}>
          <Text style={styles.headerTitle}>📋 LISTE DES COURSES</Text>
        </Surface>
        <View style={styles.blueBar} />
      </View>

      <TextInput
        placeholder="🔍 Rechercher par chauffeur, véhicule, destination..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id_affectation_demande.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

export default ListCourseScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  blueBar: {
    width: 4,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  header: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 2,
  },
  commentaire: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#8E8E93',
  },
  personne: {
    marginTop: 2,
    fontWeight: '600',
    color: '#007AFF',
  },
})
