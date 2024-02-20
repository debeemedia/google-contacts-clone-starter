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

  test('should create a new contact', async ({assert, client}) => {

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
    response.assertBodyContains({email1: 'testing1.deborah.okeke@gotedo.com'})

    const contact = await Contact.query().where('email1', 'testing1.deborah.okeke@gotedo.com').firstOrFail()
    assert.exists(contact)
    assert.equal(contact.firstName, response.body().firstName)
    assert.equal(contact.surname, response.body().surname)
    
  })
  // .pin()

  test('should fail to create contact without required fields', async ({client, assert}) => {
    const response = await client.post('/contacts')
    .form({company: 'Gotedo'})

    // response.dumpBody()
    // console.log(response.response.text);

    response.assertStatus(422)

    response.assertBodyContains({
      message: 'An error occurred while creating the contact.',
      error: { flashToSession: false, messages: { errors: [
        {
          "rule":"required",
          "field":"firstName",
          "message":"First Name is required"
        },
        {
          "rule":"required",
          "field":"surname",
          "message":"Surname is required"
        },
        {
          "rule":"required",
          "field":"email1",
          "message":
          "Email1 is required"
        },
        {
          "rule":"required",
          "field":"phoneNumber1",
          "message":"Phone Number1 is required"
        }] }}
    })
  })
  // .pin()

  test('should should fail to create contact with incorrect birthday date format', async ({client, assert}) => {

    const response = await client.post('/contacts')
    .form({birthday: '22-06-1997'})

    response.dumpBody()
    console.log(response.response.text);

    
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occurred while creating the contact.',
      error: { flashToSession: false, messages: { errors: [{
        "rule":"date.format",
        "field":"birthday",
        "message":"Please provide a valid birthday",
        "args":{"format":"yyyy-MM-dd"}
      }] } }
    })

  })
  // .pin()

  test('should fail to create contact with invalid birthday', async ({client, assert}) => {

    const response = await client.post('/contacts')
    .form({birthday: '2024-06-22'})

    // response.dumpBody()
    // console.log(response.response.text);

    
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occurred while creating the contact.',
      error: { flashToSession: false, messages: { errors: [{
        "rule":"before",
        "field":"birthday",
        "message":"Birthday must be before 'today'"
      }] } }
    })

  })
  // .pin()
})

