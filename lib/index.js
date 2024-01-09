"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeAsCDATA = exports.filterBuilder = exports.userColumn = exports.lookupColumn = exports.booleanColumn = exports.dateColumn = exports.textColumn = exports.numberColumn = exports.choiceColumn = exports.idColumn = exports.orderBy = exports.fetchxml = exports.allAttributes = exports.attributes = exports.sanitizeQuery = exports.linkEntitySimple = exports.linkEntity = exports.filterOr = exports.filterAnd = exports.LinkType = exports.FilterBuilder = exports.UserOperator = exports.LookupOperator = exports.DateOperator = exports.BooleanOperator = exports.TextOperator = exports.NumberOperator = exports.ColumnOperator = exports.Operator = void 0;
//@ts-ignore
if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
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
 * Returns a condition for filtering based on the provided attrs.
 * @param attr The alias condition attribute..
 * @returns A condition string.
 */
var conditionEntityAlias = function (attr) {
    var out = "";
    if (attr) {
        if (attr.uitype) {
            out += " uitype='".concat(attr.uitype, "'");
        }
        if (attr.uiname) {
            out += " uiname='".concat(attr.uiname, "'");
        }
        if (attr.entityname) {
            out += " entityname='".concat(attr.entityname, "'");
        }
    }
    return out;
};
/**
 * A base class for Operators
 */
var Operator = /** @class */ (function () {
    /**
     * Creates an instance of Operator.
     * @param {string} logicalName - The logical name of the column.
     * @param {IConditionAttribute} attrs - The condition attribute.
     */
    function Operator(logicalName, attrs) {
        this.logicalName = logicalName;
        this.attrs = attrs;
    }
    /**
     * Checks whether the value of the column was specified by the user.
     * @returns {string} The condition string.
     */
    Operator.prototype.isNull = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='null'").concat(conditionEntityAlias(this.attrs), "/>");
    };
    /**
     * Checks whether the value of the column was not specified by the user.
     * @returns {string} The condition string.
     */
    Operator.prototype.isNotNull = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='not-null'").concat(conditionEntityAlias(this.attrs), "/>");
    };
    return Operator;
}());
exports.Operator = Operator;
/**
 * A general operator for comparison
 */
var ColumnOperator = /** @class */ (function (_super) {
    __extends(ColumnOperator, _super);
    function ColumnOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the value of the column is equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    ColumnOperator.prototype.equalTo = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='eq' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is not equal to the specified value.
     * @param {number | string} value - The value to compare.
     * @returns {string} The condition string.
     */
    ColumnOperator.prototype.notEqualTo = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='ne' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    ColumnOperator.prototype.in = function (arrayOfValues) {
        var builder = "<condition attribute='".concat(this.logicalName, "' operator='in'").concat(conditionEntityAlias(this.attrs), ">");
        for (var i = 0; i < arrayOfValues.length; i++) {
            builder += "<value>".concat(arrayOfValues[i], "</value>");
        }
        return builder += '</condition></In>';
    };
    /**
     * Checks whether the value of the column is not equal to one of the specified values.
     * @param {number[] | string[]} arrayOfValues - Array of values to compare.
     * @returns {string} The condition string.
     */
    ColumnOperator.prototype.notIn = function (arrayOfValues) {
        var builder = "<condition attribute='".concat(this.logicalName, "' operator='not-in'").concat(conditionEntityAlias(this.attrs), ">");
        for (var i = 0; i < arrayOfValues.length; i++) {
            builder += "<value>".concat(arrayOfValues[i], "</value>");
        }
        return builder += '</condition></In>';
    };
    return ColumnOperator;
}(Operator));
exports.ColumnOperator = ColumnOperator;
/**
 * A specific operator for number columns.
 */
var NumberOperator = /** @class */ (function (_super) {
    __extends(NumberOperator, _super);
    function NumberOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the value of the column is greater than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    NumberOperator.prototype.greaterThan = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='gt' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is less than the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    NumberOperator.prototype.lessThan = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='lt' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is greater than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    NumberOperator.prototype.greaterThanOrEqualTo = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='eq-or-above' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is less than or equal to the specified value.
     * @param value The value to compare with.
     * @returns The condition string.
     */
    NumberOperator.prototype.lessThanOrEqualTo = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='eq-or-under' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    return NumberOperator;
}(ColumnOperator));
exports.NumberOperator = NumberOperator;
/**
 * A specific operator for text columns.
 */
var TextOperator = /** @class */ (function (_super) {
    __extends(TextOperator, _super);
    function TextOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    TextOperator.prototype.like = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='not-like' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Searches for a string anywhere within a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    TextOperator.prototype.notLike = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='like' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Searches for a string at the start of a column that holds Text or Note column type values.
     * @param value The value to search for.
     * @returns The condition string.
     */
    TextOperator.prototype.beginsWith = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='begins-with' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    return TextOperator;
}(ColumnOperator));
exports.TextOperator = TextOperator;
/**
 * A specific operator for boolean columns.
 */
