import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'
import { ContactFactory } from 'Database/factories'

test.group('Contacts update', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('update an existing contact', async ({client, assert, route}) => {
  
    // create the contact first
    const contact = await ContactFactory.create()
    
    // test to update the created contact
    const response = await client.put(route('ContactsController.update', {id: contact.id}))
    .form({
      firstName: 'New First Name',
      surname: 'New Surname',
      email1: 'newemail@mail.com',
      phoneNumber1: 'New Phone Number'
    })

    const responseBody = response.body()
  
    const updatedContact = await Contact.findOrFail(contact.id)
  
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Contact was edited',
      data: {
        firstName: updatedContact.firstName,
        surname: updatedContact.surname,
        email1: updatedContact.email1,
        phoneNumber1: updatedContact.phoneNumber1,
        jobTitle: updatedContact.jobTitle
      }
    })
    assert.equal(updatedContact.email1, responseBody.data.email1)
  
  })
  // .pin()
})

