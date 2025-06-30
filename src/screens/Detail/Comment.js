import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const Comment = ({ onSubmit, submitting }) => {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const handleSend = () => {
    if (!author || !comment || rating === 0) return;
    onSubmit && onSubmit({ rating, author, comment });
    setRating(0);
    setAuthor('');
    setComment('');
  };

  return (
    <View style={{ marginTop: 20, marginBottom: 40, backgroundColor: '#f7f7f7', borderRadius: 8, padding: 16 }}>
      <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Thêm đánh giá</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {[1,2,3,4,5].map(star => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={{ fontSize: 28, color: rating >= star ? 'gold' : '#ccc' }}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10, backgroundColor: '#fff' }}
        placeholder="Tên của bạn"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10, backgroundColor: '#fff', minHeight: 60 }}
        placeholder="Nhận xét của bạn"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        style={{ backgroundColor: submitting ? '#aaa' : '#e60000', borderRadius: 5, padding: 12, alignItems: 'center' }}
        onPress={handleSend}
        disabled={submitting || !author || !comment || rating === 0}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Comment;
