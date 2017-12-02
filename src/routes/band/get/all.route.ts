import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Band } from '../../../interfaces';
import { BandService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/band',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
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
                ).unique().min(1)
            }
        },
        description: 'Get all band',
        notes: 'Returns an array of band or 204',
        tags: ['api', 'band']
    }
})
export class GetAllBandRoute implements OnGet {
    /**
     * Class constructor
     * @param _bandService
     */
    constructor(private _bandService: BandService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Band[] | void> {
        return this._bandService.listAll();
    }
}
