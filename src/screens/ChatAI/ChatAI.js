import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = 'AIzaSyCNALbZ2C3yauAL1stbKyEtIWMySgn10T0';

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function fetchGeminiResponse(userMessage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Bạn là một trợ lý AI chuyên về giải Ngoại hạng Anh (Premier League). Trả lời ngắn gọn, dễ hiểu, và chính xác theo dữ liệu mới nhất. Dưới đây là câu hỏi của tôi: "${userMessage}"`,
            },
          ],
        },
      ],
    });
    return response.text;
  } catch (e) {
    console.log(e);
    return 'Đã xảy ra lỗi khi kết nối Gemini.';
  }
}


const ChatAI = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! I am your AI assistant. How can I help you today?', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Các câu hỏi gợi ý
  const suggestions = [
    'Ai ghi bàn nhiều nhất?',
    'Đội nào đang dẫn đầu?',
    'Lịch thi đấu vòng tới?',
    'Huyền thoại Ngoại hạng Anh?',
    'Cầu thủ trẻ triển vọng?',
    'Đội nào phòng ngự tốt nhất?',
    'Ai kiến tạo nhiều nhất?',
    'Top 3 đội mạnh nhất?',
    'Ai là vua phá lưới?',
    'Đội nào mới thăng hạng?',
  ];

  const handleSuggestionPress = (text) => {
    setInput(text);
  };

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;
    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    // Gọi Gemini API
    const aiText = await fetchGeminiResponse(userMessage.text);
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      sender: 'ai',
    };
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Chat</Text>
      </View>
      {/* Gợi ý câu hỏi */}
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={suggestions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionButton} onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Danh sách tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#888' }}>AI đang trả lời...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    color: '#111',
    fontSize: 22,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    backgroundColor: '#111',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#111',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    marginBottom: 0,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  suggestionButton: {
    backgroundColor: '#eaeaea',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  suggestionText: {
    color: '#111',
    fontSize: 15,
  },
});

export default ChatAI;
