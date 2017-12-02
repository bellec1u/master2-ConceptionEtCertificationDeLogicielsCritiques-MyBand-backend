import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import { BandService } from '../../../services/';
import { Band } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/band',
    method: 'POST',
    config: {
        validate: {
            payload: Joi.object().keys({
                logo: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
                location: Joi.object().keys({
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required()
                }),
                members: Joi.array().items( Joi.string().required() ).min(1).required()
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
                    logo: Joi.string().required(),
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    location: Joi.object().keys({
                        latitude: Joi.number().required(),
                        longitude: Joi.number().required()
                    }),
                    members: Joi.array().items( Joi.string().required() ).min(1).required()
                })
            }
        },
        description: 'Create one instrument',
        notes: 'Create a new instrument and return it',
        tags: ['api', 'band']
    }
})
export class PostCreateBandRoute implements OnPost {
    /**
     * Class constructor
     * @param _bandService
     */
    constructor(private _bandService: BandService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._bandService.create(request.payload as Band);
    }
}
