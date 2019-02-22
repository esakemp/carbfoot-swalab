import React, { Component } from 'react'
import deburr from 'lodash/deburr'
import Downshift from 'downshift'
import { graphql } from 'react-apollo'
import fetchAll from '../queries/fetchAll'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'

var suggestions = []

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  divider: {
    height: theme.spacing.unit * 2
  }
})

function renderInput(inputProps) {
  const { InputProps, ref, classes, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.code}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.name}
    </MenuItem>
  )
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.name.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

class DownshiftMultiple extends Component {
  state = {
    inputValue: '',
    selectedItem: []
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === 'Backspace'
    ) {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1)
      })
    }
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  handleChange = item => {
    let { selectedItem } = this.state

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item]
    }

    this.setState({
      inputValue: '',
      selectedItem
    })
    console.log(selectedItem)
    this.props.onSelectCountry(selectedItem.map(country => country.code))
  }

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem]
      selectedItem.splice(selectedItem.indexOf(item), 1)
      this.props.onSelectCountry(selectedItem.map(country => country.code))
      return { selectedItem }
    })
  }

  render() {
    const { classes } = this.props
    const { inputValue, selectedItem } = this.state
    return (
      <div className={classes.root}>
        <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
        itemToString={item => (item ? item.name : '')}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex
          }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  startAdornment: selectedItem.map(item => (
                    <Chip
                      key={item.code}
                      className={classes.chip}
                      tabIndex={-1}
                      label={item.name}
                      onDelete={this.handleDelete(item)}
                    />
                  )),
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: 'Select multiple countries'
                }),
                label: 'Countries'
              })}
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {getSuggestions(inputValue2).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({
                        item: suggestion,
                        index,
                        key: suggestion.code
                      }),
                      highlightedIndex,
                      selectedItem: selectedItem2
                    })
                  )}
                </Paper>
              ) : null}
          </div>
        )}
      </Downshift>
    </div>
    )
  }
}

function Search({ classes, onSelectCountry, data: { allCountries = [] } }) {
  suggestions = allCountries
  return (
    <div>
      <DownshiftMultiple
        classes={classes}
        onSelectCountry={selectedItem => onSelectCountry(selectedItem)}
      />
    </div>
  )
}

export default graphql(fetchAll)(withStyles(styles)(Search))
