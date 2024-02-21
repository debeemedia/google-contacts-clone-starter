// import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'


test.group('Contacts image upload', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  
test('upload an image while creating a contact', async ({route, assert, client}) => {

  const drive = Drive.fake()
  const {contents, name} = await file.generatePng('200kb')

  const email1 = 'testing4.deborah.okeke@gotedo.com'
  const response = await client.post(route('ContactsController.store'))
  .fields({
    firstName: 'Deborah',
    surname: 'Okeke',
    email1,
    phoneNumber1: '08109210257',
    jobTitle: 'Backend Intern',
    company: 'Gotedo'
  })
  // .file('profilePicture', Application.makePath('Bear-Avatar-icon.png'))  // using real image
  .file('profilePicture', contents, {filename: name})

  response.assertStatus(201)

  response.assertBodyContains({
    profilePicture: {
      extname: 'png',
      mimeType: 'image/png'
    }
  })

  assert.isTrue(await drive.exists(name))
  
})
// .pin()
// .tags(['image'])

test('fail to upload image greater than 500kb', async ({route, client, assert}) => {

  const {contents, name} = await file.generateJpg('1mb')

  const response = await client.post(route('ContactsController.store'))
  .fields({
    firstName: 'Deborah',
    surname: 'Okeke',
    email1: 'testing@gmail.com',
    phoneNumber1: '08109210257'
  })
  .file('profilePicture', contents, {filename: name})

  response.assertStatus(422)
  
  response.assertBodyContains({
    "message":"An error occurred while creating the contact.",
    "error":{
      "flashToSession":false,
      "messages":{
        "errors":[{
          "rule":"file.size",
          "field":"profilePicture",
          "message":"File size should be less than 500KB",
          "args":{
            "size":"500kb",
            "extnames":["jpg","png","webp","gif"]
          }
        }]
      }
    }
  })
})
// .pin()
// .tags(['image'])

test('fail to upload unsupported file format', async ({route, client, assert}) => {

  const {contents, name} = await file.generateDocx('10kb')

  const response = await client.post(route('ContactsController.store'))
  .fields({
    firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing3.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257',
      jobTitle: 'Backend Intern',
      company: 'Gotedo'
  })
  .file('profilePicture', contents, {filename: name})

  response.assertStatus(422)
  response.assertBodyContains({
    message: 'An error occurred while creating the contact.',
    error: { flashToSession: false, messages: { errors: [{
      "rule": "file.extname",
      "field": "profilePicture",
      "message": "Invalid file extension docx. Only jpg, png, webp, gif are allowed",
      "args": {"size":"500kb", "extnames": ["jpg","png","webp","gif"]}
    }] }}
  })
})
// .pin()
// .tags(['image'])
})
