import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            // {
            //     id       : 'sample',
            //     title    : 'Sample',
            //     translate: 'NAV.SAMPLE.TITLE',
            //     type     : 'item',
            //     icon     : 'email',
            //     url      : '/sample',
            //     badge    : {
            //         title    : '25',
            //         translate: 'NAV.SAMPLE.BADGE',
            //         bg       : '#F44336',
            //         fg       : '#FFFFFF'
            //     }
            // },
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
                icon     : 'shopping_cart',
                url      : '/product'
            },
            {
                id       : 'area',
                title    : 'Area',
                translate: 'Area',
                type     : 'item',
                icon     : 'location_on',
                url      : '/area'
            },
            {
                id       : 'problem',
                title    : 'Problem',
                translate: 'Problem',
                type     : 'item',
                icon     : 'error',
                url      : '/problem'
            },
            {
                id       : 'engineer',
                title    : 'Engineer',
                translate: 'Engineer',
                type     : 'item',
                icon     : 'perm_contact_calendar',
                url      : '/engineer'
            },
            {
                id       : 'client',
                title    : 'Client',
                translate: 'Client',
                type     : 'item',
                icon     : 'group',
                url      : '/client'
            },
            {
                id       : 'complaint',
                title    : 'Complaint',
                translate: 'Complaint',
                type     : 'item',
                icon     : 'receipt_long',
                url      : '/complaint'
            }
        ]
    }
];
