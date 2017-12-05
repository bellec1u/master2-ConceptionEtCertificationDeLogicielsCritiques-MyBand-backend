import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { BandService } from '../../../services';
import { Band } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/band/{id}',
    method: 'GET',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
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
        description: 'Get one band',
        notes: 'Returns one band for the given id in path parameter',
        tags: ['api', 'band']
    }
})
export class GetOneBandRoute implements OnGet {
    /**
     * Class constructor
     * @param _bandService
     */
    constructor(private _bandService: BandService) {}

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Band> {
        return this._bandService.one(request.params.id);
    }
}
