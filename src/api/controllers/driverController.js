const utils = require('../utils.js')
const endpoints = require('../endpoints')

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
exports.getRandomDriver = (cache) => {
  return Promise.resolve(this.getDriverSlugObjs(1400, cache)).then((res) => {
    // random int btw 0 and 20
    const randomInt = utils.getRandomInt(20)
    return res[randomInt]
  })
}
// takes slug - checks if it matches
// return name_slug or false
exports.checkDriverNameIsValid = (slugToCheck, cache) => {
  try {
    slugToCheck = slugToCheck.toLowerCase()
    return Promise.resolve(module.exports.getDriverSlugObjs(1400, cache)).then(
      (drivers) => {
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
      }
    )
  } catch (e) {
    console.error('An error in checkDriverNameIsValid', e)
  }
}
// logic to add to cache
exports.addToCache = (cache) => {
  return module.exports
    .getAllDriverSlugs()
    .then((driverSlugObj) => {
      console.log('getDriverSlugObjs() - NOT FROM CACHE')
      // add timeStamp
      cache.driversCache.driver_slugs = {
        slugs: driverSlugObj,
        timeStamp: new Date()
      }
      console.log('getDriverSlugObjs cache', cache)
      return cache.driversCache.driver_slugs.slugs
    })
    .catch((e) => {
      console.error('Error addToCache', e)
      throw Error('Error addToCache', e)
    })
}
// takes a cache obj and timeStamp
// gets/caches drivers array
// returns slug array
exports.getDriverSlugObjs = (expiryTime, cache) => {
  try {
    // if not in cache add it
    if (!cache.driversCache.hasOwnProperty('driver_slugs')) {
      return module.exports.addToCache(cache).then((res) => res)
    } else {
      if (cache.driversCache.hasOwnProperty('driver_slugs')) {
        // console.log('CHECK 2', cache.driversCache.driver_slugs)
        if (
          !utils.verifyTimeStamp(
            cache.driversCache.driver_slugs.timeStamp,
            expiryTime
          )
        ) {
          console.log('getDriverSlugObjs() - NOT FROM CACHE')
          console.log('time stamp failed')
          return module.exports.addToCache(cache).then((res) => res)
          // time stamp failed - re-cache
        } else {
          console.log('getDriverSlugObjs() - FROM CACHE')
          return cache.driversCache.driver_slugs.slugs
        }
      }
    }
  } catch (e) {
    console.error('An error in getDriverSlugObjs', e)
    throw Error('An error in getDriverSlugObjs', e)
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
exports.getDriverObj = (driverSlug, cache) => {
  try {
    console.log('getDriverObj cache', cache)
    // if not in cache add to cache
    if (!cache.driverCache.hasOwnProperty(driverSlug)) {
      // call drivers api and check if valid name
      return module.exports
        .checkDriverNameIsValid(driverSlug, cache)
        .then((slug) => {
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
      // check if time is valid - less than 30 mins
      if (utils.verifyTimeStamp(cache.driverCache[driverSlug].timeStamp, 30)) {
        console.log('getDriverObj() - FROM CACHE')
        console.log('valid time stamp')
        // if valid get from cache
        return cache.driverCache[driverSlug]
        // if not valid then re-add
      } else {
        console.log('getDriverObj() - NOT FROM CACHE')
        console.log('failed time stamp')
        cache.driverCache[driverSlug] = module.exports.mapDriverObj(driverSlug)
        // return new driver obj from cache
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
