import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import NationFilter from './components/NationFilter'
// import { playerList } from '../../data/playerList.js'
import PlayerCard from './components/PlayerCard.js'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const navigation = useNavigation()
  const [playerList, setPlayerList] = useState([])
  const [favorites, setFavorites] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  const fetchPlayerList = async () => {
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_URL)
      setPlayerList(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFilteredPlayers = async () => {
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_URL + `?team=${selectedCountry}`)
      setPlayerList(response.data)
    } catch (error) {
      console.log(error)
    }
  }
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

  useEffect(() => {
    fetchPlayerList();
    fetchFavoritePlayers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoritePlayers();
    }, [])
  );

  useEffect(() => {
    if (selectedCountry) {
      fetchFilteredPlayers()
    } else {
      fetchPlayerList()
    }
  }, [selectedCountry])

  const handleToggleFavorite = async (player) => {
    try {
      let updatedFav
      const isAddedToFav = favorites.some((fav) => fav.id === player.id)
      if (isAddedToFav) {
        updatedFav = favorites.filter((fav) => fav.id !== player.id)
        Toast.show({
          type: 'success',
          text1: 'Đã bỏ khỏi danh sách yêu thích!',
          position: 'bottom',
          bottomOffset: 85
        });
      } else {
        updatedFav = [...favorites, player]
        Toast.show({
          type: 'success',
          text1: 'Đã thêm vào danh sách yêu thích!',
          position: 'bottom',
          bottomOffset: 85
        });
      }
      setFavorites(updatedFav)
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFav))
    } catch (error) {
      console.log(error)
    } finally {
      console.log(favorites)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'FIFA Best Players 2025',
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowSearch(s => !s)} style={{ marginRight: 16 }}>
          <Ionicons name="search" size={22} color="#111" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filteredPlayers = searchText.trim()
    ? playerList.filter(player => player.playerName.toLowerCase().includes(searchText.trim().toLowerCase()))
    : playerList;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <NationFilter
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
          {showSearch && (
            <View style={styles.searchBarWrapper}>
              <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm cầu thủ..."
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>
          )}
          <View style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', marginTop: 10, paddingVertical: 10,
            width: '100%', gap: 5
          }}>
            {filteredPlayers.map((player, index) => (
              <View style={{ width: '49%', height: 370 }} key={index}>
                <PlayerCard
                  player={player}
                  toggleFavorites={handleToggleFavorite}
                  isFavorite={favorites.some(fav => fav.id === player.id)}
                  isCaptain={player.isCaptain}
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
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },

});



