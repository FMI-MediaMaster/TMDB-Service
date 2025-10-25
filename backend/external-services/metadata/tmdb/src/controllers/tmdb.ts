import { Request, Response } from 'express';
import TmdbService from '@services/tmdb';

export default class TmdbController {
    static handler(req: Request, res: Response): void {
        const tmdb: TmdbService = new TmdbService(req.params.type!);
        res.ok(tmdb.handle(req.params.method!, req.query));
    }
}
