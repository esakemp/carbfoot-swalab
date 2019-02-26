const { Country, upsertCountry, findCountry, upsertCountryStatistic, upsertCountryStats } = require('./country')
const { dbconnect, dbclose } = require('./db')

beforeAll(async () => {
  await dbconnect()
  await Country.deleteMany()
})

afterAll(() => {
  dbclose()
})

test('Calling upsertCountry creates country with correct name and code in DB', async () => {
  const code = 'ABW'
  const name = 'Aruba'
  await upsertCountry(code, name)
  const country = await findCountry(code)
  expect(country).toMatchObject({ code, name })
  expect(country.stats).toBeTruthy()
  expect(country.stats.length).toBe(0)
})

test('Calling upsertCountryStatistic creates missing emissions statistic', async () => {
  const code = 'ZWE'
  const name = 'Zimbabwe'
  const year = '2016'
  const emissions = 1234.4567
  await upsertCountry(code, name)
  await upsertCountryStatistic(code, { year, emissions })
  const country = await findCountry(code)
  expect(country.stats.length).toBe(1)
  expect(country.stats.find(s => s.year === year)).toMatchObject({ year, emissions })
})

test('Calling upsertCountryStatistic on existing year updates emissions statistic', async () => {
  const code = 'FIN'
  const name = 'Finland'
  const year = '2014'
  const coOld = 123
  const coNew = 456
  await upsertCountry(code, name)
  await upsertCountryStatistic(code, { year, emissions: coOld })
  await upsertCountryStatistic(code, { year, emissions: coNew })
  const country = await findCountry(code)
  expect(country.stats.find(s => s.year === year)).toMatchObject({
    year,
    emissions: coNew
  })
})

test('Calling upsertCountryStatistc with population data on existing year with emissions updates statistic', async () => {
  const code = 'ZWE'
  const name = 'Zimbabwe'
  const year = '2016'
  const emissions = 12346
  const population = 67890
  await upsertCountry(code, name)
  await upsertCountryStatistic(code, { year, emissions })
  await upsertCountryStatistic(code, { year, population })
  const country = await findCountry(code)
  expect(country.stats.length).toBe(1)
  expect(country.stats.find(s => s.year === year)).toMatchObject({
    year,
    emissions,
    population
  })
})

test('Calling upsertCountryStats saves information correctly', async () => {
  const code = 'SWE'
  const name = 'Sweden'
  const stats = [
    { year: 2000, population: 1 },
    { year: 2001, population: 2 },
    { year: 2003, population: 3 }
  ]
  await upsertCountryStats(code, name, stats)
  const country = await findCountry(code)
  expect(country.stats.length).toBe(3)
  expect(country).toMatchObject({ code, name })
})
