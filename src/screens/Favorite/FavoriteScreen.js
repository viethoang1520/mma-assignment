import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import NationFilter from '../Home/components/NationFilter'
import PlayerCard from '../Home/components/PlayerCard.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])

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

  const togglePlayerSelection = (player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id))
    } else {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  const handleSelectAll = () => {
    setSelectedPlayers([...favorites])
  }

  const handleCancelSelection = () => {
    setIsMultiSelectMode(false)
    setSelectedPlayers([])
  }

  const handleDeleteSelected = async () => {
    const count = selectedPlayers.length;
    Alert.alert(
      'Xác nhận xóa',
      `Bạn muốn xóa ${count} cầu thủ?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const selectedIds = selectedPlayers.map(p => p.id)
              const updatedFavorites = favorites.filter(player => !selectedIds.includes(player.id))
              setFavorites(updatedFavorites)
              await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
              handleCancelSelection()
            } catch (error) {
              console.log(error)
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }

  useFocusEffect(
    useCallback(() => {
      fetchFavoritePlayers()
    }, [])
  )

  return (
    <>
      <View style={styles.header}>
        {!isMultiSelectMode && favorites.length === 0 ? null :
          !isMultiSelectMode ? (
            <TouchableOpacity
              style={styles.multiSelectButton}
              onPress={() => setIsMultiSelectMode(true)}
            >
              <Text style={styles.buttonText}>Chọn nhiều</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.multiSelectActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSelectAll}
              >
                <Text style={styles.buttonText}>Chọn tất cả</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteSelected}
              >
                <Text style={styles.buttonText}>Bỏ thích</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCancelSelection}
              >
                <Text style={styles.buttonText}>Hủy chọn</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
      <ScrollView style={styles.container}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa thêm cầu thủ yêu thích nào</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.grid}>
              {favorites.map((player, index) => {
                const isSelected = isMultiSelectMode && selectedPlayers.find(p => p.id === player.id);
                return (
                  <Pressable
                    style={[
                      styles.cardWrapper,
                      isSelected && styles.selectedCard
                    ]}
                    key={index}
                    onPress={() => isMultiSelectMode ? togglePlayerSelection(player) : null}
                  >
                    {isMultiSelectMode && (
                      <View hitSlop={10} style={styles.checkboxWrapper}>
                        {isSelected ? (
                          <MaterialIcons name="check-circle" size={24} color="#007AFF" />
                        ) : (
                          <MaterialIcons name="radio-button-unchecked" size={24} color="#ccc" />
                        )}
                      </View>
                    )}
                    <PlayerCard
                      player={player}
                      toggleFavorites={isMultiSelectMode ? null : handleToggleFavorite}
                      isFavorite={true}
                      disableDetails={isMultiSelectMode}
                    />
                  </Pressable>
                )
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 10,
    width: '100%',
    gap: 5,
  },
  cardWrapper: {
    width: '49%',
    height: 370,
    borderRadius: 8,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: 'rgba(1, 4, 8, 0.1)',
  },
  checkboxWrapper: {
    position: 'absolute',
    top: 16,
    left: 8,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  multiSelectButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  multiSelectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
});