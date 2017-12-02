import { OnPut, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { PeopleService } from '../../../services';
import { People } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/people/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
            payload: Joi.object().keys({
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
        description: 'Update one people',
        notes: 'Update the people for the given id in path parameter and return it',
        tags: ['api', 'people']
    }
})
export class PutUpdatePeopleRoute implements OnPut {
    /**
     * Class constructor
     * @param _peopleService
     */
    constructor(private _peopleService: PeopleService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<People> {
        return this._peopleService.update(request.params.id, request.payload);
    }
}
