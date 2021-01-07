const utils = require('../utils.js')
const endpoints = require('../endpoints')
const {cache} = require('../cache')

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
  return Promise.resolve(this.getDriverSlugObjs(cache.driversCache, 1400)).then(
    (res) => {
      // random int btw 0 and 20
      const randomInt = utils.getRandomInt(20)
      return res[randomInt]
    }
  )
}
// takes slug - checks if it matches
// return name_slug or false
exports.checkDriverNameIsValid = (slugToCheck) => {
  try {
    slugToCheck = slugToCheck.toLowerCase()
    return Promise.resolve(
      module.exports.getDriverSlugObjs(cache.driversCache, 1400)
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
// returns slug array
exports.getDriverSlugObjs = (expiryTime, driversCache = {}) => {
  try {
    // if not in cache OR time stamp passes fails use new call
    if (
      !cache.driversCache.hasOwnProperty('slugs') ||
      !utils.verifyTimeStamp(driversCache.drivers_slugs.timeStamp, expiryTime)
    ) {
      return module.exports
        .getAllDriverSlugs()
        .then((driverSlugObj) => {
          console.log('getDriverSlugObjs() - NOT FROM CACHE')
          // add timeStamp
          // cache.driversCache.slugs = {
          //   slugs: driverSlugObj,
          //   timeStamp: new Date()
          // }
          return driverSlugObj
        })
        .catch((e) => {
          console.error('Error inner getDriverSlugObjs()', e)
          throw Error('Error inner getDriverSlugObjs()', e)
        })
    } else {
      console.log('getDriverSlugObjs() - FROM CACHE')
      // if less than 24 hours old get from cache
      return cache.driversCache.slugs
    }
  } catch (e) {
    console.error('An error in getDriverSlugObjs', e)
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
// checks if obj is alrady in cache
// returns obj
exports.getDriverObj = (driverSlug, driverCache) => {
  try {
    // console.log('getDriverObj cache', cache)
    // console.log('getDriverObj slug', driverSlug)
    // console.log('check slug', cache.driverCache.hasOwnProperty(driverSlug))
    // if not in cache add to cache
    if (!cache.driverCache.hasOwnProperty(driverSlug)) {
      // call drivers api and check if valid name
      return module.exports.checkDriverNameIsValid(driverSlug).then((slug) => {
        // if driver name is valid
        if (slug) {
          //  add to cache
          console.log('getDriverObj() - NOT FROM CACHE')
          cache.driverCache[driverSlug] = module.exports.mapDriverObj(slug)
          // return new driver obj
          // console.log('driver Obj', driverCache[driverSlug])
          return cache.driverCache[driverSlug]
        } else {
          console.log('Not a valid driver name')
          return false
        }
      })
      // if driver is in cache already
    } else if (cache.driverCache.hasOwnProperty(driverSlug)) {
      console.log('getDriverObj() - FROM CACHE')
      // check if time is valid - less than 30 mins
      if (utils.verifyTimeStamp(cache.driverCache[driverSlug].timeStamp, 30)) {
        console.log('valid time stamp')
        // if valid get from cache
        return cache.driverCache[driverSlug]
        // if not valid then re-add
      } else {
        console.log('getDriverObj() - NOT FROM CACHE')
        console.log('failed time stamp')
        cache.driverCache[driverSlug] = this.mapDriverObj(driverSlug)
        // console.log('here', driverCache)
        // return new driver obj
        return cache.driverCache[driverSlug]
      }
    } else {
      console.log('Not a valid driver name to cache')
      return false
    }
  } catch (e) {
    console.error('An error in driverController.getDriverObj', e)
  }
}
