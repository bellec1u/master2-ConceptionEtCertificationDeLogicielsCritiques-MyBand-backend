import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Instrument } from '../../../interfaces';
import { InstrumentService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/instrument',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().required(),
                        name: Joi.string().required(),
                        type: Joi.string().required()
                    })
                ).unique().min(1)
            }
        },
        description: 'Get all instruments',
        notes: 'Returns an array of instrument or 204',
        tags: ['api', 'instrument']
    }
})
export class GetAllInstrumentRoute implements OnGet {
    /**
     * Class constructor
     * @param _instrumentService
     */
    constructor(private _instrumentService: InstrumentService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Instrument[] | void> {
        return this._instrumentService.listAll();
    }
}
