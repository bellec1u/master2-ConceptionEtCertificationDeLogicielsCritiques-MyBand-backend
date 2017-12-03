import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Research } from '../../../interfaces';
import { ResearchService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/research',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().required(),
                        description: Joi.string().required(),
                        instruments: Joi.array().items( Joi.string().required() ).min(1).required(),
                        band: Joi.string().required()
                    })
                ).unique().min(1)
            }
        },
        description: 'Get all research',
        notes: 'Returns an array of research or 204',
        tags: ['api', 'research']
    }
})
export class GetAllResearchRoute implements OnGet {
    /**
     * Class constructor
     * @param _researchService
     */
    constructor(private _researchService: ResearchService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Research[] | void> {
        return this._researchService.listAll();
    }
}
