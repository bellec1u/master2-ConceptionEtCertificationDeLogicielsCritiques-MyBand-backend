import { Injectable } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Biim } from '@hapiness/biim';
import { Observable } from 'rxjs/Observable';

import { Band } from '../../interfaces';
import { BandDocumentService } from '../band-document';

import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class BandService {
    /**
     * Class constructor
     */
    constructor(private _bandDocumentService: BandDocumentService) {}

    /**
     * Returns all existing band in the list
     *
     * @returns {Observable<Band[]>}
     */
    listAll(): Observable<Band[] | void> {
        return this._bandDocumentService.find();
    }

    /**
     * Returns one band of the list matching id in parameter
     *
     * @param {string} id of the band
     *
     * @returns {Observable<Band>}
     */
    one(id: string): Observable<Band> {
        return this._bandDocumentService.findById(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Band with id '${id}' not found`))
                )
            );
    }

    /**
     * Check if band already exists and add it in band list
     *
     * @param band to create
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(band: Band): Observable<HapinessHTTPHandlerResponse> {
        return this._bandDocumentService.create(band)
            .pipe(
                catchError(e => _throw(Biim.conflict(e.message))),
                map(_ => ({ response: _, statusCode: 201 }))
            );
    }

    /**
     * Update a band in band list
     *
     * @param {string} id of the band to update
     * @param band data to update
     *
     * @returns {Observable<Band>}
     */
    update(id: string, band: Band): Observable<Band> {
        return this._bandDocumentService.findByIdAndUpdate(id, band)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Band with id '${id}' not found`))
                )
            );
    }

    /**
     * Delete one band in band list
     *
     * @param {string} id of the band to delete
     *
     * @returns {Observable<any>}
     */
    delete(id: string): Observable<void> {
        return this._bandDocumentService.findByIdAndRemove(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(undefined) :
                        _throw(Biim.notFound(`Band with id '${id}' not found`))
                )
            );
    }
}
