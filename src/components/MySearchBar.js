import {SearchBar} from 'react-native-elements'
import React from 'react'

export default function MySearchBar(props) {
  return (
    <SearchBar
      placeholder="Type Here..."
      onChangeText={props.onChangeText}
      value={props.value}
    />
  )
}
