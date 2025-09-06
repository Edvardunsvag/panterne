/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllTimePodiumStatsDto } from '../models/AllTimePodiumStatsDto';
import type { DailyLeaderboardDto } from '../models/DailyLeaderboardDto';
import type { LeaderboardEntryDto } from '../models/LeaderboardEntryDto';
import type { SubmitQuizWithUserDto } from '../models/SubmitQuizWithUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScoreService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiScoreSubmit(
        requestBody?: SubmitQuizWithUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Score/submit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @param category
     * @param limit
     * @returns LeaderboardEntryDto Success
     * @throws ApiError
     */
    public static getApiScoreLeaderboard(
        category: string,
        limit: number = 10,
    ): CancelablePromise<Array<LeaderboardEntryDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Score/leaderboard/{category}',
            path: {
                'category': category,
            },
            query: {
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param category
     * @param date
     * @param limit
     * @returns LeaderboardEntryDto Success
     * @throws ApiError
     */
    public static getApiScoreLeaderboardDaily(
        category: string,
        date?: string,
        limit: number = 10,
    ): CancelablePromise<Array<LeaderboardEntryDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Score/leaderboard/{category}/daily',
            path: {
                'category': category,
            },
            query: {
                'date': date,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param category
     * @param days
     * @returns DailyLeaderboardDto Success
     * @throws ApiError
     */
    public static getApiScoreLeaderboardHistorical(
        category: string,
        days: number = 7,
    ): CancelablePromise<Array<DailyLeaderboardDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Score/leaderboard/{category}/historical',
            path: {
                'category': category,
            },
            query: {
                'days': days,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param category
     * @param limit
     * @returns AllTimePodiumStatsDto Success
     * @throws ApiError
     */
    public static getApiScorePodiumStats(
        category: string,
        limit: number = 10,
    ): CancelablePromise<Array<AllTimePodiumStatsDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Score/podium-stats/{category}',
            path: {
                'category': category,
            },
            query: {
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
