const utils = require('../utils.js')
const endpoints = require('../endpoints')
const cache = require('../cache')

exports.getAllDriverSlugs = () => {
  return utils
    .httpReq(`${endpoints.prodAPIEndpoint}/drivers`)
    .then((drivers) => drivers)
    .catch((e) => console.error('An error in getAllDriverSlugs', e))
}
// make all names lowercase
exports.makeEntriesLower = (arr) => {
  try {
    if (typeof arr === 'string' && !Array.isArray(arr)) {
      arr = JSON.parse(arr)
    }
    let newArr = arr.map((obj) => {
      obj.name = obj.name.toLowerCase()
      obj.name_slug = obj.name_slug.toLowerCase()
      return obj
    })
    // re-stringify for searching later on
    return JSON.stringify(newArr)
  } catch (e) {
    console.error('An error in makeEntriesLower', e)
  }
}
// take in drivers json and add first and last name keys
// return new arr
exports.extractDriverNames = (driversArr) => {
  return driversArr.map((driverObj) => {
    let firstName = driverObj.name_slug.split('-')[0]
    let lastName = driverObj.name_slug.split('-')[1]
    driverObj.firstName = firstName
    driverObj.lastName = lastName
    return driverObj
  })
}
// returns obj with driver name and slug
exports.getRandomDriver = () => {
  return Promise.resolve(
    this.cacheAndGetDrivers(cache.driversCache, 1400)
  ).then((res) => {
    // random int btw 0 and 20
    const randomInt = utils.getRandomInt(20)
    return res[randomInt]
  })
}
// takes slug - checks if it matches
// return name_slug or false
exports.checkDriverNameIsValid = (slugToCheck) => {
  try {
    slugToCheck = slugToCheck.toLowerCase()
    return Promise.resolve(
      module.exports.cacheAndGetDrivers(cache.driversCache, 1400)
    ).then((drivers) => {
      // CHECK THESE
      drivers = module.exports.makeEntriesLower(drivers)
      drivers = module.exports.extractDriverNames(JSON.parse(drivers))
      // console.log('drivers', drivers)
      // console.log('slug', slugToCheck)
      for (let driver of drivers) {
        if (driver.name_slug === slugToCheck) {
          console.log('slug okay', slugToCheck)
          return slugToCheck
        }
      }
      return false
    })
  } catch (e) {
    console.error('An error in checkDriverNameIsValid', e)
  }
}
// takes a cache obj and timeStamp
// gets/caches drivers array
// returns array cache for from api
exports.cacheAndGetDrivers = (expiryTime, driversCache = {}) => {
  // if not in cache OR time stamp passes fails use new call
  if (
    !driversCache.hasOwnProperty('drivers_slugs') ||
    !utils.verifyTimeStamp(driversCache.drivers_slugs.timeStamp, expiryTime)
  ) {
    return (
      module.exports
        .getAllDriverSlugs()
        // .then((drivers) => {
        //   // console.log('DRIVERS', drivers)
        //   driversCache.drivers_slugs = {
        //     drivers_slugs: drivers,
        //     timeStamp: new Date()
        //   }
        //   // console.log('cacheAndGetDrivers() - NOT FROM CACHE', driversCache)

        //   return drivers
        // })
        .catch((e) => console.error('An error on cacheAndGetDrivers', e))
    )
  } else {
    console.log('cacheAndGetDrivers() - FROM CACHE')
    // if less than 24 hours old get from cache
    return driversCache.drivers_slugs.drivers_slugs
  }
}
exports.mapDriverObj = (driverSlug) => {
  if (!driverSlug) {
    throw Error('mapDriverObj: no slug given')
  }
  try {
    return {
      slug: driverSlug,
      mobileImageUrl: `${
        endpoints.prodCardsEndpoint
      }${endpoints.prodDriverCardSm(driverSlug)}`,
      imageUrl: `${endpoints.prodCardsEndpoint}${endpoints.prodDriverCardLg(
        driverSlug
      )}`,
      timeStamp: new Date()
    }
  } catch (e) {
    console.error('An error in driverController.mapDriverObj', e)
  }
}

// checks if slug is valid
// checks if obj is alrady in cache and adds
// returns obj
exports.getDriverObj = (driverSlug, driverCache) => {
  try {
    console.log('getDriverObj11()', driverCache)
    // if not in cache add to cache
    if (!driverCache.hasOwnProperty(driverSlug)) {
      // call drivers api and check if valid name
      return module.exports.checkDriverNameIsValid(driverSlug).then((slug) => {
        // if driver name is valid
        if (slug) {
          //  add to cache
          console.log('getDriverObj() - NOT FROM CACHE')
          driverCache[driverSlug] = module.exports.mapDriverObj(driverSlug)
          // return new driver obj
          console.log('driver Obj', driverCache)
          return driverCache[driverSlug]
        } else {
          console.log('Not a valid driver name')
          return false
        }
      })
      // if driver is in cache already
    } else if (driverCache.hasOwnProperty(driverSlug)) {
      console.log('getDriverObj() - FROM CACHE')
      // check if time is valid - less than 30 mins
      if (utils.verifyTimeStamp(driverCache[driverSlug].timeStamp, 30)) {
        console.log('valid time stamp')
        // if valid get from cache
        return driverCache[driverSlug]
        // if not valid then re-add
      } else {
        console.log('getDriverObj() - NOT FROM CACHE')
        console.log('failed time stamp')
        driverCache[driverSlug] = this.mapDriverObj(driverSlug)
        // console.log('here', driverCache)
        // return new driver obj
        return driverCache[driverSlug]
      }
    } else {
      console.log('Not a valid driver name to cache')
      return false
    }
  } catch (e) {
    console.error('An error in driverController.getDriverObj', e)
  }
}
