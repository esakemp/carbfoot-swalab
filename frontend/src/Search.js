import React, { useState, Component } from 'react'
import Downshift from 'downshift'
import { graphql, renderToStringWithData } from 'react-apollo'
import gql from 'graphql-tag'
import SingleCountry from './components/SingleCountry'

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
                    <input {...getInputProps({ placeholder: "search" })} />
                    {isOpen ? (
                        <div style={{ border: "1px solid #ccc" }}>
                            {items.filter(i => !inputValue || i.name
                                .toLowerCase().includes(inputValue.toLowerCase()))
                                .slice(0, 10).map((item, index) => (
                                    <div {...getItemProps({ item, index, key: item.code })}
                                        key={item.code}
                                        style={{
                                            backgroundColor:
                                                highlightedIndex === index ? "gray" : "white",
                                            fontWeight: selectedItem === item.name ? "bold" : "normal"
                                        }}
                                    >
                                        {item.name}, {item.code}
                                    </div>
                                ))}
                        </div>
                    ) : null}
                </div>
            )}
    </Downshift>
)

const Search = ({ data: { allCountries = [] } }) => (
    <div>
        <BasicAutocomplete items={allCountries}
            onChange={selectedItem => console.log(selectedItem)} />
    </div>
)

const allCountriesQuery = gql`
{
    allCountries{
        code
        name
    }
}

`

export default graphql(allCountriesQuery)(Search)