describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'TestUser',
      username: 'Test',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('Test')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('TestUser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('Test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Test', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://www.test.url/')
      cy.contains('save').click()

      cy.contains('Test Title')
    })

    it('A blog can be liked', function() {
      cy.contains('Add new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://www.test.url/')
      cy.contains('save').click()
      cy.contains('view blog').click()
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('A blog can be deleted', function() {
      cy.contains('Add new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://www.test.url/')
      cy.contains('save').click()
      cy.contains('view blog').click()
      cy.contains('remove').click()
      cy.get('#blogsapp').should('not.contain', 'Test Title')
    })
    it('Blogs are ordered by likes, descending', function() {

      cy.contains('Add new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://www.test.url/')
      cy.contains('save').click()

      cy.contains('Add new blog').click()
      cy.get('#title').type('Test Title2')
      cy.get('#author').type('Test Author2')
      cy.get('#url').type('http://www.test2.url/')
      cy.contains('save').click()
      cy.wait(100)
      cy.get('button').then(buttons => {
        for(let i = 0; i < buttons.length; i++) {
          if(buttons[i].firstChild.nodeValue === 'view blog') {
            cy.wrap(buttons[i]).click()
          }
        }
        for(let i = 0; i < buttons.length; i++) {
          if(buttons[i].firstChild.nodeValue === 'like') {
            for(let j = 0; j < i; j++) {
              cy.wrap(buttons[i]).click()
            }
          }
        }
      })
      cy.wait(500)
      let last = 90000000
      cy.get('.likecount').then(c => {
        console.log(c)
        for(let i = 0; i < c.length; i++) {
          console.log('AA')
          console.log(c[i].firstChild.textContent)
          assert.isTrue(parseInt(c[i].firstChild.textContent) <= last)
          last = parseInt(c[i].firstChild.textContent)
        }
      })
    })

  })

})