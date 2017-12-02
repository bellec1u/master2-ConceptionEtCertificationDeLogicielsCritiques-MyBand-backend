import { Injectable } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Biim } from '@hapiness/biim';
import { Observable } from 'rxjs/Observable';

import { Instrument } from '../../interfaces';
import { InstrumentDocumentService } from '../instrument-document';

import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class InstrumentService {
    /**
     * Class constructor
     */
    constructor(private _instrumentDocumentService: InstrumentDocumentService) {}

    /**
     * Returns all existing instrument in the list
     *
     * @returns {Observable<Instrument[]>}
     */
    listAll(): Observable<Instrument[] | void> {
        return this._instrumentDocumentService.find();
    }

    /**
     * Returns one instrument of the list matching id in parameter
     *
     * @param {string} id of the instrument
     *
     * @returns {Observable<Instrument>}
     */
    one(id: string): Observable<Instrument> {
        return this._instrumentDocumentService.findById(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Instrument with id '${id}' not found`))
                )
            );
    }

    /**
     * Check if instrument already exists and add it in instrument list
     *
     * @param instrument to create
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(instrument: Instrument): Observable<HapinessHTTPHandlerResponse> {
        return this._instrumentDocumentService.create(instrument)
            .pipe(
                catchError(e => _throw(Biim.conflict(e.message))),
                map(_ => ({ response: _, statusCode: 201 }))
            );
    }

    /**
     * Update an instrument in instrument list
     *
     * @param {string} id of the instrument to update
     * @param instrument data to update
     *
     * @returns {Observable<Instrument>}
     */
    update(id: string, instrument: Instrument): Observable<Instrument> {
        return this._instrumentDocumentService.findByIdAndUpdate(id, instrument)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Instrument with id '${id}' not found`))
                )
            );
    }

    /**
     * Delete one instrument in instrument list
     *
     * @param {string} id of the instrument to delete
     *
     * @returns {Observable<any>}
     */
    delete(id: string): Observable<void> {
        return this._instrumentDocumentService.findByIdAndRemove(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(undefined) :
                        _throw(Biim.notFound(`Instrument with id '${id}' not found`))
                )
            );
    }
}
