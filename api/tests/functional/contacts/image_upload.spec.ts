import Application from '@ioc:Adonis/Core/Application'
// import {file} from '@ioc:Adonis/Core/Helpers'
// const {contents, name} = file.generateJpg('2mb')
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Contact from 'App/Models/Contact'


test.group('Contacts image upload', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  
test('upload an image while creating a contact', async ({assert, client}) => {

  const response = await client.post('/contacts')
  .fields({
    firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257',
      jobTitle: 'Backend Intern',
      company: 'Gotedo'
  })
  .file('profilePicture', Application.makePath('Bear-Avatar-icon.png'))

  
  response.assertStatus(201)

  const contact = await Contact.query().where('email1', 'testing1.deborah.okeke@gotedo.com').firstOrFail()
  // console.log(contact);
  
  assert.exists(contact)
  assert.exists(contact.profilePicture)
  
})
// .pin()

test('fail to upload image greater than 500kb', async ({client, assert}) => {
  const response = await client.post('/contacts')
  .fields({
    firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257',
      jobTitle: 'Backend Intern',
      company: 'Gotedo'
  })
  // .file('profilePicture', contents, {filename: name})  // trying to generate dummy file
  .file('profilePicture', Application.makePath('passport_debee.jpg'))

  // response.dumpBody()
  // console.log(response.response.text);

  response.assertStatus(422)

  response.assertBodyContains({
    message: 'An error occurred while creating the contact.',
    error: { flashToSession: false, messages: { errors: [{
      "rule":"file.size",
      "field":"profilePicture",
      "message":"File size be less than 500KB",
      "args":{"size":"500kb",
      "extnames":["jpg","png","webp","gif"]
    }}] }}
  })
})
// .pin()

test('fail to upload unsupported file format', async ({client, assert}) => {
  const response = await client.post('/contacts')
  .fields({
    firstName: 'Deborah',
      surname: 'Okeke',
      email1: 'testing1.deborah.okeke@gotedo.com',
      phoneNumber1: '08109210257',
      jobTitle: 'Backend Intern',
      company: 'Gotedo'
  })
  .file('profilePicture', Application.makePath('bear-image.jfif'))

  // response.dumpBody()
  // console.log(response.response.text);

  response.assertStatus(422)
  response.assertBodyContains({
    message: 'An error occurred while creating the contact.',
    error: { flashToSession: false, messages: { errors: [{
      "rule": "file.extname",
      "field": "profilePicture",
      "message": "Invalid file extension jfif. Only jpg, png, webp, gif are allowed",
      "args": {"size":"500kb", "extnames": ["jpg","png","webp","gif"]}}] }}
  })
})
// .pin()
})
