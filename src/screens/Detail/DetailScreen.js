import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

export default function DetailScreen({ route }) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSpecificPlayer = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/${playerId}`
      );
      setPlayer(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSpecificPlayer();
  }, []);

  const handleAddFeedback = async (feedback) => {
    if (!player) return;
    setSubmitting(true);
    const newFeedback = { ...feedback, date: new Date().toISOString() };
    const updatedPlayer = {
      ...player,
      feedbacks: [...(player.feedbacks || []), newFeedback],
    };
    setPlayer(updatedPlayer);
    try {
      await axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/${playerId}`, {
        feedbacks: updatedPlayer.feedbacks,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Image
        source={{ uri: player?.image }}
        style={{ width: "100%", height: 490 }}
        resizeMode="cover"
      />

      <View
        style={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          display: "flex",
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          {player?.playerName} - {player?.YoB}
        </Text>
        <Text style={{ fontWeight: "600", color: "#e60000", fontSize: 18 }}>
          {player?.isCaptain ? "Captain" : "Player"}
        </Text>
        <Text style={{ color: "#4d4d4d", fontSize: 16 }}>
          Nominee in {player?.team}
        </Text>
        <Text style={{ color: "#e60000", fontSize: 16 }}>
          {player?.MinutesPlayed} minutes on the pitch{" "}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {player?.position} - {player?.PassingAccuracy * 100}% passing accuracy
        </Text>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#ccc",
          marginVertical: 10, // Khoảng cách trên dưới đường kẻ
        }}
      />
      <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
        <Text style={{ fontWeight: "500", fontSize: 20, paddingBottom: 20 }}>
          Reviews ({player?.feedbacks?.length || 0})
        </Text>
        {player?.feedbacks?.map((feedback, idx) => (
          <View key={idx}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              {[...Array(feedback?.rating)].map((_, index) => (
                <Text key={index} style={{ fontSize: 24, color: "gold" }}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={{ paddingTop: 10, fontSize: 16, color: "#4d4d4d" }}>
              {feedback?.author} ·{" "}
              {new Date(feedback?.date).toLocaleString("en-US")}
            </Text>
            <Text
              style={{
                paddingTop: 18,
                paddingBottom: 40,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {feedback?.comment}
            </Text>
          </View>
        ))}
        <Comment onSubmit={handleAddFeedback} submitting={submitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
