/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React, {useState, useEffect} from 'react'
import {cache} from '../../api/cache.js'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Button
} from 'react-native'

import InputDropDown from '../../components/InputDropDown.js'
import MySearchBar from '../../components/MySearchBar.js'
import {Header} from 'react-native-elements'

import driverController from '../../api/controllers/driverController'
import teamController from '../../api/controllers/teamController.js'
import {LogBox} from 'react-native'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications
import {NavigationContainer} from '@react-navigation/native'
const Home = ({navigation}) => {
  const [drivers, setDriversData] = useState([])
  const [teams, setTeamsData] = useState('') // from search bar
  const [input, setInput] = useState('')
  const [combinedData, setCombinedData] = useState([])
  // const [dropdownDisplay, setDropdownDisplay] = useState('')
  const [driversCardObj, setDriverCardObj] = useState({})
  const [teamCardObj, setTeamCardObj] = useState({})
  // const [base64state, setBase64State] = useState({})
  // track which every last obj clicked
  const [currentSelectionObj, setCurrentSelectionObj] = useState('')
  // array being displayed
  const [cardsToRender, setCardsToRender] = useState([
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    },
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    },
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    },
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    },
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    },
    {
      slug: 'valtteri-bottas',
      mobileImageUrl:
        'https://f1-cards.herokuapp.com/api/mobile/driver/valtteri-bottas',
      imageUrl: 'https://f1-cards.herokuapp.com/api/driver/valtteri-bottas',
      timeStamp: Date.now()
    }
  ])
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
  // add to array to render
  const combineDataToRender = (newObj) => {
    console.log('Cards to render', cardsToRender)
    // check if obj is already in array
    const notInArray = cardsToRender.every((obj) => {
      // check current obj does not equal any existing
      return obj.slug !== newObj.slug
    })
    if (notInArray) {
      setCardsToRender([newObj, ...cardsToRender])
    }
  }
  function addObjToState(obj) {
    // call controllers and get driver urls from api
    switch (obj.type) {
      case 'driver':
        const driverObj = driverController.getDriverObj(obj.name_slug, cache)
        Promise.resolve(driverObj).then((res) => {
          // use this syntax to handle when promise not exist
          setDriverCardObj((prevState) => {
            // combine current res with previous state
            setCardsToRender((prev) => [...prev, res])
            setCurrentSelectionObj(res)
            return {
              ...prevState,
              [res.slug]: res
            }
          })
        })
        break
      case 'team':
        const teamObj = teamController.getTeamObj(obj.name_slug, cache)
        Promise.resolve(teamObj).then((res) => {
          setTeamCardObj((prevState) => {
            // combine current res with previous state
            setCardsToRender((prev) => [...prev, res])
            setCurrentSelectionObj(res)
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
  //     addObjToState(e)
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

      Promise.all([data1, data2]).then((values) => {
        let mainArr = data1.concat(data2)
        setCombinedData(mainArr)
        setTimeout(() => {
          mainArr.map((item) => {
            console.log('to state', addObjToState(item))
            addObjToState(item.name_slug)
          }, 100)
        })
      })
    }
    runCombine()
  }, [])
  // // combine all obj into one array for searching
  // const combineData = (setterFunc, ...args) => {
  //   let flat = [...args].flat()
  //   setterFunc([...flat])
  // }
  return (
    <SafeAreaView style={styles.scrollWrapper}>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: 'FORMULA 1 CARDS',
          style: {color: '#fff'}
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <Button
        title="Go to Jane's profile"
        onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
      />
      {/* <MySearchBar onChangeText={handleChildchangeText} value={input} />
       <View style={styles.dropDownContainer}>
         <InputDropDown searchData={dropdownDisplay} onPress={handleClick} />
       </View> */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {cardsToRender.map((card) => {
          return (
            <Image
              style={styles.card}
              source={{
                uri: card.mobileImageUrl
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

export default Home
