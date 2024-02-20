import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import ContactsController from 'App/Controllers/Http/ContactsController'
import Contact from 'App/Models/Contact'

test.group('Contacts show', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fetch a contact', async ({client, assert}) => {

    // create the contact first
    const createdContact = await client.post('/contacts').form({
      firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257'
    })
    const createdContactId = JSON.parse(createdContact.response.text).id
    // console.log('created contact id---', createdContactId);
  
  
    // test to fetch the created contact
    const response = await client.get(`/contacts/${createdContactId}`)
    // console.log(JSON.parse(response.response.text).data)
    const fetchedContact = await Contact.findOrFail(createdContactId)

    // response.dumpBody()
    // console.log(response.body().data)
    
    response.assertStatus(200)

    response.assertBodyContains({
      data: {
        id: createdContactId,
        firstName: 'Deborah',
        surname: 'Okeke',
        email1: 'testing1.deborah.okeke@gotedo.com',
        phoneNumber1: '08109210257'
      }
    })
  
    assert.equal(fetchedContact.id, response.body().data.id)
    assert.equal(fetchedContact.email1, response.body().data.email1)
  })
  // .pin()
})

