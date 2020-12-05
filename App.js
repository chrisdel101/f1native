/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React, {useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import cache from './src/api/cache'
import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native'

import MySearchBar from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/MySearchBar.js'
import {Header} from 'react-native-elements'
import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
import AutoComplete from './src/components/AutoComplete'
const utils = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/utils.js')
const endpoints = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/endpoints.js')
// const cache = require('../cache')

const App: () => React$Node = () => {
  const [drivers, setDrivers] = useState([])
  const [teams, setTeams] = useState('')
  // set state on load like componentDidMount
  useEffect(() => {
    driverController
      .cacheAndGetDrivers(1400, cache.driversCache)
      .then((res) => setDrivers(res))
    teamController
      .cacheAndGetTeams(1400, cache.teamsCache)
      .then((res) => setTeams(res))
    // setDrivers(driverController.cacheAndGetDrivers(1400, cache.driversCache))
    // setTeams(teamController.cacheAndGetTeams(1400, cache.teamsCache))
  }, []) // pass in an empty array as a second argument
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
              <AutoComplete drivers={drivers} teams={teams} />
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
