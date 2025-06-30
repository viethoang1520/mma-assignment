import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SearchPlayer = ({ onSearch }) => {
  const [playerName, setPlayerName] = useState("");

  const handleChange = (text) => {
    setPlayerName(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type player name..."
        value={playerName}
        onChangeText={handleChange}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    backgroundColor: "#fff",
  },
});

export default SearchPlayer;
