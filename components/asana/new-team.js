const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");

module.exports = {
  name: "Team Added To Organization",
  description: "Emits an event for each team added to an organization.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    asana,
    organizationId: { propDefinition: [asana, "organizationId"] },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let teams = [];

    let results = await this.asana.getTeams(this.organizationId);
    for (const result of results) {
      teams.push(await this.asana.getTeam(result.gid));
    }

    for (const team of teams) {
      this.$emit(team, {
        id: team.gid,
        summary: team.name,
        ts: Date.now(),
      });
    }
  },
};
