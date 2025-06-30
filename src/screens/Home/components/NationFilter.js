import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

const countries = ['England', 'Brazil', 'Germany', 'Spain', 'France']

export default function NationFilter({ selectedCountry, setSelectedCountry }) {
  return (
    <View style={styles.container}>
      {countries.map(country => (
        <Pressable
          key={country}
          style={[
            styles.filter,
            selectedCountry === country && styles.selected
          ]}
          onPress={() => setSelectedCountry(selectedCountry === country ? "" : country)}
        >
          <Text
            style={[
              styles.content,
              selectedCountry === country && styles.selectedText
            ]}
          >
            {country}
          </Text>
        </Pressable>
      ))}
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
  selected: {
    backgroundColor: '#e0e0e0',
  },
  selectedText: {
    color: '#888',
  },
})