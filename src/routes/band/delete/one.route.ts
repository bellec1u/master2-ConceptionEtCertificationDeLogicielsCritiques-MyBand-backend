import { OnDelete, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { BandService } from '../../../services';

import * as Joi from 'joi';

@Route({
    path: '/api/band/{id}',
    method: 'DELETE',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        description: 'Delete band',
        notes: 'Delete one band for the given id in path parameter',
        tags: ['api', 'band']
    }
})
export class DeleteOneBandRoute implements OnDelete {
    /**
     * Class constructor
     * @param _bandService
     */
    constructor(private _bandService: BandService) {
    }

    /**
     * OnDelete implementation
     * @param request
     */
    onDelete(request: Request): Observable<void> {
        return this._bandService.delete(request.params.id);
    }
}
