import runMetadataTests, { Fields } from '@FMI-MediaMaster/metadata-service-tests';
import { Express } from 'express';
import { describe } from 'vitest';
import app from '../src/app';

const server = app as Express;

describe('Controller', () => {
    describe('Endpoint /api/movie', () => {
        const endpoint: string = '/api/movie';
        const validMap: object = {
            'Spider-Man': '557',
            'Home alone': '771',
            'A Million Miles Away': '1002185',
        };
        const invalidMap: object = {
            'adasdasa': '-1',
            '' : 'Spider-Man',
            'nonExistentMovie': 'nonExistentId',
        };
        const fieldsMap: Record<string, Fields> = {
            options: {
                id: { type: 'number' },
                name: { type: 'string' },
            },
            info: {
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
            recommendations: {
                id: { type: 'number' },
                name: { type: 'string' },
            },
        };

        runMetadataTests(
            server,
            endpoint,
            { validMap, invalidMap, fieldsMap, type: 'movie', }
        );
    });

    describe('Endpoint /api/series', () => {
        const endpoint: string = '/api/series';
        const validMap: object = {
            'Arcane': '94605',
            '12 Monkeys': '60948',
            'I Know This Much Is True': '88166',
        };
        const invalidMap: object = {
            'adasdasa': '-1',
            '' : 'Arcane',
            'nonExistentSeries': 'nonExistentId',
        };
        const fieldsMap: Record<string, Fields> = {
            options: {
                id: { type: 'number' },
                name: { type: 'string' },
            },
            info: {
                originalname: { type: 'string' },
                description: { type: 'string' },
                language: { type: 'string' },
                artworks: { type: 'string' },
                coverimage: { type: 'string' },
                creators: { type: 'stringArray' },
                genres: { type: 'stringArray' },
                status: { type: 'string' },
                communityscore: { type: 'number' },
                releasedate: { type: 'string' },
                seasons: { type: 'objectArray' },
            },
            recommendations: {
                id: { type: 'number' },
                name: { type: 'string' },
            },
        };

        runMetadataTests(
            server,
            endpoint,
            { validMap, invalidMap, fieldsMap, type: 'series', }
        );
    });
});