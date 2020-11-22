/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'

import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native'

import MySearchBar from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/MySearchBar.js'
import {Header} from 'react-native-elements'
import driverController from './src/api/controllers/driverController'

// returns a promise
const httpReq = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    })
}
const App: () => React$Node = () => {
  const apiUrl = 'https://api.github.com/users/hacktivist123/repos'
  console.log(driverController.getAllDriverSlugs())
  return (
    <>
      <NavigationContainer>
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header
              leftComponent={{icon: 'menu', color: '#fff'}}
              centerComponent={{
                text: 'FORMULA 1 CARDS',
                style: {color: '#fff'}
              }}
              rightComponent={{icon: 'home', color: '#fff'}}
            />
            <MySearchBar />
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                {/* <Text style={styles.sectionTitle}>My Cards</Text>
              <Image
                style={styles.testImage}
                source={{
                  uri:
                    'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
                }}
              /> */}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white'
  },
  engine: {
    position: 'absolute',
    right: 0
  },
  body: {
    backgroundColor: 'white'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  highlight: {
    fontWeight: '700'
  },

  testImage: {
    width: '100%',
    height: 200
  }
})

export default App
