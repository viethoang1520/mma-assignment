import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import NationFilter from "./components/NationFilter";
// import { playerList } from '../../data/playerList.js'
import PlayerCard from "./components/PlayerCard.js";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchPlayer from "./components/SearchPlayer";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [playerList, setPlayerList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchName, setSearchName] = useState("");

  const fetchPlayerList = async () => {
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_URL);
      setPlayerList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilteredPlayers = async () => {
    try {
      const response = await axios.get(
        process.env.EXPO_PUBLIC_API_URL + `?team=${selectedCountry}`
      );
      setPlayerList(response.data);
    } catch (error) {
      console.log(error);
    }
  };
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
      fetchFilteredPlayers();
    } else {
      fetchPlayerList();
    }
  }, [selectedCountry]);

  const handleToggleFavorite = async (player) => {
    try {
      let updatedFav;
      const isAddedToFav = favorites.some((fav) => fav.id === player.id);
      if (isAddedToFav) {
        updatedFav = favorites.filter((fav) => fav.id !== player.id);
      } else {
        updatedFav = [...favorites, player];
      }
      setFavorites(updatedFav);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFav));
    } catch (error) {
      console.log(error);
    } finally {
      console.log(favorites);
    }
  };

  const handleSearchPlayer = (name) => {
    setSearchName(name);
  };

  // Lọc danh sách cầu thủ theo tên
  const filteredPlayerList = searchName
    ? playerList.filter((player) =>
        player.playerName?.toLowerCase().includes(searchName.toLowerCase())
      )
    : playerList;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 60 }}>
          <Text style={styles.text}> FIFA Best Players 2025</Text>
          <SearchPlayer onSearch={handleSearchPlayer} />
          <NationFilter
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
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
            {filteredPlayerList.map((player, index) => (
              <View style={{ width: "49%", height: 370 }} key={index}>
                <PlayerCard
                  player={player}
                  toggleFavorites={handleToggleFavorite}
                  isFavorite={favorites.some((fav) => fav.id === player.id)}
                />
              </View>
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
