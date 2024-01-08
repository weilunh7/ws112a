var R = {}

window.onhashchange = async function () {
  var r
  var tokens = window.location.hash.split('/')
  console.log('tokens=', tokens)
  switch (tokens[0]) {
    case '#show':
      r = await window.fetch('/post/' + tokens[1])
      let post = await r.json()
      R.show(post)
      break
    case '#new':
      R.new()
      break
    default:
      r = await window.fetch('/list')
      let posts = await r.json()
      R.list(posts)
      break
  }
}

window.onload = function () {
  window.onhashchange()
}

R.layout = function (title, content) {
  document.querySelector('title').innerText = title
  document.querySelector('#content').innerHTML = content
}

R.list = function (posts) {
  let list = []
  for (let number of posts) {
    list.push(`
    <li>
      <h2>${ number.title }</h2>
      <p><a id="show${number.id}" href="#show/${number.id}">通訊錄</a></p>
    </li>
    `)
  }
  let content = `
  <h1>通訊錄</h1>
  <p>目前擁有 <strong>${posts.length}</strong> 個聯絡人!</p>
  <p><a id="createPost" href="#new">創建新的聯絡人</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return R.layout('Posts', content)
}

R.new = function () {
  return R.layout('New Post', `
  <h1>新聯絡人</h1>
  <p>創建新的聯絡人.</p>
  <form>
    <p><input id="title" type="text" placeholder="姓名" name="title"></p>
    <p><textarea id="body" placeholder="號碼" name="body"></textarea></p>
    <p><input id="savePost" type="button" onclick="R.savePost()" value="新增"></p>
  </form>
  `)
}

R.show = function (post) {
  return R.layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `)
}

R.savePost = async function () {
  let title = document.querySelector('#title').value
  let body = document.querySelector('#body').value
  console.log("title:",title,"body:",body)
  let r = await window.fetch('/post', {
    body: JSON.stringify({title: title, body: body}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  window.location.hash = '#list'
  return r
}