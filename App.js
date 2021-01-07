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
import {cache} from './src/api/cache'
import {SafeAreaView, StyleSheet, ScrollView, View} from 'react-native'

import InputDropDown from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/InputDropDown.js'
import MySearchBar from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/MySearchBar.js'
import DriverCard from './src/components/DriverCard.js'
import {Header} from 'react-native-elements'

import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
const utils = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/utils.js')
const endpoints = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/endpoints.js')

const App: () => React$Node = () => {
  const [drivers, setDriversData] = useState([])
  const [teams, setTeamsData] = useState('')
  const [input, setInput] = useState('')
  const [combinedData, setCombinedData] = useState('')
  const [dropdownDisplay, setDropdownDisplay] = useState('')
  const [driversCardObjs, setDriverCardObjs] = useState([])
  // set state on load like componentDidMount
  const combineData = (...args) => {
    let datax = [...args].flat()
    // console.log('d', datax)
    setCombinedData([...datax])
    console.log('combined Data on run:', combinedData)
  }
  useEffect(() => {
    ///SET STATE
    const combine = async () => {
      // call data to fill in autocomplete
      const data1 = await driverController
        .getDriverSlugObjs(1400, cache.driversCache)
        .then((res) => {
          setDriversData(res)
          return res
        })
      const data2 = await teamController
        .getTeamSlugObjs(1400, cache.teamsCache)
        .then((res) => {
          setTeamsData(res)
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
    // console.log('e', e)
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
  // takes input state and saves it as dropdownDisplay
  function autoComplete(inputVal) {
    console.log('autocomplete input', inputVal)
    // console.log('com', combinedData)
    if (combinedData.length <= 0) {return} // prettier-ignore
    else if (!inputVal) {
      // set searchval to blank
      return setDropdownDisplay('')
    } else {
      // check if input is within drivers name
      let searchArr = []
      combinedData.some((obj, i) => {
        if (obj.name.includes(inputVal)) {
          searchArr.push(combinedData[i])
        }
      })
      // alphabetize arr
      searchArr = searchArr.sort()
      // set dropdownDisplay
      return setDropdownDisplay(searchArr)
    }
  }
  function handleDriverState(e) {
    const driverObj = driverController.getDriverObj(e, cache.driversCache)
    // driverObj.then((driver) => console.log('state1', driver))
    // console.log('STATE2', driversCardObjs)
    setDriverCardObjs([...driversCardObjs, driverObj])
    // setTimeout(() => {
    // }, 100)
  }
  function handleClick(e) {
    handleDriverState(e)
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
              <InputDropDown
                searchData={dropdownDisplay}
                onPress={handleClick}
              />
            </View>
            {/* <DriverCard driverImage={} /> */}
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
