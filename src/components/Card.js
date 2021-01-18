import React from 'react'
import {Image, View, StyleSheet, Text} from 'react-native'

const Card = (props) => {
  if (!props) {
    return
  }
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View styles={styles.closerContainer}>
          <Text
            style={styles.closer}
            onPress={() => props.onPress(props.index)}>
            X
          </Text>
        </View>
        <Image
          style={styles.image}
          source={{
            uri: props.stateObj.mobileImageUrl
          }}
        />
      </View>
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
  closerContainer: {
    width: '100%',
    display: 'flex'
  },
  closer: {
    marginRight: 40,
    alignSelf: 'flex-end',
    height: 20,
    width: 20,
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center'
  },
  cardContainer: {
    height: 700,
    margin: 20
  },
  card: {
    borderColor: 'black',
    borderWidth: 1
  },
  image: {
    height: 700
  }
})
