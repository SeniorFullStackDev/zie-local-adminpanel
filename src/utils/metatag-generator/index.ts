import moment from 'moment';

interface Image {
    'id': number,
    'alt'?: string,
    'url': string,
    'path'?: string,
    'size'?: string,
    'type'?: string,
    'width'?: number,
    'height'?: number,
    'pixels'?: number
}

interface PotentialAction {
    '@type':string,
    'target':{
        '@type':string,
        'urlTemplate':string
    } | string[],
    'query-input'?:string
}

interface ItemElement {
    'item': string,
    'name': string,
    '@type': string,
    'position': number
}

interface GraphObj {
        '@id':string,
        'url'?:string,
        'name'?:string,
        '@type':string,
        'inLanguage'?:string,
        'width'?:number,
        'height'?:number,
        'caption'?:number,
        'contentUrl'?:string,
        'description'?:string,
        'potentialAction'?:PotentialAction[],
        'isPartOf'?:{
            '@id':string
        },
        'breadcrumb'?:{
            '@id':string
        },
        'dateModified'?:string,
        'datePublished'?:string,
        'primaryImageOfPage'?:{
            '@id':string
        },
        'itemListElement'?:ItemElement[],
        'aggregateRating'?:{
            '@type': string,
            'ratingCount': number,
            'ratingValue': number
        },
}

interface OptionType {
    title?:string;
    description?:string;
    og_url?:string;
    og_type?:string;
    og_image?:Image[];
    og_title?:string;
    canonical?:string;
    og_locale?:string;
    og_site_name?:string;
    twitter_card?:string;
    twitter_image?:string;
    twitter_title?:string;
    twitter_description?:string;
    twitter_misc?:any;
    og_description?:any;

    schema?: {
        '@graph': GraphObj[],
        '@context': string
    }
    robots?: {
        'index': 'index'|'noindex',
        'follow': 'follow'|'nofollow',
        'max-snippet': 'max-snippet:-1',
        'max-image-preview': 'max-image-preview:large',
        'max-video-preview': 'max-video-preview:-1'
    }
}

class MetadataGenerator {

    site_url = 'https://zielonamapa.pl/';
    site_name = 'Zielonamapa.pl';
    site_description = 'Przewodnik po Ameryce Południowej i Europie';

    title:string | undefined;
    description:string | undefined;

    og_url:string | undefined;
    og_type:string | undefined;
    og_image:Image[] | undefined;
    og_title:string | undefined;
    canonical:string | undefined;
    og_locale:string | undefined;
    og_site_name:string | undefined;
    twitter_card:string | undefined;
    twitter_image:string | undefined;
    twitter_title:string | undefined;
    twitter_description:string | undefined;
    twitter_misc:any | undefined;
    og_description:any | undefined;
    article_modified_time:any | undefined;

    schema: {
        '@graph': GraphObj[],
        '@context': string
    }

    robots: {
        'index': 'index'|'noindex',
        'follow': 'follow'|'nofollow',
        'max-snippet': 'max-snippet:-1',
        'max-image-preview': 'max-image-preview:large',
        'max-video-preview': 'max-video-preview:-1'
    }

    constructor(options?:OptionType) {

        this.robots = {
            'index': 'index',
            'follow': 'follow',
            'max-snippet': 'max-snippet:-1',
            'max-image-preview': 'max-image-preview:large',
            'max-video-preview': 'max-video-preview:-1'
        };
        this.schema = {
            '@graph':[],
            '@context':'https://schema.org'
        };

        this.article_modified_time = moment.utc().format();
        this.og_site_name = this.site_name;

        if(options){
            this.config(options);
        }

        this.addWebSiteGraphObj(this.site_url, this.site_name, this.site_description);
    }

    public config(options:OptionType){
        if(options.title){
            this.setTitle(options.title);
        }
        if(options.description){
            this.setDescription(options.description);
        }
        if(options.og_url){
            this.setOgUrl(options.og_url);
        }

        if(options.og_type){
            this.setOgType(options.og_type);
        }

        if(options.og_image){
            this.setOgImage(options.og_image);
        }
        if(options.og_title){
            this.setOgTitle(options.og_title);
        }
        if(options.canonical){
            this.setCanonical(options.canonical);
        }
        if(options.og_locale){
            this.setOgLocal(options.og_locale);
        }
        if(options.og_site_name){
            this.setOgSiteName(options.og_site_name);
        }
        if(options.twitter_card){
            this.setTwitterCard(options.twitter_card);
        }
        if(options.twitter_image){
            this.setTwitterImage(options.twitter_image);
        }

        if(options.twitter_title){
            this.setTwitterTitle(options.twitter_title);
        }
        if(options.twitter_description){
            this.setTwitterDescription(options.twitter_description);
        }

        if(options.twitter_misc){
            this.setTwitterMisc(options.twitter_misc);
        }
        if(options.og_description){
            this.setOgDescription(options.og_description);
        }

        if(options.robots){
            this.setRobots(options.robots);
        }
        if(options.schema){
            this.setSchema(options.schema);
        }
    }

    /**
     * setTitle
     */
    public setTitle(_title:string) {
        this.title = _title;
    }

    /**
     * setDescription
     */
    public setDescription(_description:string) {
        this.description = _description;
    }

    /**
     * setOgUrl
     */
     public setOgUrl(_og_url:string) {
        this.og_url = _og_url;
    }
    
    /**
     * setCanonical
     */
     public setCanonical(_canonical:string) {
        this.canonical = _canonical;
    }

