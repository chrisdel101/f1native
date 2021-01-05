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

import InputDropDown from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/InputDropDown.js'
import MySearchBar from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/MySearchBar.js'
import {Header} from 'react-native-elements'
import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
const utils = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/utils.js')
const endpoints = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/endpoints.js')
// const cache = require('../cache')

const App: () => React$Node = () => {
  const [drivers, setDrivers] = useState([])
  const [teams, setTeams] = useState('')
  const [input, setInput] = useState('')
  const [allData, setData] = useState('')
  const [searchData, setSearchData] = useState('')
  // set state on load like componentDidMount
  const combineData = (...args) => {
    let datax = [...args].flat()
    console.log('d', datax)
    setData([...datax])
    console.log('all', allData)
  }
  useEffect(() => {
    ///SET STATE
    const combine = async () => {
      const data1 = await driverController
        .cacheAndGetDrivers(1400, cache.driversCache)
        .then((res) => {
          setDrivers(res)
          return res
        })
      const data2 = await teamController
        .cacheAndGetTeams(1400, cache.teamsCache)
        .then((res) => {
          setTeams(res)
          return res
        })
      combineData(data1, data2)
    }
    combine()
  }, [])
  useEffect(() => {
    autoComplete(input)
  }, [input])
  const handleChildchangeText = (e) => {
    console.log('e', e)
    // set input data
    setInput(e)
    resetInputState(e)
    // use input data in autoComplete
  }
  const resetInputState = (e) => {
    if (!e) {
      setInput('')
    }
  }
  // takes input state and saves it as searchData
  function autoComplete(inputVal) {
    console.log('s', inputVal)
    if (allData.length <= 0) {return} // prettier-ignore
    else if (!inputVal) {
      // set searchval to blank
      return setSearchData('')
    } else {
      // check if input is within drivers name
      let searchArr = []
      allData.some((obj, i) => {
        if (obj.name.includes(inputVal)) {
          searchArr.push(allData[i])
        }
      })
      // alphabetize arr
      searchArr = searchArr.sort()
      // set searchData
      return setSearchData(searchArr)
      // setTimeout(() => {
      //   console.log('searchdata ', searchData)
      // }, 100)
    }
  }
  function test(e) {
    console.log(e)
  }
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
            <MySearchBar onChangeText={handleChildchangeText} value={input} />
            <View style={styles.body}>
              <InputDropDown searchData={searchData} onPress={test} />
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
