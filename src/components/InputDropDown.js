import React from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'

const InputDropDown: (props) => React$Node = (props) => {
  return (
    <TouchableOpacity>
      {props.searchData
        ? props.searchData.map((datum, i) => {
            return (
              <Text style={styles.itemText} key={i}>
                {datum.name}
              </Text>
            )
          })
        : null}
    </TouchableOpacity>
  )
}
export default InputDropDown

const styles = StyleSheet.create({
  itemText: {
    padding: 16
  }
})
