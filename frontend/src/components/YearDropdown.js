import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import fetchYears from '../queries/fetchYears'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
})

class Dropdown extends Component {
  state = { selectedYear: '' }
  handleChange = event => {
    this.setState({ selectedYear: event.target.value })
    this.props.onSelectYear(event.target.value)
  }
  render() {
    const { years } = this.props
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl} fullWidth={true}>
            <InputLabel htmlFor="selectedYear">Top Emissions For Year</InputLabel>
            <Select
              value={this.state.selectedYear}
              onChange={this.handleChange}
              fullWidth={true}
              inputProps={{
                year: 'selectedYear',
              }}
            >
              {years.map(year => (
                <MenuItem value={year} key={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </div>
    )
  }
}

Dropdown.propTypes = {
  years: PropTypes.arrayOf(PropTypes.string),
}

Dropdown.defaultProps = {
  years: [],
}

function YearDropdown({ classes, onSelectYear, data: { top10 = [] } }) {
  const { year } = top10
  return (
    <div>
      <Dropdown
        classes={classes}
        years={year}
        onSelectYear={selectedItem => onSelectYear(selectedItem)}
      />
    </div>
  )
}
export default graphql(fetchYears)(withStyles(styles)(YearDropdown))