var BooleanOperator = /** @class */ (function (_super) {
    __extends(BooleanOperator, _super);
    function BooleanOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the value of the column is True.
     * @returns The condition string.
     */
    BooleanOperator.prototype.isTrue = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator=\"eq\" value='1'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is False.
     * @returns The condition string.
     */
    BooleanOperator.prototype.isFalse = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator=\"eq\" value='0'").concat(conditionEntityAlias(this.attrs), " />");
    };
    return BooleanOperator;
}(Operator));
exports.BooleanOperator = BooleanOperator;
/**
 * A specific operator for date columns.
 */
var DateOperator = /** @class */ (function (_super) {
    __extends(DateOperator, _super);
    function DateOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the value of the column is on the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    DateOperator.prototype.on = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='on' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is on or before the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    DateOperator.prototype.onOrBefore = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='on-or-before' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is on or after the specified value.
     * @param value The value to compare with in ISO format.
     * @returns The condition string.
     */
    DateOperator.prototype.onOrAfter = function (value) {
        return "<condition attribute='".concat(this.logicalName, "' operator='on-or-after' value='").concat(value, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is last year.
     * @returns The condition string.
     */
    DateOperator.prototype.lastYear = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='last-year'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is this year.
     * @returns The condition string.
     */
    DateOperator.prototype.thisYear = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='this-year'").concat(conditionEntityAlias(this.attrs), "/>");
    };
    /**
     * Checks whether the value of the column is next year.
     * @returns The condition string.
     */
    DateOperator.prototype.nextYear = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='next-year'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is today.
     * @returns The condition string.
     */
    DateOperator.prototype.isToday = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='today'").concat(conditionEntityAlias(this.attrs), "/>");
    };
    return DateOperator;
}(Operator));
exports.DateOperator = DateOperator;
/**
 * A specific operator for lookup columns.
 */
