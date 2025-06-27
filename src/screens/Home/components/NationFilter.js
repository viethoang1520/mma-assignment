import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function NationFilter() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.filter}><Text style={styles.content}>England</Text></Pressable>
      <Pressable style={styles.filter}><Text style={styles.content}>Brazil</Text></Pressable>
      <Pressable style={styles.filter}><Text style={styles.content}>Germany</Text></Pressable>
      <Pressable style={styles.filter}><Text style={styles.content}>Spain</Text></Pressable>
      <Pressable style={styles.filter}><Text style={styles.content}>France</Text></Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderColor: '#000',
    borderWidth: .5,
    borderRadius: 10,
  },
  content: {
    color: '#4d4d4d',
    fontWeight: 'bold',

  },
})