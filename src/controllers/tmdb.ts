import { Request, Response } from 'express';
import TmdbService from '@services/tmdb';

export default class TmdbController {
    static async handler(req: Request, res: Response): Promise<void> {
        const tmdb: TmdbService = new TmdbService(req.params.type!);
        res.ok(await tmdb.handle(req.params.method, req.query) as object);
    };
};

