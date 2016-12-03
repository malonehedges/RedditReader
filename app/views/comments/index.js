
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  ActivityIndicator
} from 'react-native'
import moment from 'moment'
import he from 'he'

import styles from './styles'
import redditApi from '../../api/reddit'
import ParseHTML from '../../ParseHTML'

import disclosure90 from './images/disclosure90.png'
import disclosure from './images/disclosure.png'

export default class CommentsView extends Component {

  constructor (props) {
    super(props)

    this.state = {
      comments: [],
      loaded: false
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    redditApi.fetchComments(this.props.post)
      .then(comments => {
        comments.sort((a,b) => b.score - a.score)
        this.setState({
          comments,
          loaded: true
        })
      })
      .done()
  }

  _renderComments () {
    return (
      <CommentsList comments={this.state.comments} />
    )
  }

  _renderLoader () {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator style={styles.activityIndicator} size="large" color="#48bbec" />
      </View>
    )
  }

  render () {
    return (
      <View style={[styles.container, styles.viewContainer]}>
        {this.state.loaded ? this._renderComments() : this._renderLoader()}
      </View>
    )
  }
}

class CommentsList extends Component {

  constructor (props) {
    super(props)

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.comments)
    }
  }

  componentWillUpdate (nextProps) {
    this.state.dataSource = this.getDataSource(nextProps.comments)
  }

  getDataSource (comments) {
    return this.state.dataSource.cloneWithRows(comments)
  }

  render () {
    return (
     <ListView
       style={styles.container}
       dataSource={this.state.dataSource}
       renderRow={this.renderComment.bind(this)}
       enableEmptySections={true} />
    )
  }

  renderComment (comment) {
    return (
      <Comment comment={comment} />
    )
  }
}

class Comment extends Component {

  constructor (props) {
    super(props)

    this.state = {
      repliesShown: true
    }
  }

  render () {
    return (
      <View style={styles.comment}>
        <View style={styles.rowContainer}>
          <Text style={styles.author}>{this.props.comment.author + ' '}</Text>
          <Text style={styles.pointsAndTime}>{this.props.comment.score || 0} points {moment(this.props.comment.created_utc * 1000).fromNow()}</Text>
        </View>
        <View style={styles.postDetailsContainer}>
          <Text style={styles.commentBody}>{this.props.comment.body && he.unescape(this.props.comment.body)}</Text>
          {this.props.comment.replies && this._renderRepliesSection()}
        </View>
      </View>
    )
  }

  _renderRepliesSection () {
    if (this.props.comment.replies.length > 0) {
      return (
        <View>
          <View style={styles.rowContainer}>
            <Text onPress={this._toggleReplies.bind(this)} style={styles.repliesBtnText}>
              replies ({this.props.comment.replies.length})
            </Text>
            <Image
              style={[styles.disclosure, styles.muted]}
              source={this.state.repliesShown ? disclosure90 : disclosure}
            />
          </View>
          {this.state.repliesShown && this._renderReplies()}
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _toggleReplies () {
    this.setState({
      repliesShown: !this.state.repliesShown
    })
  }

  _renderReplies () {
    return (
      <View style={styles.repliesContainer}>
        <CommentsList comments={this.props.comment.replies} />
      </View>
    )
  }
}
