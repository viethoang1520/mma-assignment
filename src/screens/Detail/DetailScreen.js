import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

export default function DetailScreen({ route }) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState(null);
  const scrollViewRef = useRef(null);
  const commentFormRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;

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

  const handleFocusComment = () => {
    setTimeout(() => {
      if (commentFormRef.current && scrollViewRef.current) {
        commentFormRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y) => {
            const offset = y - screenHeight * 1;
            scrollViewRef.current.scrollTo({
              y: offset > 0 ? offset : 0,
              animated: true,
            });
          }
        );
      }
    }, 100);
  };

  // Tính toán rating trung bình và số lượng từng mức sao
  const feedbacks = player?.feedbacks || [];
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => feedbacks.filter((fb) => fb.rating === star).length
  );
  const totalRatings = feedbacks.length;
  const avgRating = totalRatings
    ? (
        feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalRatings
      ).toFixed(1)
    : 0;
  const filteredFeedbacks = filterRating
    ? feedbacks.filter((fb) => fb.rating === filterRating)
    : feedbacks;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 80}
    >
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
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
            {player?.position} - {player?.PassingAccuracy * 100}% passing
            accuracy
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 10,
          }}
        />
        <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              paddingBottom: 18,
              color: "#222",
            }}
          >
            Reviews ({totalRatings})
          </Text>
          {/* Hiển thị rating trung bình và filter rating */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#e6b800",
                marginRight: 10,
              }}
            >
              {avgRating}
            </Text>
            <Text
              style={{ fontSize: 18, color: "#888", marginRight: 16 }}
            >{`/ 5`}</Text>
            {[5, 4, 3, 2, 1].map((star) => (
              <TouchableOpacity
                key={star}
                style={{
                  alignItems: "center",
                  marginHorizontal: 2,
                  padding: 4,
                  borderRadius: 6,
                  backgroundColor:
                    filterRating === star ? "#ffe5b4" : "transparent",
                }}
                onPress={() => setFilterRating(star)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#e6b800",
                    fontWeight: "bold",
                  }}
                >
                  {star}★
                </Text>
                <Text style={{ fontSize: 14, color: "#333" }}>
                  {ratingCounts[star - 1]}
                </Text>
              </TouchableOpacity>
            ))}
            {filterRating && (
              <TouchableOpacity
                onPress={() => setFilterRating(null)}
                style={{ marginLeft: 12, padding: 4 }}
              >
                <Text
                  style={{ color: "#007AFF", fontWeight: "bold" }}
                >{`Xem tất cả`}</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Hiển thị feedbacks đã lọc */}
          {filteredFeedbacks.map((feedback, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.07,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                {[...Array(feedback?.rating)].map((_, index) => (
                  <Text key={index} style={{ fontSize: 22, color: "gold" }}>
                    ★
                  </Text>
                ))}
              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: "#007AFF",
                  fontWeight: "600",
                }}
              >
                {feedback?.author}{" "}
                <Text
                  style={{ color: "#888", fontWeight: "400" }}
                >{`· ${new Date(feedback?.date).toLocaleString(
                  "en-US"
                )}`}</Text>
              </Text>
              <Text
                style={{
                  paddingTop: 8,
                  fontSize: 15,
                  color: "#333",
                  fontWeight: "500",
                }}
              >
                {feedback?.comment}
              </Text>
            </View>
          ))}
          <View ref={commentFormRef}>
            <Comment
              onSubmit={handleAddFeedback}
              submitting={submitting}
              onFocusInput={handleFocusComment}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
