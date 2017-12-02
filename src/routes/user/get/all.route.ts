import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { User } from '../../../interfaces';
import { UserService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/user',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().required(),
                        firstname: Joi.string().required(),
                        lastname: Joi.string().required(),
                        favoriteInstrument: Joi.string().required(),
                        instruments: Joi.array().items( Joi.string().required() ).min(1),
                        band: Joi.string()
                    })
                ).unique().min(1)
            }
        },
        description: 'Get all user',
        notes: 'Returns an array of user or 204',
        tags: ['api', 'user']
    }
})
export class GetAllUserRoute implements OnGet {
    /**
     * Class constructor
     * @param _userService
     */
    constructor(private _userService: UserService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<User[] | void> {
        return this._userService.listAll();
    }
}
