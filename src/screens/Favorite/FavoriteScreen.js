import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import NationFilter from "../Home/components/NationFilter";
import PlayerCard from "../Home/components/PlayerCard.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchFavoritePlayers = async () => {
    try {
      const storage = await AsyncStorage.getItem("favorites");
      if (storage) {
        setFavorites(JSON.parse(storage));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFavorite = async (player) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== player.id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    const updatedFavorites = favorites.filter(
      (fav) => !selectedIds.includes(fav.id)
    );
    setFavorites(updatedFavorites);
    setSelectedIds([]);
    setMultiSelect(false);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoritePlayers();
    }, [])
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 60 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={styles.text}> Favorite Players</Text>
            <TouchableOpacity
              onPress={() => setMultiSelect(!multiSelect)}
              style={{ flexDirection: "row", alignItems: "center", padding: 6 }}
            >
              <MaterialIcons
                name={multiSelect ? "close" : "select-all"}
                size={26}
                color={multiSelect ? "#e60000" : "#007AFF"}
              />
              <Text
                style={{
                  marginLeft: 6,
                  color: multiSelect ? "#e60000" : "#007AFF",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {multiSelect ? "Hủy chọn nhiều" : "Chọn nhiều"}
              </Text>
            </TouchableOpacity>
          </View>
          {multiSelect && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  borderRadius: 6,
                  padding: 10,
                  marginRight: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  if (selectedIds.length === favorites.length) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(favorites.map((fav) => fav.id));
                  }
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {selectedIds.length === favorites.length
                    ? "Unselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedIds.length ? "#e60000" : "#ccc",
                  borderRadius: 6,
                  padding: 10,
                  alignItems: "center",
                }}
                onPress={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Xóa đã chọn ({selectedIds.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 10,
              paddingVertical: 10,
              width: "100%",
              gap: 5,
            }}
          >
            {favorites.map((player, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "49%",
                  height: 370,
                  borderWidth:
                    multiSelect && selectedIds.includes(player.id) ? 2 : 0,
                  borderColor: "#e60000",
                  borderRadius: 10,
                }}
                activeOpacity={multiSelect ? 0.7 : 1}
                onPress={() => (multiSelect ? handleSelect(player.id) : null)}
              >
                <PlayerCard
                  player={player}
                  toggleFavorites={handleToggleFavorite}
                  isFavorite={true}
                  multiSelect={multiSelect}
                />
                {multiSelect && (
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      padding: 2,
                    }}
                  >
                    <MaterialIcons
                      name={
                        selectedIds.includes(player.id)
                          ? "check-circle"
                          : "radio-button-unchecked"
                      }
                      size={24}
                      color={
                        selectedIds.includes(player.id) ? "#e60000" : "#ccc"
                      }
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
});
