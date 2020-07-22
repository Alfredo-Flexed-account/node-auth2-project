
exports.up = function(knex) {
    return knex.schema.createTable('users', userTbl => {
       userTbl.increments()
 
       userTbl
          .string('username', 128)
          .notNullable()
          .unique()
       
       userTbl
          .string('password', 128)
          .notNullable()
 
       userTbl
          .string('department', 128)
          .notNullable()
    })
 };
 
 exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
 };