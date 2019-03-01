import React from 'react'
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

const Dropdown = ({ years, classes, onSelectYear, selectedYear }) => {
  return (
    <div className={classes.root}>
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl} fullWidth={true}>
          <InputLabel htmlFor="selectedYear">Top Emissions For Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={event => onSelectYear(event.target.value)}
            fullWidth={true}
            inputProps={{
              year: 'selectedYear',
            }}
          >
            {years.map(({ year }) => (
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

Dropdown.propTypes = {
  years: PropTypes.arrayOf(PropTypes.shape({ year: PropTypes.string })),
}

Dropdown.defaultProps = {
  years: []
}

export default withStyles(styles)(Dropdown)
