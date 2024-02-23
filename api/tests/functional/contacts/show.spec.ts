import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import ContactsController from 'App/Controllers/Http/ContactsController'
import Contact from 'App/Models/Contact'
import { ContactFactory } from 'Database/factories'

test.group('Contacts show', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fetch a contact', async ({client, assert, route}) => {

    // create the contact first
    const contact = await ContactFactory.create()
  
    // test to fetch the created contact
    const response = await client.get(route('ContactsController.show', {id: contact.id}))
    const fetchedContact = await Contact.findOrFail(contact.id)
    
    response.assertStatus(200)

    response.assertBodyContains({
      data: {
        id: fetchedContact.id,
        firstName: fetchedContact.firstName,
        surname: fetchedContact.surname,
        email1: fetchedContact.email1,
        phoneNumber1: fetchedContact.phoneNumber1
      }
    })
  
    assert.equal(fetchedContact.id, response.body().data.id)
    assert.equal(fetchedContact.email1, response.body().data.email1)
  })
  // .pin()
})

