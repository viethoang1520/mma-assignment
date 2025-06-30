import { View, Text, Image, Pressable, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function PlayerCard({
  player,
  toggleFavorites,
  isFavorite,
  multiSelect,
}) {
  const navigation = useNavigation();
  const handlePress = () => {
    if (multiSelect) return;
    navigation.navigate("Detail", { playerId: player.id });
  };
  return (
    <>
      <Pressable
        onPress={handlePress}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <Image
          source={{ uri: player.image }}
          style={{ width: "100%", height: "75%" }}
          resizeMode="cover"
        />
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: "bold", color: "#e60000" }}>
            {player.isCaptain ? "Captain" : "Player"}
          </Text>
          <Text style={{ fontWeight: "bold" }}>{player.playerName}</Text>
          <Text style={{ color: "#4d4d4d" }}>Nominee in {player.team}</Text>
          <Text style={{ fontWeight: "bold" }}>{player.position}</Text>
        </View>
      </Pressable>
      <View
        style={{
          position: "absolute",
          top: 12,
          right: 8,
          borderRadius: "50%",
          padding: 5,
          width: 34,
          height: 34,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: multiSelect ? 0.4 : 1,
        }}
      >
        <Pressable
          onPress={() => {
            if (!multiSelect) toggleFavorites(player);
          }}
          hitSlop={10}
          disabled={multiSelect}
        >
          <AntDesign
            name={isFavorite ? "heart" : "hearto"}
            size={18}
            color={isFavorite ? "red" : "black"}
          />
        </Pressable>
      </View>
    </>
  );
}
