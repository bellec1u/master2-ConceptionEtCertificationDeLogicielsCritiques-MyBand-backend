import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import { ResearchService } from '../../../services';
import { Research } from '../../../interfaces/index';

import * as Joi from 'joi';

@Route({
    path: '/api/research',
    method: 'POST',
    config: {
        validate: {
            payload: Joi.object().keys({
                description: Joi.string().required(),
                instruments: Joi.array().items( Joi.string().required() ).min(1).required(),
                band: Joi.string().required()
            })
        },
        payload: {
            output: 'data',
            allow: 'application/json',
            parse: true
        },
        response: {
            status: {
                201: Joi.object().keys({
                    id: Joi.string().required(),
                    description: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1).required(),
                    band: Joi.string().required()
                })
            }
        },
        description: 'Create one research',
        notes: 'Create a new research and return it',
        tags: ['api', 'research']
    }
})
export class PostCreateResearchRoute implements OnPost {
    /**
     * Class constructor
     * @param _researchService
     */
    constructor(private _researchService: ResearchService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._researchService.create(request.payload as Research);
    }
}
