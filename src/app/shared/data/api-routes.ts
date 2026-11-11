import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;

export const apiRoutes = {
    writer: {
        files  : {
            base: `${ apiUrl }/writer/files`
        },
        stories: {
            base        : `${ apiUrl }/writer/stories`,
            translations: `${ apiUrl }/writer/stories/translations`,
            sentences   : `${ apiUrl }/writer/stories/translations/sentences`,
            words       : `${ apiUrl }/writer/stories/translations/words`,
            dictionary  : `${ apiUrl }/writer/dictionary`
        },
        collections: {
            base: `${ apiUrl }/writer/collections`
        },
        tags: {
            base: `${ apiUrl }/writer/tags`
        }
    },
    reader: {
        stories: {
            base: `${ apiUrl }/reader/stories`
        },
        collections: {
            base: `${ apiUrl }/reader/collections`
        }
    }
};
