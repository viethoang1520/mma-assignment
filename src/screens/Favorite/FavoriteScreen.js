import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import NationFilter from '../Home/components/NationFilter'
import PlayerCard from '../Home/components/PlayerCard.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([])
  const fetchFavoritePlayers = async () => {
    try {
      const storage = await AsyncStorage.getItem("favorites")
      if (storage) {
        setFavorites(JSON.parse(storage))
      } else {
        setFavorites([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleFavorite = async (player) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== player.id)
      setFavorites(updatedFavorites)
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchFavoritePlayers()
    }, [])
  )

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 60 }}>
          <Text style={styles.text}> Favorite Players</Text>
          <View style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', marginTop: 10, paddingVertical: 10,
            width: '100%', gap: 5
          }}>
            {favorites.map((player, index) => (
              <View style={{ width: '49%', height: 370 }} key={index}>
                <PlayerCard
                  player={player}
                  toggleFavorites={handleToggleFavorite}
                  isFavorite={true}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
});