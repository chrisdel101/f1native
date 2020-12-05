import AutoSuggest from 'react-native-autocomplete-input'
import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

class AutocompleteExample extends Component {
  static renderResults(results) {
    console.log('res', results)
    console.log('res', results.name)
    return (
      <View>
        {results.map((result, index) => {
          return (
            <Text style={styles.titleText} key={index}>
              {result.name}
            </Text>
          )
        })}
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      films: []
    }
  }

  findDatum(query) {
    if (!query || query === '') {
      return []
    }

    const data = [...this.props.drivers, ...this.props.teams]
    console.log('data', data)
    const regex = new RegExp(`${query.trim()}`, 'i')
    console.log('regex', regex)
    return data.filter((datum) => {
      return datum.name.search(regex) >= 0
    })
  }

  render() {
    const {query} = this.state
    const data = this.findDatum(query)
    console.log('data', data)
    const comp = (a, b) => {
      if (!a || !b) {
        return
      }
      a.toLowerCase().trim() === b.toLowerCase().trim()
    }
    return (
      <View style={styles.container}>
        <AutoSuggest
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={data.length === 1 && comp(query, data[0].title) ? [] : data}
          defaultValue={query}
          onChangeText={(text) => this.setState({query: text})}
          placeholder="Enter Star Wars film title"
          renderItem={({title}) => (
            <TouchableOpacity onPress={() => this.setState({query: title})}>
              <Text style={styles.itemText}>{title}</Text>
            </TouchableOpacity>
          )}
        />
        {/* <View style={styles.descriptionContainer}>
          {data.length > 0 ? (
            AutocompleteExample.renderResults(data)
          ) : (
            <Text style={styles.infoText}>Enter Name of Driver or Team</Text>
          )}
        </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 8
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  }
})

export default AutocompleteExample
