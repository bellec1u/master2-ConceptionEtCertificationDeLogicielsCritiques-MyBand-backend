import { OnPut, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { BandService } from '../../../services';
import { Band } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/band/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
            payload: Joi.object().keys({
                logo: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
                location: Joi.string().required(),
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
                200: Joi.object().keys({
                    id: Joi.string().required(),
                    logo: Joi.string().required(),
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    location: Joi.string().required(),
                    members: Joi.array().items( Joi.string().required() ).min(1).required()
                })
            }
        },
        description: 'Update one band',
        notes: 'Update the band for the given id in path parameter and return it',
        tags: ['api', 'band']
    }
})
export class PutUpdateBandRoute implements OnPut {
    /**
     * Class constructor
     * @param _bandService
     */
    constructor(private _bandService: BandService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<Band> {
        return this._bandService.update(request.params.id, request.payload);
    }
}
