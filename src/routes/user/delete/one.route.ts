import { OnDelete, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/user/{id}',
    method: 'DELETE',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        description: 'Delete user',
        notes: 'Delete one user for the given id in path parameter',
        tags: ['api', 'user']
    }
})
export class DeleteOneUserRoute implements OnDelete {
    /**
     * Class constructor
     * @param _userService
     */
    constructor(private _userService: UserService) {
    }

    /**
     * OnDelete implementation
     * @param request
     */
    onDelete(request: Request): Observable<void> {
        return this._userService.delete(request.params.id);
    }
}
