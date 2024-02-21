import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'

test.group('Contacts index', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fetch paginated list of contacts', async ({client, assert}) => {

    // seed the database first
    await ContactFactory.createMany(10)
  
    let page = 1
    let perPage = 5
  
    const response = await client.get(`/contacts/?page=${page}&perPage=${perPage}`)
    
    const responseBody = response.body()
    
    response.assertStatus(200)
    assert.property(responseBody.data, 'data')
    assert.isArray(responseBody.data.data)
    assert.equal(responseBody.data.data.length, perPage)
    assert.equal(responseBody.data.meta.current_page, page)
    assert.equal(responseBody.data.meta.per_page, perPage)
    // assert.equal(responseBody.data.meta.total, 10) // can't work because i have more than 10 contacts in my database
  
  })
  // .pin()
})


