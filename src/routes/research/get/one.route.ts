import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { ResearchService } from '../../../services';
import { Research } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/research/{id}',
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
                    description: Joi.string().required(),
                    instruments: Joi.array().items( Joi.string().required() ).min(1).required(),
                    band: Joi.string().required()
                })
            }
        },
        description: 'Get one research',
        notes: 'Returns one research for the given id in path parameter',
        tags: ['api', 'research']
    }
})
export class GetOneResearchRoute implements OnGet {
    /**
     * Class constructor
     * @param _researchService
     */
    constructor(private _researchService: ResearchService) {}

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Research> {
        return this._researchService.one(request.params.id);
    }
}
