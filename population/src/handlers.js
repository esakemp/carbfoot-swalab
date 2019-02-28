const { updateTop10Stats } = require('./country')

const materializeTop10Stats = async () => {
  await updateTop10Stats()
}

module.exports = {
  materializeTop10Stats
}