var LookupOperator = /** @class */ (function (_super) {
    __extends(LookupOperator, _super);
    function LookupOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the value of the column is equal to the specified ID value.
     * @param id The ID value to compare with.
     * @returns The condition string.
     */
    LookupOperator.prototype.idEqualTo = function (id) {
        return "<condition attribute='".concat(this.logicalName, "' operator=\"eq\" value='").concat(sanitizeGuid(id), "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the column is equal to one of the specified values.
     * @param arrayOfValues An array of ID values to compare with.
     * @returns The condition string.
     */
    LookupOperator.prototype.idIn = function (arrayOfValues) {
        var builder = "<condition attribute='".concat(this.logicalName, "' operator='in'").concat(conditionEntityAlias(this.attrs), ">");
        for (var i = 0; i < arrayOfValues.length; i++) {
            builder += "<value>".concat(arrayOfValues[i], "</value>");
        }
        return builder += '</condition></In>';
    };
    return LookupOperator;
}(Operator));
exports.LookupOperator = LookupOperator;
/**
 * A usercolumn operator for comparison
 */
var UserOperator = /** @class */ (function (_super) {
    __extends(UserOperator, _super);
    function UserOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the ID of the person column is equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    UserOperator.prototype.idEqualTo = function (id) {
        return "<condition attribute='".concat(this.logicalName, "' uitype='systemuser' operator='eq-userid' value='").concat(id, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the ID of the person column is not equal to the specified ID value.
     * @param id The ID value to compare.
     * @returns Condition string.
     */
    UserOperator.prototype.idNotEqualTo = function (id) {
        return "<condition attribute='".concat(this.logicalName, "' operator='ne-userid' value='").concat(id, "'").concat(conditionEntityAlias(this.attrs), " />");
    };
    /**
     * Checks whether the value of the person column is equal to the current user.
     * @returns Condition string.
     */
    UserOperator.prototype.equalToCurrentUser = function () {
        return "<condition attribute='".concat(this.logicalName, "' operator='eq-userid'").concat(conditionEntityAlias(this.attrs), " />");
    };
    return UserOperator;
}(Operator));
exports.UserOperator = UserOperator;
/**
 * A dynamic filter element builder.
 */
var FilterBuilder = /** @class */ (function () {
    function FilterBuilder() {
        this.queries = [];
    }
    /**
     * Adds a query to the filter builder.
     * @param query The query string to add.
     * @returns The updated filter builder instance.
     */
    FilterBuilder.prototype.addQuery = function (query) {
        this.queries.push(query);
        return this;
    };
    /**
     * Generates a WHERE string based on the added queries.
     * @returns The WHERE string.
     */
    FilterBuilder.prototype.toFilterElement = function () {
        return this.genQuery(this.queries);
    };
    /**
     * Clones the filter builder instance.
     * @returns The cloned filter builder instance.
     */
    FilterBuilder.prototype.clone = function () {
        var dynQuery = new FilterBuilder();
        dynQuery.queries = this.queries.slice(0, this.queries.length);
        return dynQuery;
    };
    FilterBuilder.prototype.genQuery = function (queryArr) {
        var count = 0;
        var len = queryArr.length;
        var text = '';
        while (count < len) {
            if (count + 1 < len) {
                text += (0, exports.filterAnd)(queryArr[count], queryArr[++count]);
            }
            else {
                text += queryArr[count];
            }
            ++count;
        }
        if (len > 2) {
            text = "<filter type='and'>" + text + '</filter>';
        }
        return text;
    };
    return FilterBuilder;
}());
exports.FilterBuilder = FilterBuilder;
/**
 * Enum representing different types of link types.
 */
var LinkType;
(function (LinkType) {
    LinkType["LEFT"] = "outer";
    LinkType["INNER"] = "inner";
})(LinkType = exports.LinkType || (exports.LinkType = {}));
/**
 * Generates an And logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical AND.
 */
var filterAnd = function () {
    var query = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        query[_i] = arguments[_i];
    }
    return "<filter type='and'>" + query.join(" ") + "</filter>";
};
exports.filterAnd = filterAnd;
/**
 * Generates an Or logical join filter element.
 * @param query The first query strings.
 * @returns The filter element for logical OR.
 */
var filterOr = function () {
    var query = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        query[_i] = arguments[_i];
    }
    return "<filter type='or'>" + query.join(" ") + "</filter>";
};
exports.filterOr = filterOr;
var linkEntityToString = function (linkEntity, elements) {
    if (elements === void 0) { elements = []; }
    var listAlias = linkEntity.alias ? " alias='".concat(linkEntity.alias, "'") : '';
    var intersect = linkEntity.intersect ? " intersect='true'" : '';
    return "<link-entity name='".concat(linkEntity.entity, "' link-type='").concat(linkEntity.type, "' to='").concat(linkEntity.to, "' from='").concat(linkEntity.from, "'").concat(listAlias).concat(intersect, ">").concat(elements.join(" "), "</link-entity>");
};
/**
 * Generates a inner-link element
 * @param linkEntity the link entity attributes
 * @param elements Elements to include within the link-entity.
 */
var linkEntity = function (linkEntity) {
    var elements = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        elements[_i - 1] = arguments[_i];
    }
    return linkEntityToString({ entity: linkEntity.entity, type: linkEntity.type || LinkType.LEFT, to: linkEntity.to, from: linkEntity.from, alias: linkEntity.alias, intersect: linkEntity.intersect }, elements);
};
exports.linkEntity = linkEntity;
/**
 * Generates a simple inner-link element.
 * @param entity The link entity.
 * @param type Type of join.
 * @param from Always refers to the attribute in the same entity as the link-entity node.
 * @param to Refers to the attribute of the entity parent node.
 * @param alias Alias to give to this link-entity.
 * @returns The generated link-entity string.
 */
var linkEntitySimple = function (entity, type, from, to, alias) {
    var elements = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        elements[_i - 5] = arguments[_i];
    }
    return linkEntityToString({ entity: entity, type: type, to: to, from: from, alias: alias }, elements);
};
exports.linkEntitySimple = linkEntitySimple;
/**
 * Removes line breaks from the supplied query string.
 * @param query The query string.
 * @returns The query string with removed line breaks.
 */
var sanitizeQuery = function (query) {
    return query.replace(/>\s+</g, '><');
};
exports.sanitizeQuery = sanitizeQuery;
var genAttribute = function (attr) {
    if (typeof attr == 'string') {
        return " name='".concat(attr, "'");
    }
    var out = " name='".concat(attr.name, "'");
    if (attr.alias) {
        out += " alias='".concat(attr.alias, "'");
    }
    if (attr.groupby) {
        out += " groupby='".concat(attr.groupby, "'");
    }
    if (attr.aggregate) {
        out += " aggregate='".concat(attr.alias, "'");
    }
    if (attr.distinct) {
        out += " distinct='true'";
    }
    return out;
};
/**
 * Generates attributes elements.
 * @param attributes The attributes to generate.
 * @returns The generated attributes string.
 */
var attributes = function () {
    var attributes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        attributes[_i] = arguments[_i];
    }
    var viewStr = attributes.reduce(function (accu, current) {
        return accu + "<attribute".concat(genAttribute(current), "/>");
    }, "");
    return viewStr;
};
exports.attributes = attributes;
/**
 * Generates all attributes element.
 * @returns The generated all-attributes string.
 */
