const utils = require('../utils.js')
const endpoints = require('../endpoints')

// check if slug is team name
exports.checkTeamNameIsValid = (slugToCheck, cache) => {
  try {
    slugToCheck = slugToCheck.toLowerCase()
    return Promise.resolve(module.exports.getTeamSlugObjs(1400, cache)).then(
      (teams) => {
        teams = module.exports.makeTeamEntriesLower(teams)
        for (let team of teams) {
          if (team.name_slug === slugToCheck) {
            return slugToCheck
          }
        }
        return false
      }
    )
  } catch (e) {
    console.error('An error in checkTeamNameIsValid', e)
  }
}
exports.makeTeamEntriesLower = (arr) => {
  console.log('arr', arr)
  try {
    if (!arr || arr.length <= 0) {
      return
    }
    return arr.map((obj) => {
      obj.name = obj.name.toLowerCase()
      return obj
    })
    // re-stringify for searching later on
  } catch (e) {
    throw Error('An error in makeEntriesLower', e)
  }
}
exports.getAllTeamSlugs = () => {
  return utils
    .httpReq(`${endpoints.prodAPIEndpoint}/teams`)
    .then((drivers) => drivers)
}
exports.addToCache = (cache) => {
  return module.exports
    .getAllTeamSlugs()
    .then((teamsSlugObj) => {
      console.log('getTeamSlugObjs() - NOT FROM CACHE')
      // add timeStamp
      cache.teamsCache.teams_slugs = {
        slugs: teamsSlugObj,
        timeStamp: new Date()
      }
      // console.log('here', cache)
      return cache.teamsCache.teams_slugs.slugs
    })
    .catch((e) => {
      console.error('Error addToCache', e)
      throw Error('Error addToCache', e)
    })
}
// get array of all teams and cache it - return it
// takes the teams cache and expiry time
exports.getTeamSlugObjs = (expiryTime, cache) => {
  // console.log('getTeamSlugObjs')
  // console.log('cache', teamsCache)
  try {
    // if not in cache OR time stamp passes fails use new call
    if (!cache.teamsCache.hasOwnProperty('teams_slugs')) {
      return module.exports.addToCache(cache).then((teamSlugsArr) => {
        return utils.addTags(teamSlugsArr, 'type', 'team')
      })
    } else {
      if (cache.teamsCache.hasOwnProperty('teams_slugs')) {
        if (
          !utils.verifyTimeStamp(
            cache.teamsCache.teams_slugs.timeStamp,
            expiryTime
          )
        ) {
          console.log('getTeamSlugObjs() - NOT FROM CACHE')
          console.log('time stamp failed')
          return module.exports.addToCache(cache).then((res) => res)
        } else {
          console.log('getTeamSlugObjs() - FROM CACHE')
          return cache.teamsCache.teams_slugs.slugs
        }
      }
    }
  } catch (e) {
    throw Error(e)
  }
}
exports.createTeamObject = (teamSlug) => {
  if (!teamSlug) {
    throw Error()
  }
  try {
    return {
      slug: teamSlug,
      mobileImageUrl: `${endpoints.prodCardsEndpoint}${endpoints.prodTeamCardSm(
        teamSlug
      )}`,
      imageUrl: `${endpoints.prodCardsEndpoint}${endpoints.prodTeamCardLg(
        teamSlug
      )}`,
      timeStamp: new Date()
    }
  } catch (e) {
    console.error('An error in driverController.createDriverObject', e)
  }
}
// gets team from api or cache - returns teamobj
exports.getTeamObj = (teamSlug, cache) => {
  console.log('getTeamObj cache', cache.teamCache)
  console.log('getTeamObj slug', teamSlug)
  // if not in cache add to cache
  if (!cache.teamCache.hasOwnProperty(teamSlug)) {
    // call all team api and check if it's there
    return module.exports.checkTeamNameIsValid(teamSlug, cache).then((slug) => {
      // if team name is valid
      if (slug) {
        //  add to cache
        console.log('getTeamObj() - NOT FROM CACHE')
        cache.teamCache[teamSlug] = module.exports.createTeamObject(teamSlug)
        console.log('cache inner', cache)
        // return new team obj
        return cache.teamCache[teamSlug]
      } else {
        console.log(' Not a valid team name')
        return false
      }
    })
    // if team is in cache already
  } else if (cache.teamCache.hasOwnProperty(teamSlug)) {
    // check if time is valid
    if (utils.verifyTimeStamp(cache.teamCache[teamSlug].timeStamp, 30)) {
      console.log('getTeamObj() - FROM CACHE')
      console.log('valid time stamp')
      // if valid get from cache
      return cache.teamCache[teamSlug]
      // if not valid then re-add
    } else {
      console.log('getTeamObj() - failed time stamp')
      cache.teamCache[teamSlug] = module.exports.createTeamObject(teamSlug)
      return cache.teamCache[teamSlug]
    }
  } else {
    console.log('Not a valid team name to cache')
    return false
  }
}
