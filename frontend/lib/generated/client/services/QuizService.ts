/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionDto } from '../models/QuestionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuizService {
    /**
     * @param category
     * @param count
     * @returns QuestionDto Success
     * @throws ApiError
     */
    public static getApiQuizRecent(
        category: string,
        count: number = 10,
    ): CancelablePromise<Array<QuestionDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Quiz/recent/{category}',
            path: {
                'category': category,
            },
            query: {
                'count': count,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
