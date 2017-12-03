import {OnPut, Request, Route} from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { ResearchService } from '../../../services';
import { Research } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/research/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
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
                200: Joi.object().keys({
                    id: Joi.string().required(),
                    description: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1).required(),
                    band: Joi.string().required()
                })
            }
        },
        description: 'Update one research',
        notes: 'Update the research for the given id in path parameter and return it',
        tags: ['api', 'research']
    }
})
export class PutUpdateResearchRoute implements OnPut {
    /**
     * Class constructor
     * @param _researchService
     */
    constructor(private _researchService: ResearchService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<Research> {
        return this._researchService.update(request.params.id, request.payload);
    }
}
