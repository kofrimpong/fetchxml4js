//@ts-ignore
if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

/**
 * Interface representing a condition attribute.
 */
export interface IConditionAttribute {

    /**
     * The alias of the linked entity.
     */
    entityname?: string;
    /**
     * The logical entity type of the column.
     */
    uitype?: string;
    /**
     * The logical name of the column.
     */
    uiname?: string;
}

/**
 * Returns a condition for filtering based on the provided attrs.
 * @param attr The alias condition attribute..
 * @returns A condition string.
 */
const conditionEntityAlias = (attr: IConditionAttribute) => {
    let out = "";
    if (attr) {
        if (attr.uitype) {
            out += ` uitype='${attr.uitype}'`
        }
        if (attr.uiname) {
            out += ` uiname='${attr.uiname}'`
        }
        if (attr.entityname) {
            out += ` entityname='${attr.entityname}'`
        }
    }
    return out;
}


/**
 * A base class for Operators
 */
export class Operator {

    protected logicalName: string;
    protected attrs: IConditionAttribute

    /**
     * Creates an instance of Operator.
     * @param {string} logicalName - The logical name of the column.
     * @param {IConditionAttribute} attrs - The condition attribute.
     */
    constructor(logicalName: string, attrs?: IConditionAttribute) {
        this.logicalName = logicalName;
        this.attrs = attrs;
    }

    /**
     * Checks whether the value of the column was specified by the user.
     * @returns {string} The condition string.
     */
    isNull(): string {
        return `<condition attribute='${this.logicalName}' operator='null'${conditionEntityAlias(this.attrs)}/>`;
    }

    /**
     * Checks whether the value of the column was not specified by the user.
     * @returns {string} The condition string.
     */
    isNotNull(): string {
        return `<condition attribute='${this.logicalName}' operator='not-null'${conditionEntityAlias(this.attrs)}/>`;
    }
}

/**
 * A general operator for comparison
 */
export class ColumnOperator extends Operator {
    /**
     * Checks whether the value of the column is equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    equalTo(value: number | string,): string {
        return `<condition attribute='${this.logicalName}' operator='eq' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is not equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    notEqualTo(value: number | string,): string {
        return `<condition attribute='${this.logicalName}' operator='ne' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    in(arrayOfValues: number[] | string[],) {
        let builder = `<condition attribute='${this.logicalName}' operator='in'${conditionEntityAlias(this.attrs)}>`;
        for (let i = 0; i < arrayOfValues.length; i++) {
            builder += `<value>${arrayOfValues[i]}</value>`;
        }
        return builder += '</condition></In>';
    }

    /**
     * Checks whether the value of the column is not equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    notIn(arrayOfValues: number[] | string[],) {
        let builder = `<condition attribute='${this.logicalName}' operator='not-in'${conditionEntityAlias(this.attrs)}>`;
        for (let i = 0; i < arrayOfValues.length; i++) {
            builder += `<value>${arrayOfValues[i]}</value>`;
        }
        return builder += '</condition></In>';
    }
}

/**
 * A specific operator for number columns.
 */
export class NumberOperator extends ColumnOperator {

