# fetchxml4js
A declarative JavaScript library for creating Dataverse fetchxml queries. The package simplifies the creation of complex queries by allowing you to build them using intuitive JavaScript functions and chaining methods.

## Table of Contents

- [Intallation](#installation)
- [Usage](#usage)
- [Basic Concepts](#basic-concepts)
- [API Overview](#api-overview)
- [Examples](#examples)

## Installation
Npm:
```
npm install fetchxml4js --save
```

Npm TypeScript definitions:
```
npm install @types/fetchxml4js --save-dev
```
## Usage

In browser:

```html
<script type="text/javascript" src="//fetchxml4js.js"></script>
```

In node:

```js
var caml4js = require('fetchxml4js');
```

ES6 modules:
```js
import {LinkType, attributes, choiceColumn} from 'fetchxml4js';
```

## Basic Concepts

Before diving into usage, it's important to understand some basic components:

1.  **Entity**: The primary object in the query.
2.  **Attributes**: The fields or columns of the entity you wish to retrieve.
3.  **Filter**: Conditions applied to restrict the data returned.
4.  **Link Entity**: Used to join another related entity.
5.  **Order**: Determines the sorting of the results.

#### Example Query

Here's an example of a FetchXML query created using this package:

```typescript
fetchxml({ entity: "contact" },
    attributes("fullname"),
    filterAnd(
        idColumn('leadid').equalTo('8788facf-828e-4333-8405-b825b0f29ea0'),
        choiceColumn('statecode').equalTo(0)
    ),
    linkEntitySimple("lead", LinkType.LEFT, "emailaddress1", "emailaddress1", '',       
        attributes("fullname")
    ),
    orderBy({ logicalName: "createdon", desc: true })
);
```
This code generates the following FetchXML:

```xml
<fetch>
    <entity name='contact'>
        <attribute name='fullname'/>
        <filter type='and'>
            <condition attribute='leadid' operator='eq' value='8788facf-828e-4333-8405-b825b0f29ea0' />
            <condition attribute='statecode' operator='eq' value='0' />
        </filter>
        <link-entity name='lead' link-type='outer' to='emailaddress1' from='emailaddress1'>
            <attribute name='fullname'/>
        </link-entity>
        <order attribute='createdon' descending='true'/>
    </entity>
</fetch>
```

## API Overview

Below are the key functions provided by the package:

1.  **fetchxml(entity, ...elements)**: Main function to start building a FetchXML query.

    -   `entity`: IFetchOption - Specifies the options for the query.
    -   `...elements`: Accepts attributes, filters, link entities, and orders.
2.  **attributes(...names|...IAttribute)**: Specifies the attributes (fields) to be retrieved.

    -   Example: `attributes("fullname", "emailaddress1",{name:"telephone",alias:"phone", distint:true})`.
3.  **filterAnd(...conditions)**: Combines multiple conditions using an AND logical operator.

    -   Example: `filterAnd(idColumn('leadid').equalTo('1234'), textColumn('name').like('John%'))`.
4.  **filterOr(...conditions)**: Combines multiple conditions using an OR logical operator.

    -   Example: `filterOr(textColumn('firstname').like('A%'), textColumn('lastname').like('B%'))`.
5.  **idColumn(name)**: Creates an operator for filtering by ID.

    -   Example: `idColumn('leadid').equalTo('1234')`.
6.  **textColumn(name)**: Creates an operator for filtering text fields.

    -   Example: `textColumn('fullname').like('John%')`.
7.  **numberColumn(name)**: Creates an operator for filtering numeric fields.

    -   Example: `numberColumn('age').greaterThan(25)`.
8.  **choiceColumn(name)**: Creates an operator for filtering choice fields.

    -   Example: `choiceColumn('statecode').equalTo(0)`.
9.  **booleanColumn(name)**: Creates an operator for filtering boolean fields.

    -   Example: `booleanColumn('isActive').isTrue()`.
10. **linkEntitySimple(name, linkType, to, from, alias, ...components)**: Simplifies linking entities.

    -   Example: `linkEntitySimple("lead", LinkType.LEFT, "emailaddress1", "emailaddress1", '', attributes("fullname"))`.

11. **linkEntity(linkEntity, ...elements)**: Main function to start building a FetchXML query.

    -   `linkEntity`: ILinkEntity - link entity attributes object
    -   `...elements`: Elements to include within the link-entity.

12. **orderBy(options)**: Orders the results based on a specified attribute.

    -   `options`: `{ logicalName: string, desc?: boolean }`.
    -   Example: `orderBy({ logicalName: "createdon", desc: true })`.


## Examples
Simple Query:

```typescript
fetchxml({ entity: "account" },
    attributes("name", "accountnumber"),
    filterAnd(textColumn('name').beginsWith('A'))
);
```

Complex Query:

```typescript
fetchxml({ entity: "order" },
    attributes("ordernumber", "totalamount"),
    filterOr(
        idColumn('customerid').in(['1111', '2222']),
        dateColumn('orderdate').thisYear()
    ),
    orderBy({ logicalName: "totalamount", desc: true })
);

```
Linked Entities::

```typescript
fetchxml({ entity: "invoice" },
    attributes("invoicenumber"),
    linkEntitySimple("customer", LinkType.INNER, "customerid", "customerid", 'cust',
        attributes("fullname"))
);
```