import { HapiConfig, Hapiness, HttpServerExt } from '@hapiness/core';
import { LoggerExt } from '@hapiness/logger';
import { Config } from '@hapiness/config';
import { MongoClientExt } from '@hapiness/mongo';

import { ApplicationModule } from './application.module';

// bootstrap application
Hapiness.bootstrap(ApplicationModule, [
    LoggerExt,
    HttpServerExt.setConfig(Config.get<HapiConfig>('server')),
    MongoClientExt.setConfig({
        load: [
            {
                name: 'mongoose',
                config: Config.get('mongodb')
            }
        ]
    })
])
    .catch(err => console.log(err));
