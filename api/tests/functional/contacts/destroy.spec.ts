import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'
import { ContactFactory } from 'Database/factories'

test.group('Contacts destroy', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('delete a contact', async ({client, assert, route}) => {

    // create the contact first
    const contact = await ContactFactory.create()
  
    // test to delete the created contact
    const response = await client.delete(route('ContactsController.destroy', {id: contact.id}))
  
    // response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Contact was deleted',
      data: contact.id
    })
  
    const deletedContact = await Contact.find(contact.id)
  
    assert.isNull(deletedContact)
  
  })
  // .pin()
})

