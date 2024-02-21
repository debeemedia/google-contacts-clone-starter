import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Contact extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public id: string

  @column({serializeAs: 'firstName'})
  public firstName: string

  @column()
  public surname: string

  @column()
  public company: string | null

  @column({serializeAs: 'jobTitle'})
  public jobTitle: string | null

  @column()
  public email1: string

  @column()
  public email2: string | null

  @column({serializeAs: 'phoneNumber1'})
  public phoneNumber1: string

  @column({serializeAs: 'phoneNumber2'})
  public phoneNumber2: string | null

  @column()
  public country: string | null

  @column({serializeAs: 'streetAddressLine1'})
  public streetAddressLine1: string | null

  @column({serializeAs: 'streetAddressLine2'})
  public streetAddressLine2: string | null

  @column()
  public city: string | null

  @column({serializeAs: 'postCode'})
  public postCode: string | null

  @column()
  public state: string | null

  @column.date({autoCreate: false, autoUpdate: false})
  public birthday: DateTime | null

  @column()
  public website: string | null

  @column()
  public notes: string | null

  @attachment({disk: 'local', folder: 'avatars', preComputeUrl: true, serializeAs: 'profilePicture'})
  public profilePicture: AttachmentContract | null

  @column.dateTime({autoCreate: true, serializeAs: 'createdAt'})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt'})
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(contact: Contact): void {
    contact.id = cuid()
  }
}
