import { environment } from "environments/environment";

const apiUrl = environment.apiUrl;

export const apiRoutes = {
    writer: {
        stories: `${apiUrl}/stories`
    }
}