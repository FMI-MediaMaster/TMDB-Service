import config from '@FMI-MediaMaster/load-dotenv';
import errors from '@FMI-MediaMaster/http-errors';

export default class TmdbService {
    private readonly headers: Record<string, string>;
    private readonly mediaType: string;

    constructor(mediaType: string) {
        if (!['movie', 'series'].includes(mediaType)) {
            throw errors.notFound('Did you mean /api/[movie/series]?');
        }

        this.mediaType = mediaType;
        this.headers = {
            accept: 'application/json',
            Authorization: `Bearer ${config.tmdbToken}`,
        };
    };

    public handle = (method: string, query: object): object => {
        if (!['options', 'info', 'recommendations'].includes(method)) {
            throw errors.notFound(`Did you mean /api/${this.mediaType}/[options/info/recommendations]`);
        }
        return {
            method,
            query,
            type: this.mediaType
        };
    };
};
