import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'

export default class FindContact {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const {response, params} = ctx

    const {id} = params
    if (!id) {
      return response.badRequest({message: 'Contact ID not provided'})
    }

    let contact: Contact
    try {
      contact = await Contact.findOrFail(id)
      
    } catch (error) {
        return response.notFound({message: 'Unknown contact was requested'})
    }

    ctx.requestedContact = contact

    await next()
  }
}
