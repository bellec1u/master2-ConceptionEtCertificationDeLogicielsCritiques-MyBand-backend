import { OnDelete, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { ResearchService } from '../../../services/index';

import * as Joi from 'joi';

@Route({
    path: '/api/research/{id}',
    method: 'DELETE',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        description: 'Delete research',
        notes: 'Delete one research for the given id in path parameter',
        tags: ['api', 'research']
    }
})
export class DeleteOneResearchRoute implements OnDelete {
    /**
     * Class constructor
     * @param _researchService
     */
    constructor(private _researchService: ResearchService) {
    }

    /**
     * OnDelete implementation
     * @param request
     */
    onDelete(request: Request): Observable<void> {
        return this._researchService.delete(request.params.id);
    }
}
