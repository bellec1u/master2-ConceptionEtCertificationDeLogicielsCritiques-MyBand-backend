import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as Joi from 'joi';

@Route({
    path: '/api/hello/{name}',
    method: 'GET',
    config: {
        validate: {
            params: {
                name: Joi.string().min(3).max(10)
            }
        },
        response: {
            status: {
                200: Joi.string().required()
            }
        },
        description: 'Say Hello',
        notes: 'The name parameter is required with min length of 3 and max length of 10',
        tags: ['api', 'hello']
    }
})
export class GetHelloWorldRoute implements OnGet {
    /**
     * OnGet implementation
     *
     * @param {Request} request
     *
     * @return {Observable<string>}
     */
    onGet(request: Request): Observable<string> {
        return of(`Hello ${request.params.name}!`);
    }
}
