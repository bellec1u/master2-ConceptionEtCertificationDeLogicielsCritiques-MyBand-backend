import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { ResearchModel } from '../../models';
import { Research } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class ResearchDocumentService {
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
        }, ResearchModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns Research[] or undefined
     *
     * @return {Observable<Research[] | void>}
     */
    find(): Observable<Research[] | void> {
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
     * Returns one research of the list matching id in parameter
     *
     * @param {string} id of the research in the db
     *
     * @return {Observable<Research | void>}
     */
    findById(id: string): Observable<Research | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Research) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if research already exists and add it in research list
     *
     * @param {Request} research to create
     *
     * @return {Observable<Research>}
     */
    create(research: Research): Observable<Research> {
        return fromPromise(this._document.findOne({
            band: { $regex: new RegExp(research.band, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`Research already exists`)
                    ) :
                    fromPromise(this._document.create(research))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as Research)
            );
    }

    /**
     * Update an request in research list
     *
     * @param {string} id
     * @param {Research} research
     *
     * @return {Observable<Research>}
     */
    findByIdAndUpdate(id: string, research: Research): Observable<Research> {
        return fromPromise(this._document.findByIdAndUpdate(id, research, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Research) :
                        of(undefined)
                )
            )
    }

    /**
     * Delete an research in research list
     *
     * @param {string} id
     *
     * @return {Observable<Research>}
     */
    findByIdAndRemove(id: string): Observable<Research> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Research) :
                        of(undefined)
                )
            )
    }
}
