import { OnDelete, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { InstrumentService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/instrument/{id}',
    method: 'DELETE',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        description: 'Delete instrument',
        notes: 'Delete one instrument for the given id in path parameter',
        tags: ['api', 'instrument']
    }
})
export class DeleteOneInstrumentRoute implements OnDelete {
    /**
     * Class constructor
     * @param _instrumentService
     */
    constructor(private _instrumentService: InstrumentService) {
    }

    /**
     * OnDelete implementation
     * @param request
     */
    onDelete(request: Request): Observable<void> {
        return this._instrumentService.delete(request.params.id);
    }
}
