import React from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'

const InputDropDown: (props) => React$Node = (props) => {
  return (
    <TouchableOpacity>
      {!props.searchData
        ? null
        : props.searchData.map((datum, i) => {
            return (
              <Text
                style={styles.itemText}
                key={i}
                onPress={() => props.onPress(datum.name_slug)}>
                {datum.name}
              </Text>
            )
          })}
    </TouchableOpacity>
  )
}
export default InputDropDown

const styles = StyleSheet.create({
  itemText: {
    color: '#F8F8F8',
    padding: 16
  }
})
