import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private titleService: Title,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this.titleService.setTitle("Falcon - Sample");
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }
}
