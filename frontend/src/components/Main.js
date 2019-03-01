import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { graphql } from 'react-apollo'
import Search from './Search'
import Country from './Country'
import Top10 from './Top10'
import YearDropdown from './YearDropdown'
import fetchFormData from '../queries/fetchFormData'

import logo from '../logo.png'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  logo: {
    width: 50,
    height: 50,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

class App extends Component {
  state = {
    selectedCountries: [],
    selectedYear: '',
    showCountries: false,
    perCapita: false,
  }

  static getDerivedStateFromProps({ data: { top10List = [] } }, state) {
      if (!state.selectedYear && top10List.length > 0) {
        const { year } = top10List[0]
        return { ...state, selectedYear: year}
      }
      return null
  }

  onSelectCountry = value => {
    this.setState({ selectedCountries: value, showCountries: true })
  }

  onSelectYear = value => {
    this.setState({ selectedYear: value, showCountries: false })
  }

  togglePerCapita = () => {
    this.setState({ perCapita: !this.state.perCapita })
  }

  render() {
    const {
      classes,
      data: { countries, top10List: years }
    } = this.props
    const {
      selectedCountries,
      selectedYear,
      showCountries,
      perCapita,
    } = this.state
    return (
      <div className={classes.main}>
        <img src={logo} alt="carbfoot" className={classes.logo} />
        <Search
          onSelectCountry={this.onSelectCountry}
          countries={countries || []}
        />
        <YearDropdown
          selectedYear={selectedYear}
          years={years || []}
          onSelectYear={this.onSelectYear}
        />
        <FormControlLabel
          control={
            <Checkbox checked={perCapita} onChange={this.togglePerCapita} />
          }
          label="Per Capita"
        />
        {showCountries
          ? selectedCountries.length > 0 && (
              <Country codes={selectedCountries} perCapita={perCapita} />
            )
          : selectedYear && <Top10 year={selectedYear} perCapita={perCapita} />}
      </div>
    )
  }
}

export default graphql(fetchFormData)(withStyles(styles)(App))
