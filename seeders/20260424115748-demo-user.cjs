'use strict';
const fs = require("fs");
const path = require("path");
const { v7: uuidv7 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const profile = path.join(process.cwd(), "src", "seed", "seed_profiles.json");

    const data = await fs.promises.readFile(profile, "utf-8");

    const parsed = JSON.parse(data);

    const profiles = parsed.profiles.map((profile) => ({
      id: uuidv7(),
      ...profile,
      created_at: new Date(),
      updated_at: new Date()
    }));

    return queryInterface.bulkInsert('profiles', profiles);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('profiles', null, {});
  }
};