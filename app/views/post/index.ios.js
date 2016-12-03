
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  WebView
} from 'react-native'

import styles from './styles'

export default class PostView extends Component {

  render () {
    return (
     <View style={styles.container}>
       <WebView
         automaticallyAdjustContentInsets={true}
         source={{ uri: this.props.url}}
         javaScriptEnabledAndroid={true}
         scalesPageToFit={true} />
     </View>
    )
  }
}
