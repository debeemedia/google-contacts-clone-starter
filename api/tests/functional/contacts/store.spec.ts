import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'

test.group('Contacts store', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('create a new contact', async ({assert, client}) => {

    const payload = {
      firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257',
      jobTitle: 'Backend Intern',
      company: 'Gotedo'
    }  
      
    const response = await client.post('/contacts')
    .form(payload)
  
    // console.log('the response---', response);
    // response.dumpBody()
    
    
    response.assertStatus(201)
  
    const contact = await Contact.query().where('email1', 'testing1.deborah.okeke@gotedo.com').firstOrFail()
    assert.exists(contact)
    assert.equal(contact.firstName, 'Deborah')
    assert.equal(contact.surname, 'Okeke')
    
  })
  // .pin()
})

