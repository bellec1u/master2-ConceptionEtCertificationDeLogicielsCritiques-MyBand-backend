import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services';
import { User } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/user/{id}',
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
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    favoriteInstrument: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1),
                    band: Joi.string()
                })
            }
        },
        description: 'Get one user',
        notes: 'Returns one user for the given id in path parameter',
        tags: ['api', 'user']
    }
})
export class GetOneUserRoute implements OnGet {
    /**
     * Class constructor
     * @param _userService
     */
    constructor(private _userService: UserService) {}

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<User> {
        return this._userService.one(request.params.id);
    }
}
