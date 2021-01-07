import React from 'react'
import {Image, View, StyleSheet, Text} from 'react-native'

const DriverCard = (props) => {
  console.log('p', props)
  if (!props) {
    return
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.testImage}
        source={{
          uri: props.driverImage
        }}
      />
    </View>
  )
}

export default DriverCard

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  testImage: {
    width: '100%',
    height: 200
  }
})
