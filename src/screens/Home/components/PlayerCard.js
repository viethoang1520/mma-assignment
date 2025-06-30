import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PlayerCard({ player, toggleFavorites, isFavorite, disableDetails, isCaptain }) {
  const navigation = useNavigation()
  return (
    <>
      <Pressable
        onPress={disableDetails ? null : () => navigation.navigate('Detail', { playerId: player.id })}
        style={[
          styles.card,
          isCaptain && styles.captainCard,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '75%' }}>
          <Image
            source={{ uri: player.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {isCaptain && (
            <View style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: 2 }}>
              <MaterialCommunityIcons name="crown" size={20} color="#FFD700" />
            </View>
          )}
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#e60000' }}>{player.isCaptain ? "Captain" : "Player"}</Text>
          <Text style={{ fontWeight: 'bold' }}>{player.playerName}</Text>
          <Text style={{ color: '#4d4d4d' }}>Nominee in {player.team}</Text>
          <Text style={{ fontWeight: 'bold' }}>{player.position}</Text>
        </View>
      </Pressable>
      <View
        style={{
          position: 'absolute', top: 12, right: 8, borderRadius: '50%',
          padding: 5, width: 34, height: 34, backgroundColor: 'white',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
        <Pressable onPress={() => toggleFavorites(player)} hitSlop={10}>
          <AntDesign name={isFavorite ? "heart" : 'hearto'} size={18} color={isFavorite ? "red" : 'black'} />
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    minHeight: 370,
    marginBottom: 0,
    marginTop: 0,
    marginHorizontal: 0,
    padding: 0,
  },
  captainCard: {
    backgroundColor: '#fffbe6',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
});