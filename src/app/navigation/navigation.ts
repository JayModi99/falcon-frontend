import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'product-category',
                title    : 'Product Category',
                translate: 'Product Category',
                type     : 'item',
                icon     : 'category',
                url      : '/product-category'
            },
            {
                id       : 'product',
                title    : 'Product',
                translate: 'Product',
                type     : 'item',
                icon     : 'inventory_2',
                url      : '/product'
            }
        ]
    }
];
