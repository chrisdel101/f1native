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
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions
} from 'react-native'

import InputDropDown from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/InputDropDown.js'
import MySearchBar from '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/components/MySearchBar.js'
import Card from './src/components/Card.js'
import {Header} from 'react-native-elements'

import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
const utils = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/utils.js')
const endpoints = require('/Users/chrisdielschnieder/desktop/code_work/formula1/f1Native/src/api/endpoints.js')
import {LogBox} from 'react-native'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

const App: () => React$Node = () => {
  const [drivers, setDriversData] = useState([])
  const [teams, setTeamsData] = useState('')
  const [input, setInput] = useState('')
  const [combinedData, setCombinedData] = useState([])
  const [dropdownDisplay, setDropdownDisplay] = useState('')
  const [driversCardObj, setDriverCardObj] = useState({})
  const [teamCardObj, setTeamCardObj] = useState({})
  const [base64state, setBase64State] = useState({})
  const [allCardObjsArr, setAllCardObjsArr] = useState([
    // {
    //   slug: 'romain-grosjean',
    //   mobileImageUrl:
    //     'https://f1-cards.herokuapp.com/api/mobile/driver/romain-grosjean',
    //   imageUrl: 'https://f1-cards.herokuapp.com/api/driver/romain-grosjean',
    //   timeStamp: Date.now()
    // }
    // {
    //   slug: 'romain-grosjean',
    //   mobileImageUrl:
    //     'https://f1-cards.herokuapp.com/api/mobile/driver/romain-grosjean',
    //   imageUrl: 'https://f1-cards.herokuapp.com/api/driver/romain-grosjean',
    //   timeStamp: Date.now()
    // },
    // {
    //   slug: 'romain-grosjean',
    //   mobileImageUrl:
    //     'https://f1-cards.herokuapp.com/api/mobile/driver/romain-grosjean',
    //   imageUrl: 'https://f1-cards.herokuapp.com/api/driver/romain-grosjean',
    //   timeStamp: Date.now()
    // }
    // {
    //   slug: 'valtteri-bottas',
    //   mobileImageUrl:
    //     'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
    //   imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
    //   timeStamp: Date.now()
    // }
  ])
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
  // combine all obj into one array for searching
  const combineData = (setterFunc, ...args) => {
    let flat = [...args].flat()
    setterFunc([...flat])
    console.log('d', flat)
  }
  const resetInputState = (e) => {
    if (!e) {
      setInput('')
    }
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
  async function addCardObjToState(urlObj) {
    console.log('state', base64state)
    if (urlObj) {
      try {
        // check if obj is in state already
        if (base64state && base64state.hasOwnProperty(urlObj.slug)) {
          console.log('exists')
          return
        }
        // get base64 string
        console.log('hello')
        let base64 = await convertToBase64(urlObj)
        console.log('goodbye')
        if (base64state && !base64state.hasOwnProperty(urlObj.slug)) {
          setBase64State((prevState) => {
            // check that base64state is not empty
            console.log('added')
            return {
              ...prevState,
              [urlObj.slug]: base64
            }
          })
        } else {
          console.log('not added')
        }
      } catch (e) {
        throw Error('Error in addCardObjToState', e)
      }
    } else {
      console.error('urlObj not defined in addCardObjToState')
    }
  }
  async function convertToBase64(urlObj) {
    console.log('obj', urlObj)
    console.log('obj', urlObj.slug)
    // console.log('obj', !Object.keys(urlObj).length === 0)
    // console.log('obj', urlObj.constructor === Object)
    if (urlObj && urlObj.hasOwnProperty('mobileImageUrl')) {
      const url = urlObj.mobileImageUrl
      try {
        return new Promise(async (resolve, reject) => {
          var reader = new window.FileReader()
          let blob = await fetch(url).then((r) => r.blob())
          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            var base64data = reader.result
            if (!base64data) {
              return reject(
                console.error('Promise is rejected in convertToBase64')
              )
            }
            resolve(base64data)
          }
        })
      } catch (e) {
        throw Error('An error in convertToBase64', e)
      }
    } else {
      console.error('Error with urlObj.hasOwnPropery mobileImageUrl')
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
            // combine current res with previous state
            combineStateData(res)
            // console.log('res', res)
            addCardObjToState(res)
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
    <SafeAreaView style={{height: 1000}}>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: 'FORMULA 1 CARDS',
          style: {color: '#fff'}
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <MySearchBar onChangeText={handleChildchangeText} value={input} />
      <ScrollView>
        {/* {[...new Array(100)].map((item, i) => {
          return <Text key={i}>Hello</Text>
        })} */}
        <View style={styles.cardsContainer}>
          {allCardObjsArr.map((obj, i) => {
            return <Card stateObj={obj} key={i} />
          })}
        </View>
        <Text>There</Text>
      </ScrollView>
      <View style={styles.dropDownContainer}>
        <InputDropDown searchData={dropdownDisplay} onPress={handleClick} />
      </View>
      <View style={styles.scrollWrapper}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {/* {[...new Array(10)].map((item, i) => {
            return <Text key={i}>Hello</Text>
          })} */}
          {/* <View style={styles.cardsContainer}>
            {allCardObjsArr.map((obj, i) => {
              return <Card stateObj={obj} key={i} />
            })}
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1
  },
  scrollView: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flexGrow: 1
    // position: 'relative'
  },
  dropDownContainer: {
    backgroundColor: 'rgba(72,72,72, 0.4)',
    zIndex: 3
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  cardsContainer: {
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: '100%'
  }
})

export default App
