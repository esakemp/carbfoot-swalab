import React, { Component } from 'react'
import deburr from 'lodash/deburr'
import Downshift from 'downshift'
import { graphql } from 'react-apollo'
import fetchAll from '../queries/fetchAll'

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

var suggestions = []

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.code}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}


function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

class DownshiftMultiple extends React.Component {
  state = {
    inputValue: '',
    selectedItem: [],
  };

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = item => {
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }
    console.log(selectedItem)
    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
    });
  };

  render() {
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
        itemToString={item => (item ? item.code : '')}
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
                  placeholder: 'Select multiple countries',
                }),
                label: 'Label',
              })}
              {isOpen ? (
                <Paper square>
                  {getSuggestions(inputValue2).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.code, index, key: suggestion.code }),
                      highlightedIndex,
                      selectedItem: selectedItem2,
                    }),
                  )}
                </Paper>
              ) : null}
            </div>
          )}
      </Downshift>
    );
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
  suggestions = allCountries
  return (
    <div>
      <BasicAutocomplete items={allCountries}
        onChange={selectedItem => onSelectCountry(selectedItem.code)} />
      <DownshiftMultiple />
    </div>

  )
}

export default graphql(fetchAll)(Search)
