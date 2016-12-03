
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native'

import PostsView from './app/views/posts'

class RedditReader extends Component {
  render () {
    return (
      <NavigatorIOS
        style={styles.container}
        tintColor='#48BBEC'
        titleTextColor='#48BBEC'
        translucent={true}
        initialRoute={{
          title: 'reddit',
          component: PostsView,
        }} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

AppRegistry.registerComponent('RedditReader', () => RedditReader)
