import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'

test.group('Contacts destroy', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should delete a contact', async ({client, assert}) => {

    // create the contact first
    const contact = await client.post('/contacts').form({
      firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257'
    })
  
    const createdContactId = JSON.parse(contact.response.text).id
  
    // test to delete the created contact
    const response = await client.delete(`/contacts/${createdContactId}`)
  
    // response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Contact was deleted',
      data: createdContactId
    })
  
    const deletedContact = await Contact.find(createdContactId)
  
    assert.notExists(deletedContact)
    assert.isNull(deletedContact)
  
  })
  // .pin()
})

