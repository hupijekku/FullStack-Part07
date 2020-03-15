import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlockForm />', () => {
  let component
  let mockHandler
  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <BlogForm createBlog={mockHandler} />
    )
  })

  test('BlogForm eventhandler gets corrent values', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    const form = component.container.querySelector('#form')

    fireEvent.change(title, {
      target: { value: 'test title' }
    })
    fireEvent.change(author, {
      target: { value: 'test author' }
    })
    fireEvent.change(url, {
      target: { value: 'test url' }
    })

    fireEvent.submit(form)

    expect(mockHandler.mock.calls.length).toBe(1)
    expect(mockHandler.mock.calls[0][0].author).toBe('test author')
    expect(mockHandler.mock.calls[0][0].title).toBe('test title')
    expect(mockHandler.mock.calls[0][0].url).toBe('test url')
  })

})