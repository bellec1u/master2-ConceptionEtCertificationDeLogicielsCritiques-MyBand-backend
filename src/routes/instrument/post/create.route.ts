import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import {InstrumentService} from '../../../services/';
import { Instrument } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/instrument',
    method: 'POST',
    config: {
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required(),
                type: Joi.string().required()
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
                    name: Joi.string().required(),
                    type: Joi.string().required()
                })
            }
        },
        description: 'Create one instrument',
        notes: 'Create a new instrument and return it',
        tags: ['api', 'instrument']
    }
})
export class PostCreateInstrumentRoute implements OnPost {
    /**
     * Class constructor
     * @param _instrumentService
     */
    constructor(private _instrumentService: InstrumentService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._instrumentService.create(request.payload as Instrument);
    }
}
