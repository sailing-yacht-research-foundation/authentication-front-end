const { getCompetitionUnitById, searchScrapedRaceById } = require("./services")

module.exports = {
    async getRaceTitleAndDescription(raceId) {
        let race, scrapedRaceResponse, scrapedRace;

        try {
            race = await getCompetitionUnitById(raceId);
            scrapedRaceResponse = await searchScrapedRaceById(raceId);
        } catch(e) {
            console.error(e);
        }
       
        if (race) {
            return {
                title: race.name,
                description: race.description
            }
        } else if (scrapedRaceResponse) {
            scrapedRace = scrapedRaceResponse?.hits?.hits?.[0];
            if (scrapedRace) {
                return {
                    title: scrapedRace._source?.name,
                    description: null
                }
            }
        }

        return {};
    },

    replaceOpenGraphTagsContent(title, description, url, image, data) {
        data = data.replace(/\$OG_TITLE/g, title);
        data = data.replace(/\$OG_DESCRIPTION/g, description);
        data = data.replace(/\$OG_URL/g, url);
        data = data.replace(/\$OG_IMAGE/g, image);

        return data;
    }
}