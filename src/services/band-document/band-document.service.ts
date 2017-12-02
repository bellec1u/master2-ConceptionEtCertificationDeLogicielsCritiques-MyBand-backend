import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { BandModel } from '../../models';
import { Band } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class BandDocumentService {
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
        }, BandModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns Band[] or undefined
     *
     * @return {Observable<Band[] | void>}
     */
    find(): Observable<Band[] | void> {
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
     * Returns one band of the list matching id in parameter
     *
     * @param {string} id of the band in the db
     *
     * @return {Observable<Band | void>}
     */
    findById(id: string): Observable<Band | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Band) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if band already exists and add it in band list
     *
     * @param {Band} band to create
     *
     * @return {Observable<Band>}
     */
    create(band: Band): Observable<Band> {
        return fromPromise(this._document.findOne({
            name: { $regex: new RegExp(band.name, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`Band with name '${band.name}' already exists`)
                    ) :
                    fromPromise(this._document.create(band))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as Band)
            );
    }

    /**
     * Update a band in band list
     *
     * @param {string} id
     * @param {Band} band
     *
     * @return {Observable<Band>}
     */
    findByIdAndUpdate(id: string, band: Band): Observable<Band> {
        return fromPromise(this._document.findByIdAndUpdate(id, band, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Band) :
                        of(undefined)
                )
            )
    }

    /**
     * Delete a band in band list
     *
     * @param {string} id
     *
     * @return {Observable<Band>}
     */
    findByIdAndRemove(id: string): Observable<Band> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Band) :
                        of(undefined)
                )
            )
    }
}
