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

const suggestions = [
  { label: 'Finland' },
  { label: 'Fiji' },
  { label: 'Testimaa' },
  { label: 'Testimaa2' },
  { label: 'Testimaa3' },
  { label: 'Testimaa4' },
  { label: 'Testimaa5' },
]


function renderInput(inputProps) {
  const { inputprops, ref, ...other } = inputProps

  return (
    <TextField
      inputprops={{
        inputRef: ref,
        ...inputprops,
      }}
      {...other}
    />
  )
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > - 1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  )
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  console.log(inputValue)

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

      if (keep) {
        count += 1
      }

      return keep
    })
}


class SearchBar extends Component {
  state = {
    inputValue: '',
    selectedItem: []
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1)
      })
    }
  }
  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  handleChange = (item) => {
    let { selectedItem } = this.state
    if (selectedItem.indexOf(item) === -1) {
      selectedItem = { ...selectedItem, item }
    }

    this.setState({
      inputValue: '',
      selectedItem
    })
  }
  handleDelete = (item) => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem]
      selectedItem.splice(selectedItem.indexOf(item), 1)
      return { selectedItem }
    })
  }

  render() {
    const { inputValue, selectedItem } = this.state

    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
            <div>
              {renderInput({
                fullWidth: true,
                InputProps: getInputProps({
                  startAdornment: selectedItem.map(item => (
                    <Chip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      onDelete={this.handleDelete(item)}
                    />
                  )),
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: 'select multiple countries',
                }),
                label: 'Label',
              })}
              {isOpen ? (
                <Paper square>
                  {getSuggestions(inputValue2).map((suggestion, index) => {
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem: selectedItem2,
                    })
                  })}
                </Paper>
              ) : null}
            </div>
          )}
      </Downshift>
    )
  }
}

const BasicAutocomplete = ({ items, onChange }) => (
  <Downshift onChange={onChange} itemToString={item => (item ? item.name : '')}>
    {({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex
    }) => (
        <div>
          <input {...getInputProps({ placeholder: 'search' })} />
          {isOpen ? (
            <div style={{ border: '1px solid #ccc' }}>
              {items.filter(i => !inputValue || i.name
                .toLowerCase().includes(inputValue.toLowerCase()))
                .slice(0, 10).map((item, index) => (
                  <div {...getItemProps({ item, index, key: item.code })}
                    key={item.code}
                    style={{
                      backgroundColor: highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item.name ? 'bold' : 'normal'
                    }}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
  </Downshift>
)

function Search({ onSelectCountry, data: { allCountries = [] } }) {
  //<BasicAutocomplete items={allCountries}
  //onChange={selectedItem => onSelectCountry(selectedItem.code)} />

  return (
    <div>
      <BasicAutocomplete items={allCountries}
        onChange={selectedItem => onSelectCountry(selectedItem.code)} />
        <SearchBar/>
    </div>
    
  )
}

export default graphql(fetchAll)(Search)
