const { Country, Statistics } = require('./models')
const {
  upsertCountry,
  upsertCountryStats,
  findCountry,
  findAllYears,
  updateTop10Stats,
  getTop10
} = require('./country')

const { dbconnect, dbclose } = require('./db')

beforeAll(async () => {
  await dbconnect()
})

beforeEach(async () => {
  await Statistics.deleteMany()
  await Country.deleteMany()
})

afterAll(() => {
  dbclose()
})

test('Calling upsertCountry creates country with correct name and code in DB', async () => {
  const code = 'ABW'
  const name = 'Aruba'
  const country = await upsertCountry(code, name)
  expect(country).toMatchObject({ code, name })
})

test('Calling findCountry returns code, name and stats created with upsertCountryStats.', async () => {
  const code = 'ZWE'
  const name = 'Zimbabwe'
  const year = '2000'
  const population = 1234
  const statistic = { year, population }
  await upsertCountryStats(code, name, [statistic])
  const country = await findCountry(code)
  expect(country).toMatchObject({ code, name })
  expect(country.stats).toBeTruthy()
  expect(country.stats.length).toBe(1)
  const match = country.stats.find(s => s.year === year)
  expect(match).toMatchObject(statistic)
})

test('Calling upsertCountryStats multiple times updates values to stats', async () => {
  const code = 'SWE'
  const name = 'Sweden'
  const year = '2000'
  const oldstat = { year, population: 123 }
  const newstat = { year, population: 456 }
  await upsertCountryStats(code, name, [oldstat])
  await upsertCountryStats(code, name, [newstat])
  const { stats } = await findCountry(code)
  const { population } = stats.find(s => s.year === year)
  expect(population).not.toBe(oldstat.population)
  expect(population).toBe(newstat.population)
})

test('Calling upsertCountryStats with missing fields does not overwrite previous values', async () => {
  const code = 'FIN'
  const name = 'Finland'
  const year = '2000'
  const population = 123
  const emissions = 456
  await upsertCountryStats(code, name, [{ year, population }])
  await upsertCountryStats(code, name, [{ year, emissions }])
  const { stats } = await findCountry(code)
  const saved = stats.find(s => s.year === year)
  expect(saved.population).toBe(population)
  expect(saved.emissions).toBe(emissions)
})

test('Calling findAllYears will return all saved years', async () => {
  const stats = [
    { year: 2000, emissions: 100.99, population: 10 },
    { year: 2001, emissions: 200.99, population: 10 },
    { year: 2002, emissions: 300.99, population: 10 }
  ]
  await upsertCountryStats('ZWE', 'Zimbabwe', stats)
  await upsertCountryStats('FIN', 'Finland', stats)
  const years = await findAllYears()
  expect(years).toEqual(expect.arrayContaining(['2000', '2001', '2002']))
})

test('Calling updateTop10Stats() + getTop10() updates and fetches values correctly.', async () => {
  const code = 'ZWE'
  const name = 'Zimbabwe'
  const stats = [
    { year: '2014', emissions: '12020.426', population: '100' },
  ]
  await upsertCountryStats(code, name, stats)
  await updateTop10Stats()
  const topstats = await getTop10('2014')
  expect(topstats.year).toBe('2014')
  expect(topstats).toHaveProperty('year', 'emissions', 'perCapita')
  const { emissions } = topstats
  expect(emissions).toBeTruthy()
  expect(emissions.length).toBe(1)
  const topEmission = emissions[0]
  expect(topEmission).toMatchObject({ code, name })
  expect(topEmission).toHaveProperty('emissions', 'perCapita', 'population')
})
