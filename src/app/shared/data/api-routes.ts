import {environment} from "environments/environment";

const apiUrl = environment.apiUrl;

export const apiRoutes = {
  writer: {
    stories: {
      base: `${apiUrl}/writer/stories`,
      translations: `${apiUrl}/writer/stories/translations`,
      sentences: `${apiUrl}/writer/stories/translations/sentences`,
      words: `${apiUrl}/writer/stories/translations/words`,
      dictionary: `${apiUrl}/writer/dictionary`,
    },
  },
  reader: {
    stories: {
      base: `${apiUrl}/reader/stories`
    }
  }
};