    /**
     * Checks whether the value of the column is greater than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    greaterThan(value: number,): string {
        return `<condition attribute='${this.logicalName}' operator='gt' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is less than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    lessThan(value: number,): string {
        return `<condition attribute='${this.logicalName}' operator='lt' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is greater than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    greaterThanOrEqualTo(value: number,): string {
        return `<condition attribute='${this.logicalName}' operator='eq-or-above' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is less than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    lessThanOrEqualTo(value: number,): string {
        return `<condition attribute='${this.logicalName}' operator='eq-or-under' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }
}

/**
 * A specific operator for text columns.
 */
export class TextOperator extends ColumnOperator {

    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    like(value: number | string,): string {
        return `<condition attribute='${this.logicalName}' operator='like' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    notLike(value: number | string,): string {
        return `<condition attribute='${this.logicalName}' operator='not-like' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Searches for a string at the start of a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    beginsWith(value: string,): string {
        return `<condition attribute='${this.logicalName}' operator='begins-with' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }
}

/**
 * A specific operator for boolean columns.
 */
export class BooleanOperator extends Operator {

    /**
     * Checks whether the value of the column is True.
     * @returns The condition string.
     */
    isTrue() {
        return `<condition attribute='${this.logicalName}' operator="eq" value='1'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is False.
     * @returns The condition string.
     */
    isFalse() {
        return `<condition attribute='${this.logicalName}' operator="eq" value='0'${conditionEntityAlias(this.attrs)} />`;
    }
}

/**
 * A specific operator for date columns.
 */
export class DateOperator extends Operator {
    /**
     * Checks whether the value of the column is on the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    on(value: string,) {
        return `<condition attribute='${this.logicalName}' operator='on' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is on or before the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    onOrBefore(value: string,): string {
        return `<condition attribute='${this.logicalName}' operator='on-or-before' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is on or after the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    onOrAfter(value: string,): string {
        return `<condition attribute='${this.logicalName}' operator='on-or-after' value='${value}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is last year.
     * @returns The condition string.
     */
    lastYear(): string {
        return `<condition attribute='${this.logicalName}' operator='last-year'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is this year.
     * @returns The condition string.
     */
    thisYear(): string {
        return `<condition attribute='${this.logicalName}' operator='this-year'${conditionEntityAlias(this.attrs)}/>`;
    }

    /**
     * Checks whether the value of the column is next year.
     * @returns The condition string.
     */
    nextYear(): string {
        return `<condition attribute='${this.logicalName}' operator='next-year'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is today.
     * @returns The condition string.
     */
    isToday(): string {
        return `<condition attribute='${this.logicalName}' operator='today'${conditionEntityAlias(this.attrs)}/>`;
    }
}

/**
 * A specific operator for lookup columns.
 */
export class LookupOperator extends Operator {
    /**
     * Checks whether the value of the column is equal to the specified ID value.
     * @param id The ID value to compare with.
     * @returns The condition string.
     */
    idEqualTo(id: string,): string {
        return `<condition attribute='${this.logicalName}' operator="eq" value='${sanitizeGuid(id)}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param arrayOfValues An array of ID values to compare with.
     * @returns The condition string.
     */
    idIn(arrayOfValues: string[],): string {
        let builder = `<condition attribute='${this.logicalName}' operator='in'${conditionEntityAlias(this.attrs)}>`;
        for (let i = 0; i < arrayOfValues.length; i++) {
            builder += `<value>${arrayOfValues[i]}</value>`;
        }
        return builder += '</condition></In>';
    }
}

/**
 * A usercolumn operator for comparison
 */
export class UserOperator extends Operator {

    /**
     * Checks whether the ID of the person column is equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    idEqualTo(id: string,): string {
        return `<condition attribute='${this.logicalName}' uitype='systemuser' operator='eq-userid' value='${id}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the ID of the person column is not equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    idNotEqualTo(id: string,): string {
        return `<condition attribute='${this.logicalName}' operator='ne-userid' value='${id}'${conditionEntityAlias(this.attrs)} />`;
    }

    /**
     * Checks whether the value of the person column is equal to the current user.
     * @returns Condition string.
     */
    equalToCurrentUser(): string {
        return `<condition attribute='${this.logicalName}' operator='eq-userid'${conditionEntityAlias(this.attrs)} />`;
    }
}

/**
 * A dynamic filter element builder.
 */
export class FilterBuilder {

    private queries: string[] = [];

    /**
     * Adds a query to the filter builder.
     * @param query The query string to add.
     * @returns The updated filter builder instance.
     */
    addQuery(query: string): FilterBuilder {
        this.queries.push(query);
        return this;
    }

    /**
     * Generates a WHERE string based on the added queries.
     * @returns The WHERE string.
     */
    toFilterElement(): string {
        return this.genQuery(this.queries);
    }

    /**
     * Clones the filter builder instance.
     * @returns The cloned filter builder instance.
     */
    clone(): FilterBuilder {
        const dynQuery = new FilterBuilder();
        dynQuery.queries = this.queries.slice(0, this.queries.length);
        return dynQuery;
    }

    private genQuery(queryArr: string[]): string {
        let count = 0;
        let len = queryArr.length;
        let text = '';
        while (count < len) {
            if (count + 1 < len) {
                text += filterAnd(queryArr[count], queryArr[++count]);
            } else {
                text += queryArr[count];
            }
            ++count;
        }
        if (len > 2) {
            text = "<filter type='and'>" + text + '</filter>';
        }
        return text;
    }
}

/**
 * Enum representing different types of link types.
 */
export enum LinkType {
    LEFT = "outer",
    INNER = "inner"
}

/**
 * Generates an And logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical AND.
 */
export const filterAnd = (...query: string[]): string => {
    return "<filter type='and'>" + query.join(" ") + "</filter>";
};

/**
 * Generates an Or logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical OR.
 */
export const filterOr = (...query: string[]): string => {
    return "<filter type='or'>" + query.join(" ") + "</filter>";
};

export interface ILinkEntity {
    /**
    * Type of join, either "outer" or "inner".
    * @default LinkType.LEFT
    */
    type?: LinkType;

    /**
     * Refers to the attribute of the entity parent node.
     */
    to: string;

    /**
     * Always refers to the attribute in the same entity as the link-entity node.
     */
    from: string;

    /**
     * Alias to give to this link-entity.
     */
    alias: string;

    /**
     * Entity to join to.
     */
    entity: string;
    /**
     * Indicates whether the link-entity is an intersect.
     * @default false
     */
    intersect?: boolean
}

const linkEntityToString = (linkEntity: ILinkEntity, elements: string[] = []) => {
    let listAlias = linkEntity.alias ? ` alias='${linkEntity.alias}'` : '';
    let intersect = linkEntity.intersect ? ` intersect='true'` : '';
    return `<link-entity name='${linkEntity.entity}' link-type='${linkEntity.type}' to='${linkEntity.to}' from='${linkEntity.from}'${listAlias}${intersect}>${elements.join(" ")}</link-entity>`;
}

/**
 * Generates a inner-link element
 * @param linkEntity the link entity attributes
 * @param elements Elements to include within the link-entity.
 */
export const linkEntity = (linkEntity: ILinkEntity, ...elements: string[]) => {
    return linkEntityToString({ entity: linkEntity.entity, type: linkEntity.type || LinkType.LEFT, to: linkEntity.to, from: linkEntity.from, alias: linkEntity.alias, intersect: linkEntity.intersect }, elements);
}

/**
 * Generates a simple inner-link element.
 * @param entity The link entity.
 * @param type Type of join.
 * @param from Always refers to the attribute in the same entity as the link-entity node.
 * @param to Refers to the attribute of the entity parent node.
 * @param alias Alias to give to this link-entity.
 * @returns The generated link-entity string.
 */
export const linkEntitySimple = (entity: string, type: LinkType, from: string, to: string, alias: string, ...elements: string[]): string => {
    return linkEntityToString({ entity, type, to, from, alias }, elements);
};



/**
 * Removes line breaks from the supplied query string.
 * @param query The query string.
 * @returns The query string with removed line breaks.
 */
export const sanitizeQuery = (query: string): string => {
    return query.replace(/>\s+</g, '><');
};

/**
 * Represents the definition of an attribute.
 */
export interface IAttribute {
    /**
     * The logical name of the attribute.
     */
    name: string;

    /**
     * An alternative name for the attribute in the result set
     * Notes:
     * Alias must be unique across all attributes in the query.
     * For link-entity attribute, if you want to return formatted value for choice and lookup columns, provide an alias.
     * For link-enttity attribute, if you make the alias the same as the attribute name, the attribute is not returned at all.
     */
    alias?: string;

    /**
     * An optional attribute for grouping.
     */
    groupby?: string;

    /**
     * An optional aggregate function.
     */
    aggregate?: "count" | "countcolumn" | "min" | "max" | "sum" | "avg";
    /**
     * If true, the results will contain only distinct values.
     */
    distinct?: boolean
}
const genAttribute = (attr: IAttribute | string) => {
    if (typeof attr == 'string') {
        return ` name='${attr}'`
    }
    let out = ` name='${attr.name}'`;
    if (attr.alias) {
        out += ` alias='${attr.alias}'`
    }
    if (attr.groupby) {
        out += ` groupby='${attr.groupby}'`
    }
    if (attr.aggregate) {
        out += ` aggregate='${attr.aggregate}'`
    }
    if (attr.distinct) {
        out += ` distinct='true'`
    }
    return out;
}

/**
 * Generates attributes elements.
 * @param attributes The attributes to generate.
 * @returns The generated attributes string.
 */
export const attributes = (...attributes: Array<string | IAttribute>): string => {
    let viewStr = attributes.reduce((accu, current) => {
        return accu + `<attribute${genAttribute(current)}/>`;
    }, "");
    return viewStr as string;
};
/**
 * Generates all attributes element.
 * @returns The generated all-attributes string.
 */
export const allAttributes = (): string => {
    return `<all-attributes/>`;
}

/**
 * Interface representing options for constructing a FetchXML query.
 */
export interface IFetchOption {
    /**
     * Indicates whether to retrieve distinct results.
     */
    distinct?: boolean;

    /**
     * The maximum number of records to retrieve.
     */
    top?: number;

    /**
     * Indicates whether to include aggregate values.
     */
    aggregate?: boolean;

    /**
     * The total number of records to retrieve.
     */
    count?: number;

    /**
     * The logical name of the entity to query.
     */
    entity: string;
}
const genFetch = (attr: IFetchOption) => {
    let out = "";
    if (attr.distinct) {
        out += ` distinct='true'`
    }
    if (attr.aggregate) {
        out += ` aggregate='true'`
    }
    if (attr.top) {
        out += ` top='${attr.top}'`
    }
    if (attr.count) {
        out += ` top='${attr.count}'`
    }
    return out;
}
/**
 * Generates a fetchxml query.
 * @param fetch The fetch options.
 * @param inputs The fetch inputs.
 * @returns The generated fetchxml string.
 */
export const fetchxml = (fetch: IFetchOption, ...inputs: string[]): string => {
    return `<fetch${genFetch(fetch)}><entity name='${fetch.entity}'>${inputs.join('')}</entity></fetch>`;
};

export interface IOrderBy {
    logicalName: string
    desc?: boolean
}

/**
 * Generates an order element.
 * @param orderBy The order options.
 * @returns The generated order string.
 */
export const orderBy = (...orderBy: IOrderBy[]): string => {
    let viewStr = orderBy.reduce((accu, current) => {
        if (current.logicalName) {
            let asc = current.desc ? ` descending='true'` : '';
            return accu + `<order attribute='${current.logicalName}'${asc}/>`;
        }
        return accu;
    }, '');
    return viewStr;
};

/**
 * Gets an operator for an ID column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified ID column.
 */
export const idColumn = (logicalName: string, attrs?: IConditionAttribute): ColumnOperator => {
    return new ColumnOperator(logicalName, attrs);
};

/**
 * Gets an operator for a choice column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified choice column.
 */
export const choiceColumn = (logicalName: string, attrs?: IConditionAttribute): ColumnOperator => {
    return new ColumnOperator(logicalName, attrs);
};

/**
 * Gets an operator for a number column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of NumberOperator for the specified number column.
 */
export const numberColumn = (logicalName: string, attrs?: IConditionAttribute): NumberOperator => {
    return new NumberOperator(logicalName, attrs);
};

/**
 * Gets an operator for a text column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of TextOperator for the specified text column.
 */
export const textColumn = (logicalName: string, attrs?: IConditionAttribute): TextOperator => {
    return new TextOperator(logicalName, attrs);
};

/**
 * Gets an operator for a date column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of DateFieldOperator for the specified date column.
 */
export const dateColumn = (logicalName: string, attrs?: IConditionAttribute): DateOperator => {
    return new DateOperator(logicalName, attrs);
};

/**
 * Gets an operator for a boolean column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of BooleanOperator for the specified boolean column.
 */
export const booleanColumn = (logicalName: string, attrs?: IConditionAttribute): BooleanOperator => {
    return new BooleanOperator(logicalName, attrs);
};
/**
 * Gets an operator for a lookup column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of LookupFieldOperator for the specified lookup column.
 */
export const lookupColumn = (logicalName: string, attrs?: IConditionAttribute): LookupOperator => {
    return new LookupOperator(logicalName, attrs);
};

/**
 * Gets an operator for a User column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of UserFieldOperator for the specified User column.
 */
export const userColumn = (logicalName: string, attrs?: IConditionAttribute): UserOperator => {
    return new UserOperator(logicalName, attrs);
};

/**
 * Gets a dynamic filter element builder.
 * @returns An instance of FilterBuilder for building dynamic filters.
 */
export const filterBuilder = (): FilterBuilder => {
    return new FilterBuilder();
};
/**
 * Encode textual data that should not be parsed by an XML parser as CDATA.
 * @param s 
 * @returns 
 */
export const encodeAsCDATA = (s: string) => {
    if (/[<>&]+/.test(s)) {
        let sb = '';
        for (let i = 0; i < s.length; i++) {
            const ch = s.charAt(i);
            if (/^[<>&]+$/.test(ch)) {
                sb += `&#${ch.charCodeAt(0)};`;
            }
            else {
                sb += ch;
            }
        }
        return sb;
    }
    return s;
}
// export const encodeAsCDATA = (s: string) => {
//     //Simpple CDATA construction will not work for string end with ']' .
//     //https://en.wikipedia.org/wiki/CDATA#Nesting
//     //return "<![CDATA[" + s + "]]>";
//     let sb = '';
//     for (let i = 0; i < s.length; i++) {
//         const ch = s.charAt(i);
//         if (/^[a-zA-Z0-9\s]+$/.test(ch)) {
//             sb += ch;
//         }
//         else {
//             sb += `&#${ch.charCodeAt(0)};`;
//         }
//     }
//     return sb;
// }

function stringIsNullOrEmpty(s: string | undefined | null): s is undefined | null | "" {
    return typeof s === "undefined" || s === null || s.length < 1;
}
function sanitizeGuid(guid: string): string {
    if (stringIsNullOrEmpty(guid)) {
        return guid;
    }
    const matches = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i.exec(guid);
    return matches === null ? guid : matches[1];
}