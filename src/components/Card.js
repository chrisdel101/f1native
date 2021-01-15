import React from 'react'
import {Image, View, StyleSheet, Text} from 'react-native'

const Card = (props) => {
  if (!props) {
    return
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: props.stateObj.mobileImageUrl
        }}
      />
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
  container: {
    height: 700
    // backgroundColor: 'yellow'
  },
  image: {
    // height: '100%'
    height: 700
  }
})
