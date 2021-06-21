import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
	name: 'filter',
	pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {
	/*
	 * @param items object from array
	 * @param term term's search
	 * @param objectFieldName (optional)
	 */
	transform(items: any, term: string, objectFieldName: string): any {
		if ( !term || !items ) return items;
		return SearchPipe.filter(items, term, objectFieldName);
	}
	/*
	 * @param items List of items to filter
	 * @param term  a string term to compare with every property of the list
	 * @param objectFieldName
	 */
	static filter(items: Array<{ [ key: string ]: any }>, term: string, objectFieldName: string): Array<{ [ key: string ]: any }> {
		const toCompare = term.toLowerCase();
		if ( objectFieldName === null || objectFieldName === undefined ) { // Object Field not defined so loop over object
			return items.filter(function (item: any) {
				for ( let property in item ) {
					if ( item[ property ] === null || item[ property ] == undefined ) {
						continue;
					}
					if ( item[ property ].toString().toLowerCase().includes(toCompare) ) {
						return true;
					}
				}
				return false;
			})
		}
		return items.filter( function(item:any) {
			return (item[objectFieldName].toString().toLowerCase().includes(toCompare)) ;
		})
	}
}