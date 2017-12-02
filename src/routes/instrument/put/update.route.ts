import { OnPut, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { InstrumentService } from '../../../services';
import { Instrument } from '../../../interfaces';

import * as Joi from 'joi';

@Route({
    path: '/api/instrument/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
            payload: Joi.object().keys({
                name: Joi.string().required(),
                type: Joi.string().required()
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
                    name: Joi.string().required(),
                    type: Joi.string().required(),
                })
            }
        },
        description: 'Update one instrument',
        notes: 'Update the instrument for the given id in path parameter and return it',
        tags: ['api', 'instrument']
    }
})
export class PutUpdateInstrumentRoute implements OnPut {
    /**
     * Class constructor
     * @param _instrumentService
     */
    constructor(private _instrumentService: InstrumentService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<Instrument> {
        return this._instrumentService.update(request.params.id, request.payload);
    }
}
