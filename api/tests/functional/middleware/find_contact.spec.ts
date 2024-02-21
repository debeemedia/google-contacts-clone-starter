import { test } from '@japa/runner'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'


test.group('Middleware find contact', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fail to find a contact that does not exist', async ({assert, client}) => {
    const id = cuid()
    const response = await client.get(`contacts/${id}`)

    response.assertStatus(404)
    response.assertBodyContains({message: 'Unknown contact was requested'})
  })
  // .pin()
})
