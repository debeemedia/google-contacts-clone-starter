import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'


test.group('Contacts store', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('create a new contact', async ({route, assert, client}) => {

    const email1 = 'testing3.deborah.okeke@gotedo.com'

    const payload = {
      firstName: 'Deborah',
      surname: 'Okeke',
      email1,
      phoneNumber1: '08109210257'
    }  
      
    const response = await client.post(route('ContactsController.store'))
    .form(payload)
    const responseBody = response.body()
         
    response.assertStatus(201)
    response.assertBodyContains({email1})

    const contact = await Contact.query().where('email1', email1).firstOrFail()
    assert.exists(contact)
    assert.equal(contact.firstName, responseBody.firstName)
    assert.equal(contact.surname, responseBody.surname)
    
  })
  // .pin()

  test('fail to create contact without required fields', async ({route, client, assert}) => {

    const requiredFields = ['firstName', 'surname', 'email1', 'phoneNumber1']
    const formData = {}
    requiredFields.forEach(requiredField => {
      formData[requiredField] = ''
    })

    const response = await client.post(route('ContactsController.store'))
    .form(formData)

    response.assertStatus(422)

    const errorMessages = requiredFields.map(requiredField => {
      return {
        rule: 'required',
        field: requiredField,
        message: `${requiredField.charAt(0).toUpperCase() + requiredField.slice(1)} is required`

      }      
    })    

    response.assertBodyContains({
      message: 'An error occurred while creating the contact.',
      error: { flashToSession: false, messages: { errors: errorMessages }}
    })
  })
  // .pin()

  test('fail to create contact with incorrect birthday date format', async ({route, client, assert}) => {

    const response = await client.post(route('ContactsController.store'))
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

  test('fail to create contact with birthday that is after today', async ({route, client, assert}) => {

    const today = new Date()
    let futureDate = new Date()
    futureDate.setDate(today.getDate() + 1)
    const formattedFutureDate =  futureDate.toISOString().split('T')[0];
    // console.log(formattedFutureDate);

    const response = await client.post(route('ContactsController.store'))
    .form({birthday: formattedFutureDate})

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

