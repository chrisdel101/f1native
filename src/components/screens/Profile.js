/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react'
import {DatePickerIOSBase} from 'react-native'
import {View, Text, Image} from 'react-native'

const Profile: () => React$Node = ({route, navigation}) => {
  const {data} = route.params
  console.log('Data', data)
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Image
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        source={{
          uri: data.mobileImageUrl
        }}
      />
    </View>
  )
}

export default Profile
