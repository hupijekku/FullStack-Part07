import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import Users from './components/Users'
import User from './components/User'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import storage from './utils/storage'
import {
  Switch, Route, Link,
  useRouteMatch
} from 'react-router-dom'
import { Alert, Form, Button, Navbar, Nav } from 'react-bootstrap'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
    userService.getAll().then(users =>
      setUsers(users)
    )
  }, [])

  useEffect(() => {
    const user = storage.loadUser()
    setUser(user)
  }, [])

  const notifyWith = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      setUsername('')
      setPassword('')
      setUser(user)
      notifyWith(`${user.name} welcome back!`)
      storage.saveUser(user)
    } catch(exception) {
      notifyWith('wrong username/password', 'error')
    }
  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog '${newBlog.title}' by ${newBlog.author} added!`)
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1, user: blogToLike.user.id }
    await blogService.update(likedBlog)
    setBlogs(blogs.map(b => b.id === id ?  { ...blogToLike, likes: blogToLike.likes + 1 } : b))
  }

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(b => b.id === id)
    const ok = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
    if (ok) {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const handleLogout = () => {
    setUser(null)
    storage.logoutUser()
  }

  const match = useRouteMatch('/users/:id')

  if ( !user ) {
    return (
      <div className='container'>
        <h2>login to application</h2>
        {(message && <Alert variant="success"> {message} </Alert>)}

        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              id='username'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password</Form.Label>
            <Form.Control
              id='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button variant='primary' type='submit' id='login'>login</Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
  let userRouteMatch
  if(users) {
    userRouteMatch = match
      ? users.find(user => user.id === match.params.id)
      : null
  }


  const byLikes = (b1, b2) => b2.likes - b1.likes

  const Menu = () => {
    const padding = {
      paddingRight: 5
    }
    return (
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='mr-auto'>
            <Nav.Link href='#' as='span'>
              <Link style={padding} to='/'>blogs</Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link style={padding} to='/users'>users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user
                ? <em>{user.name} logged in <Button onClick={handleLogout}>logout</Button></em>
                : <></>
              }
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }


  return (
    <div className='container'>
      <Menu />
      

      {(message && <Alert variant="success"> {message} </Alert>)}


      <Switch>
        <Route path='/users/:id'>
          <User user={userRouteMatch}/>
        </Route>
        <Route path='/users'>
          <h2>Users</h2>
          <Users users={users}/>
        </Route>
        <Route path='/'>
          <h2>Blogs</h2>
          <Togglable buttonLabel='create new blog'  ref={blogFormRef}>
            <NewBlog createBlog={createBlog} />
          </Togglable>

          {blogs.sort(byLikes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
              own={user.username===blog.user.username}
            />
          )}
        </Route>
      </Switch>

    </div>
  )
}

export default App