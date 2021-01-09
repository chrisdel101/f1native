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
import Card from './src/components/Card.js'
import {Header} from 'react-native-elements'

import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
const utils = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/utils.js')
const endpoints = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/endpoints.js')

const App: () => React$Node = () => {
  const [drivers, setDriversData] = useState([])
  const [teams, setTeamsData] = useState('')
  const [input, setInput] = useState('')
  const [combinedData, setCombinedData] = useState([])
  const [dropdownDisplay, setDropdownDisplay] = useState('')
  const [driversCardObj, setDriverCardObj] = useState({})
  const [teamCardObj, setTeamCardObj] = useState({})
  const [allCardObjsArr, setAllCardObjsArr] = useState([])
  // combine all obj into one array for searching
  const combineData = (setterFunc, ...args) => {
    let flat = [...args].flat()
    setterFunc([...flat])
    console.log('d', flat)
  }
  useEffect(() => {
    ///SET STATE
    const runCombine = async () => {
      // call data to fill in autocomplete
      const data1 = await driverController
        .getDriverSlugObjs(1400, cache)
        .then((res) => {
          setDriversData(res)
          return res
        })
        .catch((e) => {
          throw Error('Error fetching driver data', e)
        })
      const data2 = await teamController
        .getTeamSlugObjs(1400, cache)
        .then((res) => {
          setTeamsData(res)
          return res
        })
        .catch((e) => {
          throw Error('Error fetching driver data', e)
        })
      combineData(setCombinedData, data1, data2)
    }
    runCombine()
  }, [])
  // second userEffect for autoComplete
  useEffect(() => {
    autoComplete(input)
  }, [input])
  const handleChildchangeText = (e) => {
    // set input data
    setInput(e)
    resetInputState(e)
  }
  // reset to black input
  const resetInputState = (e) => {
    if (!e) {
      setInput('')
    }
  }
  // takes input state and saves it as dropdownDisplay
  function autoComplete(inputVal) {
    console.log('autocomplete input', inputVal)
    // console.log('combined', combinedData)
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
  // check data for tag type - returns arr with obj inside
  function checkObjType(slug) {
    try {
      return combinedData.filter((item) => {
        if (item.name_slug === slug) {
          return item.type
        }
      })
    } catch (e) {
      throw Error('Slug type not found', e)
    }
  }
  const combineStateData = (newObj) => {
    // check if obj is already in array
    const check = allCardObjsArr.every((obj) => {
      console.log('obj', obj.slug)
      console.log('newObj', newObj.slug)
      return obj.slug !== newObj.slug
    })
    if (check) {setAllCardObjsArr([...allCardObjsArr, newObj])} // prettier-ignore
  }
  // add clicked name objs to state
  function addObjsToState(slug) {
    const type = checkObjType(slug)[0].type
    switch (type) {
      case 'driver':
        const driverObj = driverController.getDriverObj(slug, cache)
        Promise.resolve(driverObj).then((res) => {
          setDriverCardObj((prevState) => {
            combineStateData(res)
            return {
              ...prevState,
              [res.slug]: res
            }
          })
        })
        break
      case 'team':
        const teamObj = teamController.getTeamObj(slug, cache)
        Promise.resolve(teamObj).then((res) => {
          setTeamCardObj((prevState) => {
            combineStateData(res)
            return {
              ...prevState,
              [res.slug]: res
            }
          })
        })
        break
      default:
        console.error('Error in handling type state')
    }
  }
  function handleClick(e) {
    addObjsToState(e)
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
            {allCardObjsArr.map((obj, i) => {
              return <Card stateObj={obj} key={i} />
            })}
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
