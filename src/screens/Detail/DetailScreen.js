import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function DetailScreen({ route }) {
  const { playerId } = route.params
  const [player, setPlayer] = useState(null)
  const [author, setAuthor] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [image, setImage] = useState(null)
  const [reviewFilter, setReviewFilter] = useState('all');

  const fetchSpecificPlayer = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${playerId}`)
      setPlayer(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!author.trim() || !comment.trim() || rating === 0) {
      setError('Vui lòng nhập đầy đủ tên, bình luận và chọn số sao!')
      return;
    }
    setError('');
    setLoading(true);
    const newFeedback = {
      rating,
      comment,
      author,
      date: new Date().toISOString(),
      image: image || null,
    };
    try {
      const updatedFeedbacks = [...(player.feedbacks || []), newFeedback];
      await axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/${playerId}`, {
        feedbacks: updatedFeedbacks
      });
      setAuthor('');
      setComment('');
      setRating(0);
      setImage(null);
      await fetchSpecificPlayer();
      Toast.show({
        type: 'success',
        text1: 'Gửi đánh giá thành công!',
        position: 'bottom',
        bottomOffset: 85
      });
    } catch (e) {
      setError('Có lỗi khi gửi bình luận!');
    }
    setLoading(false);
  }

  // Lọc feedbacks theo filter
  const filteredFeedbacks = player?.feedbacks
    ? (reviewFilter === 'all'
      ? player.feedbacks
      : player.feedbacks.filter(fb => fb.rating === reviewFilter))
    : [];

  useEffect(() => {
    fetchSpecificPlayer()
  }, [])
  return (
    <ScrollView >
      <Image
        source={{ uri: player?.image }}
        style={{ width: '100%', height: 490 }}
        resizeMode='cover'
      />

      <View style={{ paddingVertical: 30, paddingHorizontal: 20, display: 'flex', gap: 6 }}>
        <Text style={{ fontSize: 20, fontWeight: '500', }}>
          {player?.playerName} - {player?.YoB}
        </Text>
        <Text style={{ fontWeight: '600', color: '#e60000', fontSize: 18, }}>{player?.isCaptain ? "Captain" : "Player"}</Text>
        <Text style={{ color: '#4d4d4d', fontSize: 16 }}>Nominee in {player?.team}</Text>
        <Text style={{ color: '#4d4d4d', color: '#e60000', fontSize: 16 }}>{player?.MinutesPlayed} minutes on the pitch </Text>
        <Text style={{ fontSize: 16 }}>{player?.position} - {player?.PassingAccuracy * 100}% passing accuracy</Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 6 }} >
        {/* Thống kê số lượng review theo sao và bộ lọc review đặt ngay dưới Reviews */}
        {player?.feedbacks && player.feedbacks.length > 0 && (
          <>
            <View style={styles.reviewFilterRow}>
              <TouchableOpacity
                style={[styles.filterBtn, reviewFilter === 'all' && styles.filterBtnActive]}
                onPress={() => setReviewFilter('all')}
              >
                <Text style={[styles.filterBtnText, reviewFilter === 'all' && styles.filterBtnTextActive]}>Tất cả</Text>
              </TouchableOpacity>
              {[5, 4, 3, 2, 1].map(star => (
                <TouchableOpacity
                  key={star}
                  style={[styles.filterBtn, reviewFilter === star && styles.filterBtnActive]}
                  onPress={() => setReviewFilter(star)}
                >
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.filterBtnText, reviewFilter === star && styles.filterBtnTextActive]}> {star}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingStatsWrapper}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = player.feedbacks.filter(fb => fb.rating === star).length;
                return (
                  <View key={star} style={styles.ratingStatsRow}>
                    <MaterialIcons name="star" size={18} color="#FFD700" style={{ marginRight: 2 }} />
                    <Text style={styles.ratingStatsText}>{star}</Text>
                    <Text style={styles.ratingStatsCount}>({count})</Text>
                  </View>
                )
              })}
            </View>
            
          </>
        )}
        <Text style={{ fontWeight: '500', fontSize: 20, paddingBottom: 20, paddingTop: 20 }}>Reviews ({player?.feedbacks.length})</Text>

        {filteredFeedbacks.map((feedback, idx) => (
          <View key={idx}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              {[...Array(feedback?.rating)].map((_, index) => (
                <Text key={index} style={{ fontSize: 24, color: 'gold' }}>★</Text>
              ))}
            </View>
            <Text style={{ paddingTop: 10, fontSize: 16, color: '#4d4d4d', }}>{feedback?.author} · {new Date(feedback?.date).toLocaleString('en-US')}</Text>
            {feedback?.image && (
              <Image source={{ uri: feedback.image }} style={styles.feedbackImg} />
            )}
            <Text style={{ paddingTop: 18, paddingBottom: 40, fontSize: 16, fontWeight: '500' }}>{feedback?.comment}</Text>
          </View>
        ))}
      </View>

      <View style={styles.feedbackForm}>
        <Text style={styles.feedbackTitle}>Đánh giá cầu thủ</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <MaterialIcons name={star <= rating ? 'star' : 'star-border'} size={28} color={star <= rating ? '#FFD700' : '#ccc'} />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Tên của bạn"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Nhập bình luận..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
          <Text style={styles.imagePickerBtnText}>{image ? 'Đổi ảnh khác' : 'Chọn ảnh (tùy chọn)'}</Text>
        </TouchableOpacity>
        {image && (
          <View style={styles.previewImgWrapper}>
            <Image source={{ uri: image }} style={styles.previewImg} />
            <TouchableOpacity style={styles.removeImgBtn} onPress={() => setImage(null)}>
              <Text style={styles.removeImgBtnText}>Hủy ảnh</Text>
            </TouchableOpacity>
          </View>
        )}
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitFeedback} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Gửi đánh giá</Text>}
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: '#ccc',
          marginVertical: 10, // Khoảng cách trên dưới đường kẻ
        }}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  feedbackForm: {
    backgroundColor: '#f7f7f7',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#222',
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePickerBtn: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerBtnText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '500',
  },
  previewImgWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImgBtn: {
    marginTop: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  removeImgBtnText: {
    color: '#e60000',
    fontWeight: '500',
    fontSize: 14,
  },
  feedbackImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  ratingStatsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 0,
  },
  ratingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingStatsText: {
    fontSize: 15,
    color: '#222',
    marginRight: 2,
    fontWeight: 'bold',
  },
  ratingStatsCount: {
    fontSize: 15,
    color: '#e60000',
    fontWeight: 'bold',
    marginRight: 12,
  },
  reviewFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingLeft: 10,
    gap: 3,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  filterBtnActive: {
    backgroundColor: '#FFD700',
  },
  filterBtnText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
  },
  filterBtnTextActive: {
    color: '#111',
    fontWeight: 'bold',
  },
})