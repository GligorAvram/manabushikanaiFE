import { environment } from "environments/environment";

const apiUrl = environment.apiUrl;

export const apiRoutes = {
  writer: {
    stories: {
      base: `${apiUrl}/stories`,
      translations: `${apiUrl}/stories/translations`,
      dictionary: `${apiUrl}/dictionary`
    },
  },
};