/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
// import ContactsController from 'App/Controllers/Http/ContactsController'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/health', async ({response}) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

// Route.get('/contacts', 'ContactsController.index')
// Route.post('/contacts', 'ContactsController.store')
// Route.put('/contacts/:id', 'ContactsController.update').middleware(['findContact'])
// Route.get('/contacts/:id', 'ContactsController.show').middleware(['findContact'])
// Route.delete('/contacts/:id', 'ContactsController.destroy').middleware(['findContact'])

// refactored routes
Route.resource('contacts', 'ContactsController').apiOnly().middleware({
  show: ['findContact'],
  update: ['findContact'],
  destroy: ['findContact']
})