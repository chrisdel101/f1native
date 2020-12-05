const utils = require('../utils.js')
const endpoints = require('../endpoints')
const cache = require('../cache')

exports.checkTeamApi = (nameToCheck) => {
  // check if string is team name from api- return name_slug or false
  try {
    nameToCheck = nameToCheck.toLowerCase()
    return Promise.resolve(
      module.exports.cacheAndGetTeams(cache.teamsCache, 1400)
    ).then((teams) => {
      teams = module.exports.makeTeamEntriesLower(teams)
      // console.log('DDD', teams)
      // compare entry to team names first
      for (let team of teams) {
        // compare against team name
        if (team.name.includes(nameToCheck)) {
          return team.name_slug
        }
      }
      // if not match names - compare entry to team slugs second
      for (let team of teams) {
        // compare against team name
        if (team.name_slug.includes(nameToCheck)) {
          return team.name_slug
        }
      }
      return false
    })
  } catch (e) {
    console.error('An error in checkTeamApi', e)
  }
}
exports.makeTeamEntriesLower = (arr) => {
  try {
    if (typeof arr === 'string' && !Array.isArray(arr)) {
      arr = JSON.parse(arr)
    }
    return arr.map((obj) => {
      obj.name = obj.name.toLowerCase()
      return obj
    })
    // re-stringify for searching later on
  } catch (e) {
    console.error('An error in makeEntriesLower', e)
  }
}
exports.getAllTeamSlugs = () => {
  return utils
    .httpReq(`${endpoints.prodAPIEndpoint}/teams`)
    .then((drivers) => drivers)
}

// get array of all teams and cache it - return it
// takes the teams cache and expiry time
exports.cacheAndGetTeams = (expiryTime, teamsCache = {}) => {
  console.log('cacheAndGetTeams')
  // console.log('cache', teamsCache)
  // if not in cache OR time stamp passes fails use new call
  if (
    !teamsCache.hasOwnProperty('teams_slugs') ||
    !utils.verifyTimeStamp(teamsCache.teams_slugs.timeStamp, expiryTime)
  ) {
    return module.exports
      .getAllTeamSlugs()
      .then((teams) => {
        console.log('NOT FROM CACHE')
        teamsCache.teams_slugs = {
          teams_slugs: teams,
          timeStamp: new Date()
        }
        return teams
      })
      .catch((e) => {
        console.error('An error occured in cacheAndGetTeams', e)
      })
  } else {
    console.log('FROM CACHE')
    // if less and 24 hours old get from cache
    return teamsCache.teams_slugs.teams_slugs
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
// handle caching and return team obj - returns a promise or object
// takes teamCache
exports.cacheAndGetTeam = (teamSlug, teamCache) => {
  // console.log('cacheAndGetTeam', teamCache)
  // if not in cache add to cache
  if (!teamCache.hasOwnProperty(teamSlug)) {
    // call all team api and check if it's there
    return module.exports.checkTeamApi(teamSlug).then((slug) => {
      // if team name is valid
      if (slug) {
        //  add to cache
        teamCache[teamSlug] = this.createTeamObject(teamSlug)
        // console.log('here', teamCache)
        // return new team obj
        return teamCache[teamSlug]
      } else {
        console.log('Not a valid team name')
        return false
      }
    })
    // if team is in cache already
  } else if (teamCache.hasOwnProperty(teamSlug)) {
    // check if time is valid
    if (utils.verifyTimeStamp(teamCache[teamSlug].timeStamp, 30)) {
      console.log('valid time stamp')
      // if valid get from cache
      console.log('team from cache')
      return teamCache[teamSlug]
      // if not valid then re-add
    } else {
      console.log('failed time stamp')
      teamCache[teamSlug] = this.createTeamObject(teamSlug)
      return teamCache[teamSlug]
    }
  } else {
    console.log('Not a valid team name to cache')
    return false
  }
}
