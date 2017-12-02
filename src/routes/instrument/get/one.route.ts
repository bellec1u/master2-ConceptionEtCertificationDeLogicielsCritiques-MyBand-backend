import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { InstrumentService } from '../../../services';
import { Instrument } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/instrument/{id}',
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
                    name: Joi.string().required(),
                    type: Joi.string().required()
                })
            }
        },
        description: 'Get one instrument',
        notes: 'Returns one instrument for the given id in path parameter',
        tags: ['api', 'instrument']
    }
})
export class GetOneInstrumentRoute implements OnGet {
    /**
     * Class constructor
     * @param _instrumentService
     */
    constructor(private _instrumentService: InstrumentService) {}

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Instrument> {
        return this._instrumentService.one(request.params.id);
    }
}