var allAttributes = function () {
    return "<all-attributes/>";
};
exports.allAttributes = allAttributes;
var genFetch = function (attr) {
    var out = "";
    if (attr.distinct) {
        out += " distinct='true'";
    }
    if (attr.aggregate) {
        out += " aggregate='true'";
    }
    if (attr.top) {
        out += " top='".concat(attr.top, "'");
    }
    if (attr.count) {
        out += " top='".concat(attr.count, "'");
    }
    return out;
};
/**
 * Generates a fetchxml query.
 * @param fetch The fetch options.
 * @param inputs The fetch inputs.
 * @returns The generated fetchxml string.
 */
var fetchxml = function (fetch) {
    var inputs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        inputs[_i - 1] = arguments[_i];
    }
    return "<fetch".concat(genFetch(fetch), "><entity name='").concat(fetch.entity, "'>").concat(inputs.join(''), "</entity></fetch>");
};
exports.fetchxml = fetchxml;
/**
 * Generates an order element.
 * @param orderBy The order options.
 * @returns The generated order string.
 */
var orderBy = function () {
    var orderBy = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        orderBy[_i] = arguments[_i];
    }
    var viewStr = orderBy.reduce(function (accu, current) {
        if (current.logicalName) {
            var asc = current.desc ? " descending='true'" : '';
            return accu + "<order attribute='".concat(current.logicalName, "'").concat(asc, "/>");
        }
        return accu;
    }, '');
    return viewStr;
};
exports.orderBy = orderBy;
/**
 * Gets an operator for an ID column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified ID column.
 */
var idColumn = function (logicalName, attrs) {
    return new ColumnOperator(logicalName, attrs);
};
exports.idColumn = idColumn;
/**
 * Gets an operator for a choice column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of FieldOperator for the specified choice column.
 */
var choiceColumn = function (logicalName, attrs) {
    return new ColumnOperator(logicalName, attrs);
};
exports.choiceColumn = choiceColumn;
/**
 * Gets an operator for a number column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of NumberOperator for the specified number column.
 */
var numberColumn = function (logicalName, attrs) {
    return new NumberOperator(logicalName, attrs);
};
exports.numberColumn = numberColumn;
/**
 * Gets an operator for a text column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of TextOperator for the specified text column.
 */
var textColumn = function (logicalName, attrs) {
    return new TextOperator(logicalName, attrs);
};
exports.textColumn = textColumn;
/**
 * Gets an operator for a date column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of DateFieldOperator for the specified date column.
 */
var dateColumn = function (logicalName, attrs) {
    return new DateOperator(logicalName, attrs);
};
exports.dateColumn = dateColumn;
/**
 * Gets an operator for a boolean column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of BooleanOperator for the specified boolean column.
 */
var booleanColumn = function (logicalName, attrs) {
    return new BooleanOperator(logicalName, attrs);
};
exports.booleanColumn = booleanColumn;
/**
 * Gets an operator for a lookup column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of LookupFieldOperator for the specified lookup column.
 */
var lookupColumn = function (logicalName, attrs) {
    return new LookupOperator(logicalName, attrs);
};
exports.lookupColumn = lookupColumn;
/**
 * Gets an operator for a User column for comparison.
 * @param logicalName The logical name of the column.
 * @param attrs Optional condition filter atributes.
 * @returns An instance of UserFieldOperator for the specified User column.
 */
var userColumn = function (logicalName, attrs) {
    return new UserOperator(logicalName, attrs);
};
exports.userColumn = userColumn;
/**
 * Gets a dynamic filter element builder.
 * @returns An instance of FilterBuilder for building dynamic filters.
 */
var filterBuilder = function () {
    return new FilterBuilder();
};
exports.filterBuilder = filterBuilder;
/**
 * Encode textual data that should not be parsed by an XML parser as CDATA.
 * @param s
 * @returns
 */
var encodeAsCDATA = function (s) {
    if (/[<>&]+/.test(s)) {
        var sb = '';
        for (var i = 0; i < s.length; i++) {
            var ch = s.charAt(i);
            if (/^[<>&]+$/.test(ch)) {
                sb += "&#".concat(ch.charCodeAt(0), ";");
            }
            else {
                sb += ch;
            }
        }
        return sb;
    }
    return s;
};
exports.encodeAsCDATA = encodeAsCDATA;
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
function stringIsNullOrEmpty(s) {
    return typeof s === "undefined" || s === null || s.length < 1;
}
function sanitizeGuid(guid) {
    if (stringIsNullOrEmpty(guid)) {
        return guid;
    }
    var matches = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i.exec(guid);
    return matches === null ? guid : matches[1];
}
//# sourceMappingURL=index.js.map