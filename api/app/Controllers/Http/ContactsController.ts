import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'
import Logger from '@ioc:Adonis/Core/Logger'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class ContactsController {

    public async index ({request, response}: HttpContextContract) {
        try {
            const {page, perPage} = request.qs()

            const contacts = await Contact.query().select(['id', 'first_name', 'surname', 'phone_number1', 'company', 'job_title', 'profile_picture']).paginate(page, perPage)
    
            return response.ok({data: contacts})
            
        } catch (error) {
            Logger.error('Error at ContactsController.index:\n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while fetching contacts.',
                error: process.env.NODE_ENV !== 'production' ? error : null
            })
        }
    }

    public async store ({request, response}: HttpContextContract) {
        try {
            // const payload = request.body()   // before validation
            const payload = await request.validate(ContactValidator)
    
            const contact = await Contact.create({
                ...payload,
                profilePicture: payload.profilePicture ? Attachment.fromFile(payload.profilePicture) : null
            })
    
            // await contact.refresh()  // refresh unsupported in new versions
            return response.created(contact)
            
        } catch (error) {
            Logger.error('Error at ContactsController.store:\n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while creating the contact.',
                error: process.env.NODE_ENV !== 'production' || error?.status === 422 ? error : null
            })
        }
    }

    public async show ({request, response, requestedContact}: HttpContextContract) {
        try {
            return response.ok({data: requestedContact})
        } catch (error) {
            Logger.error('Error at ContactsController.show: \n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while fetching the contact.',
                error: process.env.NODE_ENV !== 'production' ? error : null
            })
        }
    }

    public async update ({request, response, requestedContact}: HttpContextContract) {
        try {
            const payload = await request.validate(ContactValidator)
    
            requestedContact?.merge({
                ...payload,
                profilePicture: payload.profilePicture ? Attachment.fromFile(payload.profilePicture) : null
            })
    
            await requestedContact?.save()
            // await requestedContact?.refresh()    // refresh unsupported in new versions

            return response.ok({message: 'Contact was edited', data: requestedContact})
            
        } catch (error) {
            Logger.error('Error at ContactsController.update: \n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while updating the contact.',
                error: process.env.NODE_ENV !== 'production' ? error : null
            })
        }
    }

    public async destroy ({request, response, requestedContact}: HttpContextContract) {
        try {
            await requestedContact?.delete()
            
            return response.ok({message: 'Contact was deleted', data: requestedContact?.id})

        } catch (error) {
            Logger.error('Error at ContactsController.destroy: \n%o', error)
            return response.status(error?.status ?? 500).json({
                message: 'An error occurred while deleting the contact.',
                error: process.env.NODE_ENV !== 'production' ? error : null
            })
        }
        }
    }

    
}
