import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ContactsController {

    public async store ({request, response}: HttpContextContract) {
        try {
            // const payload = request.body()   // before validation
            const payload = await request.validate(ContactValidator)
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
            
        } catch (error) {
            Logger.error('Error at ContactsController.store:\n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while creating the contact.',
                error: process.env.NODE_ENV !== 'production' || error?.status === 422 ? error : null
            })
        }
    }
}
