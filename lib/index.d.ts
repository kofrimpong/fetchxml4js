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
 * A base class for Operators
 */
export declare class Operator {
    protected logicalName: string;
    protected attrs: IConditionAttribute;
    /**
     * Creates an instance of Operator.
     * @param {string} logicalName - The logical name of the column.
     * @param {IConditionAttribute} attrs - The condition attribute.
     */
    constructor(logicalName: string, attrs?: IConditionAttribute);
    /**
     * Checks whether the value of the column was specified by the user.
     * @returns {string} The condition string.
     */
    isNull(): string;
    /**
     * Checks whether the value of the column was not specified by the user.
     * @returns {string} The condition string.
     */
    isNotNull(): string;
}
/**
 * A general operator for comparison
 */
export declare class ColumnOperator extends Operator {
    /**
     * Checks whether the value of the column is equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    equalTo(value: number | string): string;
    /**
     * Checks whether the value of the column is not equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    notEqualTo(value: number | string): string;
    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    in(arrayOfValues: number[] | string[]): string;
    /**
     * Checks whether the value of the column is not equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    notIn(arrayOfValues: number[] | string[]): string;
}
/**
 * A specific operator for number columns.
 */
export declare class NumberOperator extends ColumnOperator {
    /**
     * Checks whether the value of the column is greater than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    greaterThan(value: number): string;
    /**
     * Checks whether the value of the column is less than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    lessThan(value: number): string;
    /**
     * Checks whether the value of the column is greater than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    greaterThanOrEqualTo(value: number): string;
    /**
     * Checks whether the value of the column is less than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    lessThanOrEqualTo(value: number): string;
}
/**
 * A specific operator for text columns.
 */
export declare class TextOperator extends ColumnOperator {
    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    like(value: number | string): string;
    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    notLike(value: number | string): string;
    /**
     * Searches for a string at the start of a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    beginsWith(value: string): string;
}
/**
 * A specific operator for boolean columns.
 */
export declare class BooleanOperator extends Operator {
    /**
     * Checks whether the value of the column is True.
     * @returns The condition string.
     */
    isTrue(): string;
    /**
     * Checks whether the value of the column is False.
     * @returns The condition string.
     */
    isFalse(): string;
}
/**
 * A specific operator for date columns.
 */
export declare class DateOperator extends Operator {
    /**
     * Checks whether the value of the column is on the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    on(value: string): string;
    /**
     * Checks whether the value of the column is on or before the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    onOrBefore(value: string): string;
    /**
     * Checks whether the value of the column is on or after the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    onOrAfter(value: string): string;
    /**
     * Checks whether the value of the column is last year.
     * @returns The condition string.
     */
    lastYear(): string;
    /**
     * Checks whether the value of the column is this year.
     * @returns The condition string.
     */
    thisYear(): string;
    /**
     * Checks whether the value of the column is next year.
     * @returns The condition string.
     */
    nextYear(): string;
    /**
     * Checks whether the value of the column is today.
     * @returns The condition string.
     */
    isToday(): string;
}
/**
 * A specific operator for lookup columns.
 */
export declare class LookupOperator extends Operator {
    /**
     * Checks whether the value of the column is equal to the specified ID value.
     * @param id The ID value to compare with.
     * @returns The condition string.
     */
    idEqualTo(id: string): string;
    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param arrayOfValues An array of ID values to compare with.
     * @returns The condition string.
     */
    idIn(arrayOfValues: string[]): string;
}
/**
 * A usercolumn operator for comparison
 */
export declare class UserOperator extends Operator {
    /**
     * Checks whether the ID of the person column is equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    idEqualTo(id: string): string;
    /**
     * Checks whether the ID of the person column is not equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    idNotEqualTo(id: string): string;
    /**
     * Checks whether the value of the person column is equal to the current user.
     * @returns Condition string.
     */
    equalToCurrentUser(): string;
}
/**
 * A dynamic filter element builder.
 */
export declare class FilterBuilder {
    private queries;
    /**
     * Adds a query to the filter builder.
     * @param query The query string to add.
     * @returns The updated filter builder instance.
     */
    addQuery(query: string): FilterBuilder;
    /**
     * Generates a WHERE string based on the added queries.
     * @returns The WHERE string.
     */
    toFilterElement(): string;
    /**
     * Clones the filter builder instance.
     * @returns The cloned filter builder instance.
     */
    clone(): FilterBuilder;
    private genQuery;
}
/**
 * Enum representing different types of link types.
 */
export declare enum LinkType {
    LEFT = "outer",
    INNER = "inner"
}
/**
 * Generates an And logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical AND.
 */
export declare const filterAnd: (...query: string[]) => string;
/**
 * Generates an Or logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical OR.
 */
export declare const filterOr: (...query: string[]) => string;
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
    intersect?: boolean;
}
/**
 * Generates a inner-link element
 * @param linkEntity the link entity attributes
 * @param elements Elements to include within the link-entity.
 */
export declare const linkEntity: (linkEntity: ILinkEntity, ...elements: string[]) => string;
/**
 * Generates a simple inner-link element.
 * @param entity The link entity.
 * @param type Type of join.
 * @param from Always refers to the attribute in the same entity as the link-entity node.
 * @param to Refers to the attribute of the entity parent node.
 * @param alias Alias to give to this link-entity.
 * @returns The generated link-entity string.
 */
export declare const linkEntitySimple: (entity: string, type: LinkType, from: string, to: string, alias: string, ...elements: string[]) => string;
/**
 * Removes line breaks from the supplied query string.
 * @param query The query string.
 * @returns The query string with removed line breaks.
 */
export declare const sanitizeQuery: (query: string) => string;
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
    distinct?: boolean;
}
/**
 * Generates attributes elements.
 * @param attributes The attributes to generate.
 * @returns The generated attributes string.
 */
export declare const attributes: (...attributes: Array<string | IAttribute>) => string;
/**
 * Generates all attributes element.
 * @returns The generated all-attributes string.
 */
export declare const allAttributes: () => string;
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
/**
 * Generates a fetchxml query.
 * @param fetch The fetch options.
 * @param inputs The fetch inputs.
 * @returns The generated fetchxml string.
 */
export declare const fetchxml: (fetch: IFetchOption, ...inputs: string[]) => string;
export interface IOrderBy {
    logicalName: string;
    desc?: boolean;
}
/**
 * Generates an order element.
 * @param orderBy The order options.
 * @returns The generated order string.
 */
export declare const orderBy: (...orderBy: IOrderBy[]) => string;
/**
 * Gets an operator for an ID column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified ID column.
 */
export declare const idColumn: (logicalName: string, attrs?: IConditionAttribute) => ColumnOperator;
/**
 * Gets an operator for a choice column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified choice column.
 */
export declare const choiceColumn: (logicalName: string, attrs?: IConditionAttribute) => ColumnOperator;
/**
 * Gets an operator for a number column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of NumberOperator for the specified number column.
 */
export declare const numberColumn: (logicalName: string, attrs?: IConditionAttribute) => NumberOperator;
/**
 * Gets an operator for a text column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of TextOperator for the specified text column.
 */
export declare const textColumn: (logicalName: string, attrs?: IConditionAttribute) => TextOperator;
/**
 * Gets an operator for a date column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of DateFieldOperator for the specified date column.
 */
export declare const dateColumn: (logicalName: string, attrs?: IConditionAttribute) => DateOperator;
/**
 * Gets an operator for a boolean column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of BooleanOperator for the specified boolean column.
 */
export declare const booleanColumn: (logicalName: string, attrs?: IConditionAttribute) => BooleanOperator;
/**
 * Gets an operator for a lookup column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of LookupFieldOperator for the specified lookup column.
 */
export declare const lookupColumn: (logicalName: string, attrs?: IConditionAttribute) => LookupOperator;
/**
 * Gets an operator for a User column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of UserFieldOperator for the specified User column.
 */
export declare const userColumn: (logicalName: string, attrs?: IConditionAttribute) => UserOperator;
/**
 * Gets a dynamic filter element builder.
 * @returns An instance of FilterBuilder for building dynamic filters.
 */
export declare const filterBuilder: () => FilterBuilder;
/**
 * Encode textual data that should not be parsed by an XML parser as CDATA.
 * @param s
 * @returns
 */
export declare const encodeAsCDATA: (s: string) => string;
