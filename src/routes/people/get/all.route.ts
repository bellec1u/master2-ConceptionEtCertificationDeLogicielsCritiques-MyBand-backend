import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { People } from '../../../interfaces';
import { PeopleService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/people',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
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
                ).unique().min(1)
            }
        },
        description: 'Get all people',
        notes: 'Returns an array of people or 204',
        tags: ['api', 'people']
    }
})
export class GetAllPeopleRoute implements OnGet {
    /**
     * Class constructor
     * @param _peopleService
     */
    constructor(private _peopleService: PeopleService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<People[] | void> {
        return this._peopleService.listAll();
    }
}
