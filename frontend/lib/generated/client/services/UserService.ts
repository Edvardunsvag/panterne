/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SyncUserDto } from '../models/SyncUserDto';
import type { UserDto } from '../models/UserDto';
import type { UserScoreDto } from '../models/UserScoreDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param requestBody
     * @returns UserDto Success
     * @throws ApiError
     */
    public static postApiUserSync(
        requestBody?: SyncUserDto,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/sync',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param gitHubId
     * @returns UserDto Success
     * @throws ApiError
     */
    public static getApiUser(
        gitHubId: string,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/{gitHubId}',
            path: {
                'gitHubId': gitHubId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * @param userId
     * @returns UserScoreDto Success
     * @throws ApiError
     */
    public static getApiUserScores(
        userId: string,
    ): CancelablePromise<Array<UserScoreDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/{userId}/scores',
            path: {
                'userId': userId,
            },
        });
    }
}
