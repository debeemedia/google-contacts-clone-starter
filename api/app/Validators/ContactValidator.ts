import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public refs = schema.refs({
    id: this.ctx.params?.id ?? null
  })

  public schema = schema.create({
    firstName: schema.string([rules.escape(), rules.trim(), rules.maxLength(30)]),
    surname: schema.string([rules.escape(), rules.trim(), rules.maxLength(30)]),
    company: schema.string.optional([rules.escape(), rules.trim()]),
    jobTitle: schema.string.optional([rules.escape(), rules.trim()]),
    email1: schema.string([rules.trim(), rules.email(), rules.unique({
      table: 'contacts',
      column: 'email1',
      caseInsensitive: true,
      whereNot: this.refs?.id ? {id: this.refs.id} : {}
    })]),
    email2: schema.string.optional([rules.trim(), rules.email()]),
    phoneNumber1: schema.string([rules.escape(), rules.trim(), rules.maxLength(20)]),
    phoneNumber2: schema.string.optional([rules.escape(), rules.trim(), rules.maxLength(20)]),
    country: schema.string.optional([rules.escape(), rules.trim(), rules.maxLength(25)]),
    streetAddressLine1: schema.string.optional([rules.escape(), rules.trim()]),
    streetAddressLine2: schema.string.optional([rules.escape(), rules.trim()]),
    city: schema.string.optional([rules.escape(), rules.trim()]),
    postCode: schema.string.optional([rules.escape(), rules.trim()]),
    state: schema.string.optional([rules.escape(), rules.trim()]),
    birthday: schema.date.optional({format: 'yyyy-MM-dd'}, [rules.before('today')]),
    website: schema.string.optional([rules.trim(), rules.url({
      protocols: ['http', 'https'],
      requireHost: true
    })]),
    notes: schema.string.optional([rules.escape(), rules.trim()]),
    profilePicture: schema.file.optional({
      size: '500kb',
      extnames: ['jpg', 'png', 'webp', 'gif']
    })

  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'firstName.required': 'FirstName is required',
    'firstName.maxLength': 'FirstName should be a maximum of {{options.maxLength}} characters',
    'surname.required': 'Surname is required',
    'surname.maxLength': 'Surname should be a maximum of {{options.maxLength}} characters',
    'email1.required': 'Email1 is required',
    'email1.email': 'Email1 should be a valid email address',
    'email1.unique': 'Email is already registered in your contacts',
    'email2.email': 'Email2 should be a valid email address',
    'phoneNumber1.required': 'PhoneNumber1 is required',
    'phoneNumber1.maxLength': 'PhoneNumber1 should be a maximum of {{options.maxLength}} characters',
    'phoneNumber2.maxLength': 'PhoneNumber2 should be a maximum of {{options.maxLength}} characters',
    'country.maxLength': 'Country should be a maximum of {{options.maxLength}} characters',
    'birthday.before': "Birthday must be before 'today'",
    'birthday.date.format': 'Please provide a valid birthday',
    'website.url': 'Website is not valid',
    'profilePicture.size': 'Maximum profile picture size is 500kb',
    'profilePicture.extnames': 'The uploaded file type is not allowed'
  }
}
