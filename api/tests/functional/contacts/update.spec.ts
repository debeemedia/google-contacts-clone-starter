import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'

test.group('Contacts update', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('update an existing contact', async ({client, assert}) => {
  
    // create the contact first
    const contact = await client.post('/contacts').form({
      firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257'
    })
    const createdContact = JSON.parse(contact.response.text)
    
    // test to update the created contact
    const response = await client.put(`/contacts/${createdContact.id}`).form({
      ...createdContact,
      jobTitle: 'Backend Intern'
    })
    const responseBodyData = JSON.parse(response.response.text).data
    // response.dumpBody()
  
    const fetchedContact = await Contact.findOrFail(createdContact.id)
    // console.log('fetchedContact-----', fetchedContact);    
  
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Contact was edited',
      data: {
        firstName: 'Deborah',
        surname: 'Okeke',
        email1: 'testing1.deborah.okeke@gotedo.com',
        phoneNumber1: '08109210257',
        jobTitle: 'Backend Intern'
      }
    })
    assert.notEqual(null, responseBodyData.jobTitle)
    assert.equal(fetchedContact.jobTitle, responseBodyData.jobTitle)
  
  })
  // .pin()
})

