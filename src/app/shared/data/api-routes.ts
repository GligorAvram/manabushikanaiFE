import { environment } from "environments/environment";

const apiUrl = environment.apiUrl;

export const apiRoutes = {
    writer: {
        stories: {
            base: `${apiUrl}/stories`,
            translationsSentences: `${apiUrl}/stories/translations/sentences`,
            translationsWords: `${apiUrl}/stories/translations/words`,
            dictionary: `${apiUrl}/dictionary`,
        },
    },
};