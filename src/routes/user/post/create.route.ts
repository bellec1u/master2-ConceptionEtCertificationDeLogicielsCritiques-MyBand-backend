import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services';
import { User } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/user',
    method: 'POST',
    config: {
        validate: {
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
                201: Joi.object().keys({
                    id: Joi.string().required(),
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    favoriteInstrument: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1),
                    band: Joi.string()
                })
            }
        },
        description: 'Create one user',
        notes: 'Create a new user and return it',
        tags: ['api', 'user']
    }
})
export class PostCreateUserRoute implements OnPost {
    /**
     * Class constructor
     * @param _userService
     */
    constructor(private _userService: UserService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._userService.create(request.payload as User);
    }
}
