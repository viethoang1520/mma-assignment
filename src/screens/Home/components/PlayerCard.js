import { View, Text, Image, Pressable, Button } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function PlayerCard({ player, toggleFavorites }) {
  const navigation = useNavigation()
  const [like, setLike] = useState(false)
  return (
    <>
      <Pressable onPress={() => navigation.navigate('Detail')} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Image
          source={{ uri: player.image }}
          style={{ width: '100%', height: '75%', }}
          resizeMode="cover"
        />
        <View style={{ padding: 10, }}>
          <Text style={{ fontWeight: 'bold', color: '#e60000' }}>{player.isCaptain ? "Captain" : "Player"}</Text>
          <Text style={{ fontWeight: 'bold' }}>{player.playerName}</Text>
          <Text style={{ color: '#4d4d4d', }}>Nominee in {player.team}</Text>
          <Text style={{ fontWeight: 'bold' }}>{player.position}</Text>

        </View>
      </Pressable>
      <View
        style={{
          position: 'absolute', top: 12, right: 8, borderRadius: '50%',
          padding: 5, width: 34, height: 34, backgroundColor: 'white',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
        <Pressable onPress={() => {
          setLike(!like)
          toggleFavorites(player)
        }}
          hitSlop={10}>
          <AntDesign name={like ? "heart" : 'hearto'} size={18} color={like ? "red" : 'black'} />
        </Pressable>
      </View>
    </>
  )
}