import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const NewBlog = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()

    props.createBlog({
      title, author, url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={handleNewBlog}>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            id='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <Form.Label>title</Form.Label>
          <Form.Control
            id='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <Form.Label>url</Form.Label>
          <Form.Control
            id='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button variant='primary' id="create" type='submit'>create</Button>
      </Form>
    </div>
  )
}

export default NewBlog