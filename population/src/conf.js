const {
    PORT = 8000,
    MONGOURL,
    REDISURL = 'redis://redis',
    REDISPORT = 6379
} = process.env

module.exports = {
    PORT, MONGOURL, REDISURL, REDISPORT
}