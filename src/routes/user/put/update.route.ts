import { OnPut, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services';
import { User } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/user/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
            payload: Joi.object().keys({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                favoriteInstrument: Joi.string().required(),
                instruments: Joi.array().items( Joi.string().required() ).min(1),
                band: Joi.string()
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
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    favoriteInstrument: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1),
                    band: Joi.string()
                })
            }
        },
        description: 'Update one user',
        notes: 'Update the user for the given id in path parameter and return it',
        tags: ['api', 'user']
    }
})
export class PutUpdateUserRoute implements OnPut {
    /**
     * Class constructor
     * @param _userService
     */
    constructor(private _userService: UserService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<User> {
        return this._userService.update(request.params.id, request.payload);
    }
}
