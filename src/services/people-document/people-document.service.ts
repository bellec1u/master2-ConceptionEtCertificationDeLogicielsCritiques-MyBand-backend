import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { PeopleModel } from '../../models';
import { People } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class PeopleDocumentService {
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
        }, PeopleModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns People[] or undefined
     *
     * @return {Observable<People[] | void>}
     */
    find(): Observable<People[] | void> {
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
     * Returns one people of the list matching id in parameter
     *
     * @param {string} id of the people in the db
     *
     * @return {Observable<People | void>}
     */
    findById(id: string): Observable<People | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as People) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if person already exists and add it in people list
     *
     * @param {People} person to create
     *
     * @return {Observable<People>}
     */
    create(person: People): Observable<People> {
        return fromPromise(this._document.findOne({
            firstname: { $regex: new RegExp(person.firstname, 'i') },
            lastname: { $regex: new RegExp(person.lastname, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`People with lastname '${person.lastname}' and firstname '${person.firstname}' already exists`)
                    ) :
                    fromPromise(this._document.create(person))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as People)
            );
    }

    /**
     * Update a person in people list
     *
     * @param {string} id
     * @param {People} person
     *
     * @return {Observable<People>}
     */
    findByIdAndUpdate(id: string, person: People): Observable<People> {
        return fromPromise(this._document.findByIdAndUpdate(id, person, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as People) :
                        of(undefined)
                )
            )
    }

    /**
     * Delete a person in people list
     *
     * @param {string} id
     *
     * @return {Observable<People>}
     */
    findByIdAndRemove(id: string): Observable<People> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as People) :
                        of(undefined)
                )
            )
    }
}
