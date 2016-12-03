const baseUrl =  'https://www.reddit.com/'
const jsonPostfix = '.json'

function beutifyReplies(comments) {
  return comments.map(comment => {
    if (comment.replies) {
      comment.replies = comment.replies.data.children.map(reply => reply.data)
    } else {
      comment.replies = []
    }
    beutifyReplies(comment.replies)
    return comment
  })
}

function postsResponseToJson(response) {
  return response.json()
    .then((responseJson) => responseJson.data.children.map(c => c.data))
}

module.exports = {
  fetchHot () {
    return fetch(`${baseUrl}${jsonPostfix}`)
      .then(postsResponseToJson)
  },

  fetchNext (lastPostName) {
    return fetch(`${baseUrl}${jsonPostfix}?count=25&after=${lastPostName}`)
      .then(postsResponseToJson)
  },

  fetchComments (post) {
    return fetch(`${baseUrl}${post.permalink}${jsonPostfix}`)
      .then(response => response.json())
      .then(responseJson => responseJson[1].data.children.map(c => c.data).filter(c => c.body))
      .then(beutifyReplies)
  }
}
