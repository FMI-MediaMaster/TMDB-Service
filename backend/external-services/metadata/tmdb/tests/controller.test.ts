import runMetadataTests from '@FMI-MediaMaster/metadata-service-tests';
import { Express } from 'express';
import { describe } from 'vitest';
import app from '../src/app';

const server = app as Express;

describe('Controller', () => {
    describe('Endpoint /api/movies', () => {
        const endpoint: string = '/api/movies';
        const validMap: Object = {
            'Spider-Man': '557',
            'Home alone': '771',
            'A Million Miles Away': '1002185',
        };
        const invalidMap: Object = {
            'adasdasa': '-1',
            '' : 'Spider-Man',
            'nonExistentMovie': 'nonExistentId',
        };
        const [[firstName, firstId]] = Object.entries(validMap);

        const destroyQuery = (method: string, key: string, value: string) => ({
            split: `${key[0]} ${key.slice(1)}=${value}`,
            duplicate: `${key[0].repeat(2)}${key}=${value}`,
        }[method] ?? `${key}=${value}`);

        const buildInvalidQueries = (key: string, value: string) => 
            ['split', 'duplicate'].map(m => destroyQuery(m, key, value));

        const testsMap: Object = {
            options: {
                validItems: Object.keys(validMap),
                nonExistentItems: Object.keys(invalidMap),
                invalidQueries: buildInvalidQueries('name', firstName),
                fields: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                },
            },
            info: {
                validItems: Object.values(validMap),
                nonExistentItems: Object.values(invalidMap),
                invalidQueries: buildInvalidQueries('id', firstId),
                fields: {
                    originalname: { type: 'string' },
                    description: { type: 'string' },
                    language: { type: 'string' },
                    artworks: { type: 'string' },
                    coverimage: { type: 'string' },
                    creators: { type: 'stringArray' },
                    genres: { type: 'stringArray' },
                    status: { type: 'string' },
                    communityscore: { type: 'number' },
                    seriesname: { type: 'stringArray' },
                    releasedate: { type: 'string' },
                    durationinseconds: { type: 'number' },
                },
            },
            recommendations: {
                validItems: Object.values(validMap),
                nonExistentItems: Object.values(invalidMap),
                invalidQueries: buildInvalidQueries('id', firstId),
                fields: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                },
            }
        };

        for (const [method, params] of Object.entries(testsMap)) {
            runMetadataTests(server, `${endpoint}/${method}`, {...params, type: 'movie'});
        }
    });
});
