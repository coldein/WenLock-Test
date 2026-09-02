"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1788200265635 = void 0;
class CreateUsersTable1788200265635 {
    name = 'CreateUsersTable1788200265635';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`email\` varchar(254) NOT NULL, \`registration\` varchar(20) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_users_email\` (\`email\`), UNIQUE INDEX \`UQ_users_registration\` (\`registration\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`UQ_users_registration\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`UQ_users_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.CreateUsersTable1788200265635 = CreateUsersTable1788200265635;
//# sourceMappingURL=1788200265635-CreateUsersTable.js.map