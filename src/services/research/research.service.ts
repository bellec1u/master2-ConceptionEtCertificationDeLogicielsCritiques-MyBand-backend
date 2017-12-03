import { Injectable } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Biim } from '@hapiness/biim';
import { Observable } from 'rxjs/Observable';

import { Research } from '../../interfaces';
import { ResearchDocumentService } from '../research-document';

import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class ResearchService {
    /**
     * Class constructor
     */
    constructor(private _researchDocumentService: ResearchDocumentService) {}

    /**
     * Returns all existing research in the list
     *
     * @returns {Observable<Research[]>}
     */
    listAll(): Observable<Research[] | void> {
        return this._researchDocumentService.find();
    }

    /**
     * Returns one research of the list matching id in parameter
     *
     * @param {string} id of the research
     *
     * @returns {Observable<Research>}
     */
    one(id: string): Observable<Research> {
        return this._researchDocumentService.findById(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Research with id '${id}' not found`))
                )
            );
    }

    /**
     * Check if research already exists and add it in research list
     *
     * @param research to create
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(research: Research): Observable<HapinessHTTPHandlerResponse> {
        return this._researchDocumentService.create(research)
            .pipe(
                catchError(e => _throw(Biim.conflict(e.message))),
                map(_ => ({ response: _, statusCode: 201 }))
            );
    }

    /**
     * Update a research in research list
     *
     * @param {string} id of the research to update
     * @param research data to update
     *
     * @returns {Observable<Research>}
     */
    update(id: string, research: Research): Observable<Research> {
        return this._researchDocumentService.findByIdAndUpdate(id, research)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Research with id '${id}' not found`))
                )
            );
    }

    /**
     * Delete one research in research list
     *
     * @param {string} id of the research to delete
     *
     * @returns {Observable<any>}
     */
    delete(id: string): Observable<void> {
        return this._researchDocumentService.findByIdAndRemove(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(undefined) :
                        _throw(Biim.notFound(`Research with id '${id}' not found`))
                )
            );
    }
}
