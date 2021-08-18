/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React, {useState, useEffect} from 'react'
import {cache} from './src/api/cache'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text
} from 'react-native'

import InputDropDown from './src/components/InputDropDown.js'
import MySearchBar from './src/components/MySearchBar.js'
import {Header} from 'react-native-elements'

import driverController from './src/api/controllers/driverController'
import teamController from './src/api/controllers/teamController.js'
import {LogBox} from 'react-native'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

const App: () => React$Node = () => {
  const [drivers, setDriversData] = useState([])
  const [teams, setTeamsData] = useState('')
  // from search bar
  const [input, setInput] = useState('')
  // data to search for drop down
  const [combinedData, setCombinedData] = useState([])
  const [dropdownDisplay, setDropdownDisplay] = useState('')
  const [driversCardObj, setDriverCardObj] = useState({})
  const [teamCardObj, setTeamCardObj] = useState({})
  const [base64state, setBase64State] = useState({})
  // track which every last obj clicked
  const [currentSelectionObj, setCurrentSelectionObj] = useState('')
  // array being displayed
  const [cardsToRender, setCardsToRender] = useState([])
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/lewis-hamilton',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/lewis-hamilton',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/lewis-hamilton',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/lewis-hamilton',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/lewis-hamilton',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/lewis-hamilton',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/lewis-hamilton',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/lewis-hamilton',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
  //     timeStamp: Date.now()
  //   },
  //   {
  //     slug: 'valtteri-bottas',
  //     mobileImageUrl:
  //       'https://f1-cards.herokuapp.com/api/mobile/driver/lewis-hamilton',
  //     imageUrl: 'https://f1-cards.herokuapp.com/api/driver/lewis-hamilton',
  //     timeStamp: Date.now()
  //   }
  // ])
  // second userEffect for autoComplete
  // useEffect(() => {
  //   autoComplete(input)
  // }, [input])
  // useEffect(() => {
  //   currentSelectionObj
  // }, [currentSelectionObj])
  // const handleChildchangeText = (e) => {
  //   // set input data
  //   setInput(e)
  //   resetInputState(e)
  // }
  // const resetInputState = (e) => {
  //   if (!e) {
  //     setInput('')
  //   }
  // }
  // // RESTRUCTURE
  // async function addBase64State(urlObj) {
  //   // console.log('state', base64state)
  //   if (!urlObj) {return} // prettier-ignore
  //   try {
  //     // check if obj is in state already
  //     if (base64state && base64state.hasOwnProperty(urlObj.slug)) {
  //       console.log('exists aleady')
  //       return
  //     }
  //     // get base64 string
  //     let base64 = await convertToBase64(urlObj)
  //     setBase64State((prevState) => {
  //       // check that base64state is not empty
  //       console.log('Base64 added')
  //       return {
  //         ...prevState,
  //         [urlObj.slug]: base64
  //       }
  //     })
  //   } catch (e) {
  //     throw Error('Error in addBase64State', e)
  //   }
  // }
  // async function convertToBase64(urlObj) {
  //   if (urlObj && urlObj.hasOwnProperty('mobileImageUrl')) {
  //     const url = urlObj.mobileImageUrl
  //     try {
  //       return new Promise(async (resolve, reject) => {
  //         var reader = new window.FileReader()
  //         let blob = await fetch(url).then((r) => r.blob())
  //         reader.readAsDataURL(blob)
  //         reader.onloadend = function () {
  //           var base64data = reader.result
  //           if (!base64data) {
  //             return reject(
  //               console.error('Promise is rejected in convertToBase64')
  //             )
  //           }
  //           resolve(base64data)
  //         }
  //       })
  //     } catch (e) {
  //       throw Error('An error in convertToBase64', e)
  //     }
  //   } else {
  //     console.error('Error with urlObj.hasOwnPropery mobileImageUrl')
  //   }
  // }
  // // takes input state and saves it as dropdownDisplay
  // function autoComplete(inputVal) {
  //   console.log('autocomplete input', inputVal)
  //   // console.log('combined', combinedData)
  //   if (combinedData.length <= 0) {return} // prettier-ignore
  //   else if (!inputVal) {
  //     // set searchval to blank
  //     return setDropdownDisplay('')
  //   } else {
  //     // check if input is within drivers name
  //     let searchArr = []
  //     combinedData.some((obj, i) => {
  //       if (obj.name.includes(inputVal)) {
  //         searchArr.push(combinedData[i])
  //       }
  //     })
  //     // alphabetize arr
  //     searchArr = searchArr.sort()
  //     // set dropdownDisplay
  //     return setDropdownDisplay(searchArr)
  //   }
  // }
  // // check data for tag type - returns arr with obj inside
  // function checkObjType(slug) {
  //   try {
  //     return combinedData.filter((item) => {
  //       if (item.name_slug === slug) {
  //         return item.type
  //       }
  //     })
  //   } catch (e) {
  //     throw Error('Slug type not found', e)
  //   }
  // }
  // // add to array to render
  // const combineDataToRender = (newObj) => {
  //   // check if obj is already in array
  //   const notInArray = cardsToRender.every((obj) => {
  //     // check current obj does not equal any existing
  //     console.log('HERE')
  //     return obj.slug !== newObj.slug
  //   })
  //   if (notInArray) {
  //     setCardsToRender([newObj, ...cardsToRender])
  //   }
  // }
  // // add clicked name objs to state
  // function addObjsToState(slug) {
  //   const type = checkObjType(slug)[0].type
  //   // call controllersand get driver urls from api
  //   switch (type) {
  //     case 'driver':
  //       const driverObj = driverController.getDriverObj(slug, cache)
  //       Promise.resolve(driverObj).then((res) => {
  //         setDriverCardObj((prevState) => {
  //           // combine current res with previous state
  //           combineDataToRender(res)
  //           console.log('res', res)
  //           setCurrentSelectionObj(res)
  //           return {
  //             ...prevState,
  //             [res.slug]: res
  //           }
  //         })
  //       })
  //       break
  //     case 'team':
  //       const teamObj = teamController.getTeamObj(slug, cache)
  //       Promise.resolve(teamObj).then((res) => {
  //         setTeamCardObj((prevState) => {
  //           combineDataToRender(res)
  //           setCurrentSelectionObj(res)
  //           return {
  //             ...prevState,
  //             [res.slug]: res
  //           }
  //         })
  //       })
  //       break
  //     default:
  //       console.error('Error in handling type state')
  //   }
  // }
  // function deleteCard(indexToRemove) {
  //   if (!cardsToRender || cardsToRender.length <= 0) {return} // prettier-ignore
  //   let copy = Array.from(cardsToRender)
  //   copy = [...copy.slice(0, indexToRemove), ...copy.slice(indexToRemove + 1)]
  //   console.log('delete', copy)
  //   setCardsToRender(copy)
  // }
  // function handleClick(e) {
  //   if (e === undefined || e === null) {return} // prettier-ignore
  //   if (typeof e === 'string') {
  //     addObjsToState(e)
  //   } else if (typeof e === 'number') {
  //     deleteCard(e)
  //   }
  // }
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

    // setCardsToRender(combineData)
    // console.log('combined', combineData)
  }, [])
  // combine all obj into one array for searching
  const combineData = (setterFunc, ...args) => {
    let flat = [...args].flat()
    setterFunc([...flat])
    // console.log('d', flat)
  }
  return (
    <SafeAreaView style={styles.scrollWrapper}>
      {console.log('Cards', cardsToRender)}
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: 'FORMULA 1 CARDS',
          style: {color: '#fff'}
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      {/* <MySearchBar onChangeText={handleChildchangeText} value={input} />
      <View style={styles.dropDownContainer}>
        <InputDropDown searchData={dropdownDisplay} onPress={handleClick} />
      </View> */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {combinedData.map((card) => {
          return (
            <Image
              style={styles.card}
              source={{
                uri: `https://f1-cards.herokuapp.com/api/mobile/driver/${card.name_slug}`
              }}
            />
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 1,
    position: 'absolute',
    top: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: 100,
    height: 100,
    marginBottom: 10,
    backgroundColor: 'blue'
  },
  scrollWrapper: {
    flex: 1,
    height: 'auto'
  },
  dropDownContainer: {
    backgroundColor: 'rgba(5,5,5, 0.7)',
    zIndex: 3
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  }
})

export default App
