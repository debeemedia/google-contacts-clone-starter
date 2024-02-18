import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('birthday').alter().index()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('birthday')
      table.string('birthday').alter()
    })
  }
}
