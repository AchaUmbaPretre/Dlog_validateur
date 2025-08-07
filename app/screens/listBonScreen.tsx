import { getBandeSortie } from '@/services/charroiService'
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
  id_bande_sortie: number
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

const ListBonScreen = () => {
  const [data, setData] = useState<AffectationItem[]>([])
  const [filteredData, setFilteredData] = useState<AffectationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const response = await getBandeSortie()
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
    const filtered = data.filter((item) =>
      `${item.nom} ${item.immatriculation}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, data])

  const renderItem = ({ item }: { item: AffectationItem }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <Title style={styles.title}>Bon #{item.id_bande_sortie}</Title>
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
      <View style={styles.advancedHeaderWrapper}>
        <View style={styles.blueSideBar} />
        <Surface style={styles.advancedHeader} elevation={4}>
          <Text style={styles.advancedHeaderText}>🚚 Liste de bons de sortie</Text>
        </Surface>
        <View style={styles.blueSideBar} />
      </View>

      <TextInput
        placeholder="🔍 Rechercher par nom ou immatriculation..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id_bande_sortie.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

export default ListBonScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  advancedHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 10,
  },
  blueSideBar: {
    width: 5,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  advancedHeader: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  advancedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#1C1C1E',
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
