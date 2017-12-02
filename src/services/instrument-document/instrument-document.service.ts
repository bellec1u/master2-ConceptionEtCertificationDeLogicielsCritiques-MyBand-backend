import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { InstrumentModel } from '../../models';
import { Instrument } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class InstrumentDocumentService {
    // private property to store document instance
    private _document: any;

    /**
     * Class constructor
     *
     * @param {MongoClientService} _mongoClientService
     */
    constructor(private _mongoClientService: MongoClientService) {
        this._document = this._mongoClientService.getModel({
            adapter: 'mongoose',
            options: Config.get('mongodb')
        }, InstrumentModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns Instrument[] or undefined
     *
     * @return {Observable<Instrument[] | void>}
     */
    find(): Observable<Instrument[] | void> {
        return fromPromise(this._document.find({}))
            .pipe(
                flatMap((docs: MongooseDocument[]) =>
                    of(of(docs))
                        .pipe(
                            flatMap(_ =>
                                mergeStatic(
                                    _.pipe(
                                        filter(__ => !!__ && __.length > 0),
                                        map(__ => __.map(doc => doc.toJSON())),
                                    ),
                                    _.pipe(
                                        filter(__ => !__ || __.length === 0),
                                        map(__ => undefined)
                                    )
                                )
                            )
                        )
                )
            );
    }

    /**
     * Returns one instrument of the list matching id in parameter
     *
     * @param {string} id of the instrument in the db
     *
     * @return {Observable<Instrument | void>}
     */
    findById(id: string): Observable<Instrument | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Instrument) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if instrument already exists and add it in instrument list
     *
     * @param {Instrument} instrument to create
     *
     * @return {Observable<Instrument>}
     */
    create(instrument: Instrument): Observable<Instrument> {
        return fromPromise(this._document.findOne({
            name: { $regex: new RegExp(instrument.name, 'i') },
            type: { $regex: new RegExp(instrument.type, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`Instrument with name '${instrument.name}' and type '${instrument.type}' already exists`)
                    ) :
                    fromPromise(this._document.create(instrument))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as Instrument)
            );
    }

    /**
     * Update a instrument in instrument list
     *
     * @param {string} id
     * @param {Instrument} instrument
     *
     * @return {Observable<Instrument>}
     */
    findByIdAndUpdate(id: string, instrument: Instrument): Observable<Instrument> {
        return fromPromise(this._document.findByIdAndUpdate(id, instrument, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Instrument) :
                        of(undefined)
                )
            )
    }

    /**
     * Delete an instrument in instrument list
     *
     * @param {string} id
     *
     * @return {Observable<Instrument>}
     */
    findByIdAndRemove(id: string): Observable<Instrument> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Instrument) :
                        of(undefined)
                )
            )
    }
}
