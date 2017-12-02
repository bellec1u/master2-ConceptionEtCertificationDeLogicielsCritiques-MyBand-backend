import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { UserModel } from '../../models';
import { User } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class UserDocumentService {
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
        }, UserModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns User[] or undefined
     *
     * @return {Observable<User[] | void>}
     */
    find(): Observable<User[] | void> {
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
     * Returns one user of the list matching id in parameter
     *
     * @param {string} id of the user in the db
     *
     * @return {Observable<User | void>}
     */
    findById(id: string): Observable<User | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as User) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if user already exists and add it in user list
     *
     * @param {User} user to create
     *
     * @return {Observable<User>}
     */
    create(user: User): Observable<User> {
        return fromPromise(this._document.findOne({
            firstname: { $regex: new RegExp(user.firstname, 'i') },
            lastname: { $regex: new RegExp(user.lastname, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`User with firstname '${user.firstname}' and lastname '${user.lastname}' already exists`)
                    ) :
                    fromPromise(this._document.create(user))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as User)
            );
    }

    /**
     * Update a user in user list
     *
     * @param {string} id
     * @param {User} user
     *
     * @return {Observable<User>}
     */
    findByIdAndUpdate(id: string, user: User): Observable<User> {
        return fromPromise(this._document.findByIdAndUpdate(id, user, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as User) :
                        of(undefined)
                )
            )
    }

    /**
     * Delete a user in user list
     *
     * @param {string} id
     *
     * @return {Observable<User>}
     */
    findByIdAndRemove(id: string): Observable<User> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as User) :
                        of(undefined)
                )
            )
    }
}
