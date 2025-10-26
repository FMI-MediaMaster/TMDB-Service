import fetch from 'node-fetch';
import config from '@media-master/load-dotenv';
import errors from '@media-master/http-errors';
import {
    MediaOption,
    Query,
    SearchResult,
    SearchResponse,
    MovieResult,
    SeriesResult,
    MediaResult,
    MovieInfo,
    SeriesInfo,
    MediaInfo,
} from '@types';

export default class TmdbService {
    private readonly headers: Record<string, string>;
    private readonly mediaType: 'movie' | 'tv';

    constructor(mediaType: string) {
        if (!['movies', 'series'].includes(mediaType)) {
            throw errors.notFound(
                'Invalid endpoint! Use /api/[movies|series]/[options|info|recommendations]'
            );
        }

        this.mediaType = mediaType === 'movies' ? 'movie' : 'tv';
        this.headers = {
            accept: 'application/json',
            Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
        };
    };

    private request = async <T>(path: string, params: Record<string, string> = {}): Promise<T | undefined> => {
        const url = new URL(`https://api.themoviedb.org/3/${path}`);
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

        const response = await fetch(url, { headers: this.headers });
        if (!response.ok) return undefined;

        return (await response.json()) as T;
    };

    private mapSearchResult = (media: SearchResult): MediaOption => {
        const title = this.mediaType === 'movie' ? media.title : media.name;
        const date = this.mediaType === 'movie' ? media.release_date : media.first_air_date;
        const releaseYear = date?.slice(0, 4) ? ` (${date.slice(0, 4)})` : '';

        return {
            id: media.id,
            name: `${title ?? ''}${releaseYear}`.trim(),
        };
    };

    private sharedInfo = (media: MediaResult) => ({
        name: this.mediaType === 'movie' ? media.title ?? '' : media.name ?? '',
        description: media.overview ?? '',
        language: media.original_language ?? '',
        artwork: `https://image.tmdb.org/t/p/original${media.backdrop_path ?? ''}`,
        cover: `https://image.tmdb.org/t/p/original${media.poster_path ?? ''}`,
        producers: media.production_companies?.map(p => p.name) ?? [],
        genres: media.genres?.map(g => g.name) ?? [],
        status: media.status ?? '',
        links: [
            {
                'name': 'TMDb',
                'href': `https://www.themoviedb.org/${this.mediaType}/${media.id}`,
            },
            ...(media.homepage
                ? [
                    {
                        name: 'Homepage',
                        href: media.homepage
                    }
                ]
                : []
            ),
        ],
        community_score: Math.round((media.vote_average ?? 0) * 10),
    });

    private getOptions = async (name: string): Promise<MediaOption[]> => {
        const data = await this.request<SearchResponse>(`search/${this.mediaType}`, { query: name });
        return data?.results?.map(this.mapSearchResult) ?? [];
    };

    private getMediaById = async (id: string): Promise<MovieResult | SeriesResult | undefined> => {
        return await this.request<MovieResult | SeriesResult | undefined>(`${this.mediaType}/${id}`, { language: 'en-US' });
    };

    private getMovieInfo = async (id: string): Promise<MovieInfo> => {
        const movie = await this.getMediaById(id) as MovieResult;
        if (!movie?.id) throw errors.notFound('Movie not found');

        return {
            ...this.sharedInfo(movie),
            series: [movie.belongs_to_collection?.name ?? ''],
            release_date: movie.release_date ?? '',
            runtime: movie.runtime ?? 0,
        };
    };

    private getSeriesInfo = async (id: string): Promise<SeriesInfo> => {
        const series = await this.getMediaById(id) as SeriesResult;
        if (!series?.id) throw errors.notFound('Series not found');

        return {
            ...this.sharedInfo(series),
            release_date: series.first_air_date ?? '',
            seasons: series.seasons?.map(season => ({
                name: season.name ?? '',
                cover: `https://image.tmdb.org/t/p/original${season.poster_path ?? ''}`,
                episodes: season.episode_count ?? 0,
            })) ?? [],
        };
    };

    private getInfo = async (id: string): Promise<MediaInfo> => {
        return this.mediaType === 'movie' ? this.getMovieInfo(id) : this.getSeriesInfo(id);
    };

    private getRecommendations = async (id: string): Promise<MediaOption[]> => {
        const data = await this.request<SearchResponse>(
            `${this.mediaType}/${id}/recommendations`,
            { language: 'en-US' }
        );
        return data?.results?.map(this.mapSearchResult) ?? [];
    };

    public handle = async (method: string, query: Query): Promise<unknown> => {
        const methodMap: Record<string, (param: string) => Promise<unknown>> = {
            options: this.getOptions,
            info: this.getInfo,
            recommendations: this.getRecommendations,
        };

        if (!(method in methodMap)) {
            throw errors.notFound(
                'Invalid endpoint! Use /api/[movies|series]/[options|info|recommendations]'
            );
        }

        const param = query[method === 'options' ? 'name' : 'id'];
        if (param === undefined) throw errors.badRequest(`Missing parameter for the ${method} endpoint`);

        return await methodMap[method](param);
    };
};
