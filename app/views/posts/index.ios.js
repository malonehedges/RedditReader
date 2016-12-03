
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'

import styles from './styles'
import redditApi from '../../api/reddit'
import PostView from '../post'
import CommentsView from '../comments'

import commentsIcon from './images/comments.png'

export default class PostsView extends Component {

  constructor (props) {
    super(props)

    this.state = {
      posts: [],
      loading: true
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    this.setState({loading: true})

    return redditApi.fetchHot()
      .then(posts => {
        this.setState({
          posts: posts,
          loading: false
        })
      })
  }

  loadMore () {
    this.setState({loading: true})

    return redditApi.fetchNext(this.getLastPost().name)
      .then(posts => {
        this.setState({
          posts: this.state.posts.concat(posts),
          loading: false
        })
      })
  }

  getLastPost () {
    return this.state.posts[this.state.posts.length - 1]
  }

  render () {
    return (
      <PostList
        posts={this.state.posts}
        loadMore={this.loadMore}
        navigator={this.props.navigator} />
    )
  }
}

class PostList extends Component {

  constructor (props) {
    super(props)

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.posts),
      loading: true
    }
  }

  componentWillUpdate (nextProps) {
    this.state.dataSource = this.getDataSource(nextProps.posts)
  }

  getDataSource (posts) {
    return this.state.dataSource.cloneWithRows(posts)
  }

  renderPost (rowData, sectionID, rowID) {
    return (
      <Post post={rowData} navigator={this.props.navigator}></Post>
    )
  }

  render () {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderPost.bind(this)}
        canLoadMore={true}
        isLoadingMore={this.state.loading}
        refreshOnRelease={true}
        renderScrollComponent={props => <InfiniteScrollView {...props} />}
        onLoadMoreAsync={this.props.loadMore}
        enableEmptySections={true} />
    )
  }
}

class Post extends Component {

  render () {
    let thumbnail = this.props.post.preview && this.props.post.preview.images[0].source
    let imageEl = this._getImageElement(thumbnail)

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.showPost.bind(this)}>
          <View style={styles.container}>
            <Text style={styles.postTitle}>
              {this.props.post.title}
            </Text>
            {imageEl}
            <View style={styles.postStats} onPress={this.showComments}>
              <Text style={styles.statsTextStyles}>{this.props.post.score || 0} points</Text>
              <View style={styles.dotDelimeter}><Text style={styles.statsTextStyles}> . </Text></View>
              <Text style={styles.statsTextStyles}>{this.props.post.num_comments || 0} comments</Text>
              <View style={styles.dotDelimeter}><Text style={styles.statsTextStyles}> . </Text></View>
              <Text style={[styles.statsTextStyles, styles.blue]}>{'/r/' + this.props.post.subreddit}</Text>
              <View style={styles.dotDelimeter}><Text style={styles.statsTextStyles}> . </Text></View>
              <Text style={[styles.statsTextStyles, styles.blue]}>{this.props.post.author}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.showComments.bind(this)}>
          <View style={[styles.container, styles.commentsSection]} onPress={this.showComments.bind(this)}>
            <Image
              style={styles.commentsIcon}
              source={commentsIcon} />
            <View style={styles.readComments}>
              <Text style={[styles.statsTextStyles]}>  Read comments</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    )
  }

  showPost () {
    this.props.navigator.push({
      title: this.props.post.title,
      component: PostView,
      passProps: {
        url: this.props.post.url
      }
    })
  }

  showComments () {
    this.props.navigator.push({
      title: 'Comments - ' + this.props.post.title,
      component: CommentsView,
      passProps: {post: this.props.post}
    })
  }

  _getImageElement (image) {
    if (image) {
      return (
        <View style={styles.imageContainer}>
          <Image
            style={this._getImageStyle(image)}
            source={{ uri: image.url }} />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _getImageStyle (image) {
    let width = Dimensions.get('window').width
    let height = image.height * width / image.width
    return { width, height }
  }
}
