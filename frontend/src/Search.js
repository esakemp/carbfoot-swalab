import React from 'react'
import Downshift from 'downshift'
import { graphql } from 'react-apollo'
import fetchAll from './queries/fetchAll'

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

const Search = ({onSelectCountry, data: { allCountries = [] }}) => (
    <div>
        <BasicAutocomplete items={allCountries}
            onChange={selectedItem => onSelectCountry(selectedItem.code)} />
    </div>
)

export default graphql(fetchAll)(Search)