    /**
     * setOgLocal
     */
    public setOgLocal(_og_local:string) {

        this.og_locale = _og_local;
        
    }

    /**
     * setOgType
     */
     public setOgType(_og_type:string) {
        this.og_type = _og_type;
    }

    /**
     * setOgImage
     */
    public setOgImage(_og_image:Image[]) {
        this.og_image = _og_image;
    }

    /**
     * setOgTitle
     */
    public setOgTitle(_og_title:string) {
        this.og_title = _og_title;
    }

    /**
     * setOgSiteName
     */
    public setOgSiteName(_og_site_name:string) {
        this.og_site_name = _og_site_name;
    }

    /**
     * setTwitterCard
     */
    public setTwitterCard(_twitter_card:string) {
        this.twitter_card = _twitter_card;
    }

    /**
     *  setTwitterImage
     */
    public  setTwitterImage(_twitter_image:string) {
        this.twitter_image = _twitter_image;
    }
    /**
     *  setTwitterTitle
     */
    public  setTwitterTitle(_twitter_title:string) {
        this.twitter_title = _twitter_title;
    }
    /**
     *  setTwitterImage
     */
    public  setTwitterDescription(_twitter_description:string) {
        this.twitter_description = _twitter_description;
    }

    /**
     * setOgDescription
     */
    public setOgDescription(_og_description:string) {
        this.og_description = _og_description;
    }

    /**
     * setTwitterMisc
     */
    public setTwitterMisc(_twitter_misc:any) {
        this.twitter_misc = _twitter_misc;
    }

    /**
     * setRobots
     */
    public setRobots(_robots:any) {
        this.robots = {...this.robots, ..._robots};
    }

    /**
     * setSchema
     */
    public setSchema(_schema:any) {
        this.schema = _schema;
    }


    /**
     * addGraphObj
     */
    public addGraphObj(item:GraphObj){
        const index = this.schema['@graph'].findIndex((ele, index) => (ele['@type'] == item['@type']));
        if(index > -1 ){
            this.schema['@graph'][index] = item;
        }else{
            this.schema['@graph'].push(item);
        }
    }

    /**
     * addWebSiteGraphObj
     */
    public addWebSiteGraphObj(_site_url:string, _site_name:string, _site_description:string) {
        const webpageGrapObj:GraphObj = {
            '@id': `${this.site_name}#website`,
            'url':_site_url,
            'name': _site_name,
            '@type': 'WebSite',
            'inLanguage': 'en-US',
            'description':_site_description,
            'potentialAction': [
                {
                    '@type': 'SearchAction',
                    'target': {
                        '@type': 'EntryPoint',
                        'urlTemplate': `${_site_url}?s={search_term_string}`
                    },
                    'query-input': 'required name=search_term_string'
                }
            ]
        };
        this.addGraphObj(webpageGrapObj);
    }

    /**
     * addImageGraphObj
     */
    public addImageGraphObj({url, imageObj }:any) {
        const imageGraphObj = {
            '@id': `${url}#primaryimage`,
            'url': imageObj.url,
            '@type': 'ImageObject',
            'width': imageObj.width,
            'height': imageObj.height,
            // 'caption': 'Monreale, Włochy - © Zielonamapa',
            'caption': imageObj.caption,
            'contentUrl': imageObj.url,
            'inLanguage': 'en-US'
        };
        this.addGraphObj(imageGraphObj);
    }

    /**
     * addWebPageGraphObj
     */
    public addWebPageGraphObj({url, name }:any) {
        const webPageGraphObj = {
            '@id': `${url}#webpage`,
            'url': url,
            'name': name, // or title
            '@type': 'WebPage',
            'isPartOf': {
                '@id': `${this.site_url}#website`
            },
            'breadcrumb': {
                '@id': `${url}#breadcrum`
            },
            'inLanguage': 'en-US',
            'dateModified': moment.utc().format(),
            'datePublished': moment.utc().format(),
            'potentialAction': [
                {
                    '@type': 'ReadAction',
                    'target': [
                        `${url}`
                    ]
                }
            ],
            'primaryImageOfPage': {
                '@id': `${url}#primaryimage`
            }
        };
        this.addGraphObj(webPageGraphObj);
    }

    /**
     * addBreadcrumbList
     */
    public addBreadcrumbList({url, items}: {url:string, items:any[]}) {
        const itemList:any = [];
        items.forEach(element => {
            itemList.push({
                item:element.url,
                name:element.name,
                '@type': 'ListItem',
                'position': element.position
            });
        });

        const breadcrumbObj = {
            '@id': `${url}#breadcrumb`,
            '@type': 'BreadcrumbList',
            'itemListElement': itemList
        };
        this.addGraphObj(breadcrumbObj);
    }

    /**
     * addProductGraphObj
     */
    public addProductGraphObj({url, name, description, rating}:any) {
        const productGraphObj = {
            '@type': 'Product',
            '@id': `${url}#article_location`,
            'name': name,
            'description': description,
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingCount': rating.count,
                'ratingValue': rating.value
            }
        };
        this.addGraphObj(productGraphObj);
    }

    static getBreadcrumbList(schema_json:any){

        let result:any = [];
        if(schema_json['@graph']){
            console.log('schema_json ====>', schema_json['@graph']);
            schema_json['@graph'].forEach((element:any) => {
                if(element['@type'] == 'BreadcrumbList'){
                    result =  element.itemListElement;
                }
            });
        }
        return result;
    }
}

export default MetadataGenerator;