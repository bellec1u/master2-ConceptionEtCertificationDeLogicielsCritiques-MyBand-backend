import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { PeopleService } from '../../../services';
import { People } from '../../../interfaces/people';

import * as Joi from 'joi';

@Route({
    path: '/api/people/{id}',
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
                    photo: Joi.string(),
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    email: Joi.string().email().required(),
                    phone: Joi.string().required(),
                    address: Joi.object().keys({
                        street: Joi.string().required(),
                        postalCode: Joi.number().required(),
                        city: Joi.string().required()
                    }).required()
                })
            }
        },
        description: 'Get one people',
        notes: 'Returns one people for the given id in path parameter',
        tags: ['api', 'people']
    }
})
export class GetOnePeopleRoute implements OnGet {
    /**
     * Class constructor
     * @param _peopleService
     */
    constructor(private _peopleService: PeopleService) {}

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<People> {
        return this._peopleService.one(request.params.id);
    }
}
