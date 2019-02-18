const redis = require('redis')
const bluebird = require('bluebird')
const { REDISURL, REDISPORT } = require('./conf')

bluebird.promisifyAll(redis.RedisClient.prototype)

const REDIS_EMISSIONS = year => `EMISSIONS_${year}`
const REDIS_EMISSIONS_PER_CAPITA = year => `EMISSIONS_PER_CAPITA_${year}`

const client = redis.createClient({
  url: REDISURL,
  port: REDISPORT
})

const ping = async () => client.pingAsync()

const redisSortedSet = REDISKEY => {
  const purge = async () => client.del(REDISKEY)
  const addScore = async (code, score) => {
    if (!score) {
      return false
    } else {
      const updated = await client.zaddAsync(REDISKEY, 'CH', score, code)
      return !!updated
    }
  }
  const getTop10 = async () => client.zrevrangeAsync(REDISKEY, 0, 9)
  const getRank = async code => client.zrevrankAsync(REDISKEY, code)
  const isTop10 = async code => {
    const rank = await getRank(code)
    return !!rank && rank < 10
  }
  return {
    purge,
    addScore,
    getTop10,
    getRank,
    isTop10
  }
}

const emissions = year => redisSortedSet(REDIS_EMISSIONS(year))
const emissionsPerCapita = year => redisSortedSet(REDIS_EMISSIONS_PER_CAPITA(year))

module.exports = {
  emissions,
  emissionsPerCapita,
  ping,
  redisSortedSet
}
