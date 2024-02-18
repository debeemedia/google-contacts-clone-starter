import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'

export default class ContactsController {

    public async store ({request, response}: HttpContextContract) {
        const payload = request.body()
        const {
            firstName,
            surname,
            jobTitle,
            email1,
            email2,
            phoneNumber1,
            phoneNumber2,
            country,
            streetAddressLine1,
            streetAddressLine2,
            city,
            postCode,
            state,
            birthday,
            website,
            notes
        } = payload

        const contact = await Contact.create({
            firstName,
            surname,
            jobTitle,
            email1,
            email2,
            phoneNumber1,
            phoneNumber2,
            country,
            streetAddressLine1,
            streetAddressLine2,
            city,
            postCode,
            state,
            birthday,
            website,
            notes
        })

        await contact.refresh()
        return response.created(contact)
    }
}
